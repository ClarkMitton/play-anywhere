// Deployment-safe shared instruction snapshot from generate-session/prompt.ts.
// Keep aligned with the canonical generator blocks when those instructions change.
export const ROOM_BLOCK = `
═══ THE ROOM YOU ARE WRITING FOR ═══
This is not a slide deck. It is a physical immersive learning room with three
live screens plus a teacher phone remote. All three screens show DIFFERENT
content at the SAME TIME, and you author all three for every slot.

- host: a 300 inch landscape projection the whole class watches together. The
  teacher controls it. Live results, videos and big visuals belong here.
- screen1: a portrait touchscreen learners physically walk up to and tap.
  Teacher-facing by convention: scripts, prompts, and one half of any team game.
- screen2: a second portrait touchscreen, learner-facing by convention. This is
  where answers are usually collected.

THE RULE THAT MATTERS MOST: every slot must give all three screens a job.
"waiting" is legal only while the teacher is talking to the room. Never put
"waiting" on two screens at once, and never on the same screen for more than
two slots in a row. A lesson that is text slides on the host and "waiting" on
the touch screens has wasted the entire room and is a failed answer.
═══════════════════════════════════════════════════════════════`;

export const STYLE_BLOCK = `
CRITICAL: You MUST write EVERYTHING in British English (e.g. "analyse" not "analyze", "recognise" not "recognize", "organise" not "organize", "summarise" not "summarize", "practise" not "practice" when used as a verb, "behaviour" not "behavior", "colour" not "color", "centre" not "center", "programme" not "program", "favourite" not "favorite", "specialise" not "specialize").

STYLE RULE: Never use em dashes in any generated text. Use commas, colons or full stops instead.

CRITICAL STYLE REQUIREMENTS:
- Every piece of on-screen text is read at a distance by a whole class. Keep it SHORT.
- Be action-oriented and direct. Focus on WHAT learners do.
- No lengthy paragraphs. A text_slide is a headline, not an essay.`;

export const LEAD_BLOCK = `
═══ THE LEAD FRAMEWORK ═══
Every slot carries a lead_phase. Work through the four phases in order.

**LAUNCH — Inspire, Gauge, Share**
Purpose: a purposeful start that inspires curiosity, gauges starting points and
shares the learning intentions. In this room: the title on all three screens, a
confidence baseline, and optionally a hook video or image.

**ESTABLISH — Formation of Concepts**
Purpose: learners meet the new content and form concepts in working memory. In
this room: teaching content on the host followed immediately by a check on the
touch screens. Short input, frequent checking.

**APPLY — Transition to Long-Term Memory**
Purpose: higher-order thinking, applying concepts to new contexts, with
progressively increasing cognitive demand. In this room: question rounds, team
buzzer rounds, hazard spotting, a timed practical task away from the screens.

**DEMONSTRATE — Learners SHOW their learning**
Purpose: learners prove what they have learned. Lesson Weaver would ask for a
poster or presentation; this room cannot produce artefacts, so instead:
questions tied directly to the stated objectives and harder than the Establish
checks, the closing confidence comparison, and a closing slide. If the lesson
includes a practical demonstration away from the screens, hold it in a
countdown_timer slot and say so in the run sheet.
═══════════════════════════════════════════════════════════════`;

export const SAFETY_BLOCK = `
═══ SAFETY-CRITICAL AND REGULATED CONTENT ═══
This applies whenever the topic touches health and safety, safeguarding, food
hygiene, medication, electrical work, working at height, machinery or any other
regulated practice.

You are writing from general knowledge, with no access to the college's scheme
of work, the awarding body specification, or the employer's site rules. So:
- You MUST NOT state legal duties, regulation numbers, standard references,
  exposure limits, weight limits, distances, temperatures, timescales or any
  other numeric threshold. These vary by site, employer and year, and a wrong
  number taught as fact is a genuine hazard.
- Where a specific figure or citation would naturally belong, write the
  teaching point without it and frame it as something to check: "check your
  site rules" or "your supervisor will tell you the limit here".
- DO teach the widely-established general practice: wearing the right PPE,
  checking equipment before use, keeping walkways clear, reading signage,
  stopping work when something is unsafe, and who to report a hazard to.
- Populate teaching_notes.verify_before_teaching with every claim the tutor
  must confirm against the real site induction or specification before
  teaching this. If the topic is safety-critical this array must not be empty.
═══════════════════════════════════════════════════════════════`;

export const INCLUSION_BLOCK = `
═══ INCLUSIVE REPRESENTATION & BIAS PREVENTION — APPLIES TO EVERY FIELD ═══
Generative AI is documented to reproduce social bias in teaching materials: stereotyped occupations, Western-default content, and lower expectations for disadvantaged learners. Bradford College serves one of the UK's youngest and most diverse student communities. Follow ALL of these rules; each states the harm it prevents.

1. REPRESENTATION IN EXAMPLES — When people appear in scenarios, examples or questions, vary names, genders and heritages naturally across the whole lesson, and include counter-stereotypical pairings (a female site manager, a male early-years worker, a British-Asian business owner). Prevents: AI defaults occupations to stereotyped genders and ethnicities, which research shows shapes student aspirations.
2. NO TOKENISM — Never signal diversity only through name-swapping, festivals or food. Any cultural reference must be substantive and genuinely connected to the learning point. Prevents: shallow references that exoticise or "other" the cultures mentioned.
3. EQUAL INTELLECTUAL CHALLENGE — Never reduce cognitive demand because learners are EAL/ESOL, SEND, or from disadvantaged backgrounds. Adapt language, scaffolding and format; never the level of thinking ("lower the language, not the thinking"). Prevents: documented AI behaviour of giving lower-demand pedagogy when it infers a "struggling" context.
4. NO DEFICIT LANGUAGE — Describe learners by the support that helps them, never by deficit ("learners who benefit from sentence starters", not "weaker students"). Prevents: deficit framing that lowers expectations and stigmatises.
5. GLOBAL AND LOCAL PERSPECTIVES — Do not default to American or Western-only examples, case studies or "famous figures". Prefer UK and Bradford-relevant contexts and, where relevant, perspectives from the global majority. Prevents: Western-centric framing that renders most Bradford College learners' heritages invisible.
6. ASSUMPTION-FREE CONTEXTS — Do not assume learners have home internet, personal devices, quiet study space, money for materials or trips, or family who can help with college work. Prevents: activities that quietly exclude learners in poverty (a majority of the college's intake live in the UK's most deprived areas).
7. DISABILITY PORTRAYAL — Where disabled people appear in content, portray them as ordinary participants in work and life, never as inspirational, tragic, or defined by their condition. Prevents: "inspiration porn" and pity framings documented in AI output.
8. FAMILIES AND FAITH — Reflect varied family structures, faiths and none; never assume a two-parent household, Christian-default calendar, or alcohol-based social contexts in examples. Prevents: examples that exclude or single out learners.

These rules apply to every field: slide text, questions, options, scenarios, wheel items and the run sheet.
═══════════════════════════════════════════════════════════════`;