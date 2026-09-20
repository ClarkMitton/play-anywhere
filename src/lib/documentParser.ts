import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import JSZip from 'jszip';

// Set the worker source for pdf.js (Vite-compatible)
// NOTE: This prevents the common "fake worker"/CORS issues seen with CDN worker URLs.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Reconstruct reading order AND column layout from a PDF page's raw text items.
// The old approach concatenated items in content-stream order, which destroyed
// two-column layouts — a criteria grid's "P1 ↔ descriptor" pairing was lost, and
// the AI was then told to quote codes it could no longer see aligned. Here we
// cluster items into rows by their y position, sort each row left-to-right, and
// insert a TAB where there is a real horizontal gap, so grid columns stay paired.
function reconstructPageText(items: any[]): string {
  const cells = items
    .filter((it) => typeof it?.str === 'string' && it.str.trim().length > 0)
    .map((it) => ({
      str: it.str as string,
      x: Array.isArray(it.transform) ? (it.transform[4] as number) : 0,
      y: Array.isArray(it.transform) ? (it.transform[5] as number) : 0,
      w: typeof it.width === 'number' ? it.width : 0,
    }));
  if (cells.length === 0) return '';

  // Group into rows: same row when the baselines are within a small tolerance.
  const Y_TOL = 3;
  const rows: { y: number; items: typeof cells }[] = [];
  for (const c of cells) {
    let row = rows.find((r) => Math.abs(r.y - c.y) <= Y_TOL);
    if (!row) { row = { y: c.y, items: [] }; rows.push(row); }
    row.items.push(c);
  }
  // PDF y increases upwards, so top-to-bottom is descending y.
  rows.sort((a, b) => b.y - a.y);

  const lines = rows.map((row) => {
    row.items.sort((a, b) => a.x - b.x);
    let line = '';
    let prev: (typeof row.items)[number] | null = null;
    for (const it of row.items) {
      if (prev) {
        const gap = it.x - (prev.x + prev.w);
        // A wide gap means a new column (grid cell); a small gap is a word space.
        if (gap > 12) line += '\t';
        else if (gap > 0.5 || !/\s$/.test(line)) line += ' ';
      }
      line += it.str;
      prev = it;
    }
    return line.replace(/[ \t]+$/g, '').trimStart();
  });
  return lines.filter((l) => l.trim().length > 0).join('\n');
}

export async function extractPdfRich(file: File): Promise<{ text: string; pages: number }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += reconstructPageText(textContent.items as any[]).trim() + '\n\n';
    }
    return { text: fullText.trim(), pages: pdf.numPages };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. The file may be corrupted or password-protected.');
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
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const out: string[] = [];
  const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

  const walk = (node: Node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType !== 1) return; // elements only
      const el = child as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (tag === 'table') {
        el.querySelectorAll('tr').forEach((tr) => {
          const row = Array.from(tr.querySelectorAll('th,td')).map((c) => clean(c.textContent || ''));
          if (row.some(Boolean)) out.push('| ' + row.join(' | ') + ' |');
        });
        out.push('');
        return; // handled — don't descend
      }
      if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(tag)) {
        const t = clean(el.textContent || '');
        if (t) out.push(t);
        return;
      }
      walk(el); // containers (div, ul, ol, section…)
    });
  };
  walk(doc.body);
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export async function extractWordRich(file: File): Promise<{ text: string; pages: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
  const text = htmlToStructuredText(html);
  // Fallback to raw text if the HTML path yielded nothing (rare).
  if (!text.trim()) {
    const raw = await mammoth.extractRawText({ arrayBuffer });
    return { text: (raw.value || '').trim(), pages: 1 };
  }
  return { text, pages: 1 };
}

export async function extractTextFromWord(file: File): Promise<string> {
  return (await extractWordRich(file)).text;
}

