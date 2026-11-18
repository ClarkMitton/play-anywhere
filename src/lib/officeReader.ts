// Reads what a teacher's files actually contain, pictures included, so the
// lesson agent works from the real material rather than from a guess.
//
//   .ppt / .doc   the old Office format (a "compound file"). The browser has
//                 no reader for it, so this file has a small one: slide text,
//                 Word text with tables, and the photos inside.
//   .pptx / .docx pictures from the media folder, slide by slide.
//   .pdf          every page drawn as a picture, so a teacher's own slides or
//                 worksheets can go straight on the screens.
//
// Clip art in the old formats (WMF/EMF drawings) cannot be shown in a browser
// and is counted as skipped, never silently dropped.

import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export type FoundPicture = { name: string; blob: Blob };
export type ReadResult = {
  text: string;
  /** Slides or pages, where the format has them. */
  pages: number;
  pictures: FoundPicture[];
  /** Pictures left out: clip art that cannot be shown, tiny icons, logos repeated on every slide. */
  skipped: number;
  /** Web links in the document, typed out or hidden behind words (Wordwall, YouTube, Canva...). */
  links?: string[];
};

const URL_IN_TEXT = /https?:\/\/[^\s<>"'\u0000-\u001f)\]]+/gi;
// Addresses inside Office files that are part of the format, not links a teacher made.
const FORMAT_URL = /schemas\.(openxmlformats|microsoft)\.org|purl\.org|w3\.org\/|microsoft\.com\/office|ns\.adobe\.com/i;

/** Clean, de-duplicated web links. */
export function tidyLinks(found: string[]): string[] {
  const out = new Set<string>();
  for (const raw of found) {
    const url = raw.replace(/[.,;:!?'"]+$/, "").trim();
    if (!/^https?:\/\/[^/]+\.[^/]+/i.test(url) || FORMAT_URL.test(url)) continue;
    out.add(url);
  }
  return [...out].slice(0, 20);
}

/** Links typed out in any text, including the raw bytes of an old Office file. */
function linksInText(...texts: string[]): string[] {
  return texts.flatMap((t) => t.match(URL_IN_TEXT) ?? []);
}

/** Links hidden behind words in a .docx or .pptx: the "External" targets in its relationship files. */
async function linksInZip(file: File): Promise<string[]> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const found: string[] = [];
  for (const path of Object.keys(zip.files).filter((p) => p.endsWith(".rels"))) {
    const xml = await zip.file(path)!.async("text");
    for (const m of xml.matchAll(/<Relationship\b[^>]*>/g)) {
      if (!/TargetMode="External"/.test(m[0])) continue;
      const target = /Target="([^"]+)"/.exec(m[0])?.[1];
      if (target) found.push(target.replace(/&amp;/g, "&"));
    }
  }
  return found;
}

/** Links on a PDF's pages (clickable areas). */
async function linksInPdf(file: File): Promise<string[]> {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const found: string[] = [];
  for (let i = 1; i <= Math.min(pdf.numPages, 60); i++) {
    const notes = await (await pdf.getPage(i)).getAnnotations();
    for (const a of notes as { url?: string; unsafeUrl?: string }[]) {
      if (a.url || a.unsafeUrl) found.push(String(a.url ?? a.unsafeUrl));
    }
  }
  return found;
}

const MAX_PICTURES = 40;
const MIN_PICTURE_BYTES = 6_000;

// ── Compound file (old .ppt and .doc) ────────────────────────────────────

type Entry = { name: string; type: number; start: number; size: number; left: number; right: number; child: number };

