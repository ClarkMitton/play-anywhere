-- ─────────────────────────────────────────────────────────────
-- SEND 3 · ADHD, autism and dyslexia (staff CPD)
-- 60 minutes · 44 steps · Monika Worthington with Disability Services
-- Built from Monika/SEND 3 · Immersive room lesson plan.pdf and the 39 presenter slides.
-- The slides are in the media storage (lesson-media/lessons/send3/).
-- The six videos are NOT uploaded yet: see the checks in the lesson notes.
-- Run once in the SQL editor. Re-running inserts a second copy.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'SEND 3: ADHD, Autism and Dyslexia',
    'Staff CPD with Disability Services. Three learners, Kai, Amira and Ryan, each followed by four boxes at the tables, a reveal, the strategy and the college tools behind it. Staff then plan for one learner in Lesson Weaver, build a Digital Companion, test each other''s, and finish with myth or truth, what to say, who to go to and a pledge.',
    60,
    false,
    true,
    now(),
    '{"rationale":"Monika Worthington''s SEND 3 staff session, built from her lesson plan and presenter slides. One idea: you can plan for a learner''s need before anyone tells you about it, using three strategies and the college''s own systems. Three learner videos (Kai, Amira, Ryan) each run the same routine: full-focus video, four boxes at the tables before anything is explained, a probe or vote, a silent reveal, Disability Services input, the strategy, and the college tools. Apply turns it into a real plan in Lesson Weaver and a Digital Companion; Demonstrate tests every pair''s work against six checks, then a myth-or-truth buzzer, what to say, who to go to, a pledge, and the hook answered. Changes from the plan on paper: videos set not to loop so they move on; the vote and the wheel split into two steps; the probes shown before the wheel; show-and-test moved to the tables so every pair is tested; a ''Sort the toolkit'' Canva Code before the cheat sheet; the final confidence check moved to the exit.","objectives":["Identify the barrier each of Kai, Amira and Ryan meets, in the table''s four boxes.","Explain which strategy removes each barrier and which college system supports it.","Analyse what each barrier costs the learner now and by the end of the course.","Plan a lesson for one learner in Lesson Weaver, adapt one task in its Digital Companion, and test it as the learner would."],"run_sheet":[{"slot_index":0,"teacher_says":"Welcome. Scan the QR to open the Digital Companion, tap how confident you feel on a touch screen, then talk about the question on your table.","watch_for":"Learners: arriving past the touch screens, then at the tables. The four boxes and the arrival question are already on every table: \"Think of a learner you found hard to reach. What did you try?\" Stretch: what worked, and why? Technique: baseline confidence, compared on the way out."},{"slot_index":1,"teacher_says":"ADHD, autism and dyslexia: three learners, three strategies, the college tools behind them, and one thing you will change.","watch_for":"Learners: at the tables. Keep it to thirty seconds. Technique: share the plan first (the session follows its own rule: no surprises)."},{"slot_index":2,"teacher_says":"How do you plan for a learner whose needs nobody has told you about? We answer it at the end.","watch_for":"Learners: at the tables. No answers yet. Technique: a hook that opens a question the last step answers."},{"slot_index":3,"teacher_says":"Watch. Nobody talks until it ends.","watch_for":"Learners: at the tables, full focus. 1 minute 37. The session moves on by itself when it ends. Technique: full-focus video."},{"slot_index":4,"teacher_says":"One word each, written on your table: how did Kai feel? Then one runner types your table''s words on a touch screen.","watch_for":"Learners: at the tables, one runner per table to the screens. The words that grow are the ones most of the room saw. Ask: did anyone write \"lazy\"? Stretch: which word would his teacher have chosen? Technique: send a runner, not the room."},{"slot_index":5,"teacher_says":"By the end of the hour you will identify, explain, analyse and create. Each one is checked, and the slide says where.","watch_for":"Learners: at the tables. Read them quickly. Technique: share the learning intentions."},{"slot_index":6,"teacher_says":"Set up your Digital Companion: choose a font, an overlay or high contrast, press Listen on one line, tick each step as you go. You are the learner today. Breathing Space is there whenever you need it.","watch_for":"Learners: at the tables, on phones. Help anyone who cannot open it. At 0:38 they build one of these themselves. Technique: experience it as the learner first."},{"slot_index":7,"teacher_says":"Four boxes on your table: the barrier, the impact, needs now, needs later. Questions for Disability Services go in the corner of your table.","watch_for":"Learners: at the tables. Point to the boxes already drawn on each table. Technique: one routine, repeated for all three learners."},{"slot_index":8,"teacher_says":"Fill in the four boxes for Kai, as a table. Three and a half minutes. What is he good at? What is he hiding?","watch_for":"Learners: at the tables. Start a 3:30 timer from your phone (Add Timer) so the slide stays up. Stretch: which of Kai''s needs will still be there at work, and who needs to know? Technique: attempt before the reveal."},{"slot_index":9,"teacher_says":"Three questions. Read them now, because the wheel is about to pick a table to answer them.","watch_for":"Learners: at the tables. Read all three probes aloud: the toilet trip (avoidance or calming down?), what \"you need to focus\" assumes, and who else benefits if the sheets came one at a time. Technique: questions before the spin."},{"slot_index":10,"teacher_says":"The wheel picks a table, never a person. That table answers; everyone else adds to their boxes.","watch_for":"Learners: at the tables. The probes stay on the touch screens. Technique: cold call by table, not by person."},{"slot_index":11,"teacher_says":"(Read the reveal aloud: the clip is silent.)","watch_for":"Learners: at the tables. 12 seconds; moves on by itself. Technique: reveal after prediction."},{"slot_index":12,"teacher_says":"Disability Services lead: what ADHD is, how it can look, Kai''s strength, and the myth.","watch_for":"Learners: at the tables. Questions go in the table corner, not now. Kai was diagnosed at 15 and his support agreement was already on EBS. Technique: expert input, short."},{"slot_index":13,"teacher_says":"Hide the pile: one step at a time. Instead of \"You need to focus\", try \"Start with question 1. Tick it when it''s done.\" Say it back.","watch_for":"Learners: at the tables, adding to Needs now and Needs later. Technique: say it back."},{"slot_index":14,"teacher_says":"The college tools that hide the pile: EBS before you plan, the Digital Companion in the lesson, Teams Assignments after.","watch_for":"Learners: at the tables. Photograph the boxes, then wipe. Tell them: you will sort these tools yourself at 0:37. Technique: name the systems, then test them later."},{"slot_index":15,"teacher_says":"Watch. Nobody talks until it ends.","watch_for":"Learners: at the tables, full focus. 1 minute 31. Moves on by itself. Technique: full-focus video."},{"slot_index":16,"teacher_says":"Fill in the four boxes for Amira. Three minutes. What is she good at? What is she hiding?","watch_for":"Learners: at the tables. Add Timer 3:00 from your phone. Stretch: nothing was on EBS; what could her teachers have put in place anyway? Technique: attempt before the reveal."},{"slot_index":17,"teacher_says":"Agree one answer as a table. One runner votes on a touch screen.","watch_for":"Learners: at the tables, one runner per table to the screens. Two answers both look right: that is the point. Technique: best-answer vote."},{"slot_index":18,"teacher_says":"The wheel picks a table: defend your vote. \"Don''t overthink it.\" What did the teacher mean, and what did Amira hear?","watch_for":"Learners: at the tables. Technique: justify a position."},{"slot_index":19,"teacher_says":"(Read the reveal aloud: the clip is silent.)","watch_for":"Learners: at the tables. 12 seconds; moves on by itself."},{"slot_index":20,"teacher_says":"Disability Services lead: what autism is, how it can look, Amira''s strength, and the myth.","watch_for":"Learners: at the tables. Amira chose not to disclose: nothing on EBS would have warned you. Technique: expert input, short."},{"slot_index":21,"teacher_says":"No surprises: say what will happen before it happens, and what finished looks like. Instead of \"Don''t overthink it\", try \"Three slides, one point each, two minutes.\" Say it back.","watch_for":"Learners: at the tables, adding to the boxes. Technique: say it back."},{"slot_index":22,"teacher_says":"Class Team posts before the lesson, the Companion in it, Student Services after.","watch_for":"Learners: at the tables. Photograph, then wipe."},{"slot_index":23,"teacher_says":"Watch. Nobody talks until it ends.","watch_for":"Learners: at the tables, full focus. 1 minute 29. Moves on by itself."},{"slot_index":24,"teacher_says":"Fill in the four boxes for Ryan. Three minutes. Then wait for the carousel.","watch_for":"Learners: at the tables. Add Timer 3:00 from your phone. Stretch: his timed test is in six weeks; what has to happen before then, and who does it? Write the carousel instruction on the whiteboard now: the rotation timer hides the slide."},{"slot_index":25,"teacher_says":"Move one table clockwise, all together. Read their four boxes and add one idea to their Needs now box.","watch_for":"Learners: WHOLE-CLASS MOVE 1, one table on and back. Technique: build on another table''s work."},{"slot_index":26,"teacher_says":"(Read the reveal aloud: the clip is silent.)","watch_for":"Learners: back at their own tables. 12 seconds; moves on by itself."},{"slot_index":27,"teacher_says":"Disability Services lead: what dyslexia is, how it can look, Ryan''s strength, and the myth.","watch_for":"Learners: at the tables. Ryan has never been assessed. Only an assessment can say, so never tell a learner they are dyslexic."},{"slot_index":28,"teacher_says":"Same challenge, a better-supported route. Instead of \"Read the next paragraph for us\", try \"Who''d like to read? Look at it first if you like.\" Say it back.","watch_for":"Learners: at the tables, adding to the boxes. Technique: say it back."},{"slot_index":29,"teacher_says":"Lesson Weaver, Go Read, Immersive Reader and the Accessibility Checker.","watch_for":"Learners: at the tables. Photograph, then wipe."},{"slot_index":30,"teacher_says":"None of them needs a diagnosis. For every learner: ask them what helps. They are the expert on themselves.","watch_for":"Learners: at the tables. Which strategy would have helped most learners in your last lesson? Stretch: which would cost you least to start tomorrow? The Equality Act line is on the slide: anticipate, don''t wait for a label."},{"slot_index":31,"teacher_says":"Before you get the cheat sheet: sort the college tools into understand the need, adapt the lesson, and learners'' own tools. Use the tablet on your table.","watch_for":"Learners: at the tables, in pairs, on the tablets (link: canva.com/design/DAHb0XovLpo/kRah0QLTu9A3nxVpZ3wCiw/view). Pairs without a tablet use a touch screen. Retrieval of steps 15, 23 and 30 before the answer arrives. Technique: retrieve before you''re told."},{"slot_index":32,"teacher_says":"Here is the answer, and your cheat sheet: understand the need, adapt the lesson, learners'' own tools.","watch_for":"Learners: at the tables. Hand out the two-sided cheat sheets now. Technique: check against the model."},{"slot_index":33,"teacher_says":"Each table builds for the learner the wheel lands on. Spin it again: does the same strategy help the next learner too?","watch_for":"Learners: at the tables. Spin once per table; tables write their learner on the table. Write slide 29''s timings on the whiteboard now: the countdown hides it."},{"slot_index":34,"teacher_says":"In pairs, one tablet: notes box (the need, not the label, and one strategy), generate the plan, make the Companion, pick one task and up to three scaffolds, test it in the learner view against the six checks.","watch_for":"Learners: at the tables in pairs. Touch Screen 2 shows the six checks. Check 6 matters most: support changes the route, never the task. Stretch: plan when each scaffold comes away. This is tight for staff new to the Companion: if Monika agrees, start from a Companion made in advance. Technique: create, then test."},{"slot_index":35,"teacher_says":"One of you types your three notes on a touch screen. The other keeps testing.","watch_for":"Learners: one runner per pair to the screens. This board is the evidence of learning. Technique: capture the product."},{"slot_index":36,"teacher_says":"Pass your tablet one table on. Use their Companion as the learner would and say which of the six checks it meets.","watch_for":"Learners: at the tables; tablets move, people stay. Every pair is tested, not only two. Technique: test each other''s work against criteria."},{"slot_index":37,"teacher_says":"Everyone to the touch screens, one team at each. Buzz, then say myth or truth, and ten seconds on why. A different person buzzes each time.","watch_for":"Learners: WHOLE-CLASS MOVE 2, to the touch screens. Everything in it was taught in steps 13, 21 and 28. Technique: fast recall, competitive."},{"slot_index":38,"teacher_says":"The answers. Then back to your tables.","watch_for":"Learners: WHOLE-CLASS MOVE 3, back to the tables."},{"slot_index":39,"teacher_says":"Disability Services: what to say to a learner. In private, start with what they do well, say what you noticed, never name a condition.","watch_for":"Learners: at the tables. Answer questions from the table corners. Touch screens show the contacts and next steps to photograph. Technique: rehearse the words."},{"slot_index":40,"teacher_says":"Who to go to: Disability Services, Student Services, EBS, and beyond college. Disclosure is a choice. Support the need, not the label.","watch_for":"Learners: at the tables. Group the remaining corner questions. CHECK slide 36 has the real referral route and timescales before the session."},{"slot_index":41,"teacher_says":"Start one thing, stop one thing, and think of one learner, no names. On your table and your cheat sheet.","watch_for":"Learners: at the tables, on their own. Photograph each table. They tap the final confidence check on the way out (last step)."},{"slot_index":42,"teacher_says":"How do you plan for a learner whose needs nobody has told you about? Say them back: hide the pile, no surprises, lower the language not the thinking. Check EBS. Use the tools. Ask the learner.","watch_for":"Learners: at the tables. One week: a short quiz. Two weeks: rebuild one of your own lessons. Technique: close the loop the hook opened."},{"slot_index":43,"teacher_says":"Same question as when you arrived. Tap it on your way out. The big screen compares start and now.","watch_for":"Learners: leaving past the touch screens, as they arrived. Moved here from the pledge so nobody queues during the session. Technique: confidence comparison."}],"verify_before_teaching":["UPLOAD THE SIX VIDEOS to the media storage at lesson-media/lessons/send3/ with exactly these names: SEND3_Kai_v3_elevenlabs.mp4, SEND3_Amira_v3_elevenlabs.mp4, SEND3_Ryan_elevenlabs.mp4, SEND3_Kai_reveal.mp4, SEND3_Amira_reveal.mp4, SEND3_Ryan_reveal.mp4. The steps already point there and are set not to loop, so they move on when they end.","Slide 1 still shows [Companion QR] and [time]; slide 36 still shows [Route and timescales] and [Route]. Fix them in the slides, re-export, and re-upload with the same file names.","Wheels in steps 11 and 19 list Table 1 to 6: edit to the number of tables on the day.","The Canva Code ''Sort the toolkit'' (step 32) is on the touch screens. Open its link on each tablet before the session (canva.com/design/DAHb0XovLpo/kRah0QLTu9A3nxVpZ3wCiw/view) and play it through once on a touch screen.","The SEND 3 Digital Companion link: if wanted on the touch screens (step 7 and the four-boxes rounds), set them to Embed with the link.","Tablets logged in to Lesson Weaver, one per pair. Step 35 is 7.5 minutes for notes, plan, Companion, scaffolds and test: consider starting from a Companion made in advance.","Write slide 29''s timings and the carousel instruction on the whiteboard before the timers hide those slides (steps 26 and 35). Start Add Timer from the remote in steps 9, 17 and 25.","Disability Services: confirm the referral route and timescales, the Student Services route and the email on the cheat sheet.","Cheat sheets printed two-sided, one per person, handed out at step 33.","Click through the preview: 44 steps, all three screens."],"safety_note":"Never tell a learner they have a condition; only an assessment can say. Follow Disability Services'' current referral route."}'
  )
  returning id
)
insert into slots (
  lesson_id, session_id, order_index, name, lead_phase,
  duration_mins, end_behaviour, pause_before_advance, screen_delay_secs,
  host_content, screen1_content, screen2_content
)
select
  nl.id, null, v.order_index, v.name, v.lead_phase,
  v.duration_mins, v.end_behaviour, false, 0,
  v.host::jsonb, v.t1::jsonb, v.t2::jsonb
