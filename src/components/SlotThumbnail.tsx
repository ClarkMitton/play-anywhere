// Lightweight slot content preview for the designer timeline.
// Mirrors the actual SlotRenderer visually (bg colour, text, images) but renders
// at a tiny size with no playback / network side effects.

import type { ContentDef } from "@/types/slot";

export function SlotThumbnail({
  content,
  tag,
  size = "sm",
}: {
  content: ContentDef | null | undefined;
  tag: "H" | "1" | "2";
  size?: "lg" | "sm";
}) {
  const tagColour =
    tag === "H"
      ? "bg-[color:var(--cyan)] text-background"
      : "bg-foreground/70 text-background";

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-border/60 bg-background ${
        size === "lg" ? "aspect-[16/9]" : "aspect-[16/9]"
      }`}
    >
      <ThumbContent content={content} />
      <span
        className={`absolute top-0.5 left-0.5 text-[8px] font-bold leading-none px-1 py-0.5 rounded-sm ${tagColour}`}
      >
        {tag}
      </span>
    </div>
  );
}

function ThumbContent({ content }: { content: ContentDef | null | undefined }) {
  if (!content || !content.type || content.type === "waiting") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
        <span className="text-[8px] uppercase tracking-wider text-muted-foreground/50">
          empty
        </span>
      </div>
    );
  }

  const c = content as Record<string, unknown> & { type: string };

  switch (c.type) {
    case "text_slide": {
      const text = String(c.text ?? "");
      const color = (c.color as string) || "var(--foreground)";
      return (
        <div className="absolute inset-0 bg-[oklch(0.16_0.04_240)] flex items-center justify-center p-1">
          <div
            className="text-center font-bold leading-tight line-clamp-3"
            style={{
              color,
              fontSize: text.length > 40 ? "6px" : text.length > 15 ? "8px" : "11px",
            }}
          >
            {text || "Text"}
          </div>
        </div>
      );
    }

    case "image": {
      const url = c.url as string | undefined;
      if (!url) return <Label icon="🖼" label="Image" />;
      return (
        <img
          src={url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      );
    }

    case "video_upload":
      return <Label icon="🎬" label={String(c.file_name ?? "Video")} />;

    case "youtube":
      return <Label icon="▶" label="YouTube" tint="oklch(0.4 0.2 25)" />;

    case "embed":
      return <Label icon="⚞" label="Embed" tint="oklch(0.3 0.1 280)" />;

    case "webpage":
      return <Label icon="🌐" label="Webpage" tint="oklch(0.3 0.1 220)" />;

    case "html_upload":
      return <Label icon="</>" label="HTML" tint="oklch(0.3 0.12 180)" />;

    case "teacher_note":
      return (
        <div className="absolute inset-0 bg-[oklch(0.22_0.08_60)] flex items-center justify-center p-1">
          <div className="text-[7px] font-semibold text-[oklch(0.95_0.08_60)] line-clamp-4 leading-tight">
            {String(c.text ?? "Note")}
          </div>
        </div>
      );

    case "host_timer":
    case "countdown_timer":
      return <Label icon="⏱" label="Timer" tint="oklch(0.3 0.15 30)" />;

    case "host_webcam":
      return <Label icon="📷" label="Webcam" tint="oklch(0.3 0.15 320)" />;

    case "wheel_spinner":
      return <Label icon="🎡" label="Wheel" tint="oklch(0.3 0.15 60)" />;

    case "confidence_checker":
      return <Label icon="📊" label="Confidence" tint="oklch(0.32 0.15 200)" />;

    case "voting":
      return <Label icon="🗳" label="Vote" tint="oklch(0.32 0.15 140)" />;

    case "quiz":
    case "quiz_buzzer":
      return <Label icon="⚡" label="Buzzer" tint="oklch(0.34 0.18 80)" />;

    case "multiple_choice":
    case "poll":
    case "true_or_false":
    case "likert":
      return <Label icon="❓" label="Question" tint="oklch(0.3 0.12 260)" />;

    default:
      return <Label icon="●" label={c.type} />;
  }
}

function Label({
  icon,
  label,
  tint = "oklch(0.2 0.03 240)",
}: {
  icon: string;
  label: string;
  tint?: string;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-0.5"
      style={{ background: tint }}
    >
      <div className="text-[12px] leading-none">{icon}</div>
      <div className="text-[7px] uppercase tracking-wider text-white/80 truncate max-w-full px-0.5">
        {label}
      </div>
    </div>
  );
}

export function SlotStackThumbnail({
  host,
  s1,
  s2,
}: {
  host: ContentDef | null | undefined;
  s1: ContentDef | null | undefined;
  s2: ContentDef | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <SlotThumbnail content={host} tag="H" size="lg" />
      <div className="grid grid-cols-2 gap-1">
        <SlotThumbnail content={s1} tag="1" size="sm" />
        <SlotThumbnail content={s2} tag="2" size="sm" />
      </div>
    </div>
  );
}