/** The streams at the top level of an old Office file, by name. */
function readCompoundFile(buf: Uint8Array): Map<string, Uint8Array> {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const u16 = (o: number) => view.getUint16(o, true);
  const u32 = (o: number) => view.getUint32(o, true);
  if (u32(0) !== 0xe011cfd0 || u32(4) !== 0xe11ab1a1) throw new Error("not an old-format Office file");

  const sectorSize = 1 << u16(0x1e);
  const miniSectorSize = 1 << u16(0x20);
  const firstDir = u32(0x30);
  const miniCutoff = u32(0x38);
  const firstMiniFat = u32(0x3c);
  const firstDifat = u32(0x44);
  const sectorOffset = (n: number) => (n + 1) * sectorSize;
  const END = 0xfffffffe;

  // The sector table (FAT), found through the DIFAT list.
  const fatSectors: number[] = [];
  for (let i = 0; i < 109; i++) {
    const s = u32(0x4c + i * 4);
    if (s >= 0xfffffffa) break;
    fatSectors.push(s);
  }
  for (let d = firstDifat, guard = 0; d < 0xfffffffa && guard < 10_000; guard++) {
    const base = sectorOffset(d);
    const per = sectorSize / 4 - 1;
    for (let i = 0; i < per; i++) {
      const s = u32(base + i * 4);
      if (s < 0xfffffffa) fatSectors.push(s);
    }
    d = u32(base + per * 4);
  }
  const fat: number[] = [];
  for (const s of fatSectors) {
    const base = sectorOffset(s);
    if (base + sectorSize > buf.length) break;
    for (let i = 0; i < sectorSize / 4; i++) fat.push(u32(base + i * 4));
  }

  const chain = (start: number): number[] => {
    const out: number[] = [];
    for (let s = start; s !== END && s < fat.length && out.length < fat.length; s = fat[s]) out.push(s);
    return out;
  };
  const readChain = (start: number, size: number): Uint8Array => {
    const out = new Uint8Array(size);
    let pos = 0;
    for (const s of chain(start)) {
      const from = sectorOffset(s);
      const take = Math.min(sectorSize, size - pos, buf.length - from);
      if (take <= 0) break;
      out.set(buf.subarray(from, from + take), pos);
      pos += take;
    }
    return out.subarray(0, pos);
  };

  // Directory.
  const dirBytes = readChain(firstDir, chain(firstDir).length * sectorSize);
  const entries: Entry[] = [];
  for (let o = 0; o + 128 <= dirBytes.length; o += 128) {
    const nameLen = dirBytes[o + 64] | (dirBytes[o + 65] << 8);
    const name = new TextDecoder("utf-16le").decode(dirBytes.subarray(o, o + Math.max(0, nameLen - 2)));
    const dv = new DataView(dirBytes.buffer, dirBytes.byteOffset + o, 128);
    entries.push({
      name,
      type: dirBytes[o + 66],
      left: dv.getUint32(68, true),
      right: dv.getUint32(72, true),
      child: dv.getUint32(76, true),
      start: dv.getUint32(116, true),
      size: dv.getUint32(120, true),
    });
  }
  const root = entries[0];
  if (!root) throw new Error("the file has no contents list");

  // Small streams live in the "mini stream", addressed by the mini FAT.
  const miniStream = readChain(root.start, root.size);
  const miniFat: number[] = [];
  for (const s of chain(firstMiniFat)) {
    const base = sectorOffset(s);
    for (let i = 0; i < sectorSize / 4; i++) miniFat.push(u32(base + i * 4));
  }
  const readMini = (start: number, size: number): Uint8Array => {
    const out = new Uint8Array(size);
    let pos = 0;
    for (let s = start, guard = 0; s !== END && s < miniFat.length && pos < size && guard < miniFat.length; s = miniFat[s], guard++) {
      const from = s * miniSectorSize;
      const take = Math.min(miniSectorSize, size - pos);
      out.set(miniStream.subarray(from, from + take), pos);
      pos += take;
    }
    return out.subarray(0, pos);
  };

  // Only the top level: embedded objects can hold streams with the same names.
  const streams = new Map<string, Uint8Array>();
  const visit = (id: number, depth: number) => {
    if (id >= entries.length || id === 0xffffffff || depth > 64) return;
    const e = entries[id];
    visit(e.left, depth + 1);
    visit(e.right, depth + 1);
    if (e.type === 2 && !streams.has(e.name)) {
      streams.set(e.name, e.size < miniCutoff ? readMini(e.start, e.size) : readChain(e.start, e.size));
    }
  };
  visit(root.child, 0);
  return streams;
}

// ── Pictures inside old Office files ─────────────────────────────────────

