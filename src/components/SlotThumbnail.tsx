// Lightweight slot content preview for the designer.
// Renders a recognisable visual snapshot of the actual screen output:
//  - bg colour, text layout, images
//  - input UIs (voting pills, confidence scale, buzzer button)
//  - host UIs (scoreboards, mini bar charts)
//
// Use `size="lg"` for the top preview area (richer detail).
// Use `size="sm"` for the timeline (simplified).
// `role` chooses host-side vs screen-side rendering for interactive types.

import type { ContentDef } from "@/types/slot";

type Role = "host" | "screen";
type Size = "lg" | "sm";

export function SlotThumbnail({
  content,
  tag,
  size = "sm",
  role = "screen",
  showTag = true,
}: {
  content: ContentDef | null | undefined;
  tag: "H" | "1" | "2";
  size?: Size;
  role?: Role;
  showTag?: boolean;
}) {
  const tagColour =
    tag === "H"
      ? "bg-[color:var(--cyan)] text-background"
      : "bg-foreground/70 text-background";

  return (
    <div className="relative overflow-hidden rounded-md border border-border/60 bg-background w-full h-full">
      <ThumbContent content={content} size={size} role={role} />
      {showTag && (
        <span
          className={`absolute top-0.5 left-0.5 text-[8px] font-bold leading-none px-1 py-0.5 rounded-sm ${tagColour} z-10`}
        >
          {tag}
        </span>
      )}
    </div>
  );
}

