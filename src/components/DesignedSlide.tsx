// A designed slide: a proper layout and look instead of glowing text, framed
// on the room's own dark grid so every lesson still feels like the room.
//
// Five looks (clean, paper, bold, calm, night) and six layouts (cover, split,
// steps, statement, compare, question). The big screen shows a 16:9 card; the
// portrait touch screens show the same words re-flowed tall. Every size is in
// container units, so the same card works full screen, in the designer and as
// a thumbnail.

import { useEffect } from "react";

export const LOOKS = ["clean", "paper", "bold", "calm", "night"] as const;
export const LAYOUTS = ["cover", "split", "steps", "statement", "compare", "question"] as const;
export type Look = (typeof LOOKS)[number];
export type Layout = (typeof LAYOUTS)[number];

export const LOOK_LABELS: Record<Look, string> = {
  clean: "Clean",
  paper: "Warm paper",
  bold: "Bold colour",
  calm: "Calm and clear",
  night: "Immersive night",
};
export const LAYOUT_LABELS: Record<Layout, string> = {
  cover: "Cover: title over a photo",
  split: "Picture and words",
  steps: "Numbered steps",
  statement: "Big statement",
  compare: "Compare two things",
  question: "Question to discuss",
};

export type DesignedSlideContent = {
  type: "designed_slide";
  layout: Layout;
  look?: Look;
  kicker?: string;
  title: string;
  text?: string;
  points?: string[];
  columns?: { heading: string; text: string }[];
  chip?: string;
  image_url?: string;
  /** What photo to find, for a slide built before its picture is chosen. */
  image_search?: string;
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Source+Sans+3:wght@400;600&family=Archivo:wght@500;800;900&family=Nunito:wght@500;700;900&family=Inter:wght@500;800&display=swap";

const CSS = `
.ds { container-type: inline-size; position: relative; overflow: hidden; background: var(--bg); color: var(--fg); font-family: var(--body); }
.ds * { box-sizing: border-box; }
.ds h3 { font-family: var(--head); font-weight: var(--hw); margin: 0; line-height: 1.04; letter-spacing: var(--track, -0.01em); overflow-wrap: anywhere; }
.ds .k { font-size: 2.1cqw; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--accent); }
.ds p, .ds li { font-size: 2.9cqw; line-height: 1.35; margin: 0; }
.ds .ph { background-size: cover; background-position: center; background-color: var(--card); }
.ds .chip { align-self: flex-start; background: var(--accent); color: var(--afg); font-weight: 700; font-size: 2.4cqw; padding: 1cqw 2.2cqw; border-radius: 99px; }
.ds-16 { aspect-ratio: 16 / 9; }
.ds-cover .ph { position: absolute; inset: 0; }
.ds-cover .shade { position: absolute; inset: 0; background: var(--shade); }
.ds-cover .t { position: absolute; left: 6cqw; right: 26cqw; bottom: 7cqw; color: var(--cfg); display: flex; flex-direction: column; gap: 1.2cqw; }
.ds-cover .k { color: var(--cfg); opacity: .85; }
.ds-cover h3 { font-size: 6.6cqw; text-shadow: 0 .2cqw 1.2cqw rgba(0,0,0,.35); }
.ds-cover p { font-size: 2.6cqw; opacity: .92; }
.ds-split { display: grid; grid-template-columns: 1fr 1fr; }
.ds-split .t, .ds-question .t { padding: 6cqw 5cqw; display: flex; flex-direction: column; justify-content: center; gap: 2.2cqw; }
.ds-split h3 { font-size: 4.8cqw; }
.ds ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 1.4cqw; }
.ds ul li { padding-left: 3cqw; position: relative; }
.ds ul li::before { content: ""; position: absolute; left: 0; top: 1.2cqw; width: 1.4cqw; height: 1.4cqw; border-radius: 50%; background: var(--accent); }
.ds-steps .in, .ds-statement .in, .ds-compare .in { position: absolute; inset: 0; padding: 5.5cqw 6cqw; display: flex; flex-direction: column; justify-content: center; gap: 2.8cqw; }
.ds-steps h3 { font-size: 5cqw; }
.ds ol { list-style: none; margin: 0; padding: 0; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 2cqw; }
.ds ol li { background: var(--card); border-radius: 1.4cqw; padding: 2.4cqw 2cqw; font-weight: 600; font-size: 2.6cqw; }
.ds ol li b { display: block; font-family: var(--head); font-size: 6cqw; color: var(--accent); line-height: 1; margin-bottom: 1cqw; }
.ds-statement .in { padding: 0 8cqw; gap: 2cqw; }
.ds-statement h3 { font-size: 8.4cqw; }
.ds-statement p { font-size: 3.2cqw; }
.ds-compare h3 { font-size: 4.6cqw; }
.ds-compare .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 2.4cqw; }
.ds-compare .col { background: var(--card); border-radius: 1.4cqw; padding: 2.6cqw; border-top: .8cqw solid var(--accent); }
.ds-compare .col + .col { border-top-color: var(--fg); }
.ds-compare .col h4 { margin: 0 0 1.2cqw; font-family: var(--head); font-size: 3.4cqw; }
.ds-question { display: grid; grid-template-columns: 1.15fr 1fr; }
.ds-question h3 { font-size: 5.4cqw; }
.ds-question.noimg, .ds-split.noimg { grid-template-columns: 1fr; }
/* Portrait: everything stacked, picture on top. */
.ds-tall { aspect-ratio: 9 / 16; display: flex; flex-direction: column; }
.ds-tall .ph { flex: 0 0 38%; }
.ds-tall .t { flex: 1; padding: 8cqw 8cqw 10cqw; display: flex; flex-direction: column; justify-content: center; gap: 5cqw; }
.ds-tall .k { font-size: 4.4cqw; }
.ds-tall h3 { font-size: 10cqw; }
.ds-tall p, .ds-tall li { font-size: 6cqw; }
.ds-tall ul li { padding-left: 6cqw; }
.ds-tall ul li::before { top: 2.6cqw; width: 2.8cqw; height: 2.8cqw; }
.ds-tall ol { grid-auto-flow: row; gap: 3cqw; }
.ds-tall ol li { font-size: 5.6cqw; padding: 4cqw; display: flex; gap: 4cqw; align-items: center; border-radius: 3cqw; }
.ds-tall ol li b { font-size: 9cqw; margin: 0; }
.ds-tall .col { background: var(--card); border-radius: 3cqw; padding: 5cqw; border-left: 1.6cqw solid var(--accent); }
.ds-tall .col h4 { margin: 0 0 2cqw; font-family: var(--head); font-size: 6.4cqw; }
.ds-tall .chip { font-size: 5.4cqw; padding: 2cqw 5cqw; }
/* The five looks */
.ds.clean { --bg:#fbfbf9; --fg:#16181d; --accent:#0f766e; --afg:#fff; --card:#eef3f1; --head:"Plus Jakarta Sans",system-ui,sans-serif; --hw:800; --body:"Plus Jakarta Sans",system-ui,sans-serif; --shade:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.72)); --cfg:#fff; }
.ds.paper { --bg:#f3ebdd; --fg:#2b2118; --accent:#b4532a; --afg:#fff8ef; --card:#e9dcc6; --head:"Fraunces",Georgia,serif; --hw:800; --body:"Source Sans 3",system-ui,sans-serif; --track:-0.015em; --shade:linear-gradient(180deg,rgba(43,33,24,0) 30%,rgba(43,33,24,.82)); --cfg:#fff8ef; }
.ds.bold { --bg:#ffd23f; --fg:#111; --accent:#d1361d; --afg:#fff; --card:#fff3c4; --head:"Archivo",system-ui,sans-serif; --hw:900; --body:"Archivo",system-ui,sans-serif; --track:-0.02em; --shade:linear-gradient(90deg,rgba(17,17,17,.85) 0 48%,rgba(17,17,17,0) 75%); --cfg:#ffd23f; }
.ds.calm { --bg:#e8f0ea; --fg:#1f3a2e; --accent:#2f7d5b; --afg:#fff; --card:#fff; --head:"Nunito",system-ui,sans-serif; --hw:900; --body:"Nunito",system-ui,sans-serif; --shade:linear-gradient(180deg,rgba(31,58,46,0) 35%,rgba(31,58,46,.78)); --cfg:#fff; }
.ds.night { --bg:radial-gradient(ellipse at 30% 20%,#13254a,#060b1a 70%); --fg:#e8f4ff; --accent:#36d6ff; --afg:#04111f; --card:rgba(54,214,255,.08); --head:"Inter",system-ui,sans-serif; --hw:800; --body:"Inter",system-ui,sans-serif; --shade:linear-gradient(180deg,rgba(6,11,26,.1) 30%,rgba(6,11,26,.88)); --cfg:#e8f4ff; }
.ds.night h3 { text-shadow: 0 0 2cqw rgba(54,214,255,.35); }
/* The frame: the card sits on the room's grid with an electric edge. */
.ds-frame { box-shadow: 0 0 0 2px rgba(54,214,255,.55), 0 0 4vmin rgba(54,214,255,.28), 0 2vmin 6vmin rgba(0,0,0,.55); border-radius: 1.2vmin; }
`;

/** Adds the fonts and styles to the page once. */
function useDesignedSlideStyles() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("ds-styles")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS;
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.id = "ds-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);
}

