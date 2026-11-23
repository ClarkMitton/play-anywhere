-- ─────────────────────────────────────────────────────────────
-- ESOL ME AND MY HOME: MY NEIGHBOURHOOD · 90 minutes · 19 steps · ESOL Entry 1
-- Me and my home, lesson 2 (Wednesday 25 November). Two BBC Learning English
-- videos, three Canva slides, three photo slides, two Wordwalls.
-- No printing: learners write and draw on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The pictures are in the app's media storage (lesson-media/lessons/esol-my-area/),
-- so they show straight away. Copies are kept in public/lessons/esol-my-area/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Me and My Home: My Neighbourhood',
    '90 minutes for ESOL Entry 1: places near home (park, shop, mosque, church, doctor''s), I live near a ..., and It''s busy / quiet / noisy / clean / dirty. Two BBC Learning English videos, Canva slides, two Wordwalls and two whiteboard table tasks, ending in a partner interview about where each learner''s dream home is. No printing needed.',
    90, false, true, now(),
    '{"rationale":"One question runs through the lesson: where is your dream home? Learners answer with a word at the start and with ''I live near a ... It''s ...'' at the end. Two people from the BBC say where they live (big Brighton, small Petworth), which opens busy versus quiet before it is taught. Places are taught with a BBC video and a photo dictionary of places near home (including a mosque, a church and the doctor''s), then ''I live near a ...'' and the describing words, acted out first. Two Wordwalls and a question round on the touch screens, then Table task 1 (15 minutes): each table draws a street and writes about it. Then the interview questions, a spinner, and Table task 2 (20 minutes): draw your dream home and what is near it, then a partner from another table interviews you. Support is on the touch screens during both table tasks. Nothing is printed. It is a dream home so nobody has to share where they really live.","objectives":["Name places near home: park, shop, mosque, church, doctor''s.","Say where I live with I live near a ...: I live near a park.","Describe it with busy, quiet, noisy, clean and dirty, in a partner interview: It''s quiet."],"verify_before_teaching":["Nothing is printed. Learners write on the whiteboard tables at steps 2, 13 and 17, so every learner needs a pen and the tables need wiping first.","The two table tasks are about 15 and 20 minutes (two rounds of 6 and a half minutes, then two rounds of 9 minutes, one minute to move). The touch screens hold the support: the places picture dictionary at step 13, the interview questions at step 17.","The BBC home town video''s captions were read in full; the cut (0:07 to 1:36) is two speakers, Brighton and Petworth. It uses ''There''s a ...'', which learners only need to understand.","The BBC places video has no captions, so its ten words were read from still frames: hospital, school, supermarket, office, restaurant, bus station, post office, petrol station, cinema, park. Watch it once before teaching.","Three slides were made in Canva (cover, I live near, interview) and three from free stock photos (places, busy or quiet guess, It''s ...). Check them in the preview.","Two Wordwalls found through Google: ''My area'' (Match up with UK photos, including a mosque and a GP surgery) and ''My neighbourhood'' (Find the match, twelve photos). A ''Describe where I live'' Unjumble was checked and left out: most of its sentences are above Entry 1.","The whole class moves twice: to the touch screens at step 10 and back at step 13. At step 18 one person per table goes to a screen.","If the same group did ''My Dream Home'' in the morning, Table task 2 can carry on from that dream home."],"safety_note":null,"media_requests":[],"brief":{"topic":"Me and my home: my neighbourhood","level":"Entry 1","department":"Adult Skills","three_screens":true},"run_sheet":[{"slot_index":0,"teacher_says":"Point at the picture: a park, a shop, a mosque, a church. Then ask: where is your dream home? Near the sea? Near a park? In a big city? Take any word, any gesture, any language.","watch_for":"Learners: standing at the tables, each with a pen. Do not teach yet. Note two or three answers: this question comes back at the end. Keep it to the DREAM home, so nobody has to share where they really live. Technique: open a question the lesson answers."},{"slot_index":1,"teacher_says":"Say this BEFORE the clip starts: two people. Where do they live? What is there? Write the town on your table.","watch_for":"Learners: at the tables, writing. BBC Easy English Conversations, 0:07 to 1:36. Sian: ''I live in Brighton ... there''s a beach, a university, a train station ... three cinemas, lots of shops and restaurants.'' Georgie: ''I''m from Petworth ... there''s a school, a park and a market.'' It stops by itself. Technique: a watching task written on the table."},{"slot_index":2,"teacher_says":"Where does Sian live? Brighton. Where does Georgie live? Petworth. Brighton is big. Lots of people, lots of cars. Is it busy or quiet? Show with your hands: busy, hands up and wave; quiet, finger on your lips.","watch_for":"Learners: at the tables. A first taste of busy and quiet before they are taught: answers will vary, and that is the point. Brighton, busy. Petworth, a small town, quiet. Technique: predict before the teaching."},{"slot_index":3,"teacher_says":"Say this BEFORE the clip starts: ten places in a town. Say each one with the video.","watch_for":"Learners: at the tables. BBC ''Places: 10 Easy English Words'', 0:09 to 3:11: hospital, school, supermarket, office, restaurant, bus station, post office, petrol station, cinema, park, each with a photo and a sentence. The video has no captions, so these were read from still frames. Technique: say it as you see it."},{"slot_index":4,"teacher_says":"Twelve places. Say each one, the class repeats. Then: point at a picture, they say the place. Then ask: which of these is near our college?","watch_for":"Learners: at the tables. Park, shop, supermarket, mosque, church, school, bus stop, doctor''s, library, post office, café, hospital. Add places learners name that are not here (gurdwara, temple, market, gym) on the board. This picture stays on the touch screens in Table task 1. Technique: drill, then make it local."},{"slot_index":5,"teacher_says":"Say this BEFORE the clip starts: a picture comes, then the word. Shout the place BEFORE the video says it.","watch_for":"Learners: at the tables, standing. The Test yourself part of the same BBC video (3:11 to 5:24). Fast and fun. Technique: fast recall."},{"slot_index":6,"teacher_says":"Read with me: I live near a park. I live near a mosque and a shop. Then model for the college: Our college is near a ___. Then chain round each table: everyone says one ''I live near a ...'' sentence about their dream home.","watch_for":"Learners: at the tables. Drill the whole sentence, with ''a'' (I live near a park, not ''near park''). ''An'' before a vowel is a stretch: near an office. Every learner says one sentence. Technique: model, then a chain round the table."},{"slot_index":7,"teacher_says":"No words yet. Act it out: a busy street (push through a crowd), noisy (hands over ears), quiet (finger on lips), clean (sweep), dirty (hold your nose). Learners show the number on their fingers.","watch_for":"Learners: at the tables. Six photos, numbered: 1 busy market, 2 quiet street, 3 noisy traffic, 4 quiet park, 5 clean street, 6 dirty street with rubbish. Mime in a random order. Technique: act it out, learners predict before the words appear."},{"slot_index":8,"teacher_says":"Say each word with the action, the class repeats: busy, quiet, noisy, clean, dirty. Then the sentence: It''s busy. It''s quiet. Then: I live near a market. It''s busy!","watch_for":"Learners: at the tables. Two opposite pairs (busy / quiet, clean / dirty) and noisy. Point out that a place can be busy AND noisy. Then say clearly: now walk to the touch screens. Technique: words with actions, then join them to ''I live near''."},{"slot_index":9,"teacher_says":"At the screen, take turns. Everyone at your screen says the place before it goes on the picture.","watch_for":"Learners: at the touch screens, half the class at each. This trip covers three steps. New words: GP surgery (the doctor''s), pharmacy (the chemist), bank, bus service. Waiting learners say ''I live near a ___'' to the person next to them. Technique: a game in learners'' hands."},{"slot_index":10,"teacher_says":"A word comes at the top. Read it out loud together, then tap the picture.","watch_for":"Learners: at the touch screens. Three lives, so a wrong tap costs one: talk first, tap second. ''Block of flats'' is new. Technique: read and recognise, under a little time pressure."},{"slot_index":11,"teacher_says":"Read each question and every answer aloud. Talk to the person next to you, then one person taps.","watch_for":"Learners: at the touch screens. Question 4 is the odd one out: noisy describes a place, it is not a place. Question 5 checks the key word near. Then say clearly: back to your tables. Technique: mixed question shapes, true or false and odd one out."},{"slot_index":12,"teacher_says":"Draw a model on the board first: a road, a house called MY HOME, a park and a mosque next to it. ''I live near a park. I live near a mosque. It''s quiet.'' Then: your table, draw your street. Need a word? Walk to the touch screens.","watch_for":"Learners: at the tables, with the places picture dictionary on both touch screens to look up. TABLE TASK 1, about 15 minutes, written on the table, nothing printed. Support the slowest table first. A table that cannot yet write sentences labels the places; a table that finishes early adds ''It''s noisy because there is a ___''. Round 2: tables move one place, tick, add a place and a sentence. Technique: draw and label, then add to another table''s work."},{"slot_index":13,"teacher_says":"Go back to your own street. What did the other table add? Then one person from each table reads two sentences.","watch_for":"Learners: back at their own tables. Every table reads. Fix one common mistake together (often ''I live near park'', missing a). Technique: share the product out loud."},{"slot_index":14,"teacher_says":"Model with a volunteer. You ask: Where is your dream home? They answer: I live near a beach. You ask: Is it busy or quiet? They answer: It''s quiet. Swap. Then the whole class asks you, and you answer.","watch_for":"Learners: at the tables. The two questions for the interview. Drill the question intonation: busy (up) or quiet (down). Also ''What is near your home?'' for stronger learners. Technique: model with a volunteer before pairs try."},{"slot_index":15,"teacher_says":"Spin the wheel. One learner makes two sentences: I live near a market. It''s busy! Spin again, someone else.","watch_for":"Learners: at the tables. Four or five spins, a different learner each time. A good answer joins a place and a describing word that fits: a market is busy, a park is quiet. Technique: practise both sentences before the interview."},{"slot_index":16,"teacher_says":"Round 1: everyone draws their OWN dream home and what is near it, in their own space on the table: by the sea, near a big park, in the city centre. Two or three sentences. Round 2: find a partner from another table, go to their drawing and interview them. Write one thing next to their drawing: ''Yusuf lives near a beach. It''s quiet.''","watch_for":"Learners: at the tables, with the interview questions on both touch screens to look up. TABLE TASK 2, about 20 minutes, the proof of all three objectives: places named, ''I live near a ...'', and busy / quiet in a partner interview. If the class also did the ''My dream home'' lesson this morning, they can add the dream home''s street to it. Listen for ''near a'' and full answers (''It''s quiet'', not just ''quiet''). Stretch: ''lives near'' about the partner, and ''because''. Support the slowest pairs first. Technique: create, then a partner interview about it."},{"slot_index":17,"teacher_says":"Back to your own table. One person types one or two sentences about their partner.","watch_for":"Learners: back at their own tables. One runner per table goes to a screen. Read each post aloud and ask: busy or quiet? Would you like to live there? ''I live near'' is fine too. Technique: capture the product, send a runner, not the room."},{"slot_index":18,"teacher_says":"The first question again: where is your dream home? Three or four volunteers: I live near a ___. It''s ___.","watch_for":"Learners: at the tables. At the start they gave one word. Now they give two sentences: say so. Technique: close the loop on the opening question."}]}'::jsonb
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
  -- 1 · Where is your dream home? (3 min)
  (0, 'Where is your dream home?', 'Launch', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-area/cover.jpg","file_name":"cover.jpg"}',
    null),

  -- 2 · Video: where do you live? (3 min)
  (1, 'Video: where do you live?', 'Launch', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=on_1sS6Ii8M&start=7&end=96"}',
    '{"type":"text_slide","text":"Where does she live?\nWhere does he live?","size":"xl"}'),

  -- 3 · Brighton or Petworth? (2 min)
  (2, 'Brighton or Petworth?', 'Launch', 2, 'screen1_continue',
    '{"type":"text_slide","text":"Brighton: big\nPetworth: small\n\nBusy or quiet?","size":"xl","title":"Where do they live?"}',
    null),

  -- 4 · Video: 10 places (3 min)
  (3, 'Video: 10 places', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=OUr5Vubhzdg&start=9&end=191"}',
    '{"type":"text_slide","text":"Watch.\nSay the place.","size":"xl"}'),

  -- 5 · Near my home (4 min)
  (4, 'Near my home', 'Establish', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-area/places.jpg","file_name":"places.jpg"}',
    null),

  -- 6 · Video: test yourself (3 min)
  (5, 'Video: test yourself', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=OUr5Vubhzdg&start=191&end=324"}',
    '{"type":"text_slide","text":"Say the place\nbefore the video!","size":"xl"}'),

  -- 7 · I live near a ... (5 min)
  (6, 'I live near a ...', 'Establish', 5, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-area/near.jpg","file_name":"near.jpg"}',
    null),

  -- 8 · Busy or quiet? Guess (3 min)
  (7, 'Busy or quiet? Guess', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-area/busy-quiet-guess.jpg","file_name":"busy-quiet-guess.jpg"}',
    null),

  -- 9 · It's ... (4 min)
  (8, 'It''s ...', 'Establish', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-area/busy-quiet.jpg","file_name":"busy-quiet.jpg"}',
    null),

  -- 10 · Wordwall: my area (5 min)
  (9, 'Wordwall: my area', 'Apply', 5, 'screen1_continue',
    '{"type":"text_slide","text":"Find the word.\nPut it on the picture.","size":"xl","title":"My area"}',
    '{"type":"embed","url":"https://wordwall.net/embed/b408b058935e40a59b8ce454abcc95ca?themeId=1&templateId=3&fontStackId=0","description":"Wordwall ''My area'', a Match up with real UK photos: drag each word onto its picture. Thirteen places over more than one page: post office, restaurant, park, bank, school, GP surgery, mosque, church, shops, pharmacy, supermarket, bus service, train station."}'),

  -- 11 · Wordwall: find the place (4 min)
  (10, 'Wordwall: find the place', 'Apply', 4, 'screen1_continue',
    '{"type":"text_slide","text":"Read the word.\nTap the picture.","size":"xl","title":"My neighbourhood"}',
    '{"type":"embed","url":"https://wordwall.net/embed/7329d5a0a05b4944aa6fe6ed666e55c3?themeId=1&templateId=46&fontStackId=0","description":"Wordwall ''My neighbourhood'', a Find the match game: a word appears at the top; tap its photo. Twelve places: a bank, a block of flats, a bus stop, a café, a church, a market, a mosque, a park, a petrol station, a post office, a school, a supermarket."}'),

  -- 12 · Busy or quiet? (4 min)
  (11, 'Busy or quiet?', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"You see a doctor at the ...","options":["doctor''s","park","library"],"correct":0},{"type":"true_or_false","text":"A market is busy.","correct_tf":true},{"type":"multiple_choice","text":"Lots of cars, lots of people. It''s ...","options":["quiet","busy","clean"],"correct":1},{"type":"multiple_choice","text":"Which one is NOT a place?","options":["mosque","noisy","school"],"correct":1},{"type":"multiple_choice","text":"I live ___ a park.","options":["near","in","on"],"correct":0}]}',
    null),

  -- 13 · Table task 1: Our street (14 min)
  (12, 'Table task 1: Our street', 'Apply', 14, 'screen1_continue',
    '{"type":"rotation_timer","label":"Our street","details":"Round 1: Draw a street on your table. Draw a house: MY HOME. Draw 5 places near it. Write: I live near a ___. It''s busy / quiet.\nRound 2: Move to the next table. Read. Tick the right ones. Add 1 place and 1 sentence in a different colour.","rounds":2,"round_secs":390,"move_secs":60,"move_text":"Move to the next table. Take your pen."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-area/places.jpg","file_name":"places.jpg"}'),

  -- 14 · Read one sentence (2 min)
  (13, 'Read one sentence', 'Apply', 2, 'screen1_continue',
    '{"type":"text_slide","text":"I live near a ___.\nIt''s ___.","size":"xl","title":"Read one sentence"}',
    null),

  -- 15 · The interview questions (4 min)
  (14, 'The interview questions', 'Apply', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-area/interview.jpg","file_name":"interview.jpg"}',
    null),

  -- 16 · Spin: I live near a ... (3 min)
  (15, 'Spin: I live near a ...', 'Apply', 3, 'screen1_continue',
    '{"type":"wheel_spinner","prompt":"Say: I live near a ... It''s busy / quiet.","items":["park","market","mosque","beach","bus stop","supermarket","church","school"]}',
    null),

  -- 17 · Table task 2: My dream street (19 min)
  (16, 'Table task 2: My dream street', 'Demonstrate', 19, 'screen1_continue',
    '{"type":"rotation_timer","label":"My dream street","details":"Round 1: Draw your dream home on the table. Draw what is near it. Write: I live near a ___. It''s ___.\nRound 2: Find a partner from another table. Ask: Where is your dream home? Is it busy or quiet? Write one thing about your partner. Then swap.","rounds":2,"round_secs":540,"move_secs":60,"move_text":"Find a partner from another table. Take your pen."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-area/interview.jpg","file_name":"interview.jpg"}'),

  -- 18 · Our dream streets (3 min)
  (17, 'Our dream streets', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"Our dream streets","question":"One person from each table: type about your partner''s dream home.\nExample: Yusuf lives near a beach. It''s quiet."}',
    null),

  -- 19 · Where is your dream home? (2 min)
  (18, 'Where is your dream home?', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-area/cover.jpg","file_name":"cover.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
