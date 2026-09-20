import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import JSZip from "jszip";

// Set the worker source for pdf.js (Vite-compatible)
// NOTE: This prevents the common "fake worker"/CORS issues seen with CDN worker URLs.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// Reconstruct reading order AND column layout from a PDF page's raw text items.
// The old approach concatenated items in content-stream order, which destroyed
// two-column layouts — a criteria grid's "P1 ↔ descriptor" pairing was lost, and
// the AI was then told to quote codes it could no longer see aligned. Here we
// cluster items into rows by their y position, sort each row left-to-right, and
// insert a TAB where there is a real horizontal gap, so grid columns stay paired.
// Only the fields this function actually reads. pdf.js types its item union
// loosely, and everything here is guarded before use.
type PdfTextItem = { str?: string; transform?: number[]; width?: number };

function reconstructPageText(items: PdfTextItem[]): string {
  const cells = items
    .filter((it) => typeof it?.str === "string" && it.str.trim().length > 0)
    .map((it) => ({
      str: it.str as string,
      x: Array.isArray(it.transform) ? (it.transform[4] as number) : 0,
      y: Array.isArray(it.transform) ? (it.transform[5] as number) : 0,
      w: typeof it.width === "number" ? it.width : 0,
    }));
  if (cells.length === 0) return "";

  // Group into rows: same row when the baselines are within a small tolerance.
  const Y_TOL = 3;
  const rows: { y: number; items: typeof cells }[] = [];
  for (const c of cells) {
    let row = rows.find((r) => Math.abs(r.y - c.y) <= Y_TOL);
    if (!row) {
      row = { y: c.y, items: [] };
      rows.push(row);
    }
    row.items.push(c);
  }
  // PDF y increases upwards, so top-to-bottom is descending y.
  rows.sort((a, b) => b.y - a.y);

  const lines = rows.map((row) => {
    row.items.sort((a, b) => a.x - b.x);
    let line = "";
    let prev: (typeof row.items)[number] | null = null;
    for (const it of row.items) {
      if (prev) {
        const gap = it.x - (prev.x + prev.w);
        // A wide gap means a new column (grid cell); a small gap is a word space.
        if (gap > 12) line += "\t";
        else if (gap > 0.5 || !/\s$/.test(line)) line += " ";
      }
      line += it.str;
      prev = it;
    }
    return line.replace(/[ \t]+$/g, "").trimStart();
  });
  return lines.filter((l) => l.trim().length > 0).join("\n");
}

export async function extractPdfRich(file: File): Promise<{ text: string; pages: number }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += reconstructPageText(textContent.items as PdfTextItem[]).trim() + "\n\n";
    }
    return { text: fullText.trim(), pages: pdf.numPages };
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(
      "Failed to extract text from PDF. The file may be corrupted or password-protected.",
    );
  }
}

export async function extractTextFromPDF(file: File): Promise<string> {
  return (await extractPdfRich(file)).text;
}

// Turn mammoth's HTML into readable text that KEEPS table structure. The old
// extractRawText flattened a marking grid to a run of bare lines, so P1 and its
// descriptor arrived on separate lines with nothing linking them. Tables become
// markdown pipe rows here so the code↔descriptor pairing survives to the AI.
function htmlToStructuredText(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const out: string[] = [];
  const clean = (s: string) => s.replace(/\s+/g, " ").trim();

  const walk = (node: Node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType !== 1) return; // elements only
      const el = child as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (tag === "table") {
        el.querySelectorAll("tr").forEach((tr) => {
          const row = Array.from(tr.querySelectorAll("th,td")).map((c) =>
            clean(c.textContent || ""),
          );
          if (row.some(Boolean)) out.push("| " + row.join(" | ") + " |");
        });
        out.push("");
        return; // handled — don't descend
      }
      if (["p", "h1", "h2", "h3", "h4", "h5", "h6", "li"].includes(tag)) {
        const t = clean(el.textContent || "");
        if (t) out.push(t);
        return;
      }
      walk(el); // containers (div, ul, ol, section…)
    });
  };
  walk(doc.body);
  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractWordRich(file: File): Promise<{ text: string; pages: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
  const text = htmlToStructuredText(html);
  // Fallback to raw text if the HTML path yielded nothing (rare).
  if (!text.trim()) {
    const raw = await mammoth.extractRawText({ arrayBuffer });
    return { text: (raw.value || "").trim(), pages: 1 };
  }
  return { text, pages: 1 };
}

