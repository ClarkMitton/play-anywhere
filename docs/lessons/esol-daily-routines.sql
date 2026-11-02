-- ─────────────────────────────────────────────────────────────
-- ESOL DAILY ROUTINES · 60 minutes · 17 steps · ESOL Pre-Entry
-- Built from Shamim Nizami's PowerPoint (Shamim/Daily Routines/Daily Routines
-- ESOL Pre-Entry.pptx), the Wordwall "Daily routine key words" and one YouTube
-- video (Woodward English, "Daily Routines in English for Adults"), in three parts.
-- No printing: learners write and draw on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The slides are in the app's own media storage (lesson-media/lessons/esol-daily-routines/),
-- so they show straight away. Copies are kept in public/lessons/esol-daily-routines/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Daily Routines',
    'Daily routines for ESOL Pre-Entry: what time do you get up? Built around Shamim Nizami''s PowerPoint, with her Wordwall and one short video in three parts. Learners act, draw and write on the whiteboard tables and use the touch screens once. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"One question runs through the hour: what time do you get up? Learners show it with fingers in minute one and say it in a sentence in minute sixty. Shamim''s PowerPoint is the spine, in her order: her title and get up slides, her four morning clocks as a predict and reveal, and her five day slides as a picture dictation on the tables. The video is cut into three parts: the first two are act-along clips for the morning, skipping 20 seconds of shower and dressing footage; the third covers the working day and evening with a watching task. One trip to the touch screens covers the Wordwall and a short question round. The last task is learners'' own day, drawn and written on the whiteboard tables. Nothing is printed.","objectives":["Say daily routine actions from a picture or a mime (wake up, eat breakfast, brush my teeth, go to bed).","Ask and answer What time do you…? with o''clock and half past, and in the morning or in the evening.","Draw and write four sentences about my own day on the table, and ask a classmate about theirs."],"run_sheet":[{"slot_index":0,"teacher_says":"Act it: yawn, stretch, look at your watch. Then ask: What time do you get up? Show me with your fingers. Ask three learners, one at a time.","watch_for":"Learners: standing at the tables, each with a pen. Do not teach anything yet. Expect fingers or one number: 6, 7, 8. Write two or three of their numbers on the board and leave them there until the end. This is Shamim''s title slide. Technique: open a question now and answer it properly in the last step."},{"slot_index":1,"teacher_says":"Point at the clock. 7 o''clock. Point at the boy. I get up. Say it with me: I get up at 7 o''clock. Now ask the person next to you: What time do you get up?","watch_for":"Learners: at the tables, in pairs. This is Shamim''s slide 2. Drill the question and the answer chorally, then in pairs. Get up and wake up mean nearly the same: wake up is eyes open, get up is out of bed. Show both with your body. Stretch for stronger learners: tell the class about your partner. She gets up at 6 o''clock. Listen for the s on gets. Technique: model, choral drill, then pair practice."},{"slot_index":2,"teacher_says":"Say this BEFORE the clip starts: watch, listen and do it. Copy the actions. Say the words.","watch_for":"Learners: at the tables, standing and acting. Video on all three screens, full focus. The clip plays 0:00 to 0:36: I wake up, I turn off my alarm, I get up. Each line is said twice with a five second gap, so learners can repeat in the gap. Join in the actions yourself. Technique: total physical response, the word is remembered with the body."},{"slot_index":3,"teacher_says":"Act it: I take a shower. Rub your hair. I get dressed. Pull on a jumper. Say it with me. Now you do it.","watch_for":"Learners: at the tables, acting. The video''s next 20 seconds (0:36 to 0:56) show people in the shower and getting dressed, so the lesson skips them and you act these two instead. Have a shower and take a shower mean the same. Technique: the tutor''s body is the picture."},{"slot_index":4,"teacher_says":"Say this BEFORE the clip starts: watch, listen and do it again. Say the words in the gap.","watch_for":"Learners: at the tables, acting and repeating. The clip plays 0:56 to 1:46: I brush my hair, I comb my hair, I make breakfast, I eat breakfast (said again as I have breakfast), I brush my teeth. Comb is with a comb, brush is with a brush: show it. Technique: listen and repeat in the gap, with actions."},{"slot_index":5,"teacher_says":"Four clocks. Number 1: 7 o''clock. What do I do at 7 o''clock? Talk to your table. Write it on your table: 1 I wake up at 7 o''clock. Do all four.","watch_for":"Learners: at the tables, writing on the table top. These are Shamim''s clock slides 1 to 4. Many answers are right: I get up, I wake up, I eat breakfast, I brush my teeth. A learner who cannot write yet draws the action and says the sentence. Count each table''s sentences out loud. Stretch: write it again with He or She. Technique: predict before reveal."},{"slot_index":6,"teacher_says":"Here is Shamim''s morning. Number 1: I wake up at 7 o''clock. Did your table write that? Read them with me. Then act them: I say it, you do it.","watch_for":"Learners: at the tables. Shamim''s slides 4 to 7 share this screen as the answers. Tick any table with a matching sentence, and accept good different ones (I get up at 7 o''clock). Say the times two ways: 7:30 is half past seven, 8:15 is quarter past eight. Then call the actions in any order. Technique: compare your answer with a model, and act the meaning."},{"slot_index":7,"teacher_says":"Pens ready. Listen. Draw the clock and draw a little picture. Number 1: I go for a walk in the morning. Number 2: I eat lunch at 1 o''clock. Number 3: I cook dinner at 6:30. Number 4: I watch TV in the evening. Number 5: I go to bed at 10.","watch_for":"Learners: at the tables, drawing. TABLE TASK 1, and these are Shamim''s slides 8 to 12. Read each sentence twice, slowly, then once more at the end. For in the morning and in the evening, tables draw a sun or a moon, not a clock. Round 2: tables move one place, look at the drawings and say each sentence to each other. Stretch: write the sentence under the drawing. With one table, pairs swap inside the table. Technique: a picture dictation, then check another table''s work."},{"slot_index":8,"teacher_says":"Go back to your table. Here is Shamim''s day. Is your clock the same? Thumbs up. Read them with me. Morning, afternoon, evening, night: when is lunch? When is TV? Then: now walk to the touch screens.","watch_for":"Learners: at the tables, then MOVE. Shamim''s slides 8 to 12 share this screen as the answers. Teach the four parts of the day with your arm as the sun: morning (low), afternoon (high), evening (going down), night (dark). The Wordwall uses afternoon and night. Then send the class to the touch screens, half at each. Technique: check where they stand, with thumbs."},{"slot_index":9,"teacher_says":"Tap Start. Look at the picture. Say the word, then tap it. Take turns: one picture each. While you wait, ask the person next to you: What time do you eat lunch?","watch_for":"Learners: at the touch screens, half the class at each. This trip covers this step and the next two. Drink and relax were not in the slides: show them with your hands before they start (drink a cup of tea, relax on the sofa). If a screen runs out of lives, tap to play again. Technique: a game in learners'' hands, with the queue as speaking practice."},{"slot_index":10,"teacher_says":"Read each question aloud to the whole class, and point at the options. Talk to the people at your screen first, then one person taps.","watch_for":"Learners: at the touch screens. Read every question and every option aloud: nobody should have to read to take part. Answers: true, brush, false, TV (the others are meals), 10 o''clock. On the last one ask why the morning is wrong: we go to bed AT a time, IN the morning. Technique: mixed question shapes, true or false, gap fill and odd one out."},{"slot_index":11,"teacher_says":"Say this BEFORE the clip starts, while learners are still at the screens: listen for three things. One: what time does he start work? Two: what time does he finish work? Three: what animal? Now go back to your tables and write the answers as you watch.","watch_for":"Learners: walking back to the tables as it starts, then writing on the table. The clip plays 1:46 to 4:17: I go to work, I start work at nine, I answer emails, I eat lunch, I work on my computer, I finish work at five, I go home, I arrive home, I feed the dog, I cook dinner, I eat dinner, I watch TV, I read a book, I go to bed, I fall asleep. The questions stay on the touch screens. Answers: nine, five, a dog. Technique: a watching task set before the clip."},{"slot_index":12,"teacher_says":"What time does he start work? What time does he finish? What animal? Take answers from different tables. Then: What time do you start college? What time do you finish?","watch_for":"Learners: at the tables. These are the three questions they were watching for. Answers: at nine (9 o''clock), at five (5 o''clock), a dog, I feed the dog. Then make it real: I start college at 9:30. Write a learner''s answer on the board. Technique: open the floor to the watching task, then make it about the room."},{"slot_index":13,"teacher_says":"Watch me. I draw a line on the board. Sun here, moon here. I get up at 6 o''clock. I eat breakfast at 7. I go to college at 9. I go to bed at 11. Now it is your turn, on your table.","watch_for":"Learners: at the tables. This is Shamim''s last slide. Draw your own day on the board as the model, because the slide goes when the timer starts: a line, a sun at one end, a moon at the other, four clocks and four sentences. Say the success criteria: four things, four times, I at the start. Technique: show a model and the success criteria before the task."},{"slot_index":14,"teacher_says":"Your day, on your table. A line, a sun, a moon. Four clocks. Four sentences: I get up at… Then you will move, read another person''s day, and ask them a question.","watch_for":"Learners: at the tables. TABLE TASK 2, and the proof of the lesson. Round 1: each learner draws their own timeline and writes four sentences. A good one has four different actions, four times, and I at the start. A learner who finds writing hard draws the clocks and the pictures and says the sentences. Round 2: tables move one place; each learner reads another person''s day, ticks one sentence and asks its owner a What time question. Stretch: write about your partner with He or She: She gets up at 6 o''clock. Technique: create, then read and question each other''s work."},{"slot_index":15,"teacher_says":"Go back to your own table. One person from each table: go to a touch screen and type one sentence from your table. Start with a capital I. End with a full stop.","watch_for":"Learners: at the tables. One runner per table goes to a screen. Everyone else reads the board as it fills and says each sentence aloud. Check the time and the capital I. Technique: capture the product, and send a runner, not the room."},{"slot_index":16,"teacher_says":"The first question again. What time do you get up? Answer in a sentence. Ask three or four learners. Then ask a stronger learner about their partner.","watch_for":"Learners: at the tables. Point at the numbers you wrote on the board in the first minute and say so: at the start you showed me fingers, now you say a sentence: I get up at 7 o''clock. Ask the class which new word they will remember. Wipe the tables at the end. Technique: close the loop on the opening question."}],"verify_before_teaching":["Watch the video (Woodward English, ''Daily Routines in English for Adults'', 4 minutes 27 seconds). The lesson plays it in three parts: step 3 is 0:00 to 0:36 (&end=36), step 5 is 0:56 to 1:46 (&start=56&end=106), step 12 is 1:46 to 4:17 (&start=106&end=257). The part from 0:36 to 0:56 is skipped on purpose: it shows a woman and a shirtless man in the shower, and someone getting dressed against a window. Step 4 has the tutor act those two actions instead.","The full transcript, in order (each line is said twice, the second time sometimes with have): I wake up. I turn off my alarm. I get up. I take a shower (I have a shower). I get dressed. I brush my hair. I comb my hair. I make breakfast. I eat breakfast (I have breakfast). I brush my teeth. I go to work. I start work at nine. I answer emails. I eat lunch (I have lunch). I work on my computer. I finish work at five. I go home. I arrive home. I feed the dog. I cook dinner. I eat dinner (I have dinner). I watch TV. I read a book. I go to bed. I fall asleep. Describe your daily routine.","The Wordwall (Daily routine key words, Find the match) has twelve words: sleep, drink, eat, cook, work, relax, breakfast, lunch, dinner, morning, afternoon, night. Drink and relax are not taught elsewhere in the lesson, so mime them before the game.","Slides: Shamim''s 13 slides are rebuilt as six pictures, in her order. Slide 1 is the title (used again at the end). Slide 2 is the get up slide. Slides 4 to 7 share one screen as the clock prompts and another as the answers. Slides 8 to 12 share one screen as the answers to the picture dictation. Slide 13 is the model for the last task.","Changed from the PowerPoint: slide 2 said ''He / she gets up / wakes at'', now ''wakes up at''. Slide 3 was only a link to a Games4esl lesson plan and is left out. The clock-only slides for 8 to 12 are not shown, because the tutor reads those sentences aloud as a dictation.","Nothing is printed. Learners write and draw on the whiteboard tables at steps 6, 8, 12 and 15, so every learner needs a pen and the tables need wiping first.","The whole class moves twice: to the touch screens after step 9, and back to the tables as the video starts at step 12. At step 16 only one person per table goes to a screen.","There is no model on screen during the two table tasks (steps 8 and 15): the slide goes when the timer starts. Have the five dictation sentences ready to read, and draw your own day on the board at step 14."],"safety_note":null,"media_requests":[],"brief":{"topic":"Daily routines: what time do you…?","level":"Pre-Entry","department":"Adult Skills","three_screens":true}}'::jsonb
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
  v.host::jsonb, coalesce(v.touch, v.host)::jsonb, coalesce(v.touch, v.host)::jsonb