const lines = (c: DesignedSlideContent) => (c.points ?? []).map((p) => p.trim()).filter(Boolean).slice(0, 6);
const bg = (url?: string) => (url ? { backgroundImage: `url("${url}")` } : undefined);

/** The card itself, filling the width it is given. */
export function DesignedSlideCard({ content: c, tall = false, className = "" }: { content: DesignedSlideContent; tall?: boolean; className?: string }) {
  useDesignedSlideStyles();
  const look = LOOKS.includes(c.look as Look) ? c.look : "clean";
  const layout = LAYOUTS.includes(c.layout) ? c.layout : "statement";
  const points = lines(c);
  const columns = (c.columns ?? []).filter((col) => col?.heading || col?.text).slice(0, 2);
  const kicker = c.kicker ? <div className="k">{c.kicker}</div> : null;
  const chip = c.chip ? <div className="chip">{c.chip}</div> : null;
  const body = (
    <>
      {c.text && <p>{c.text}</p>}
      {layout === "steps" && points.length > 0 && (
        <ol>{points.map((p, i) => <li key={i}><b>{i + 1}</b>{p}</li>)}</ol>
      )}
      {layout !== "steps" && points.length > 0 && <ul>{points.map((p, i) => <li key={i}>{p}</li>)}</ul>}
      {layout === "compare" && columns.length > 0 && (
        <div className="cols">
          {columns.map((col, i) => <div className="col" key={i}><h4>{col.heading}</h4><p>{col.text}</p></div>)}
        </div>
      )}
      {chip}
    </>
  );

  if (tall) {
    const showPicture = !!c.image_url && (layout === "cover" || layout === "split" || layout === "question");
    return (
      <div className={`ds ds-tall ${look} ${className}`}>
        {showPicture && <div className="ph" style={bg(c.image_url)} />}
        <div className="t">{kicker}<h3>{c.title}</h3>{body}</div>
      </div>
    );
  }

  switch (layout) {
    case "cover":
      return (
        <div className={`ds ds-16 ds-cover ${look} ${className}`}>
          <div className="ph" style={bg(c.image_url)} />
          <div className="shade" />
          <div className="t">{kicker}<h3>{c.title}</h3>{c.text && <p>{c.text}</p>}</div>
        </div>
      );
    case "split":
    case "question":
      return (
        <div className={`ds ds-16 ds-${layout} ${look} ${c.image_url ? "" : "noimg"} ${className}`}>
          {layout === "split" && c.image_url && <div className="ph" style={bg(c.image_url)} />}
          <div className="t">{kicker}<h3>{c.title}</h3>{body}</div>
          {layout === "question" && c.image_url && <div className="ph" style={bg(c.image_url)} />}
        </div>
      );
    default:
      return (
        <div className={`ds ds-16 ds-${layout} ${look} ${className}`}>
          <div className="in">{kicker}<h3>{c.title}</h3>{body}</div>
        </div>
      );
  }
}

/** Full screen: the card, slightly smaller than the screen, on the room's dark grid. */
export function DesignedSlide({ content, tall = false }: { content: DesignedSlideContent; tall?: boolean }) {
  // Leave a band of the room's background all round: 16:9 on the big screen,
  // 9:16 on the portrait touch screens.
  const size = tall ? "min(90vw, calc(90vh * 9 / 16))" : "min(92vw, calc(88vh * 16 / 9))";
  return (
    <div className="h-screen w-full bg-immersive bg-grid flex items-center justify-center overflow-hidden animate-slot-in">
      <div className="ds-frame overflow-hidden" style={{ width: size }}>
        <DesignedSlideCard content={content} tall={tall} />
      </div>
    </div>
  );
}
