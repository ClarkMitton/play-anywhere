# WWW: What Went Well

A running log, one entry per lesson built for the Immersive Learning Room.
Newest first. Each entry has two halves:

- **In the build**: what worked when turning a teacher's material into a lesson. Filled in when the lesson is made.
- **In the room**: what worked with real learners. Filled in by whoever taught it, after the session.

"Even better if" sits next to each so the next lesson starts from what we learned.

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