export async function extractTextFromWord(file: File): Promise<string> {
  return (await extractWordRich(file)).text;
}

// Pull text runs out of one slide/notes XML. DOMParser first, regex fallback
// for slides whose XML the parser rejects.
function extractSlideText(xml: string): string[] {
  const texts: string[] = [];
  try {
    const xmlDoc = new DOMParser().parseFromString(xml, "text/xml");
    if (xmlDoc.getElementsByTagName("parsererror")[0]) throw new Error("XML parse error");

    const textElements = xmlDoc.getElementsByTagName("a:t");
    for (let i = 0; i < textElements.length; i++) {
      const t = textElements[i].textContent?.trim();
      if (t) texts.push(t);
    }
    // Some producers namespace differently, so sweep any *:t element.
    if (texts.length === 0) {
      const all = xmlDoc.getElementsByTagName("*");
      for (let i = 0; i < all.length; i++) {
        const el = all[i];
        if (el.tagName.endsWith(":t") || el.tagName === "t") {
          const t = el.textContent?.trim();
          if (t) texts.push(t);
        }
      }
    }
  } catch {
    const re = /<a:t[^>]*>([^<]*)<\/a:t>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml)) !== null) {
      const t = m[1]?.trim();
      if (t) texts.push(t);
    }
  }
  return texts;
}

// Zip entry paths always use forward slashes per the spec, so no separator
// normalising is needed here.
const slideNumber = (path: string): number =>
  parseInt(path.match(/slide(\d+)\.xml$/i)?.[1] || "0", 10);

/**
 * Extracts slide text from a .pptx.
 *
 * Deliberately tolerant about layout. A file can be a perfectly good zip while
 * not matching the textbook ppt/slides/slideN.xml shape: exports from Google
 * Slides, Keynote, LibreOffice and some template formats all vary, and paths
 * can arrive with different casing or separators. Rather than declaring "no
 * slides found" and stopping, this widens the search step by step, and only
 * gives up with an error naming what the archive actually contained.
 */