const JPEG = [0xff, 0xd8, 0xff];
const PNG = [0x89, 0x50, 0x4e, 0x47];
const startsWith = (b: Uint8Array, at: number, sig: number[]) => sig.every((v, i) => b[at + i] === v);

/** A device-independent bitmap with the file header browsers need to open it as .bmp. */
function dibToBmp(dib: Uint8Array): Blob | null {
  if (dib.length < 40) return null;
  const dv = new DataView(dib.buffer, dib.byteOffset, dib.byteLength);
  const headerSize = dv.getUint32(0, true);
  const bitCount = dv.getUint16(14, true);
  const compression = dv.getUint32(16, true);
  const used = headerSize >= 36 ? dv.getUint32(32, true) : 0;
  const palette = (used || (bitCount <= 8 ? 1 << bitCount : 0)) * 4 + (compression === 3 && headerSize === 40 ? 12 : 0);
  const file = new Uint8Array(14 + dib.length);
  const fv = new DataView(file.buffer);
  file[0] = 0x42;
  file[1] = 0x4d;
  fv.setUint32(2, file.length, true);
  fv.setUint32(10, 14 + headerSize + palette, true);
  file.set(dib, 14);
  return new Blob([file], { type: "image/bmp" });
}

/**
 * Pictures are stored as "blip" records in both formats (the Pictures stream
 * in PowerPoint, the Data stream in Word). Find each record and keep the
 * photos; clip art drawings are counted as skipped.
 */
function findBlips(stream: Uint8Array): { blobs: Blob[]; clipArt: number } {
  const blobs: Blob[] = [];
  let clipArt = 0;
  const dv = new DataView(stream.buffer, stream.byteOffset, stream.byteLength);
  for (let i = 0; i + 8 <= stream.length; ) {
    const verInst = dv.getUint16(i, true);
    const type = dv.getUint16(i + 2, true);
    const len = dv.getUint32(i + 4, true);
    const end = i + 8 + len;
    const isBlip = (verInst & 0xf) === 0 && type >= 0xf01a && type <= 0xf02a && len > 32 && end <= stream.length;
    if (!isBlip) {
      i++;
      continue;
    }
    const body = stream.subarray(i + 8, end);
    if (type === 0xf01a || type === 0xf01b || type === 0xf01c) {
      clipArt++;
    } else if (type === 0xf01f) {
      // A bitmap: 16 or 32 bytes of ids, then one tag byte.
      const twoIds = (verInst >> 4) === 0x7a9;
      const bmp = dibToBmp(body.subarray(twoIds ? 33 : 17));
      if (bmp) blobs.push(bmp);
    } else {
      // JPEG or PNG: the picture starts after the ids; find its signature.
      for (let k = 0; k < Math.min(64, body.length - 4); k++) {
        if (startsWith(body, k, JPEG)) { blobs.push(new Blob([body.slice(k)], { type: "image/jpeg" })); break; }
        if (startsWith(body, k, PNG)) { blobs.push(new Blob([body.slice(k)], { type: "image/png" })); break; }
      }
    }
    i = end;
  }
  return { blobs, clipArt };
}

// ── Old PowerPoint text ──────────────────────────────────────────────────

