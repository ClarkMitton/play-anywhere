-- ─────────────────────────────────────────────────────────────
-- ESOL JOBS · 60 minutes · 16 steps · ESOL Pre-Entry
-- Built from Shamim Nizami's PowerPoint (Shamim/Pre Entry Jobs/Jobs updated.pptx),
-- her Wordwall "Jobs pre-entry" and two YouTube clips, both cut down.
-- No printing: learners write on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The slides are in the app's own media storage (lesson-media/lessons/esol-jobs/),
-- so they show straight away. Copies are kept in public/lessons/esol-jobs/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Jobs',
    'Jobs for ESOL Pre-Entry: what is my job, and what can they do? Built around Shamim Nizami''s PowerPoint, with her Wordwall and two short video clips. Learners guess, act and write on the whiteboard tables, and use the touch screens once. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"One question runs through the hour: what is my job? The tutor acts a job in minute one and learners answer with a gesture or one word; in the last minute they answer in two sentences. Shamim''s PowerPoint is the spine, in her order: her first five jobs as a predict and reveal, her ''Now you try'' match as the first table task, her last three jobs acted out. Her Wordwall and a question round share one trip to the touch screens. Two short video clips do different jobs: real people saying I''m a ..., then people describing their job without naming it, so learners listen for a place. The last task flips the slides round: tables write two ''can'' sentences for a secret job and another table works out the job. Nothing is printed: everything is written on the whiteboard tables.","objectives":["Name jobs from pictures.","Say what someone can do and name the job: He can repair pipes. He is a plumber."],"run_sheet":[{"slot_index":0,"teacher_says":"Say nothing at first. Act out cooking: stir a pan, taste, add salt. Then ask: what is my job? Take any answer, in any language.","watch_for":"Learners: standing at the tables, each with a pen. Do not teach any words yet. Accept a gesture or a word in any language. Remember who knew ''chef'': this question comes back at the end. Technique: do it before being told."},{"slot_index":1,"teacher_says":"Say this BEFORE the clip starts: real people. The question is: what is your job? Listen for the jobs. Write any job you hear on the table.","watch_for":"Learners: at the tables, writing as they watch. The clip plays the first 30 seconds and moves on by itself. After a title, six people answer: I''m a nurse, I''m a lawyer, I work in marketing, I''m a snowboard instructor, I''m a waitress, I work as a journalist. Catching one or two is a good result. Technique: a watching task set before the clip."},{"slot_index":2,"teacher_says":"What jobs did you hear? Write each one on the board. Then everyone: I''m a nurse. I''m a waitress.","watch_for":"Learners: at the tables. Write their words on the board and correct the spelling there, not on their tables. Nurse, waitress and journalist come back later. Technique: open the floor to the watching task."},{"slot_index":3,"teacher_says":"Five people. What is the job? Talk to your table. Write the number and the job on the table: 1 ... 2 ... Any language is OK.","watch_for":"Learners: at the tables, writing on the table top. These are Shamim''s slides 2 to 6 with the words hidden. Let tables guess before you say anything. Stretch: write what the person does: repair cars. Technique: predict before reveal."},{"slot_index":4,"teacher_says":"Check your table. Read each one with me: She can repair cars. She is a mechanic. Then I say the first part, you say the job: He can put out fires...","watch_for":"Learners: at the tables, checking their guesses. Drill both sentences for each picture, all together. Point at can: it is what the person does. Then say only the ''can'' sentence and let the class say the job. Watch prescription and blood pressure: say them slowly and act them. Technique: choral drill, then say it from a cue."},{"slot_index":5,"teacher_says":"Shamim''s ''Now you try''. Four pictures, four sentences. On your table write the number and the letter: 1 B. Then write the job.","watch_for":"Learners: at the tables. TABLE TASK 1, written on the table, nothing printed. Read A to D aloud twice before they start. Walk round. The answers are on the next slide, so do not move on until most tables have four. Stretch: write the ''is a'' sentence for each: He is a teacher. Technique: match, then check against a model."},{"slot_index":6,"teacher_says":"Check your table. One B, two D, three C, four A. Read them with me.","watch_for":"Learners: at the tables, ticking their own work. Ask: who got four? Say the four jobs again with the class. Technique: self-check against the answer."},{"slot_index":7,"teacher_says":"Read the three with me. Now one person at your table acts a job. Do not speak. The table says: He can cook nice food. He is a chef. Change who acts.","watch_for":"Learners: standing at the tables, taking turns. Any of the twelve jobs is fine, not only these three. Listen for both sentences, not just the job word. When most have had a turn, say clearly: now walk to the touch screens. Technique: act it, then say it."},{"slot_index":8,"teacher_says":"At the screen, take turns. One person taps, everyone at your screen reads the word out loud first.","watch_for":"Learners: at the touch screens, half the class at each. This trip covers this step and the next. Four jobs are new: electrician, vet, postman or postwoman, factory worker. When one comes up, act it and say it, then let them tap. Everyone waiting says the job and a can sentence to the person next to them. Technique: a game in learners'' hands, with the word said before the tap."},{"slot_index":9,"teacher_says":"Read each question aloud. Talk to the person next to you, then one person taps.","watch_for":"Learners: at the touch screens. Read every question and option aloud. The last question is the odd one out: kitchen is a place, not a job. Keep it: the next video is about places like kitchen, school and hospital. Then say clearly: back to the tables. Technique: mixed question shapes, best answer, true or false, odd one out."},{"slot_index":10,"teacher_says":"Say this BEFORE the clip starts: two people. They do not say the job. Listen for a place: school, kitchen, hospital. Write the job on the table: Anna is a ... Phil is a ...","watch_for":"Learners: back at the tables, writing as they listen. The clip plays two people (0:21 to 1:09) and moves on by itself. Anna: ''I work in a school'', 35 children, check the children''s work: a teacher. Phil: ''I work in a big hotel'', prepare food, the kitchen must be clean: a chef. The screen shows only their name. Technique: listen for a key word."},{"slot_index":11,"teacher_says":"Anna is a ...? How do you know? Phil is a ...? How do you know? One more person now. Listen for the place again.","watch_for":"Learners: at the tables. Take an answer from each table. The ''how do you know'' is the point: school, children, food, kitchen. A good answer is one word: school! Technique: open the floor to the listening task."},{"slot_index":12,"teacher_says":"Say this BEFORE the clip starts: Dan. Listen for the place. Write Dan''s job on the table.","watch_for":"Learners: at the tables, writing. Dan plays from 1:42 to the end (about 22 seconds) and the lesson moves on by itself. ''Here at the hospital I give them their medicine'': a nurse. James and Lucy (flight attendant and shop assistant) are skipped on purpose. Technique: a second, shorter listen with the same task."},{"slot_index":13,"teacher_says":"Write a model on the board first: She can cook nice food. She can make cakes. Who is she? Then: your table, choose a secret job. Write two ''can'' sentences. Do not write the job!","watch_for":"Learners: at the tables. TABLE TASK 2 and the proof of both objectives. Walk round in round 1 and quietly check no two tables chose the same job. A table that cannot write two sentences draws a picture and writes one. Round 2: tables move one place, read, and write ''He is a ...'' under the sentences. Stretch: add a third sentence with a place: She works in a kitchen. Technique: an information gap, so the writing has a real reader."},{"slot_index":14,"teacher_says":"Go back to your own table. Did they guess your job? Then one person types your best sentence and the job.","watch_for":"Learners: back at their own tables. One runner per table goes to a screen. Read each post out: did the other table guess it? If not, which sentence was not clear? The board keeps exactly what was typed, so check capitals and full stops together. Technique: capture the product, and send a runner, not the room."},{"slot_index":15,"teacher_says":"Act cooking again. What is my job? Now in two sentences: You can cook. You are a chef. Then act one more job and ask a volunteer to say both sentences.","watch_for":"Learners: at the tables. In minute one they gave one word or a gesture. Now they say two sentences: point that out. Technique: close the loop on the opening question."}],"verify_before_teaching":["Nothing is printed. Learners write on the whiteboard tables at steps 2, 4, 6, 11, 13 and 14, so every learner needs a pen and the tables need wiping first.","Watch both clips. Video 1 (Solutions vox pops) plays 0:00 to 0:30. Video 2 (Test-English A1 listening) plays Anna and Phil (0:21 to 1:09), then Dan (1:42 to the end). James (flight attendant) and Lucy (shop assistant) are skipped. Their transcripts were read in full when the lesson was built.","The Wordwall has four jobs Shamim''s slides do not teach: electrician, vet, postman/woman and factory worker. Act each one when it comes up.","Shamim''s slides are rebuilt as six pictures with her own photos and wording, in her order. Slide 2 hides the words for a guess first. Her three ''Now you try'' worksheet slides become table tasks with nothing printed. ''He is a waiter'' gained a full stop.","Her mechanic picture is small clip art and looks soft when enlarged.","The whole class moves twice: to the touch screens at step 9 and back to the tables at step 11. At step 15 one person per table goes to a screen.","The model for the last task is written on the board, because the slide goes when the timer starts."],"safety_note":null,"media_requests":[],"brief":{"topic":"Jobs: what can they do?","level":"Pre-Entry","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · What is my job? (2 min)
  (0, 'What is my job?', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs/slide-01.jpg","file_name":"slide-01.jpg"}',
    null),

  -- 2 · Video: What is your job? (2 min)
  (1, 'Video: What is your job?', 'Launch', 2, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=0x1WRY4fvz4&end=30"}',
    '{"type":"text_slide","text":"Listen.\nWhat jobs do you hear?","size":"xl"}'),

  -- 3 · What jobs did you hear? (2 min)
  (2, 'What jobs did you hear?', 'Establish', 2, 'screen1_continue',
    '{"type":"text_slide","title":"What jobs did you hear?","text":"I''m a ___.","size":"xl"}',
    null),

  -- 4 · Who is this? (3 min)
  (3, 'Who is this?', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs/slide-02.jpg","file_name":"slide-02.jpg"}',
    null),

  -- 5 · She can repair cars (3 min)
  (4, 'She can repair cars', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs/slide-03.jpg","file_name":"slide-03.jpg"}',
    null),

  -- 6 · Now you try: match (6 min)
  (5, 'Now you try: match', 'Apply', 6, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs/slide-04.jpg","file_name":"slide-04.jpg"}',
    null),

  -- 7 · Check: teacher, journalist, builder, cashier (2 min)
  (6, 'Check: teacher, journalist, builder, cashier', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs/slide-05.jpg","file_name":"slide-05.jpg"}',
    null),

  -- 8 · Act it out (5 min)
  (7, 'Act it out', 'Apply', 5, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs/slide-06.jpg","file_name":"slide-06.jpg"}',
    null),

  -- 9 · Wordwall: find the job (6 min)
  (8, 'Wordwall: find the job', 'Apply', 6, 'screen1_continue',
    '{"type":"text_slide","title":"Jobs quiz","text":"Read the job.\nTap the picture.","size":"xl"}',
    '{"type":"embed","url":"https://wordwall.net/embed/b41bfde937534083b648db2fd1b49b91?themeId=1&templateId=5&fontStackId=0","description":"Shamim''s Wordwall ''Jobs pre-entry''. A quiz: tap Start, a job word appears (for example ''car mechanic'') and four pictures; tap the right picture. Ten questions: car mechanic, doctor, plumber, nurse, chef, electrician, vet, postman/woman, factory worker, taxi driver."}'),

  -- 10 · Which job? (4 min)
  (9, 'Which job?', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"He can repair pipes. He is a ...","options":["chef","plumber","nurse"],"correct":1},{"type":"true_or_false","text":"A chef can cook food.","correct_tf":true},{"type":"multiple_choice","text":"Who can put out fires?","options":["a teacher","a waiter","a fire-fighter"],"correct":2},{"type":"true_or_false","text":"A taxi driver can write a prescription.","correct_tf":false},{"type":"multiple_choice","text":"Which one is NOT a job?","options":["builder","kitchen","cashier"],"correct":1}]}',
    null),

  -- 11 · Video: guess the job (Anna and Phil) (3 min)
  (10, 'Video: guess the job (Anna and Phil)', 'Apply', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=ad2qjy5w8BM&start=21&end=69"}',
    '{"type":"text_slide","text":"What is the job?\n\nschool?\nkitchen?\nhospital?","size":"lg"}'),

  -- 12 · Who is it? (2 min)
  (11, 'Who is it?', 'Apply', 2, 'screen1_continue',
    '{"type":"text_slide","title":"Who is it?","text":"Anna is a ___.\nPhil is a ___.","size":"xl"}',
    null),

  -- 13 · Video: guess the job (Dan) (2 min)
  (12, 'Video: guess the job (Dan)', 'Apply', 2, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=ad2qjy5w8BM&start=102"}',
    '{"type":"text_slide","text":"What is Dan''s job?\n\nschool?\nkitchen?\nhospital?","size":"lg"}'),

  -- 14 · Secret job (12 min)
  (13, 'Secret job', 'Demonstrate', 12, 'screen1_continue',
    '{"type":"rotation_timer","label":"Secret job","details":"Round 1: Choose a secret job. Write 2 sentences on your table: He can ... She can ... Do NOT write the job.\nRound 2: Move to the next table. Read. Write the job under it: He is a ...","rounds":2,"round_secs":330,"move_secs":30,"move_text":"Move to the next table. Take your pen."}',
    null),

  -- 15 · Did they guess? (3 min)
  (14, 'Did they guess?', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"Our secret job","question":"One person from each table: type one of your sentences and the job.\nExample: She can cook nice food. She is a chef."}',
    null),

  -- 16 · What is my job? Again (3 min)
  (15, 'What is my job? Again', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs/slide-01.jpg","file_name":"slide-01.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