function ThumbContent({
  content,
  size,
  role,
}: {
  content: ContentDef | null | undefined;
  size: Size;
  role: Role;
}) {
  const lg = size === "lg";

  if (!content || !content.type || content.type === "waiting") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
        <span
          className={`uppercase tracking-wider text-muted-foreground/50 ${
            lg ? "text-[11px]" : "text-[8px]"
          }`}
        >
          No content
        </span>
      </div>
    );
  }

  const c = content as Record<string, unknown> & { type: string };

  switch (c.type) {
    case "text_slide": {
      const text = String(c.text ?? "");
      const subtitle = String(c.subtitle ?? "");
      const color = (c.color as string) || "var(--foreground)";
      const big = lg
        ? text.length > 60 ? "text-sm" : text.length > 24 ? "text-lg" : "text-2xl"
        : text.length > 40 ? "text-[6px]" : text.length > 15 ? "text-[8px]" : "text-[11px]";
      return (
        <div className="absolute inset-0 bg-[oklch(0.16_0.04_240)] flex flex-col items-center justify-center p-2 text-center">
          <div
            className={`font-bold leading-tight line-clamp-3 ${big}`}
            style={{ color }}
          >
            {text || "Text"}
          </div>
          {subtitle && lg && (
            <div className="text-[10px] text-foreground/60 mt-1 line-clamp-2">
              {subtitle}
            </div>
          )}
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
          className="absolute inset-0 w-full h-full object-contain bg-black"
          loading="lazy"
        />
      );
    }

    case "youtube":
      return <Label icon="▶" label="YouTube" tint="oklch(0.4 0.2 25)" />;

    case "embed":
      return <Label icon="⚞" label="Embed" tint="oklch(0.3 0.1 280)" />;

    case "host_timer":
    case "countdown_timer":
      return (
        <div className="absolute inset-0 bg-[oklch(0.2_0.1_30)] flex flex-col items-center justify-center">
          <div className={`font-mono font-bold text-[color:var(--orange)] ${lg ? "text-3xl" : "text-sm"}`}>
            {fmtTime(Number(c.duration_secs ?? 60))}
          </div>
          {lg && (
            <div className="text-[10px] uppercase tracking-widest text-foreground/50 mt-1">
              {String(c.label ?? "Timer")}
            </div>
          )}
        </div>
      );

    case "wheel_spinner":
      return <Label icon="🎡" label="Wheel" tint="oklch(0.3 0.15 60)" />;

    case "confidence_checker": {
      const mode = (c.scale_mode as string) || "numbers";
      const max = Number(c.max ?? 10);
      if (role === "host") {
        // Mini bar chart
        return (
          <div className="absolute inset-0 bg-[oklch(0.18_0.05_200)] flex flex-col p-2 gap-1">
            <div className={`text-foreground/80 font-semibold line-clamp-1 ${lg ? "text-[11px]" : "text-[7px]"}`}>
              {String(c.prompt ?? "Confidence")}
            </div>
            <div className="flex items-end justify-between flex-1 gap-[2px]">
              {Array.from({ length: mode === "emoji" ? 5 : Math.min(max, 10) }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[color:var(--cyan)]/70 rounded-t"
                  style={{ height: `${20 + ((i * 53) % 75)}%` }}
                />
              ))}
            </div>
          </div>
        );
      }
      // Screen input
      return (
        <div className="absolute inset-0 bg-[oklch(0.16_0.04_240)] flex flex-col p-2 gap-1.5">
          <div className={`text-foreground/80 font-semibold line-clamp-1 text-center ${lg ? "text-[11px]" : "text-[7px]"}`}>
            {String(c.prompt ?? "How confident?")}
          </div>
          <div className="flex-1 flex items-center justify-center">
            {mode === "emoji" ? (
              <div className={`flex gap-1 ${lg ? "text-2xl" : "text-[10px]"}`}>
                <span>😡</span><span>😠</span><span>😐</span><span>🙂</span><span>😄</span>
              </div>
            ) : (
              <div className={`grid grid-cols-5 gap-[2px] w-full ${lg ? "text-[10px]" : "text-[5px]"}`}>
                {Array.from({ length: Math.min(max, 10) }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[color:var(--cyan)]/30 border border-[color:var(--cyan)]/60 rounded text-center font-bold text-[color:var(--cyan)] py-0.5"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    case "voting": {
      const opts = (c.options as string[]) || [];
      const question = String(c.question ?? "Vote");
      if (role === "host") {
        // Mini bar chart of results
        return (
          <div className="absolute inset-0 bg-[oklch(0.18_0.05_140)] flex flex-col p-2 gap-1">
            <div className={`text-foreground/80 font-semibold line-clamp-1 ${lg ? "text-[11px]" : "text-[7px]"}`}>
              {question}
            </div>
            <div className="flex-1 flex flex-col justify-center gap-[3px]">
              {opts.slice(0, 5).map((o, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className={`truncate text-foreground/70 ${lg ? "text-[9px] w-14" : "text-[5px] w-8"}`}>{o}</div>
                  <div className="flex-1 h-2 bg-border/30 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-[color:var(--green,_oklch(0.7_0.18_140))]"
                      style={{ width: `${20 + ((i * 37) % 70)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div className="absolute inset-0 bg-[oklch(0.16_0.04_240)] flex flex-col p-1.5 gap-1">
          <div className={`text-foreground/80 font-semibold line-clamp-1 text-center ${lg ? "text-[10px]" : "text-[6px]"}`}>
            {question}
          </div>
          <div className="flex-1 flex flex-col gap-[3px] justify-center">
            {opts.slice(0, 4).map((o, i) => (
              <div
                key={i}
                className={`rounded bg-[color:var(--cyan)]/20 border border-[color:var(--cyan)]/60 text-center text-[color:var(--cyan)] font-bold truncate ${
                  lg ? "text-[10px] py-1 px-2" : "text-[5px] py-[1px] px-1"
                }`}
              >
                {o || `Option ${i + 1}`}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "quiz":
    case "quiz_buzzer": {
      const t1 = String(c.team1_name ?? "Team 1");
      const t2 = String(c.team2_name ?? "Team 2");
      if (role === "host") {
        return (
          <div className="absolute inset-0 bg-[oklch(0.2_0.1_80)] flex flex-col p-2 gap-1">
            <div className={`text-center text-[color:var(--orange)] font-bold uppercase tracking-widest ${lg ? "text-[10px]" : "text-[6px]"}`}>
              Buzzer Quiz
            </div>
            <div className="flex-1 grid grid-cols-2 gap-1">
              <div className="rounded bg-[oklch(0.25_0.15_250)] flex flex-col items-center justify-center">
                <div className={`text-white/70 ${lg ? "text-[9px]" : "text-[5px]"} truncate w-full text-center px-1`}>{t1}</div>
                <div className={`font-mono font-bold text-white ${lg ? "text-xl" : "text-xs"}`}>0</div>
              </div>
              <div className="rounded bg-[oklch(0.25_0.15_25)] flex flex-col items-center justify-center">
                <div className={`text-white/70 ${lg ? "text-[9px]" : "text-[5px]"} truncate w-full text-center px-1`}>{t2}</div>
                <div className={`font-mono font-bold text-white ${lg ? "text-xl" : "text-xs"}`}>0</div>
              </div>
            </div>
          </div>
        );
      }
      // Big BUZZ button
      const teamColour = tagFromContext(c);
      return (
        <div className="absolute inset-0 bg-[oklch(0.14_0.04_240)] flex items-center justify-center p-2">
          <div
            className={`rounded-full flex items-center justify-center font-black text-white shadow-lg ${
              lg ? "w-20 h-20 text-base" : "w-8 h-8 text-[7px]"
            }`}
            style={{ background: teamColour }}
          >
            BUZZ
          </div>
        </div>
      );
    }

    case "multiple_choice": {
      const opts = (c.options as string[]) || [];
      return (
        <div className="absolute inset-0 bg-[oklch(0.16_0.04_240)] flex flex-col p-1.5 gap-1">
          <div className={`text-foreground/80 font-semibold line-clamp-1 ${lg ? "text-[10px]" : "text-[6px]"}`}>
            {String(c.text ?? "Question")}
          </div>
          <div className="flex-1 flex flex-col gap-[2px] justify-center">
            {opts.slice(0, 4).map((o, i) => (
              <div
                key={i}
                className={`rounded bg-[color:var(--cyan)]/15 border border-[color:var(--cyan)]/50 truncate px-1 text-[color:var(--cyan)] ${
                  lg ? "text-[9px] py-0.5" : "text-[5px]"
                }`}
              >
                {String.fromCharCode(65 + i)}. {o}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "true_or_false":
      return (
        <div className="absolute inset-0 bg-[oklch(0.16_0.04_240)] flex flex-col p-1.5 gap-1">
          <div className={`text-foreground/80 font-semibold line-clamp-2 ${lg ? "text-[10px]" : "text-[6px]"}`}>
            {String(c.text ?? "T / F")}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1">
            <div className={`rounded bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center font-bold text-emerald-300 ${lg ? "text-sm" : "text-[6px]"}`}>TRUE</div>
            <div className={`rounded bg-rose-500/20 border border-rose-500/60 flex items-center justify-center font-bold text-rose-300 ${lg ? "text-sm" : "text-[6px]"}`}>FALSE</div>
          </div>
        </div>
      );

    default:
      return <Label icon="●" label={c.type} />;
  }
}

function tagFromContext(_c: Record<string, unknown>): string {
  // Default neutral; ScreenMockup wrappers tint by screen anyway.
  return "oklch(0.55 0.2 30)";
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
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
      <div className="aspect-[16/9] w-full">
        <SlotThumbnail content={host} tag="H" size="sm" role="host" />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="aspect-[16/9]">
          <SlotThumbnail content={s1} tag="1" size="sm" role="screen" />
        </div>
        <div className="aspect-[16/9]">
          <SlotThumbnail content={s2} tag="2" size="sm" role="screen" />
        </div>
      </div>
    </div>
  );
}