/** Slide text from the "PowerPoint Document" stream, slide by slide. */
function pptText(doc: Uint8Array): string[] {
  const dv = new DataView(doc.buffer, doc.byteOffset, doc.byteLength);
  const fromList: string[][] = [];   // SlideListWithText: placeholder text, in slide order
  const fromSlides: string[][] = []; // text boxes drawn on each slide
  const utf16 = new TextDecoder("utf-16le");
  const latin = new TextDecoder("windows-1252");

  const walk = (start: number, end: number, ctx: "none" | "list" | "slide" | "skip", depth: number) => {
    let p = start;
    while (p + 8 <= end) {
      const verInst = dv.getUint16(p, true);
      const type = dv.getUint16(p + 2, true);
      const len = dv.getUint32(p + 4, true);
      const bodyEnd = p + 8 + len;
      if (bodyEnd > end || len > doc.length) break;
      const container = (verInst & 0xf) === 0xf;
      if (container && depth < 32) {
        let next = ctx;
        if (type === 0x0ff0) next = (verInst >> 4) === 0 ? "list" : "skip"; // slides list, not masters or notes
        else if (type === 0x03ee) { fromSlides.push([]); next = "slide"; }
        else if (type === 0x03f0 || type === 0x03f8 || type === 0x0fc9) next = "skip"; // notes, masters, handouts
        walk(p + 8, bodyEnd, next, depth + 1);
      } else if (ctx !== "skip" && ctx !== "none") {
        if (type === 0x03f3 && ctx === "list") fromList.push([]);
        let text = "";
        if (type === 0x0fa0) text = utf16.decode(doc.subarray(p + 8, bodyEnd));
        else if (type === 0x0fa8) text = latin.decode(doc.subarray(p + 8, bodyEnd));
        text = text.replace(/[\r\v]/g, "\n").replace(/[\u0000-\u0008\u000e-\u001f]/g, "").trim();
        if (text && text !== "*") {
          const target = ctx === "list" ? fromList[fromList.length - 1] : fromSlides[fromSlides.length - 1];
          target?.push(text);
        }
      }
      p = bodyEnd;
    }
  };
  walk(0, doc.length, "none", 0);

  const count = Math.max(fromList.length, fromSlides.length);
  const slides: string[] = [];
  for (let i = 0; i < count; i++) {
    const parts = [...new Set([...(fromList[i] ?? []), ...(fromSlides[i] ?? [])])];
    slides.push(parts.join("\n"));
  }
  return slides;
}

// ── Old Word text ────────────────────────────────────────────────────────

