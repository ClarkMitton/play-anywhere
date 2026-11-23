-- ─────────────────────────────────────────────────────────────
-- ESOL JOBS, PLACES AND SKILLS · 120 minutes · 25 steps · ESOL Pre-Entry
-- Built from Shamim Nizami's "What is his job?" PowerPoint (elcivics), five
-- Canva slides, three Wordwalls and three YouTube clips.
-- No printing: learners write and draw on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The pictures are in the app's media storage (lesson-media/lessons/esol-jobs-skills/),
-- so they show straight away. Copies are kept in public/lessons/esol-jobs-skills/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Jobs, Places and Skills',
    'Two hours for ESOL Pre-Entry: job words, where people work, job skills with I can, and job advert short forms (f/t, p/t, hrs, p/h). Built around Shamim Nizami''s What is his job? slides, with Canva slides, three Wordwalls, three short videos and two 20-minute whiteboard table tasks. No printing needed.',
    120, false, true, now(),
    '{"rationale":"One question runs through the two hours: what job is right for you? Learners answer with a gesture at the start and with ''I can'' sentences and a job at the end. Part 1 is job words and where people work: a Pre-Entry jobs video, Shamim''s ''What is his job?'' slides (guess from her clues, then her sentences, then act them out), a workplaces Wordwall and Table task 1, drawing and labelling a town (20 minutes). Part 2 is skills and job adverts: a slow ''I can'' video, a skills slide, a stand-up check, job advert short forms and a model advert, then Table task 2 (20 minutes): tables invent a person and an advert, and another table decides if it is the right job. Both table tasks have support on the touch screens. Nothing is printed.","objectives":["Say where people work: She is a nurse. She works in a hospital.","Say my job skills with I can: I can use a computer. I can speak two languages."],"run_sheet":[{"slot_index":0,"teacher_says":"Point at each person: nurse, chef, cleaner, mechanic. Then about yourself: I am a teacher. I work in a college. I can use a computer. Ask: what job is right for you? Take any answer, in any language.","watch_for":"Learners: standing at the tables, each with a pen. Do not teach yet. Remember who answers: this question comes back at the end, with sentences. Technique: open a question the lesson answers."},{"slot_index":1,"teacher_says":"Say this BEFORE the clip starts: pictures of jobs. When you see the job, say it with me.","watch_for":"Learners: at the tables. The first part of the Pre-entry ESOL video (0:00 to 2:08): a photo of each job with its word. Say each word aloud with the class. It stops by itself. Technique: say it as you see it."},{"slot_index":2,"teacher_says":"No video now. Write all the jobs you remember on your table. Spelling does not matter yet. One minute.","watch_for":"Learners: at the tables, writing. Count each table''s jobs out loud: who has the most? Correct spelling on the board, not on their tables. Technique: recall from memory before the quiz."},{"slot_index":3,"teacher_says":"Say this BEFORE the clip starts: now a quiz. You see a number and a picture. Write the number and the job on your table.","watch_for":"Learners: at the tables, writing. The quiz part (2:09 to the end) shows the same jobs again with a number in the corner. Pause the video if a table needs more time. From still frames the jobs are: shop assistant, cleaner, builder, mechanic, barber, nurse, firefighter, teacher, chef, police officer, doctor, office worker, dentist, hairdresser, farmer, vet, taxi driver. Check the order yourself. It moves on by itself at the end. Technique: a watching task written on the table."},{"slot_index":4,"teacher_says":"Number 1? Number 2? Each table says one. Tick it on your table if you got it.","watch_for":"Learners: at the tables, ticking their own work. Go round the tables so every table answers once. Technique: self-check."},{"slot_index":5,"teacher_says":"Say each place, the class repeats: hospital, school, restaurant, shop, factory, office. Then ask: a nurse works in a ...? A teacher works in a ...?","watch_for":"Learners: at the tables. Drill the places, then the full sentence: A nurse works in a hospital. Point at the place picture as they say it. Technique: choral drill, then answer from a cue."},{"slot_index":6,"teacher_says":"Read Shamim''s clues. Learners point and say the number, any word is OK. ''He works in a restaurant. He serves food to customers.'' ''She works in a library.'' ''He delivers letters and packages.'' ''He cuts hair.'' ''He works in a supermarket.'' ''He cuts the grass.''","watch_for":"Learners: at the tables. These are six of Shamim''s ''What is his job?'' slides with the words hidden. Answers: 1 postal worker, 2 waiter, 3 librarian, 4 barber, 5 cashier, 6 gardener. Read the clues in a random order. Technique: listen and predict before the words appear."},{"slot_index":7,"teacher_says":"Read each card with the class: He is a waiter. He works in a restaurant. Then you say the job, they say where: Librarian? She works in a library.","watch_for":"Learners: at the tables. Check their guesses. Drill both sentences. His and her: point at the person each time. Technique: reveal, then drill."},{"slot_index":8,"teacher_says":"Read the six with me. Now one person at your table acts a job, no talking. The table says: He is a welder. He works in a factory. Change who acts.","watch_for":"Learners: standing at the tables, taking turns. Any of the twelve jobs is fine. Listen for both sentences, not just the job word. When most have acted, say clearly: now walk to the touch screens. Technique: act it, then say it."},{"slot_index":9,"teacher_says":"At the screen, take turns. One person taps. Everyone at your screen says the sentence first: A teacher works in a school.","watch_for":"Learners: at the touch screens, half the class at each. This trip covers this step and the next. Receptionist and reception are new: act answering a phone. Everyone waiting says a ''works in'' sentence to the person next to them. Technique: a game in learners'' hands, with the sentence said before the tap."},{"slot_index":10,"teacher_says":"Read each question and every answer aloud. Talk to the person next to you, then one person taps.","watch_for":"Learners: at the touch screens. The last question is the odd one out: barber is a job, not a place. Then say clearly: back to your tables. Technique: mixed question shapes, best answer, true or false, odd one out."},{"slot_index":11,"teacher_says":"Draw a big town on your table first, on the board, to show them: six boxes for six places. Then: your table, draw your town. Write the jobs in each place. Then three sentences. Need a word? Look at the touch screens.","watch_for":"Learners: at the tables, with the touch screens as their picture dictionary: all twelve of Shamim''s jobs with her sentences are on both screens, so a learner can walk over to find a word. TABLE TASK 1, about 20 minutes, written on the table, nothing printed. Walk round, support the slowest table first. A table that cannot yet write sentences labels places and jobs; a table that finishes early writes ''He can ...'' for two jobs. Round 2: tables move one place, tick what is right and add one job. Technique: independent table work with support on the screens, then check another table''s work."},{"slot_index":12,"teacher_says":"Go back to your own table. Read what the other table added. Then one person from each table reads your best sentence to the room.","watch_for":"Learners: back at their own tables. Every table reads one sentence. Praise the ones with ''works in a''. Fix one common mistake together on the board. Technique: share the product out loud."},{"slot_index":13,"teacher_says":"Say this BEFORE the clip starts: a picture comes, then the word. Shout the job BEFORE the word comes.","watch_for":"Learners: at the tables, standing. BBC Learning English ''Jobs: 10 Easy English Words'', the Test yourself part (3:10 to 5:24): hairdresser, teacher, flight attendant, dancer, vet, dentist, pharmacist, cleaner, firefighter, artist. Flight attendant, dancer, pharmacist and artist are new: say them once. A fun reset after the long task. Technique: fast recall."},{"slot_index":14,"teacher_says":"Say this BEFORE the clip starts: listen. Every sentence comes twice. The second time, say it with her.","watch_for":"Learners: at the tables. 1 minute 29 seconds, slow and repeated: she can use a cash register, he can help customers, she can use a computer, he can build houses, he can fix something, she can take care of patients, then ''What are your job skills? I can clean buildings / speak two languages / fix cars''. It moves on by itself. Technique: listen and repeat."},{"slot_index":15,"teacher_says":"Say each one with an action: I can drive. I can cook. The class repeats with the action. Then: point to one picture, they say the sentence.","watch_for":"Learners: at the tables. Eight skills: use a computer, drive, cook, clean, speak two languages, help customers, fix cars, look after people. Use an action for each so nobody has to read. Technique: words with actions."},{"slot_index":16,"teacher_says":"Stand up if you can drive. Sit down. Stand up if you can cook. ... Stand up if you can speak two languages. Then each learner tells their table one true sentence: I can ...","watch_for":"Learners: at the tables. A quick check where they stand, no screens. Most of the room stands for ''speak two languages'': say so, it is a real job skill. A good answer is a true sentence: I can speak Urdu and Punjabi. Technique: check by moving, then make it personal."},{"slot_index":17,"teacher_says":"Job adverts use short words. Read each with me: f t, full-time. p t, part-time. Then: I say the short form, you say the long word.","watch_for":"Learners: at the tables. Write two of them on the board as they appear in real adverts. Check with fingers: full-time, hold up five fingers for five days; part-time, two. Technique: decode, then say it from a cue."},{"slot_index":18,"teacher_says":"Read the advert together, line by line. Then ask: What is the job? Part-time or full-time? How many hours? Which days? How much an hour? What must you do? Tables write the answers on the table.","watch_for":"Learners: at the tables, writing short answers: cleaner, p/t, 20, Mon to Fri, £13, clean. This is the model for Table task 2. When done, say clearly: walk to the touch screens. Technique: questions on a real text, answers written short."},{"slot_index":19,"teacher_says":"At the screen, take turns. Read both sentences out loud first, then tap.","watch_for":"Learners: at the touch screens. This trip covers three steps. Only two choices each time, so it suits Pre-Entry. Waiting learners say a true ''I can'' sentence to the person next to them. Technique: a game in learners'' hands."},{"slot_index":20,"teacher_says":"Read each question and answer aloud. Talk to the person next to you, then tap.","watch_for":"Learners: at the touch screens. Question 3 is the best-answer one: Monday and Friday looks right but means two days only. Technique: best-answer question where two options look right."},{"slot_index":21,"teacher_says":"A memory game. Tap two tiles. Do they match? Everyone says the words out loud.","watch_for":"Learners: at the touch screens. Four pairs are new: tel, K (thousand), IT and pm. Say them once when they come up; they are not needed later. Note the game writes ''ph'' for per hour where the slide wrote ''p/h'': both are used. Then say clearly: back to your tables. Technique: a memory game for recognition."},{"slot_index":22,"teacher_says":"Write a model on the board first: ''Amir. I can drive. I can speak two languages.'' Next to it: ''Delivery driver. f/t. 40 hrs a wk. Mon to Fri. £13 p/h. You can drive.'' Ask: is it the right job for Amir? Yes, because he can drive. Then: your table, a person and an advert. Make it a yes or a no!","watch_for":"Learners: at the tables, with the short forms on both touch screens to look up. TABLE TASK 2, about 20 minutes, the proof of both objectives. In round 1 each table invents a person with two ''I can'' sentences and an advert in short forms; some tables should make a deliberate mismatch, so round 2 has something to judge. Round 2: tables move, read both, and write YES or NO with ''because he can / she can''. Support the slowest table; a table that finishes early adds a second advert. Technique: create, then judge another table''s work against the advert."},{"slot_index":23,"teacher_says":"Go back to your own table. Did the other table say yes or no? Do you agree? Then one person types your answer.","watch_for":"Learners: back at their own tables. One runner per table goes to a screen. Read each post aloud and ask the room: do you agree? A good post names the person, the job and a reason with ''can''. Technique: capture the product, and send a runner, not the room."},{"slot_index":24,"teacher_says":"The first question again: what job is right for you? Model it: I can use a computer. I can help people. A teacher is right for me. Then three or four volunteers: I can ... I can ... A ___ is right for me.","watch_for":"Learners: at the tables. At the start they gave one word or a gesture. Now they give two ''I can'' sentences and a job: point that out. Nobody has to share a job they do not want; ''I want to be a ...'' is fine too. Technique: close the loop on the opening question."}],"verify_before_teaching":["Nothing is printed. Learners write on the whiteboard tables at steps 3, 4, 12, 19 and 23, so every learner needs a pen and the tables need wiping first.","The two table tasks are 20 minutes each (two rounds of 9 and a half minutes, one minute to move). The touch screens hold the support: all twelve jobs at step 12, the short forms at step 23.","The Pre-entry ESOL jobs video has no captions, so it was read from still frames only: the learn part ends at 2:08 and the quiz part starts at 2:09. The list of quiz jobs in step 4''s note is a best reading; check the order before teaching. The BBC video was also read from stills (no captions). The job skills video''s transcript was read in full.","Shamim''s ''What is his job?'' slides: 12 of her 15 jobs are used with her sentences and new photos (her pictures were tiny clip art). Left out: maid, baseball player and the title slide. Changed for the UK: truck driver to lorry driver, grocery store to supermarket, ''He rings up the groceries'' to ''He works in a supermarket'', ''She keeps the community safe'' to ''She keeps us safe'', ''He cuts the grass and trims the bushes'' to ''He cuts the grass'', and ''His is a forklift driver'' to ''He is''.","Five slides were made in Canva (cover, places, skills, short forms, advert). The model advert pays £13 per hour: check it is not below the current minimum wage before teaching.","Three of Shamim''s Wordwalls were found through Google: workplaces (Find the match), job skills (picture quiz) and job advert short forms (Matching pairs). The short forms game includes tel, K, IT and pm, which the lesson does not teach.","The whole class moves four times in two hours: to the touch screens at step 10, back at step 12, to the screens at step 20, back at step 23. At step 24 one person per table goes to a screen.","A two-hour session usually has a break: the natural place is after step 13, before the second half."],"safety_note":null,"media_requests":[],"brief":{"topic":"Jobs, workplaces, job skills and job advert short forms","level":"Pre-Entry","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · What job is right for you? (3 min)
  (0, 'What job is right for you?', 'Launch', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/cover.jpg","file_name":"cover.jpg"}',
    null),

  -- 2 · Video: jobs (learn) (3 min)
  (1, 'Video: jobs (learn)', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=_pjd1iayafs&end=128"}',
    '{"type":"text_slide","text":"Watch.\nSay the job.","size":"xl"}'),

  -- 3 · How many jobs can you remember? (3 min)
  (2, 'How many jobs can you remember?', 'Establish', 3, 'screen1_continue',
    '{"type":"text_slide","text":"Write the jobs\non your table.","size":"xl","title":"How many can you remember?"}',
    null),

  -- 4 · Video: jobs (quiz) (4 min)
  (3, 'Video: jobs (quiz)', 'Establish', 4, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=_pjd1iayafs&start=129"}',
    '{"type":"text_slide","text":"Write the number\nand the job.","size":"xl"}'),

  -- 5 · Check the quiz (2 min)
  (4, 'Check the quiz', 'Establish', 2, 'screen1_continue',
    '{"type":"text_slide","text":"1 ... 2 ... 3 ...\nWhat is the job?","size":"xl","title":"Check"}',
    null),

  -- 6 · Where do they work? (3 min)
  (5, 'Where do they work?', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/places.jpg","file_name":"places.jpg"}',
    null),

  -- 7 · What is his job? Guess (3 min)
  (6, 'What is his job? Guess', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/jobs-1-guess.jpg","file_name":"jobs-1-guess.jpg"}',
    null),

  -- 8 · What is his job? Shamim's slides 1 (3 min)
  (7, 'What is his job? Shamim''s slides 1', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/jobs-1.jpg","file_name":"jobs-1.jpg"}',
    null),

  -- 9 · What is his job? Shamim's slides 2 (4 min)
  (8, 'What is his job? Shamim''s slides 2', 'Establish', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/jobs-2.jpg","file_name":"jobs-2.jpg"}',
    null),

  -- 10 · Wordwall: who works where? (5 min)
  (9, 'Wordwall: who works where?', 'Apply', 5, 'screen1_continue',
    '{"type":"text_slide","text":"Find the pairs.\nJob and place.","size":"xl","title":"Who works where?"}',
    '{"type":"embed","url":"https://wordwall.net/embed/8222d3e64c8d4ff89da4d5a23ca1ac3a?themeId=1&templateId=46&fontStackId=0","description":"Wordwall ''PRE-ENTRY: Jobs and Workplaces (Who works in a...?)'', a Find the match game: tap Start, then match each job to its place. Six pairs: police officer and police station, cleaner and hotel, teacher and school, receptionist and reception, doctor and hospital, shop assistant and supermarket."}'),

  -- 11 · Where? (4 min)
  (10, 'Where?', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"A nurse works in a ...","options":["hospital","school","shop"],"correct":0},{"type":"true_or_false","text":"A waiter works in a restaurant.","correct_tf":true},{"type":"multiple_choice","text":"Who works in a library?","options":["a welder","a librarian","a gardener"],"correct":1},{"type":"true_or_false","text":"A welder works in a school.","correct_tf":false},{"type":"multiple_choice","text":"Which one is NOT a place?","options":["factory","barber","office"],"correct":1}]}',
    null),

  -- 12 · Table task 1: Our town (20 min)
  (11, 'Table task 1: Our town', 'Apply', 20, 'screen1_continue',
    '{"type":"rotation_timer","label":"Our town","details":"Round 1: Draw your town on the table: hospital, school, shop, factory, restaurant, office. Write the jobs in each place. Write 3 sentences: A nurse works in a hospital.\nRound 2: Move to the next table. Read. Tick the right ones. Add 1 job they missed.","rounds":2,"round_secs":570,"move_secs":60,"move_text":"Move to the next table. Take your pen."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/jobs-all.jpg","file_name":"jobs-all.jpg"}'),

  -- 13 · Read one sentence (3 min)
  (12, 'Read one sentence', 'Apply', 3, 'screen1_continue',
    '{"type":"text_slide","text":"A ___ works in a ___.","size":"xl","title":"Read one sentence"}',
    null),

  -- 14 · Video: test yourself (3 min)
  (13, 'Video: test yourself', 'Apply', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=UiVoRIrdx8U&start=190&end=324"}',
    '{"type":"text_slide","text":"Say the job\nbefore the word!","size":"xl"}'),

  -- 15 · Video: what are your job skills? (2 min)
  (14, 'Video: what are your job skills?', 'Apply', 2, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=UFla84ro68s"}',
    '{"type":"text_slide","text":"Listen.\nSay it: I can ...","size":"xl"}'),

  -- 16 · What can you do? I can ... (4 min)
  (15, 'What can you do? I can ...', 'Apply', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/skills.jpg","file_name":"skills.jpg"}',
    null),

  -- 17 · Stand up if you can ... (2 min)
  (16, 'Stand up if you can ...', 'Apply', 2, 'screen1_continue',
    '{"type":"text_slide","text":"Stand up if\nyou can ...","size":"xl","title":"Find out"}',
    null),

  -- 18 · Job adverts: short forms (4 min)
  (17, 'Job adverts: short forms', 'Apply', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/short-forms.jpg","file_name":"short-forms.jpg"}',
    null),

  -- 19 · Read a job advert (4 min)
  (18, 'Read a job advert', 'Apply', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/advert.jpg","file_name":"advert.jpg"}',
    null),

  -- 20 · Wordwall: job skills (5 min)
  (19, 'Wordwall: job skills', 'Apply', 5, 'screen1_continue',
    '{"type":"text_slide","text":"Look at the picture.\nTap the sentence.","size":"xl","title":"I can ..."}',
    '{"type":"embed","url":"https://wordwall.net/embed/89e3ae43277749f0831f2cfe77c01bfc?themeId=1&templateId=5&fontStackId=0","description":"Wordwall ''PE EMW Job skills'', a picture quiz: a photo appears with two sentences such as ''I can clean.'' and ''I can cook.''; tap the right one. Skills include clean, work with people, cook, speak English, work with money, drive, use a computer."}'),

  -- 21 · Short forms quiz (4 min)
  (20, 'Short forms quiz', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"p/t means ...","options":["part-time","full-time","per hour"],"correct":0},{"type":"true_or_false","text":"hrs means hours.","correct_tf":true},{"type":"multiple_choice","text":"Mon – Fri means ...","options":["Monday and Friday","Monday to Friday","every day"],"correct":1},{"type":"multiple_choice","text":"£13 p/h means ...","options":["£13 a week","13 hours","£13 per hour"],"correct":2},{"type":"true_or_false","text":"f/t means part-time.","correct_tf":false}]}',
    null),

  -- 22 · Wordwall: short forms pairs (4 min)
  (21, 'Wordwall: short forms pairs', 'Apply', 4, 'screen1_continue',
    '{"type":"text_slide","text":"Find the pairs.\nShort word and long word.","size":"xl","title":"Short forms"}',
    '{"type":"embed","url":"https://wordwall.net/embed/1abd7dd444504cefb2f550609b64d27d?themeId=1&templateId=25&fontStackId=0","description":"Wordwall ''Job ads: abbreviations'', a Matching pairs memory game: tap two tiles to find a short form and its meaning. Pairs: part-time P/T, per hour ph, hours hrs, telephone number tel, thousand K, information technology IT, Monday Mon, afternoon/evening pm."}'),

  -- 23 · Table task 2: The right job (20 min)
  (22, 'Table task 2: The right job', 'Demonstrate', 20, 'screen1_continue',
    '{"type":"rotation_timer","label":"The right job","details":"Round 1: On your table write a PERSON: Name. I can ... I can ...\nThen write a JOB ADVERT: Job. f/t or p/t. hrs. Days. £ p/h. You can ...\nRound 2: Move to the next table. Read the person and the advert. Is it the right job? Write YES or NO. Because he can / she can ...","rounds":2,"round_secs":570,"move_secs":60,"move_text":"Move to the next table. Take your pen."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/short-forms.jpg","file_name":"short-forms.jpg"}'),

  -- 24 · Is it the right job? (4 min)
  (23, 'Is it the right job?', 'Demonstrate', 4, 'screen1_continue',
    '{"type":"padlet","title":"Is it the right job?","question":"One person from each table: type the person, the job and YES or NO.\nExample: Amir. Delivery driver. YES, he can drive."}',
    null),

  -- 25 · What job is right for you? (4 min)
  (24, 'What job is right for you?', 'Demonstrate', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-jobs-skills/cover.jpg","file_name":"cover.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