from new_lesson nl, (values
  -- 1 · What time do you get up? (2 min)
  (0, 'What time do you get up?', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-daily-routines/01-title.png","file_name":"01-title.png"}',
    null),

  -- 2 · I get up at 7 o'clock (3 min)
  (1, 'I get up at 7 o''clock', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-daily-routines/02-get-up.png","file_name":"02-get-up.png"}',
    null),

  -- 3 · Video: wake up, get up (1 min)
  (2, 'Video: wake up, get up', 'Establish', 1, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=hzzc1VSwuIg&end=36"}',
    null),

  -- 4 · I take a shower. I get dressed. (1 min)
  (3, 'I take a shower. I get dressed.', 'Establish', 1, 'screen1_continue',
    '{"type":"text_slide","text":"I take a shower.\nI get dressed.","size":"lg"}',
    null),

  -- 5 · Video: my morning (1 min)
  (4, 'Video: my morning', 'Establish', 1, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=hzzc1VSwuIg&start=56&end=106"}',
    null),

  -- 6 · What do I do? (4 min)
  (5, 'What do I do?', 'Establish', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-daily-routines/03-morning-clocks.png","file_name":"03-morning-clocks.png"}',
    null),

  -- 7 · Shamim's morning (2 min)
  (6, 'Shamim''s morning', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-daily-routines/04-morning-answers.png","file_name":"04-morning-answers.png"}',
    null),

  -- 8 · Listen and draw (7 min)
  (7, 'Listen and draw', 'Apply', 7, 'screen1_continue',
    '{"type":"rotation_timer","label":"Listen and draw","details":"Round 1: Listen to the teacher. Draw the clock. Draw the picture.\nRound 2: Move to the next table. Look. Say the sentence.","rounds":2,"round_secs":180,"move_secs":30,"move_text":"Stand up. Move to the next table."}',
    null),

  -- 9 · Shamim's day (3 min)
  (8, 'Shamim''s day', 'Apply', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-daily-routines/05-day-answers.png","file_name":"05-day-answers.png"}',
    null),

  -- 10 · Wordwall: find the match (5 min)
  (9, 'Wordwall: find the match', 'Apply', 5, 'screen1_continue',
    '{"type":"text_slide","text":"Look at the picture.\nTap the word.","size":"lg"}',
    '{"type":"embed","url":"https://wordwall.net/embed/ad5afff7c0ea446fa9b8b870e2df878c?themeId=1&templateId=46","description":"The Wordwall ''Daily routine key words''. It is a ''Find the match'' game: tap Start, a picture appears, and you tap the word that matches it. Twelve words: sleep, drink, eat, cook, work, relax, breakfast, lunch, dinner, morning, afternoon, night. Three lives."}'),

  -- 11 · Morning or evening? (4 min)
  (10, 'Morning or evening?', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"true_or_false","text":"7:30 is half past seven.","correct_tf":true},{"type":"multiple_choice","text":"I ___ my teeth.","options":["brush","eat","watch"],"correct":0},{"type":"true_or_false","text":"I eat breakfast in the evening.","correct_tf":false},{"type":"multiple_choice","text":"Odd one out.","options":["breakfast","lunch","TV","dinner"],"correct":2},{"type":"multiple_choice","text":"I go to bed at ___","options":["10 o''clock","the morning","breakfast"],"correct":0}]}',
    null),

  -- 12 · Video: my day (3 min)
  (11, 'Video: my day', 'Apply', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=hzzc1VSwuIg&start=106&end=257"}',
    '{"type":"text_slide","text":"1  What time does he start work?\n2  What time does he finish work?\n3  What animal?","size":"lg"}'),

  -- 13 · Nine, five and a dog (2 min)
  (12, 'Nine, five and a dog', 'Apply', 2, 'screen1_continue',
    '{"type":"text_slide","text":"1  What time does he start work?\n2  What time does he finish work?\n3  What animal?\n\nWhat time do YOU start college?","size":"lg","title":"What did you hear?"}',
    null),

  -- 14 · What time do you …? (2 min)
  (13, 'What time do you …?', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-daily-routines/06-what-time.png","file_name":"06-what-time.png"}',
    null),

  -- 15 · My day (12 min)
  (14, 'My day', 'Demonstrate', 12, 'screen1_continue',
    '{"type":"rotation_timer","label":"My day","details":"Round 1: Draw a line on your table. Sun. Moon.\nDraw 4 clocks. Write 4 sentences.\nI get up at 7 o''clock.\nRound 2: Move. Read another person''s day.\nAsk them: What time do you go to bed?","rounds":2,"round_secs":300,"move_secs":30,"move_text":"Stand up. Move to the next table."}',
    null),

  -- 16 · My day board (3 min)
  (15, 'My day board', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"My day","question":"Type one sentence about your day.\nExample: I get up at 7 o''clock."}',
    null),

  -- 17 · What time do you get up? Again (2 min)
  (16, 'What time do you get up? Again', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-daily-routines/01-title.png","file_name":"01-title.png"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