export async function extractTextFromPowerPoint(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    let fullText = '';
    const slideFiles: string[] = [];

    // Find all slide XML files
    zip.forEach((relativePath) => {
      if (relativePath.match(/ppt\/slides\/slide\d+\.xml$/)) {
        slideFiles.push(relativePath);
      }
    });

    // Sort slides by number
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml$/)?.[1] || '0');
      const numB = parseInt(b.match(/slide(\d+)\.xml$/)?.[1] || '0');
      return numA - numB;
    });

    if (slideFiles.length === 0) {
      throw new Error('No slides found in this PowerPoint file. The file may be corrupted.');
    }

    // Helper: pull text out of a slide XML using DOMParser, with a regex fallback
    const extractSlideText = (xml: string): string[] => {
      const texts: string[] = [];
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        // Some slides namespace differently — check for parser errors and fall back
        const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
        if (parserError) throw new Error('XML parse error');
        const textElements = xmlDoc.getElementsByTagName('a:t');
        for (let i = 0; i < textElements.length; i++) {
          const t = textElements[i].textContent?.trim();
          if (t) texts.push(t);
        }
        // Fallback if namespaced lookup yielded nothing
        if (texts.length === 0) {
          const all = xmlDoc.getElementsByTagName('*');
          for (let i = 0; i < all.length; i++) {
            const el = all[i];
            if (el.tagName.endsWith(':t') || el.tagName === 't') {
              const t = el.textContent?.trim();
              if (t) texts.push(t);
            }
          }
        }
      } catch {
        // Regex fallback for malformed XML
        const re = /<a:t[^>]*>([^<]*)<\/a:t>/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(xml)) !== null) {
          const t = m[1]?.trim();
          if (t) texts.push(t);
        }
      }
      return texts;
    };

    // Extract text from each slide. Slide markers matter: without them every
    // deck arrives as one undifferentiated blob and the AI cannot tell where one
    // slide ends and the next begins, so it cannot map a deck onto room slots.
    for (const slidePath of slideFiles) {
      const slideContent = await zip.file(slidePath)?.async('text');
      if (!slideContent) continue;
      const slideNo = slidePath.match(/slide(\d+)\.xml$/)?.[1] ?? '?';
      const slideTexts = extractSlideText(slideContent);
      if (slideTexts.length > 0) {
        fullText += `--- Slide ${slideNo} ---\n` + slideTexts.join(' ') + '\n\n';
      }
    }

    // Also check notes slides for additional content
    const notesFiles: string[] = [];
    zip.forEach((relativePath) => {
      if (relativePath.match(/ppt\/notesSlides\/notesSlide\d+\.xml$/)) {
        notesFiles.push(relativePath);
      }
    });

    for (const notesPath of notesFiles) {
      const notesContent = await zip.file(notesPath)?.async('text');
      if (!notesContent) continue;
      const notesNo = notesPath.match(/notesSlide(\d+)\.xml$/)?.[1] ?? '?';
      const notesTexts = extractSlideText(notesContent);
      if (notesTexts.length > 0) {
        fullText += `--- Slide ${notesNo} speaker notes ---\n` + notesTexts.join(' ') + '\n\n';
      }
    }

    return fullText.trim();
  } catch (error) {
    console.error('PowerPoint extraction error:', error);
    const msg = error instanceof Error ? error.message : 'unknown error';
    throw new Error(`Failed to read PowerPoint: ${msg}. The file may be corrupted, password-protected, or in the legacy .ppt format (please save as .pptx).`);
  }
}

// Rich variant used by the supporting-documents flow: returns the page count too,
// so the caller can warn when a file yields very little text per page (a typed
// header over a scanned grid passes a bare length check but is nearly empty).
export async function extractDocumentRich(file: File): Promise<{ text: string; pages: number }> {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith('.pdf')) return extractPdfRich(file);
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return extractWordRich(file);
  if (fileName.endsWith('.pptx') || fileName.endsWith('.ppt')) {
    return { text: await extractTextFromPowerPoint(file), pages: 1 };
  }
  if (fileName.endsWith('.txt')) return { text: await file.text(), pages: 1 };
  throw new Error('Unsupported file format. Please upload a PDF, Word document, PowerPoint, or text file.');
}

export async function extractTextFromDocument(file: File): Promise<string> {
  return (await extractDocumentRich(file)).text;
}
