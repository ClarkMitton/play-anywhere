# WWW: What Went Well

A running log, one entry per lesson built for the Immersive Learning Room.
Newest first. Each entry has two halves:

- **In the build**: what worked when turning a teacher's material into a lesson. Filled in when the lesson is made.
- **In the room**: what worked with real learners. Filled in by whoever taught it, after the session.

"Even better if" sits next to each so the next lesson starts from what we learned.

What proves itself here is collected in [WAYS-OF-WORKING.md](WAYS-OF-WORKING.md).

---

## Us vs AI

- **Built:** 6 October 2026 (first design), rebuilt the same day (second design)
- **For:** Level 2 and Level 3 learners, any subject, typical group of 16
- **Length:** 45 minutes, 20 steps, 17 minutes at the whiteboard tables
- **Source:** `USvsAI/AI Introductions.txt`
- **Lesson file:** [us-vs-ai.sql](us-vs-ai.sql)
- **Slides:** eight, made in Canva, in `public/lessons/us-vs-ai/`
- **Table packs:** `public/lessons/us-vs-ai/printables.html`

### What the first design got wrong

The first version was 21 steps of video, slide, quiz, repeat. Its outcomes stopped at
"describe" and "identify", its longest task was four minutes, most of the class watched
two touch screens, and "Demonstrate" was a recall quiz. It also tried to use all three
clips, which were really three different lessons. It was thrown away. Everything below
is about the second design.

### WWW in the build

- **The objectives were chosen first, by the person who asked for the lesson.** Four, climbing from identify to explain to analyse to rewrite. Everything else was built to serve them.
- **One idea runs through it:** AI is not thinking, it is predicting. Two of the three clips did not serve that idea and were dropped.
- **The hook opens a question the last task answers.** The sandwich clip asks "was the AI wrong, or was the instruction?" Nobody answers it until learners have rewritten an instruction themselves.
- **Learners do it before they are told.** They finish a sentence as a word cloud, and only then learn that this is all a chatbot does. They draw half past three, and only then see the AI's watches.
- **Two long tasks at the tables.** A case file to analyse and an instruction to rewrite, each with a second round where tables move and test another table's work.
- **The printed packs feel like something.** Cards to sort, a stamped case file with evidence, a black role card that says "You are the AI". Nothing is written on the paper, so they can be reused.
- **Real slides, made in Canva.** A precise brief (read from across a room, few words, no sci-fi, what each picture must show) gave eight usable slides first time.
- **No activity twice in a row,** and the two question rounds have different shapes: quick true or false, then a best-answer question.
- **Every tutor note names its technique,** so the member of staff leaves with approaches as well as a lesson.
- **Works with any number of tables.** One pack per table, and the notes say what to do with only one or two.

### Even better if (build)

- 20 steps is still more than the dozen we aimed for. Eight of them are one-minute slides, but it is worth watching whether it feels busy.
- One Canva picture misspells "Recommended". It is flagged in the tutor notes as a spot-the-AI-mistake moment, but it should be a choice, not an accident.
- The watch pictures were asked to show ten past ten, so they illustrate the point without proving it. The AI picture tool was unavailable when we tried to run the real test.
- There is no way yet to get what is written on a table onto the big screen. Learners type their final instruction instead.
- The app has no sorting activity, so the card sort is paper only.

### WWW in the room

_To fill in after the lesson has been taught._

-

### Even better if (room)

-

---

## ESOL Proper Nouns

- **Built:** 6 October 2026
- **For:** Shamim Nizami, ESOL (Entry level)
- **Length:** 60 minutes, 29 steps
- **Source:** `Shamim/Proper nouns.ppt` (15 slides) and three YouTube clips
- **Lesson file:** [esol-proper-nouns.sql](esol-proper-nouns.sql)
- **Pictures:** `public/lessons/esol-proper-nouns/`

### WWW in the build

- **The teacher's slides stayed in the teacher's order.** All 15 slides are in the lesson, with her wording. Nothing was reordered, so she will recognise her own lesson.
- **The original pictures were kept, shown small.** The clip-art is only about 200 pixels wide. Laid out as small labelled cards it stays sharp. Stretched to fill the big screen it would have been a blur.
- **The videos are spread out.** Each one is followed by slides or a touch-screen activity on the same idea. Nobody watches two clips in a row.
- **A long video was cut to the part that matters.** One link was a 54 minute course. The lesson plays only its first chapter (7 minutes 40 seconds) and then stops, by adding `&end=460` to the link. This now works for any lesson.
- **During a video the touch screens carry the task**, for example "Write down the proper nouns you hear", instead of three copies of the same clip playing out of step.
- **The right tool for capital letters.** The word cloud turns every word into small letters. That is perfect for common nouns and wrong for proper nouns, so proper nouns go on the shared board, which shows words exactly as typed.
- **Answer slides after each set of sentences.** The original slides had the sentences but no answers. Learners now mark their own work straight away.
- **The practice gets harder.** Two sets with support, then a final set done alone as the check on learning.
- **Confidence is asked at the start and the end**, so the class sees its own progress on the big screen.
- **Entry-level reading rules held.** Three options at most on every question, short everyday words, faces instead of numbers for confidence.
- **The lesson was tested before anyone ran it.** The SQL was run against a real database engine and every screen was checked against the app's own content rules.

### Even better if (build)

- The first two video links sent were the same clip, so the lesson was built once with a duplicate and then reworked when the right link arrived. Checking the links are all different before building would have saved a rebuild.
- The 8 minute video is long for Entry level learners. Worth watching for attention dropping, and pausing halfway to ask a question.
- An old `.ppt` cannot be opened without PowerPoint, so the slides were rebuilt from their text and pictures. A `.pptx` or a PDF export would let us use the slides exactly as designed.
- 60 minutes is tight with 29 steps. The sentence-writing steps are the ones to trim.
- Two spellings in the source were corrected ("egpyt", "spinx"). Worth telling the teacher, in case they were deliberate.

### WWW in the room

_To fill in after the lesson has been taught._

-

### Even better if (room)

-