/** The document text, through Word's piece table (the text is stored in pieces). */
function docText(streams: Map<string, Uint8Array>): string {
  const word = streams.get("WordDocument");
  if (!word) throw new Error("the Word text stream is missing");
  const wv = new DataView(word.buffer, word.byteOffset, word.byteLength);
  if (wv.getUint16(0, true) !== 0xa5ec) throw new Error("this is not a Word 97 to 2003 document");
  const table = streams.get(wv.getUint16(0x0a, true) & 0x0200 ? "1Table" : "0Table");
  if (!table) throw new Error("the Word table stream is missing");

  const csw = wv.getUint16(0x20, true);
  const lwStart = 0x22 + csw * 2 + 2;
  const cslw = wv.getUint16(0x22 + csw * 2, true);
  // The main text, then footnotes, headers, comments, endnotes and text
  // boxes follow it in the same pieces. Worksheets often put every sentence
  // in a text box, so all of them are read.
  let ccpText = 0;
  for (let k = 3; k <= 10; k++) ccpText += Math.max(0, wv.getInt32(lwStart + k * 4, true));
  const fcLcb = lwStart + cslw * 4 + 2;
  const fcClx = wv.getUint32(fcLcb + 33 * 8, true);
  const lcbClx = wv.getUint32(fcLcb + 33 * 8 + 4, true);

  const tv = new DataView(table.buffer, table.byteOffset, table.byteLength);
  let p = fcClx;
  while (p < fcClx + lcbClx && table[p] === 0x01) p += 3 + tv.getUint16(p + 1, true); // formatting runs
  if (table[p] !== 0x02) throw new Error("the Word piece table could not be found");
  const lcb = tv.getUint32(p + 1, true);
  const plc = p + 5;
  const n = (lcb - 4) / 12;
  const latin = new TextDecoder("windows-1252");
  const utf16 = new TextDecoder("utf-16le");
  let text = "";
  for (let i = 0; i < n && text.length < ccpText; i++) {
    const cpStart = tv.getUint32(plc + i * 4, true);
    const cpEnd = tv.getUint32(plc + (i + 1) * 4, true);
    const fc = tv.getUint32(plc + (n + 1) * 4 + i * 8 + 2, true);
    const chars = Math.min(cpEnd - cpStart, ccpText - text.length);
    if (fc & 0x40000000) {
      const at = (fc & 0x3fffffff) / 2;
      text += latin.decode(word.subarray(at, at + chars));
    } else {
      text += utf16.decode(word.subarray(fc, fc + chars * 2));
    }
  }
  return text
    .replace(/\u0013[^\u0013\u0014\u0015]*\u0014/g, "") // field instructions (keep the shown result)
    .replace(/\u0013[^\u0013\u0014\u0015]*\u0015/g, "")
    .replace(/[\u0013\u0014\u0015\u0001\u0002\u0003\u0004\u0005\u0008\u001f]/g, "")
    .replace(/ {5,}/g, " _____ ") // a gap left for learners to fill in
    .replace(/\u0007\r?/g, " | ")
    .replace(/[\r\u000b\u000c]/g, "\n")
    .replace(/\u001e/g, "-")
    .replace(/ /g, " ")
    .replace(/( \| )+\n/g, " |\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── Public readers ───────────────────────────────────────────────────────

function keepPictures(found: FoundPicture[]): { pictures: FoundPicture[]; dropped: number } {
  const big = found.filter((p) => p.blob.size >= MIN_PICTURE_BYTES);
  return { pictures: big.slice(0, MAX_PICTURES), dropped: found.length - Math.min(big.length, MAX_PICTURES) };
}

export async function readOldPowerPoint(file: File): Promise<ReadResult> {
  const streams = readCompoundFile(new Uint8Array(await file.arrayBuffer()));
  const doc = streams.get("PowerPoint Document");
  if (!doc) throw new Error("no slides were found in it");
  const slides = pptText(doc);
  const text = slides.map((s, i) => (s ? `--- Slide ${i + 1} ---\n${s}` : "")).filter(Boolean).join("\n\n");
  const links = tidyLinks(linksInText(new TextDecoder("utf-16le").decode(doc), new TextDecoder("windows-1252").decode(doc)));
  const blips = streams.get("Pictures") ? findBlips(streams.get("Pictures")!) : { blobs: [], clipArt: 0 };
  const base = file.name.replace(/\.[^.]+$/, "");
  const { pictures, dropped } = keepPictures(blips.blobs.map((blob, i) => ({ name: `${base} · picture ${i + 1}`, blob })));
  return { text, pages: slides.length, pictures, skipped: dropped + blips.clipArt, links };
}

export async function readOldWord(file: File): Promise<ReadResult> {
  const streams = readCompoundFile(new Uint8Array(await file.arrayBuffer()));
  const text = docText(streams);
  const word = streams.get("WordDocument")!;
  const links = tidyLinks(linksInText(new TextDecoder("utf-16le").decode(word), new TextDecoder("windows-1252").decode(word)));
  const blips = streams.get("Data") ? findBlips(streams.get("Data")!) : { blobs: [], clipArt: 0 };
  const base = file.name.replace(/\.[^.]+$/, "");
  const { pictures, dropped } = keepPictures(blips.blobs.map((blob, i) => ({ name: `${base} · picture ${i + 1}`, blob })));
  return { text, pages: 1, pictures, skipped: dropped + blips.clipArt, links };
}

const SHOWABLE = /\.(jpe?g|png|gif|bmp|webp)$/i;
const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", bmp: "image/bmp", webp: "image/webp" };
const mimeOf = (path: string) => MIME[path.split(".").pop()!.toLowerCase()] ?? "application/octet-stream";

/** Pictures in a .pptx, slide by slide. Logos and backgrounds repeated on three or more slides are left out. */
export async function picturesFromPptx(file: File): Promise<{ pictures: FoundPicture[]; skipped: number }> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const rels = Object.keys(zip.files)
    .map((p) => ({ p, n: Number(p.match(/^ppt\/slides\/_rels\/slide(\d+)\.xml\.rels$/i)?.[1]) }))
    .filter((r) => r.n)
    .sort((a, b) => a.n - b.n);
  const perSlide: { slide: number; media: string[] }[] = [];
  const uses = new Map<string, number>();
  for (const r of rels) {
    const xml = await zip.file(r.p)!.async("text");
    const media = [...new Set([...xml.matchAll(/Type="[^"]*\/image"[^>]*Target="([^"]+)"|Target="([^"]+)"[^>]*Type="[^"]*\/image"/g)]
      .map((m) => (m[1] ?? m[2]).replace(/^\.\.\//, "ppt/")))];
    perSlide.push({ slide: r.n, media });
    for (const m of media) uses.set(m, (uses.get(m) ?? 0) + 1);
  }
  const base = file.name.replace(/\.[^.]+$/, "");
  const found: FoundPicture[] = [];
  const seen = new Set<string>();
  let skipped = 0;
  for (const { slide, media } of perSlide) {
    let k = 0;
    for (const m of media) {
      if (seen.has(m)) continue;
      seen.add(m);
      const entry = zip.file(m);
      if (!entry || !SHOWABLE.test(m) || (uses.get(m) ?? 0) >= 3) { skipped++; continue; }
      const bytes = await entry.async("uint8array");
      k++;
      found.push({ name: `${base} · slide ${slide}${media.length > 1 ? ` picture ${k}` : ""}`, blob: new Blob([bytes as BlobPart], { type: mimeOf(m) }) });
    }
  }
  const kept = keepPictures(found);
  return { pictures: kept.pictures, skipped: skipped + kept.dropped };
}

export async function picturesFromDocx(file: File): Promise<{ pictures: FoundPicture[]; skipped: number }> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const media = Object.keys(zip.files).filter((p) => /^word\/media\//i.test(p)).sort();
  const base = file.name.replace(/\.[^.]+$/, "");
  const found: FoundPicture[] = [];
  let skipped = 0;
  for (const m of media) {
    if (!SHOWABLE.test(m)) { skipped++; continue; }
    found.push({ name: `${base} · picture ${found.length + 1}`, blob: new Blob([(await zip.file(m)!.async("uint8array")) as BlobPart], { type: mimeOf(m) }) });
  }
  const kept = keepPictures(found);
  return { pictures: kept.pictures, skipped: skipped + kept.dropped };
}

/** Every page of a PDF drawn as a picture, so the teacher's own design can go on the screens. */
export async function pagesFromPdf(file: File, width = 1600): Promise<{ pictures: FoundPicture[]; skipped: number }> {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const base = file.name.replace(/\.[^.]+$/, "");
  const pictures: FoundPicture[] = [];
  const count = Math.min(pdf.numPages, MAX_PICTURES);
  for (let i = 1; i <= count; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (blob) pictures.push({ name: `${base} · page ${i}`, blob });
  }
  return { pictures, skipped: pdf.numPages - count };
}

/**
 * Everything the agent can use from one document: its words, and its
 * pictures (or, for a PDF, each page as a picture).
 */
export async function readDocument(file: File): Promise<ReadResult> {
  const name = file.name.toLowerCase();
  const { extractPdfRich, extractTextFromPowerPoint, extractWordRich } = await import("./documentParser");
  if (/\.(txt|md|csv)$/.test(name)) {
    const text = await file.text();
    return { text, pages: 1, pictures: [], skipped: 0, links: tidyLinks(linksInText(text)) };
  }
  if (name.endsWith(".ppt")) return readOldPowerPoint(file);
  if (name.endsWith(".doc")) return readOldWord(file);
  if (name.endsWith(".pptx")) {
    const text = await extractTextFromPowerPoint(file);
    const { pictures, skipped } = await picturesFromPptx(file);
    const links = tidyLinks([...linksInText(text), ...(await linksInZip(file).catch(() => []))]);
    return { text, pages: (text.match(/^--- Slide/gm) ?? []).length, pictures, skipped, links };
  }
  if (name.endsWith(".docx")) {
    const { text, pages } = await extractWordRich(file);
    const { pictures, skipped } = await picturesFromDocx(file);
    const links = tidyLinks([...linksInText(text), ...(await linksInZip(file).catch(() => []))]);
    return { text, pages, pictures, skipped, links };
  }
  if (name.endsWith(".pdf")) {
    const { text, pages } = await extractPdfRich(file);
    const drawn = await pagesFromPdf(file);
    const links = tidyLinks([...linksInText(text), ...(await linksInPdf(file).catch(() => []))]);
    return { text, pages, pictures: drawn.pictures, skipped: drawn.skipped, links };
  }
  throw new Error("this kind of document cannot be read");
}
