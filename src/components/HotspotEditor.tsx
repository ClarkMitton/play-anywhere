import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Hotspot } from "@/components/HazardHotspots";

// Designer dialog for placing hazard hotspots on an image.
// Click empty space to add a hazard, drag a circle to move it, and edit its
// label and size in the list. Coordinates are stored as % of the image.

const DEFAULT_R = 7;

export function HotspotEditorDialog({
  open,
  url,
  hotspots,
  onClose,
  onSave,
}: {
  open: boolean;
  url: string;
  hotspots: Hotspot[];
  onClose: () => void;
  onSave: (hotspots: Hotspot[]) => void;
}) {
  const [draft, setDraft] = useState<Hotspot[]>(hotspots);
  const [selected, setSelected] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<string | null>(null);
  const labelRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset the draft each time the dialog opens.
  const [lastOpen, setLastOpen] = useState(false);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setDraft(hotspots);
      setSelected(null);
    }
  }

  const toPct = (clientX: number, clientY: number) => {
    const rect = imgRef.current!.getBoundingClientRect();
    return {
      x: Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)),
    };
  };

  const update = (id: string, patch: Partial<Hotspot>) =>
    setDraft((d) => d.map((h) => (h.id === id ? { ...h, ...patch } : h)));

  const handleImagePointerDown = (e: React.PointerEvent) => {
    if (!imgRef.current) return;
    const { x, y } = toPct(e.clientX, e.clientY);
    const id = crypto.randomUUID().slice(0, 8);
    setDraft((d) => [...d, { id, x: round1(x), y: round1(y), r: DEFAULT_R, label: "" }]);
    setSelected(id);
    setTimeout(() => labelRefs.current[id]?.focus(), 0);
  };

  const handleSpotPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelected(id);
    dragRef.current = id;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !imgRef.current) return;
    const { x, y } = toPct(e.clientX, e.clientY);
    update(dragRef.current, { x: round1(x), y: round1(y) });
  };

  const unlabelled = draft.filter((h) => !h.label.trim()).length;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[min(1200px,95vw)] w-[95vw] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Mark the hazards</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-2">
          Click the picture to add a hazard. Drag a circle to move it. Learners find a hazard by
          tapping inside its circle.
        </p>
        <div className="flex gap-4 min-h-0" style={{ maxHeight: "70vh" }}>
          <div className="flex-1 min-w-0 flex items-start justify-center bg-black rounded-lg overflow-hidden">
            <div
              className="relative select-none"
              onPointerMove={handlePointerMove}
              onPointerUp={() => (dragRef.current = null)}
            >
              <img
                ref={imgRef}
                src={url}
                alt=""
                draggable={false}
                onPointerDown={handleImagePointerDown}
                className="block max-w-full max-h-[70vh] object-contain cursor-crosshair"
              />
              {draft.map((h, i) => (
                <div
                  key={h.id}
                  onPointerDown={(e) => handleSpotPointerDown(e, h.id)}
                  className={`absolute rounded-full border-[3px] cursor-move flex items-center justify-center font-bold text-sm
                    ${selected === h.id ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/25" : "border-[color:var(--orange)] bg-[color:var(--orange)]/20"}`}
                  style={{
                    left: `${h.x}%`,
                    top: `${h.y}%`,
                    width: `${(h.r ?? DEFAULT_R) * 2}%`,
                    aspectRatio: "1",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="bg-black/70 text-white rounded px-1">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-72 shrink-0 flex flex-col gap-2 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Hazards ({draft.length})
            </div>
            {draft.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No hazards yet. Click the picture to add one.
              </p>
            )}
            {draft.map((h, i) => (
              <div
                key={h.id}
                onClick={() => setSelected(h.id)}
                className={`rounded-lg border p-2 space-y-1.5 ${selected === h.id ? "border-[color:var(--cyan)]" : "border-border"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold w-5 text-center">{i + 1}</span>
                  <Input
                    ref={(el) => {
                      labelRefs.current[h.id] = el;
                    }}
                    value={h.label}
                    onChange={(e) => update(h.id, { label: e.target.value })}
                    placeholder="e.g. Trailing cable"
                    className="h-8 text-xs bg-background/60"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDraft((d) => d.filter((x) => x.id !== h.id));
                    }}
                    className="text-muted-foreground hover:text-destructive text-lg leading-none px-1"
                    aria-label="Remove hazard"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Size
                  </span>
                  <input
                    type="range"
                    min={3}
                    max={20}
                    step={0.5}
                    value={h.r ?? DEFAULT_R}
                    onChange={(e) => update(h.id, { r: Number(e.target.value) })}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          {unlabelled > 0 && (
            <span className="text-xs text-[color:var(--orange)] mr-auto">
              {unlabelled} hazard{unlabelled === 1 ? " needs" : "s need"} a label
            </span>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={unlabelled > 0}
            onClick={() => onSave(draft.map((h) => ({ ...h, label: h.label.trim() })))}
          >
            Save hazards
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
