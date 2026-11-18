// The designer's form for a designed slide, with a live preview.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DesignedSlideCard,
  LAYOUT_LABELS,
  LAYOUTS,
  LOOK_LABELS,
  LOOKS,
  type DesignedSlideContent,
  type Layout,
} from "@/components/DesignedSlide";
import { fetchImage } from "@/lib/fetchImage";
import { prepareImage, uploadToLessonMedia } from "@/lib/lessonAgent";

/** A new designed slide, so the type can be picked from the list and shows something at once. */
export const NEW_DESIGNED_SLIDE: DesignedSlideContent = {
  type: "designed_slide",
  layout: "statement",
  look: "clean",
  title: "Your title",
};

const field = "bg-background/60 border-border focus-visible:border-[color:var(--cyan)]";
const label = "text-[10px] uppercase tracking-widest text-muted-foreground";
const PICTURE_LAYOUTS: Layout[] = ["cover", "split", "question"];
const POINT_LAYOUTS: Layout[] = ["split", "steps", "question"];

export function DesignedSlideEditor({
  content,
  lessonId,
  tall,
  onChange,
}: {
  content: DesignedSlideContent;
  lessonId: string;
  tall: boolean;
  onChange: (patch: Partial<DesignedSlideContent>) => void;
}) {
  const [busy, setBusy] = useState<null | "upload" | "search">(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(content.image_search ?? "");
  const layout = content.layout ?? "statement";
  const columns = [0, 1].map((i) => content.columns?.[i] ?? { heading: "", text: "" });

  const setColumn = (i: number, patch: Partial<{ heading: string; text: string }>) => {
    const next = columns.map((c, j) => (j === i ? { ...c, ...patch } : c));
    onChange({ columns: next });
  };

  const upload = async (file: File) => {
    setBusy("upload");
    setError(null);
    try {
      const { blob } = await prepareImage(file);
      const url = await uploadToLessonMedia(`lessons/${lessonId}`, file.name.replace(/\.[^.]+$/, "") + ".jpg", blob, "image/jpeg");
      onChange({ image_url: url, image_search: undefined });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  const findPhoto = async () => {
    const query = search.trim() || content.title;
    if (!query) return;
    setBusy("search");
    setError(null);
    const where = /\b(uk|british|britain|england|english|bradford|yorkshire|london)\b/i.test(query) ? query : `${query} UK`;
    const res = await fetchImage("stock", where, content.title);
    setBusy(null);
    if (res.ok) onChange({ image_url: res.url, image_search: undefined });
    else setError(res.error);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-md overflow-hidden border border-border bg-immersive p-2 flex justify-center">
        <div style={tall ? { width: "45%" } : { width: "100%" }}>
          <DesignedSlideCard content={content} tall={tall} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className={label}>Look</Label>
          <Select value={content.look ?? "clean"} onValueChange={(v) => onChange({ look: v as DesignedSlideContent["look"] })}>
            <SelectTrigger className={field}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              {LOOKS.map((l) => <SelectItem key={l} value={l}>{LOOK_LABELS[l]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className={label}>Layout</Label>
          <Select value={layout} onValueChange={(v) => onChange({ layout: v as Layout })}>
            <SelectTrigger className={field}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              {LAYOUTS.map((l) => <SelectItem key={l} value={l}>{LAYOUT_LABELS[l]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className={label}>Small heading (optional)</Label>
        <Input value={content.kicker ?? ""} onChange={(e) => onChange({ kicker: e.target.value })} placeholder="e.g. Talk at your table" className={field} />
      </div>
      <div className="space-y-1.5">
        <Label className={label}>Title</Label>
        <Textarea value={content.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} rows={2} className={`${field} resize-y`} />
      </div>
      <div className="space-y-1.5">
        <Label className={label}>A line under the title (optional)</Label>
        <Input value={content.text ?? ""} onChange={(e) => onChange({ text: e.target.value })} className={field} />
      </div>

      {POINT_LAYOUTS.includes(layout) && (
        <div className="space-y-1.5">
          <Label className={label}>{layout === "steps" ? "Steps, one per line" : "Points, one per line"}</Label>
          <Textarea
            value={(content.points ?? []).join("\n")}
            onChange={(e) => onChange({ points: e.target.value.split("\n").slice(0, 6) })}
            rows={4}
            className={`${field} resize-y`}
          />
        </div>
      )}

      {layout === "compare" && (
        <div className="grid grid-cols-2 gap-2">
          {columns.map((col, i) => (
            <div key={i} className="space-y-1.5">
              <Label className={label}>{i === 0 ? "Left" : "Right"}</Label>
              <Input value={col.heading} onChange={(e) => setColumn(i, { heading: e.target.value })} placeholder="Heading" className={field} />
              <Textarea value={col.text} onChange={(e) => setColumn(i, { text: e.target.value })} rows={3} className={`${field} resize-y`} />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        <Label className={label}>Label in a pill (optional)</Label>
        <Input value={content.chip ?? ""} onChange={(e) => onChange({ chip: e.target.value })} placeholder="e.g. 2 minutes" className={field} />
      </div>

      {PICTURE_LAYOUTS.includes(layout) && (
        <div className="space-y-2 rounded-md border border-border p-2">
          <Label className={label}>Picture</Label>
          <div className="flex gap-2">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Describe a photo to find" className={field}
              onKeyDown={(e) => e.key === "Enter" && findPhoto()} />
            <Button size="sm" variant="outline" onClick={findPhoto} disabled={!!busy}>{busy === "search" ? "Finding…" : "Find photo"}</Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs underline cursor-pointer">
              {busy === "upload" ? "Uploading…" : "Upload your own"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); e.target.value = ""; }} />
            </label>
            {content.image_url && <button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => onChange({ image_url: undefined })}>Remove picture</button>}
          </div>
          <p className="text-[10px] text-muted-foreground">Free stock photos from Pexels. Check the people pictured are a real mix, and that workplace photos show safe practice.</p>
          {error && <p className="text-[10px] text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}
