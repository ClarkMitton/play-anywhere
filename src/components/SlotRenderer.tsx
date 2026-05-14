// Renders content for a single slot on a single screen.
// At this checkpoint only `waiting` and `text_slide` are wired so we can
// prove three-screen Realtime sync end-to-end. More content types land next.

export type SlotContent =
  | { type: "waiting" }
  | { type: "text_slide"; text: string; size?: "md" | "lg" | "xl"; color?: string }
  | { type: "teacher_note"; text: string }
  | { type: string; [k: string]: unknown };

export function SlotRenderer({
  content,
  screen,
  muted = true,
}: {
  content: SlotContent | null | undefined;
  screen: "host" | "screen1" | "screen2";
  muted?: boolean;
}) {
  if (!content) return <Waiting screen={screen} />;

  switch (content.type) {
    case "waiting":
      return <Waiting screen={screen} />;

    case "text_slide": {
      const c = content as Extract<SlotContent, { type: "text_slide" }>;
      const sizeClass =
        c.size === "xl" ? "text-[10vw]" : c.size === "lg" ? "text-[7vw]" : "text-[5vw]";
      return (
        <div
          key={c.text}
          className="min-h-screen w-full bg-immersive bg-grid flex items-center justify-center p-12 animate-slot-in"
        >
          <div
            className={`${sizeClass} leading-[0.95] font-extrabold text-center text-glow max-w-[90vw]`}
            style={c.color ? { color: c.color } : undefined}
          >
            {c.text}
          </div>
        </div>
      );
    }

    case "teacher_note": {
      // Only rendered on Touch Screen 1.
      if (screen !== "screen1") return <Waiting screen={screen} />;
      const c = content as Extract<SlotContent, { type: "teacher_note" }>;
      return (
        <div className="min-h-screen w-full bg-immersive p-10 animate-slot-in">
          <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--orange)] mb-4">
            Teacher note · only visible here
          </div>
          <div className="text-3xl font-bold leading-snug whitespace-pre-wrap">{c.text}</div>
        </div>
      );
    }

    default:
      return (
        <div className="min-h-screen w-full bg-immersive flex items-center justify-center">
          <div className="text-2xl text-muted-foreground">
            Content type <span className="text-[color:var(--cyan)]">{String(content.type)}</span> coming soon
          </div>
        </div>
      );
  }
  // muted is consumed once video/embed types land
  void muted;
}

function Waiting({ screen }: { screen: "host" | "screen1" | "screen2" }) {
  const label =
    screen === "host" ? "Host" : screen === "screen1" ? "Touch Screen 1" : "Touch Screen 2";
  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-10">
      <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--cyan)] mb-6 animate-float-glow">
        {label}
      </div>
      <div className="text-5xl md:text-7xl font-extrabold text-glow text-center max-w-3xl">
        Standing by
      </div>
      <div className="mt-8 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse [animation-delay:200ms]" />
        <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse [animation-delay:400ms]" />
      </div>
    </div>
  );
}