from new_lesson nl, (values
  -- 1 · Arrival (2 min)
  (0, 'Arrival', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-01.jpg","file_name":"send3-slide-01.jpg"}',
    '{"type":"confidence_checker","prompt":"How confident are you adapting a lesson for a learner with ADHD, autism or dyslexia?","scale_mode":"numbers","max":5,"checkpoint":"start"}',
    '{"type":"confidence_checker","prompt":"How confident are you adapting a lesson for a learner with ADHD, autism or dyslexia?","scale_mode":"numbers","max":5,"checkpoint":"start"}'),

  -- 2 · Welcome (0.5 min)
  (1, 'Welcome', 'Launch', 0.5, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-02.jpg","file_name":"send3-slide-02.jpg"}',
    '{"type":"text_slide","text":"SEND 3 · 60 minutes","size":"xl"}',
    '{"type":"text_slide","text":"SEND 3 · 60 minutes","size":"xl"}'),

  -- 3 · Today's question (0.5 min)
  (2, 'Today''s question', 'Launch', 0.5, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-03.jpg","file_name":"send3-slide-03.jpg"}',
    '{"type":"text_slide","title":"Today''s question","text":"How do you plan for a learner whose needs nobody has told you about?","size":"lg"}',
    '{"type":"text_slide","title":"Today''s question","text":"How do you plan for a learner whose needs nobody has told you about?","size":"lg"}'),

  -- 4 · Kai's video (2 min)
  (3, 'Kai''s video', 'Launch', 2, 'screen1_continue',
    '{"type":"video","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/SEND3_Kai_v3_elevenlabs.mp4","file_name":"SEND3_Kai_v3_elevenlabs.mp4","loop":false}',
    '{"type":"text_slide","text":"Kai, 17\nwatch the big screen","size":"xl"}',
    '{"type":"text_slide","text":"Kai, 17\nwatch the big screen","size":"xl"}'),

  -- 5 · How did Kai feel? (1 min)
  (4, 'How did Kai feel?', 'Launch', 1, 'screen1_continue',
    '{"type":"word_cloud","prompt":"One word: how did Kai feel?","title":"Kai","max_words":3}',
    '{"type":"word_cloud","prompt":"One word: how did Kai feel?","title":"Kai","max_words":3}',
    '{"type":"word_cloud","prompt":"One word: how did Kai feel?","title":"Kai","max_words":3}'),

  -- 6 · Objectives (1 min)
  (5, 'Objectives', 'Launch', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-06.jpg","file_name":"send3-slide-06.jpg"}',
    '{"type":"text_slide","text":"Identify · explain · analyse · create","size":"xl"}',
    '{"type":"text_slide","text":"Identify · explain · analyse · create","size":"xl"}'),

  -- 7 · Your Companion (1 min)
  (6, 'Your Companion', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-07.jpg","file_name":"send3-slide-07.jpg"}',
    '{"type":"text_slide","title":"Digital Companion","text":"No phone?\nUse the SEND 3 Companion here.","size":"lg"}',
    '{"type":"text_slide","title":"Digital Companion","text":"No phone?\nUse the SEND 3 Companion here.","size":"lg"}'),

  -- 8 · The four boxes (0.5 min)
  (7, 'The four boxes', 'Establish', 0.5, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-08.jpg","file_name":"send3-slide-08.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-08.jpg","file_name":"send3-slide-08.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-08.jpg","file_name":"send3-slide-08.jpg"}'),

  -- 9 · Round 1: Kai (3.5 min)
  (8, 'Round 1: Kai', 'Establish', 3.5, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-09.jpg","file_name":"send3-slide-09.jpg"}',
    '{"type":"text_slide","title":"Start here","text":"What did Kai want when he walked in?\nAt what exact moment did the lesson stop working for him?","size":"lg"}',
    '{"type":"text_slide","title":"Start here","text":"What did Kai want when he walked in?\nAt what exact moment did the lesson stop working for him?","size":"lg"}'),

  -- 10 · Probe questions (0.5 min)
  (9, 'Probe questions', 'Establish', 0.5, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-10.jpg","file_name":"send3-slide-10.jpg"}',
    '{"type":"text_slide","text":"The wheel picks a table","size":"xl"}',
    '{"type":"text_slide","text":"The wheel picks a table","size":"xl"}'),

  -- 11 · Wheel: Kai (1.5 min)
  (10, 'Wheel: Kai', 'Establish', 1.5, 'screen1_continue',
    '{"type":"wheel_spinner","prompt":"Which table answers?","items":["Table 1","Table 2","Table 3","Table 4","Table 5","Table 6"]}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-10.jpg","file_name":"send3-slide-10.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-10.jpg","file_name":"send3-slide-10.jpg"}'),

  -- 12 · Kai: reveal (0.25 min)
  (11, 'Kai: reveal', 'Establish', 0.25, 'screen1_continue',
    '{"type":"video","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/SEND3_Kai_reveal.mp4","file_name":"SEND3_Kai_reveal.mp4","loop":false}',
    '{"type":"text_slide","text":"Kai · ADHD","size":"xl"}',
    '{"type":"text_slide","text":"Kai · ADHD","size":"xl"}'),

  -- 13 · Understand: ADHD (1.25 min)
  (12, 'Understand: ADHD', 'Establish', 1.25, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-11.jpg","file_name":"send3-slide-11.jpg"}',
    '{"type":"text_slide","text":"Kai · ADHD","size":"xl"}',
    '{"type":"text_slide","text":"Kai · ADHD","size":"xl"}'),

  -- 14 · Hide the pile (1 min)
  (13, 'Hide the pile', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-12.jpg","file_name":"send3-slide-12.jpg"}',
    '{"type":"text_slide","text":"Hide the pile","size":"xl"}',
    '{"type":"text_slide","text":"Hide the pile","size":"xl"}'),

  -- 15 · Tools: hide the pile (1 min)
  (14, 'Tools: hide the pile', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-13.jpg","file_name":"send3-slide-13.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-13.jpg","file_name":"send3-slide-13.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-13.jpg","file_name":"send3-slide-13.jpg"}'),

  -- 16 · Amira's video (1.5 min)
  (15, 'Amira''s video', 'Establish', 1.5, 'screen1_continue',
    '{"type":"video","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/SEND3_Amira_v3_elevenlabs.mp4","file_name":"SEND3_Amira_v3_elevenlabs.mp4","loop":false}',
    '{"type":"text_slide","text":"Amira, 26\nwatch the big screen","size":"xl"}',
    '{"type":"text_slide","text":"Amira, 26\nwatch the big screen","size":"xl"}'),

  -- 17 · Round 2: Amira (3 min)
  (16, 'Round 2: Amira', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-15.jpg","file_name":"send3-slide-15.jpg"}',
    '{"type":"text_slide","title":"Start here","text":"What did Amira need before she walked through the door?\nWhich of the teacher''s words could mean three different things?","size":"lg"}',
    '{"type":"text_slide","title":"Start here","text":"What did Amira need before she walked through the door?\nWhich of the teacher''s words could mean three different things?","size":"lg"}'),

  -- 18 · Did Amira cope? (1.5 min)
  (17, 'Did Amira cope?', 'Establish', 1.5, 'screen1_continue',
    '{"type":"voting","question":"Did Amira cope?","options":["Yes","No","Yes, but it cost her"]}',
    '{"type":"voting","question":"Did Amira cope?","options":["Yes","No","Yes, but it cost her"]}',
    '{"type":"voting","question":"Did Amira cope?","options":["Yes","No","Yes, but it cost her"]}'),

  -- 19 · Defend your vote (1.5 min)
  (18, 'Defend your vote', 'Establish', 1.5, 'screen1_continue',
    '{"type":"wheel_spinner","prompt":"Defend your vote","items":["Table 1","Table 2","Table 3","Table 4","Table 5","Table 6"]}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-16.jpg","file_name":"send3-slide-16.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-16.jpg","file_name":"send3-slide-16.jpg"}'),

  -- 20 · Amira: reveal (0.25 min)
  (19, 'Amira: reveal', 'Establish', 0.25, 'screen1_continue',
    '{"type":"video","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/SEND3_Amira_reveal.mp4","file_name":"SEND3_Amira_reveal.mp4","loop":false}',
    '{"type":"text_slide","text":"Amira · autism","size":"xl"}',
    '{"type":"text_slide","text":"Amira · autism","size":"xl"}'),

  -- 21 · Understand: autism (1.25 min)
  (20, 'Understand: autism', 'Establish', 1.25, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-17.jpg","file_name":"send3-slide-17.jpg"}',
    '{"type":"text_slide","text":"Amira · autism","size":"xl"}',
    '{"type":"text_slide","text":"Amira · autism","size":"xl"}'),

  -- 22 · No surprises (1 min)
  (21, 'No surprises', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-18.jpg","file_name":"send3-slide-18.jpg"}',
    '{"type":"text_slide","text":"No surprises","size":"xl"}',
    '{"type":"text_slide","text":"No surprises","size":"xl"}'),

  -- 23 · Tools: no surprises (1 min)
  (22, 'Tools: no surprises', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-19.jpg","file_name":"send3-slide-19.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-19.jpg","file_name":"send3-slide-19.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-19.jpg","file_name":"send3-slide-19.jpg"}'),

  -- 24 · Ryan's video (1.5 min)
  (23, 'Ryan''s video', 'Establish', 1.5, 'screen1_continue',
    '{"type":"video","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/SEND3_Ryan_elevenlabs.mp4","file_name":"SEND3_Ryan_elevenlabs.mp4","loop":false}',
    '{"type":"text_slide","text":"Ryan, 21\nwatch the big screen","size":"xl"}',
    '{"type":"text_slide","text":"Ryan, 21\nwatch the big screen","size":"xl"}'),

  -- 25 · Round 3: Ryan (3 min)
  (24, 'Round 3: Ryan', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-21.jpg","file_name":"send3-slide-21.jpg"}',
    '{"type":"text_slide","title":"Start here","text":"What does Ryan know that he can''t show?\nWhat was the task assessing: the electrics or the spelling?","size":"lg"}',
    '{"type":"text_slide","title":"Start here","text":"What does Ryan know that he can''t show?\nWhat was the task assessing: the electrics or the spelling?","size":"lg"}'),

  -- 26 · Carousel (2 min)
  (25, 'Carousel', 'Establish', 2, 'screen1_continue',
    '{"type":"rotation_timer","label":"Read their four boxes. Add one idea to their Needs now box.","details":"Then go back to your own table and read what they added. Stretch: add a Needs later idea too.","rounds":1,"round_secs":105,"move_secs":15,"move_text":"Move one table clockwise."}',
    '{"type":"text_slide","text":"Move one table on","size":"xl"}',
    '{"type":"text_slide","text":"Move one table on","size":"xl"}'),

  -- 27 · Ryan: reveal (0.25 min)
  (26, 'Ryan: reveal', 'Establish', 0.25, 'screen1_continue',
    '{"type":"video","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/SEND3_Ryan_reveal.mp4","file_name":"SEND3_Ryan_reveal.mp4","loop":false}',
    '{"type":"text_slide","text":"Ryan · dyslexia","size":"xl"}',
    '{"type":"text_slide","text":"Ryan · dyslexia","size":"xl"}'),

  -- 28 · Understand: dyslexia (1.25 min)
  (27, 'Understand: dyslexia', 'Establish', 1.25, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-23.jpg","file_name":"send3-slide-23.jpg"}',
    '{"type":"text_slide","text":"Ryan · dyslexia","size":"xl"}',
    '{"type":"text_slide","text":"Ryan · dyslexia","size":"xl"}'),

  -- 29 · Lower the language (1 min)
  (28, 'Lower the language', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-24.jpg","file_name":"send3-slide-24.jpg"}',
    '{"type":"text_slide","text":"Lower the language, not the thinking","size":"xl"}',
    '{"type":"text_slide","text":"Lower the language, not the thinking","size":"xl"}'),

  -- 30 · Tools: lower the language (1 min)
  (29, 'Tools: lower the language', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-25.jpg","file_name":"send3-slide-25.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-25.jpg","file_name":"send3-slide-25.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-25.jpg","file_name":"send3-slide-25.jpg"}'),

  -- 31 · Better for all (1 min)
  (30, 'Better for all', 'Apply', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-26.jpg","file_name":"send3-slide-26.jpg"}',
    '{"type":"text_slide","text":"Ask the learner what helps","size":"xl"}',
    '{"type":"text_slide","text":"Ask the learner what helps","size":"xl"}'),

  -- 32 · Sort the toolkit (1 min)
  (31, 'Sort the toolkit', 'Apply', 1, 'screen1_continue',
    '{"type":"text_slide","title":"Sort the toolkit","text":"Sort the college tools:\nunderstand the need · adapt the lesson · learners'' own tools","size":"lg"}',
    '{"type":"embed","url":"https://www.canva.com/design/DAHb0XovLpo/kRah0QLTu9A3nxVpZ3wCiw/view?embed","description":"Sort the toolkit (Canva Code): eleven college tools to sort into understand the need, adapt the lesson, and learners'' own tools, with a check button and a ''Show why'' line for each tool."}',
    '{"type":"embed","url":"https://www.canva.com/design/DAHb0XovLpo/kRah0QLTu9A3nxVpZ3wCiw/view?embed","description":"Sort the toolkit (Canva Code): eleven college tools to sort into understand the need, adapt the lesson, and learners'' own tools, with a check button and a ''Show why'' line for each tool."}'),

  -- 33 · Your toolkit (0.5 min)
  (32, 'Your toolkit', 'Apply', 0.5, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-27.jpg","file_name":"send3-slide-27.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-27.jpg","file_name":"send3-slide-27.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-27.jpg","file_name":"send3-slide-27.jpg"}'),

  -- 34 · Spin for your learner (0.5 min)
  (33, 'Spin for your learner', 'Apply', 0.5, 'screen1_continue',
    '{"type":"wheel_spinner","prompt":"Spin for your learner","items":["Kai","Amira","Ryan"]}',
    '{"type":"text_slide","text":"Spin for your learner","size":"xl"}',
    '{"type":"text_slide","text":"Spin for your learner","size":"xl"}'),

  -- 35 · Plan for your learner (7.5 min)
  (34, 'Plan for your learner', 'Apply', 7.5, 'screen1_continue',
    '{"type":"countdown_timer","label":"Plan, then adapt one task","duration_secs":450}',
    '{"type":"embed","url":"https://lessonweaver.online","description":"Lesson Weaver, for a pair without a tablet."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-30.jpg","file_name":"send3-slide-30.jpg"}'),

  -- 36 · Post your thinking (2 min)
  (35, 'Post your thinking', 'Apply', 2, 'screen1_continue',
    '{"type":"padlet","title":"What we planned","question":"What we took into account · How we planned it · What it changes for [your learner]"}',
    '{"type":"padlet","title":"What we planned","question":"What we took into account · How we planned it · What it changes for [your learner]"}',
    '{"type":"padlet","title":"What we planned","question":"What we took into account · How we planned it · What it changes for [your learner]"}'),

  -- 37 · Show and test (2 min)
  (36, 'Show and test', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"rotation_timer","label":"Use their Companion as the learner would. Which of the six checks does it meet?","details":"Leave one comment on their table. Then pass the tablet back.","rounds":1,"round_secs":100,"move_secs":15,"move_text":"Pass your tablet one table on."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-30.jpg","file_name":"send3-slide-30.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-30.jpg","file_name":"send3-slide-30.jpg"}'),

  -- 38 · Myth or truth? (3 min)
  (37, 'Myth or truth?', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"quiz_buzzer","team1_name":"Touch Screen 1","team2_name":"Touch Screen 2","questions":["Adults don''t have ADHD: people grow out of it.","You can''t spot dyslexia in someone still learning English.","Many autistic adults aren''t diagnosed until later in life.","Autistic people don''t feel empathy.","Dyslexia can affect memory and organisation, not only reading.","If they can focus on a game for hours, it can''t be ADHD."],"answers":["MYTH","MYTH","TRUE","MYTH","TRUE","MYTH"]}',
    '{"type":"quiz_buzzer","team1_name":"Touch Screen 1","team2_name":"Touch Screen 2","questions":["Adults don''t have ADHD: people grow out of it.","You can''t spot dyslexia in someone still learning English.","Many autistic adults aren''t diagnosed until later in life.","Autistic people don''t feel empathy.","Dyslexia can affect memory and organisation, not only reading.","If they can focus on a game for hours, it can''t be ADHD."],"answers":["MYTH","MYTH","TRUE","MYTH","TRUE","MYTH"]}',
    '{"type":"quiz_buzzer","team1_name":"Touch Screen 1","team2_name":"Touch Screen 2","questions":["Adults don''t have ADHD: people grow out of it.","You can''t spot dyslexia in someone still learning English.","Many autistic adults aren''t diagnosed until later in life.","Autistic people don''t feel empathy.","Dyslexia can affect memory and organisation, not only reading.","If they can focus on a game for hours, it can''t be ADHD."],"answers":["MYTH","MYTH","TRUE","MYTH","TRUE","MYTH"]}'),

  -- 39 · The answers (1 min)
  (38, 'The answers', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-34.jpg","file_name":"send3-slide-34.jpg"}',
    '{"type":"text_slide","text":"Back to your tables","size":"xl"}',
    '{"type":"text_slide","text":"Back to your tables","size":"xl"}'),

  -- 40 · What to say (2 min)
  (39, 'What to say', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-35.jpg","file_name":"send3-slide-35.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-36.jpg","file_name":"send3-slide-36.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-39.jpg","file_name":"send3-slide-39.jpg"}'),

  -- 41 · Who to go to (2 min)
  (40, 'Who to go to', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-36.jpg","file_name":"send3-slide-36.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-36.jpg","file_name":"send3-slide-36.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-39.jpg","file_name":"send3-slide-39.jpg"}'),

  -- 42 · Your pledge (1 min)
  (41, 'Your pledge', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-37.jpg","file_name":"send3-slide-37.jpg"}',
    '{"type":"text_slide","title":"Your pledge","text":"Start · Stop · One learner (no names)","size":"xl"}',
    '{"type":"text_slide","title":"Your pledge","text":"Start · Stop · One learner (no names)","size":"xl"}'),

  -- 43 · Today's question, answered (0.5 min)
  (42, 'Today''s question, answered', 'Demonstrate', 0.5, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/send3/send3-slide-38.jpg","file_name":"send3-slide-38.jpg"}',
    '{"type":"text_slide","text":"Hide the pile.\nNo surprises.\nLower the language, not the thinking.","size":"xl"}',
    '{"type":"text_slide","text":"Hide the pile.\nNo surprises.\nLower the language, not the thinking.","size":"xl"}'),

  -- 44 · On your way out (1.5 min)
  (43, 'On your way out', 'Demonstrate', 1.5, 'screen1_continue',
    '{"type":"confidence_checker","prompt":"How confident are you adapting a lesson for a learner with ADHD, autism or dyslexia?","scale_mode":"numbers","max":5,"checkpoint":"final"}',
    '{"type":"confidence_checker","prompt":"How confident are you adapting a lesson for a learner with ADHD, autism or dyslexia?","scale_mode":"numbers","max":5,"checkpoint":"final"}',
    '{"type":"confidence_checker","prompt":"How confident are you adapting a lesson for a learner with ADHD, autism or dyslexia?","scale_mode":"numbers","max":5,"checkpoint":"final"}')
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, t1, t2);
