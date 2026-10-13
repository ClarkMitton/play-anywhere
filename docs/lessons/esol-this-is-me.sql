-- ─────────────────────────────────────────────────────────────
-- ESOL THIS IS ME · 60 minutes · 19 steps · ESOL Pre-Entry
-- Built from Shamim Nizami's week 2 resources: the alphabet Wordwall, the
-- names and numbers audio, and two YouTube clips.
-- No printing: learners write and draw on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The slides and the sound file live in public/lessons/esol-this-is-me/ and
-- only work once that folder has been pushed and the app republished. The
-- audio step also needs the app update that adds the "Audio (listening)" type.
-- ─────────────────────────────────────────────────────────────

-- Lets tutors upload their own sound files in the designer. Safe to run twice.
update storage.buckets
set allowed_mime_types = (
  select array_agg(distinct m)
  from unnest(allowed_mime_types || array['audio/mpeg','audio/mp4','audio/x-m4a','audio/wav']) as m
)
where id = 'lesson-media';

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL This Is Me',
    'Introducing yourself for ESOL Pre-Entry: letters, numbers, three questions and three things I do in the morning. Built from Shamim Nizami''s week 2 resources, with a listening track, two short videos and an About me card written on the whiteboard tables. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"One idea runs through the hour: telling someone who I am. Learners say hello before anything is taught, then build the pieces one at a time: letters, numbers, three questions, and three things they do in the morning. Everything comes from Shamim''s week 2 resources: the alphabet Wordwall, the names and numbers audio, the personal information video and the morning video. Nothing is printed: learners write and draw on the table all the way through. The last task puts it all on one About me card, written on the table, and uses it with a new partner, which answers the question the lesson opened with.","objectives":["Recognise numbers when I hear them and write them down.","Ask and answer three questions: What''s your name? How do you spell it? Where are you from?","Say three things I do in the morning, using always or sometimes."],"run_sheet":[{"slot_index":0,"teacher_says":"Hello! I''m [your name]. What''s your name? Ask three learners, one at a time, and wait for each answer.","watch_for":"Learners: standing at the tables, each with a pen. Do not explain anything yet. Accept one-word answers. Technique: model the language, do not explain it. This question is answered properly in the last step."},{"slot_index":1,"teacher_says":"Stand up. Walk. Say hello to three people. Show it first with one learner, then count to three on your fingers.","watch_for":"Learners: walking round the tables. Join in yourself. Listen for who can say the whole question and who only says their name. Technique: do it before being told."},{"slot_index":2,"teacher_says":"Come to the touch screens. Tap Start. One person taps a box. What letter is it? Everyone at your screen says it. Then the next person taps.","watch_for":"Learners: MOVE to the touch screens straight from the hello walk, half the class at each. The Wordwall is on both touch screens, not the big screen, because it is an activity for learners to tap. They take turns: one taps a box, everyone at that screen says the letter. Stand between the two screens and listen for A, E and I, and for G and J. When the boxes are open, say clearly: now go to the tables. Technique: a game in learners'' hands, with choral repetition."},{"slot_index":3,"teacher_says":"Write your name on the table. Big letters. Now spell it to your table: A, M, I, N, A. Write your own name on the board and spell it first.","watch_for":"Learners: now at the tables, writing on the table top. TABLE TASK 1. Walk round. Look for a capital letter at the start and letters the right way round. Stretch: spell your family name, or write a friend''s name while they spell it. Technique: every learner writes and speaks, nobody watches."},{"slot_index":4,"teacher_says":"Before you show the slide, hold up fingers: how many? Then show the slide and count up together. Then: I say a number, you write it on the table. Seven. Three. Ten.","watch_for":"Learners: at the tables, writing on the table top. Say five or six numbers out of order and have learners write the figure, then hold up that many fingers to check. Three and five are often mixed up. Stretch: write the word as well, copying from the slide. Technique: predict before reveal, then a quick dictation."},{"slot_index":5,"teacher_says":"Listen. Pens down the first time. Then: listen again, and write the numbers you hear on the table.","watch_for":"Learners: at the tables with a pen. The sound is 49 seconds. It does not start by itself: explain the task, then press Play on the big screen. Press Play again for each listen: first just listen, second listen for names, third write the numbers. It does not move on by itself. Check together: one table reads out its numbers. Technique: listen several times with a narrower task each time."},{"slot_index":6,"teacher_says":"Say this BEFORE the clip starts: these are real people in the street. Listen for one name, one number and one place. Write them on the table.","watch_for":"Learners: at the tables, writing on the table as they watch. The clip plays the first 1 minute 55 seconds, then stops and moves on by itself: names and spelling first, then ages from about 1:02, then where people are from at about 1:24. The speech is fast and real, so one name, one number and one place is a good result. Technique: a watching task set before the clip."},{"slot_index":7,"teacher_says":"What name did you hear? What number? What place? Take answers from different tables and write them on the board.","watch_for":"Learners: at the tables. These are the same three questions they were listening for. Praise any answer that was really in the clip. Point out that the people spelled their names letter by letter, as the class did. Technique: open the floor to the watching task."},{"slot_index":8,"teacher_says":"Say each question, the class repeats. Then: you ask, they answer about Amina. Then they ask the person next to them, with their own answers.","watch_for":"Learners: at the tables, then MOVE. Drill all together first, then in pairs. A good answer is short and true: I''m Omar. O, M, A, R. I''m from Iraq. When the pairs have finished, say clearly: now walk to the touch screens. Technique: choral drill, then open pairs."},{"slot_index":9,"teacher_says":"Read each question aloud to the whole class. Talk to the person next to you, then one person taps.","watch_for":"Learners: at the touch screens, half the class at each. This is the second trip to the screens, and it covers this step and the next. Read every question and every option aloud: many learners cannot read them yet. If the spelling question goes wrong, spell A, N, N, A aloud together. Technique: mixed question shapes, best answer and true or false."},{"slot_index":10,"teacher_says":"Where are you from? Type your country. While you wait for your turn, ask the person next to you: where are you from?","watch_for":"Learners: at the touch screens, taking turns to type. The board shows words exactly as typed, so capitals count. Read the countries out with the class: I''m from Syria. Everyone waiting has a job, which is to ask and answer. Then say clearly: back to the tables. Technique: real answers from the room become the teaching material."},{"slot_index":11,"teacher_says":"Say nothing. Act out getting up, brushing your teeth and making coffee. Ask: what is it? Take any answer, in any language, or a copied action.","watch_for":"Learners: back at the tables, standing. They are guessing from your actions, not reading. Do not give the English words yet. Technique: predict before reveal."},{"slot_index":12,"teacher_says":"Point at each picture. Say it, the class says it and does the action. Then say one and they point to it.","watch_for":"Learners: at the tables, standing. Six actions only. All six are in the video that comes next. Technique: words with actions, so meaning does not depend on reading."},{"slot_index":13,"teacher_says":"Say this BEFORE the clip starts: stand up. When Mark says it, do the action. In the second part, say it with him.","watch_for":"Learners: at the tables, standing and acting out. The video is 3 minutes 13 seconds. Up to 1:49 Mark says eleven sentences with pictures: learners do the actions. From 1:49, ''Now it''s your turn'', the words have gaps: learners say them with him. He also says ''I usually get up at 6:10'', read the newspaper, check my email and leave for work. Do not teach those today. The lesson moves on by itself when the video ends. Technique: nobody is a passenger during a video."},{"slot_index":14,"teacher_says":"Always is every day. Sometimes is some days. I say it, you show me: hands high for always, hand flat and rocking for sometimes. I make coffee. I make the bed. Then: tell your table one true thing.","watch_for":"Learners: at the tables. A quick check where they stand, no screens needed. A good answer is a whole true sentence: I always brush my teeth. I sometimes make breakfast. Technique: check with gestures, then make it personal."},{"slot_index":15,"teacher_says":"Draw one morning thing on the table. Do not say it. Your table looks and says it: make coffee! Then write the words under your picture.","watch_for":"Learners: at the tables, drawing on the table top. Draw a quick cup on the board first to show how simple it can be. Everyone draws, everyone guesses. The words are on the big screen to copy. Stretch: draw a second one and say it with always or sometimes. Technique: draw, guess, then label, so the word is spoken before it is written."},{"slot_index":16,"teacher_says":"Write your own card on the board first and read it aloud: Name. From. In the morning, three things. Then: now you. Make your card on the table. Draw a little picture next to each one.","watch_for":"Learners: at the tables. TABLE TASK 2, and the proof of all three objectives. Round 1: each learner writes their own card on the table, copying the shape of your card from the board, with a small drawing beside each morning thing. A learner who cannot yet write the sentences draws the three things and says them. Round 2: they find a partner from another table, ask What''s your name? How do you spell it? Where are you from?, then take the partner to their card and say their three morning sentences. Stretch: add a fourth line with a number, such as I usually get up at 7. With one table only, partners swap within the table. Technique: make it, then use it with someone new."},{"slot_index":17,"teacher_says":"One person from each table: go to a touch screen. Type your partner''s name and country. Ask them: how do you spell it?","watch_for":"Learners: at the tables. One runner per table goes to a screen, and may take the partner along to spell the name. Everyone else reads the board as it fills. Check each name with its owner: is it spelled right? That is the test of ''How do you spell it?''. Technique: capture the product, and send a runner, not the room."},{"slot_index":18,"teacher_says":"The first question again: Hello! What''s your name? Ask two or three volunteers to say it all: I''m ___. I''m from ___. In the morning I always ___.","watch_for":"Learners: at the tables. Compare with the one-word answers from the first minute and say so: at the start you said one word, now you say three sentences. Technique: close the loop on the opening question."}],"verify_before_teaching":["Listen to the audio (step 6, 49 seconds) and write down the names and numbers in it. It could not be listened to when the lesson was built, so the lesson does not hold the answers.","Open the Wordwall (step 3, on the touch screens) and check what is inside the boxes. It is called ''alphabet'' and is an Open the box game, but its contents were not checked.","Watch the first video to 1:55. The cut point comes from YouTube''s own chapter marks (age at 1:02, where at 1:24, jobs at 1:55), which are approximate. Change &end=115 on the link if it cuts someone off. The jobs section after 1:55 is left out on purpose.","Watch the morning video to the end (3:13). Mark Kulek speaks American English. Check the six actions on slide 4 match what you want to teach.","Slides 1 to 5 were made with Canva''s AI (public/lessons/esol-this-is-me/). The wording is as asked. Three things to know: slide 1 has two wall posters with extra words (''Learn English Together'', ''Speak Listen Learn''); on slide 4 the shower photo showed a woman''s bare shoulders, so it was replaced with a drawing of a shower head; on slide 5 ''always'' has seven dots and ''sometimes'' has eight, three of them filled.","Who is in the slides: a young Black woman and an older Sikh man in a turban (slide 1), a woman in a hijab and a young white man who uses a wheelchair (slide 3), an East Asian woman, a larger Middle Eastern man, a Black man, an older white woman and a South Asian woman (slide 4), and an older woman in a hijab out running (slide 5).","Nothing is printed. Learners write and draw on the whiteboard tables at steps 4, 5, 6, 7, 16 and 17, so every learner needs a pen and the tables need wiping first.","The whole class moves four times: to the touch screens for the Wordwall at step 3 (straight from the hello walk), to the tables at step 4, to the touch screens at step 10 and back to the tables at step 12. At step 18 only one person per table goes to a screen.","Some learners may not want to say where they are from. ''I''m from Bradford'' is a good answer, and nobody is asked their age, address or phone number.","There is no model card on screen for the last task (step 17). Write your own About me card on the board as the example before the timer starts."],"safety_note":null,"media_requests":[],"brief":{"topic":"Introducing myself and my morning","level":"Pre-Entry","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · Hello! What's your name? (1 min)
  (0, 'Hello! What''s your name?', 'Launch', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-this-is-me/slide-01.jpg","file_name":"slide-01.jpg"}',
    null),

  -- 2 · Say hello to three people (2 min)
  (1, 'Say hello to three people', 'Launch', 2, 'screen1_continue',
    '{"type":"text_slide","title":"Say hello to 3 people","text":"Hello! I''m ___.\nWhat''s your name?","size":"lg"}',
    null),

  -- 3 · The alphabet: open the box (4 min)
  (2, 'The alphabet: open the box', 'Establish', 4, 'screen1_continue',
    '{"type":"text_slide","title":"The alphabet","text":"Open a box.\nSay the letter.","size":"xl"}',
    '{"type":"embed","url":"https://wordwall.net/embed/3290ba254468409a9835ed3daf1344d2?themeId=65&templateId=30&fontStackId=0","description":"Shamim''s Wordwall called ''alphabet''. It is an ''Open the box'' game: tap Start, then tap a numbered box to open it and show what is inside."}'),

  -- 4 · Write your name. Spell it. (4 min)
  (3, 'Write your name. Spell it.', 'Establish', 4, 'screen1_continue',
    '{"type":"text_slide","title":"Write your name","text":"1  Write your name on the table.\n2  Spell it to your table.\n\nA - M - I - N - A","size":"md"}',
    null),

  -- 5 · Numbers 1 to 10 (2 min)
  (4, 'Numbers 1 to 10', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-this-is-me/slide-02.jpg","file_name":"slide-02.jpg"}',
    null),

  -- 6 · Listen: names and numbers (4 min)
  (5, 'Listen: names and numbers', 'Establish', 4, 'screen1_continue',
    '{"type":"audio","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-this-is-me/names-and-numbers.mp3","file_name":"names-and-numbers.mp3","title":"Listen.\nWrite the numbers you hear."}',
    '{"type":"text_slide","text":"Listen\nWrite the numbers","size":"xl"}'),

  -- 7 · Video: real people answer (3 min)
  (6, 'Video: real people answer', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=d4xHaGUx3c0&end=115"}',
    '{"type":"text_slide","text":"Listen for:\n1  a name\n2  a number\n3  a place","size":"lg"}'),

  -- 8 · What did you hear? (2 min)
  (7, 'What did you hear?', 'Establish', 2, 'screen1_continue',
    '{"type":"text_slide","title":"What did you hear?","text":"1  A name?\n2  A number?\n3  A place?","size":"lg"}',
    null),

  -- 9 · Three questions (3 min)
  (8, 'Three questions', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-this-is-me/slide-03.jpg","file_name":"slide-03.jpg"}',
    null),

  -- 10 · Which answer? (4 min)
  (9, 'Which answer?', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"What''s your name?","options":["I''m Amina.","I''m from Somalia.","Seven."],"correct":0},{"type":"true_or_false","text":"7 is seven.","correct_tf":true},{"type":"multiple_choice","text":"Where are you from?","options":["I''m Omar.","O - M - A - R","I''m from Iraq."],"correct":2},{"type":"true_or_false","text":"3 is five.","correct_tf":false},{"type":"multiple_choice","text":"How do you spell it?","options":["I''m from Poland.","A - N - N - A","I''m Anna."],"correct":1}]}',
    null),

  -- 11 · Where are you from? (3 min)
  (10, 'Where are you from?', 'Apply', 3, 'screen1_continue',
    '{"type":"padlet","title":"Where are you from?","question":"Type your country. Start with a capital letter."}',
    null),

  -- 12 · What do I do in the morning? (1 min)
  (11, 'What do I do in the morning?', 'Apply', 1, 'screen1_continue',
    '{"type":"text_slide","text":"In the morning…","size":"xl"}',
    null),

  -- 13 · In the morning (2 min)
  (12, 'In the morning', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-this-is-me/slide-04.jpg","file_name":"slide-04.jpg"}',
    null),

  -- 14 · Video: in the morning (4 min)
  (13, 'Video: in the morning', 'Apply', 4, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=VpESOerMY7I"}',
    '{"type":"text_slide","text":"Watch.\nDo the actions.\nThen say it.","size":"lg"}'),

  -- 15 · Always or sometimes? (3 min)
  (14, 'Always or sometimes?', 'Apply', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-this-is-me/slide-05.jpg","file_name":"slide-05.jpg"}',
    null),

  -- 16 · Draw it. Say it. (3 min)
  (15, 'Draw it. Say it.', 'Apply', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-this-is-me/slide-04.jpg","file_name":"slide-04.jpg","title":"Draw one. Your table says it."}',
    null),

  -- 17 · About me (11 min)
  (16, 'About me', 'Demonstrate', 11, 'screen1_continue',
    '{"type":"rotation_timer","label":"About me","details":"Round 1: Make your About me card on the table. Name. From. In the morning: 3 things, with always or sometimes.\nRound 2: Find a new partner. Ask the 3 questions. Show your card and say your morning.","rounds":2,"round_secs":300,"move_secs":30,"move_text":"Stand up. Find a partner from a different table."}',
    null),

  -- 18 · My new friend (2 min)
  (17, 'My new friend', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"padlet","title":"My new friend","question":"Type your partner''s name and country.\nExample: Amina, Somalia"}',
    null),

  -- 19 · Hello again (2 min)
  (18, 'Hello again', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-this-is-me/slide-01.jpg","file_name":"slide-01.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