export async function extractTextFromPowerPoint(file: File): Promise<string> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(await file.arrayBuffer());
  } catch {
    // Not a zip at all. Almost always a legacy .ppt, which is a binary format.
    throw new Error(
      `"${file.name}" is not a .pptx. If it is an older .ppt, open it in PowerPoint and use File then Save As to save it as .pptx, then upload again.`,
    );
  }

  const paths: string[] = [];
  zip.forEach((relativePath) => paths.push(relativePath));
  const norm = (p: string) => p.toLowerCase();

  // Widen the net in stages: exact layout, then any slides folder, then any
  // xml inside something called slides.
  let slideFiles = paths.filter((p) => /(^|\/)ppt\/slides\/slide\d+\.xml$/.test(norm(p)));
  if (slideFiles.length === 0) {
    slideFiles = paths.filter((p) => /(^|\/)slides\/slide\d+\.xml$/.test(norm(p)));
  }
  if (slideFiles.length === 0) {
    slideFiles = paths.filter(
      (p) => /(^|\/)slides\/[^/]+\.xml$/.test(norm(p)) && !norm(p).includes("_rels"),
    );
  }

  let fullText = "";

  if (slideFiles.length > 0) {
    slideFiles.sort((a, b) => slideNumber(a) - slideNumber(b));
    for (const slidePath of slideFiles) {
      const slideContent = await zip.file(slidePath)?.async("text");
      if (!slideContent) continue;
      const n = slideNumber(slidePath);
      const slideTexts = extractSlideText(slideContent);
      if (slideTexts.length > 0) {
        fullText +=
          `--- Slide ${n || slideFiles.indexOf(slidePath) + 1} ---\n` +
          slideTexts.join(" ") +
          "\n\n";
      }
    }

    // Speaker notes often carry the teaching intent, so keep them.
    const notesFiles = paths.filter((p) => /notesslide\d*\.xml$/.test(norm(p)));
    notesFiles.sort((a, b) => slideNumber(a) - slideNumber(b));
    for (const notesPath of notesFiles) {
      const notesContent = await zip.file(notesPath)?.async("text");
      if (!notesContent) continue;
      const notesTexts = extractSlideText(notesContent);
      if (notesTexts.length > 0) {
        fullText +=
          `--- Slide ${slideNumber(notesPath)} speaker notes ---\n` + notesTexts.join(" ") + "\n\n";
      }
    }
  }

  // Last resort: sweep every xml in the archive for text runs. Loses slide
  // boundaries, but returning the content beats refusing the file.
  if (!fullText.trim()) {
    const xmlFiles = paths.filter(
      (p) =>
        norm(p).endsWith(".xml") &&
        !norm(p).includes("_rels") &&
        !norm(p).endsWith("app.xml") &&
        !norm(p).endsWith("core.xml"),
    );
    const collected: string[] = [];
    for (const path of xmlFiles) {
      const content = await zip.file(path)?.async("text");
      if (!content) continue;
      collected.push(...extractSlideText(content));
    }
    if (collected.length > 0) {
      fullText = collected.join(" ");
    }
  }

  if (!fullText.trim()) {
    // Name what we actually got, so the problem is diagnosable rather than a
    // dead end. Check for the common "wrong file type" cases by their markers.
    const all = paths.map(norm);
    if (all.some((p) => p === "content.xml") || all.some((p) => p === "mimetype")) {
      throw new Error(
        `"${file.name}" looks like an OpenDocument presentation (.odp), not a .pptx. Open it and use Save As to choose PowerPoint (.pptx).`,
      );
    }
    if (all.some((p) => p.startsWith("index.apxl") || p.startsWith("index/"))) {
      throw new Error(
        `"${file.name}" looks like a Keynote file. Export it as PowerPoint (.pptx) and upload again.`,
      );
    }
    if (all.some((p) => p === "word/document.xml")) {
      throw new Error(`"${file.name}" is a Word document, not a PowerPoint. Upload it as .docx.`);
    }
    if (all.some((p) => p === "xl/workbook.xml")) {
      throw new Error(`"${file.name}" is an Excel workbook, which cannot be read as a lesson.`);
    }

    const topLevel = [...new Set(all.map((p) => p.split("/")[0]))].slice(0, 6).join(", ");
    throw new Error(
      `No slide text could be read from "${file.name}". The archive contains: ${topLevel || "nothing readable"}. If the file is password-protected, remove the password and try again.`,
    );
  }

  return fullText.trim();
}

// Rich variant used by the supporting-documents flow: returns the page count too,
// so the caller can warn when a file yields very little text per page (a typed
// header over a scanned grid passes a bare length check but is nearly empty).
export async function extractDocumentRich(file: File): Promise<{ text: string; pages: number }> {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".pdf")) return extractPdfRich(file);
  if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) return extractWordRich(file);
  if (fileName.endsWith(".pptx") || fileName.endsWith(".ppt")) {
    return { text: await extractTextFromPowerPoint(file), pages: 1 };
  }
  if (fileName.endsWith(".txt")) return { text: await file.text(), pages: 1 };
  throw new Error(
    "Unsupported file format. Please upload a PDF, Word document, PowerPoint, or text file.",
  );
}

export async function extractTextFromDocument(file: File): Promise<string> {
  return (await extractDocumentRich(file)).text;
}
