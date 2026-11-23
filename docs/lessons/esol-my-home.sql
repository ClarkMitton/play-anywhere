-- ─────────────────────────────────────────────────────────────
-- ESOL ME AND MY HOME: MY DREAM HOME · 90 minutes · 20 steps · ESOL Entry 1
-- Me and my home, lesson 1 (Wednesday 25 November). Two BBC Learning English
-- videos, three Canva slides, three photo slides, two Wordwalls.
-- No printing: learners write and draw on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The pictures are in the app's media storage (lesson-media/lessons/esol-my-home/),
-- so they show straight away. Copies are kept in public/lessons/esol-my-home/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Me and My Home: My Dream Home',
    '90 minutes for ESOL Entry 1: rooms, furniture, There is a ... in the ..., and I have ... / Do you have a ...? about a dream home. Two BBC Learning English videos, Canva slides, two Wordwalls and two whiteboard table tasks, ending in a partner interview about each learner''s dream home. No printing needed.',
    90, false, true, now(),
    '{"rationale":"One question runs through the lesson: what''s in your dream home? Learners answer with a word at the start and with ''I have'' and ''There is'' sentences at the end. Georgie''s empty house (BBC) is the hook and the model: she needs furniture room by room. Rooms are guessed from mimes before they are named, furniture is taught with a BBC video and a photo dictionary, and ''There is a ... in the ...'' is practised on two Wordwalls and in Table task 1 (each table is a room, 15 minutes). Then ''I have ...'' and ''Do you have a ...?'' for a dream home, a spinner to practise the question, and Table task 2 (20 minutes): draw your dream home, then a partner from another table interviews you. Support is on the touch screens during both table tasks. Nothing is printed. It is a dream home so nobody has to describe a home they may not want to talk about.","objectives":["Name rooms and furniture: kitchen, bedroom, sofa, wardrobe.","Say what is in a room: There is a bed in the bedroom.","Describe my dream home with I have, and ask Do you have a ...? in a partner interview."],"verify_before_teaching":["Nothing is printed. Learners write on the whiteboard tables at steps 2, 8, 9, 14 and 18, so every learner needs a pen and the tables need wiping first. At step 14 write a room name on each table before the timer.","The two table tasks are about 15 and 20 minutes (two rounds of 6 and a half minutes, then two rounds of 9 minutes, one minute to move). The touch screens hold the support: the furniture picture dictionary at step 14, the interview questions at step 18.","The Georgie video''s captions were read in full. Georgie says ''I''ve got'' (= I have); the lesson teaches ''I have''. The cuts skip the worksheet and playlist adverts in the middle (1:17 to 1:29 and 3:20 to 3:38).","The BBC furniture video has no captions, so its ten words were read from still frames: sofa, armchair, bed, wardrobe, chest of drawers, dining table, cot, coffee table, stool, shelves. Watch it once before teaching.","Three slides were made in Canva (cover, There is, My dream home) and three were made from free stock photos (rooms guess, rooms, furniture). Check them in the preview.","Two Wordwalls found through Google: ''E1 furniture'' (photo Match up, with sound) and ''There is there are furniture'' (Unjumble, eleven sentences, the last five with ''There are some''). A third, a rooms labelled diagram (wordwall.net/resource/10306884), is a spare if a group finishes early.","The whole class moves twice: to the touch screens at step 11 and back at step 14. At step 19 one person per table goes to a screen."],"safety_note":null,"media_requests":[],"brief":{"topic":"Me and my home: rooms, furniture and my dream home","level":"Entry 1","department":"Adult Skills","three_screens":true},"run_sheet":[{"slot_index":0,"teacher_says":"Point at the picture: a living room, a sofa, a big window, a garden. Then ask: what''s in your dream home? A big kitchen? A garden? Take any word, any gesture, any language.","watch_for":"Learners: standing at the tables, each with a pen. Do not teach yet. Note two or three answers on the board: this question comes back at the end, with full sentences. Keep it to the DREAM home, so nobody has to talk about a home they may not want to describe. Technique: open a question the lesson answers."},{"slot_index":1,"teacher_says":"Say this BEFORE the clip starts: this is Georgie''s new house. It is empty! What does she need? Write it on your table, any spelling.","watch_for":"Learners: at the tables, writing. BBC Easy English Conversations, 0:00 to 1:16: the living room is empty, and Georgie says ''I need a sofa ... a bookshelf ... a TV ... and a rug'', then ''So I''ve got a sofa, a bookshelf, a TV and a rug in my living room.'' It stops by itself. Ask: what does she need? Answers: sofa, bookshelf, TV, rug. Say once: I''ve got = I have. Technique: a watching task written on the table."},{"slot_index":2,"teacher_says":"No words yet. Act it out: sleep, cook, have a bath, watch TV, eat dinner, water the flowers. Learners show the number on their fingers.","watch_for":"Learners: at the tables. Six photos, numbered: 1 living room, 2 bedroom, 3 kitchen, 4 bathroom, 5 dining room, 6 garden. Mime in a random order. Any word in any language is fine. Technique: act it out, learners predict before the words appear."},{"slot_index":3,"teacher_says":"Say each room, the class repeats: living room, bedroom, kitchen, bathroom, dining room, garden. Then you say a number, they say the room.","watch_for":"Learners: at the tables. Check the guesses. Drill the stress: LIVing room, BEDroom, KITchen, BATHroom. Technique: reveal, then choral drill."},{"slot_index":4,"teacher_says":"Say this BEFORE the clip starts: ten words for things in a home. Say each word with the video.","watch_for":"Learners: at the tables. BBC ''Furniture: 10 Easy English Words'', 0:09 to 3:11, one word with a photo and a sentence each: sofa, armchair, bed, wardrobe, chest of drawers, dining table, cot, coffee table, stool, shelves. Pause if you need to. Point out cot (a baby''s bed) and stool. The video has no captions, so these were read from still frames. Technique: say it as you see it."},{"slot_index":5,"teacher_says":"Twelve words. Say each one, the class repeats. Then: point at a picture, they say the word. Then ask: which room? Sofa? Living room!","watch_for":"Learners: at the tables. Sofa, armchair, bed, wardrobe, table, chair, fridge, cooker, shower, toilet, TV, lamp. This is the picture dictionary that stays on the touch screens in Table task 1. Cooker (UK) is the same as oven and hob. Technique: drill, then answer from a cue."},{"slot_index":6,"teacher_says":"Say this BEFORE the clip starts: a picture comes, then the word. Shout the word BEFORE the video says it.","watch_for":"Learners: at the tables, standing. The Test yourself part of the same BBC video (3:11 to 5:24): the same ten things in a new order. Fast and fun. Technique: fast recall."},{"slot_index":7,"teacher_says":"Say this BEFORE the clip starts: write BEDROOM, DINING ROOM, KITCHEN on your table. Listen. What does Georgie need in each room? Write it under the room.","watch_for":"Learners: at the tables, writing in three columns. 1:30 to 3:20. Bedroom: bed, lamp, bedside table, wardrobe. Dining room: table, four chairs, some drawers. Kitchen: fridge, some cupboards, an oven, a microwave. Pause between rooms if tables need time. It stops by itself. Technique: a watching task written on the table."},{"slot_index":8,"teacher_says":"Say this BEFORE the clip starts: now a quiz. Look at your table. Say the answer BEFORE the video says it. Tick it on your table if you were right.","watch_for":"Learners: at the tables. 3:39 to 6:02: ''What''s this room?'' four times, then ''What has Georgie got in her bedroom?'' ''She''s got a bed, a lamp ...''. There is a pause before each answer: that is the class''s turn. Technique: answer from your own notes, then self-check."},{"slot_index":9,"teacher_says":"Read with me: There is a sofa in the living room. There is a bed in the bedroom. Then you say a thing, a table says the sentence: Fridge? There is a fridge in the kitchen.","watch_for":"Learners: at the tables. Drill the whole sentence, not just the word. Go round every table once. Then say clearly: now walk to the touch screens. Technique: model, then make a sentence from a cue."},{"slot_index":10,"teacher_says":"At the screen, take turns. Tap the speaker to hear the word. Everyone at your screen says the word before it goes on the picture.","watch_for":"Learners: at the touch screens, half the class at each. This trip covers three steps. Bunk beds and rug are new: point at them. Waiting learners say ''There is a ___ in the ___'' to the person next to them. Technique: a game in learners'' hands, with sound."},{"slot_index":11,"teacher_says":"Put the words in order. Read the sentence out loud when it is right.","watch_for":"Learners: at the touch screens. The first six are ''There is a ...''; the last five are ''There are some ...'' (curtains, flowers, cushions, towels, cupboards). Say once: one thing, there is; many things, there are some. The big word with a capital letter starts the sentence. Technique: build the sentence, then say it."},{"slot_index":12,"teacher_says":"Read each question and every answer aloud. Talk to the person next to you, then one person taps.","watch_for":"Learners: at the touch screens. Question 4 is the odd one out: kitchen is a room, not furniture. Then say clearly: back to your tables. Technique: mixed question shapes, true or false and odd one out."},{"slot_index":13,"teacher_says":"Before the timer: write a room on each table in big letters: LIVING ROOM, BEDROOM, KITCHEN, BATHROOM (and DINING ROOM if you have five tables). Show a model on the board: a box for a kitchen, a fridge and a cooker drawn in it, ''There is a fridge in the kitchen.'' Then: draw your room. Need a word? Walk to the touch screens.","watch_for":"Learners: at the tables, with the picture dictionary (all twelve words) on both touch screens to look up. TABLE TASK 1, about 15 minutes, written on the table, nothing printed. Walk round and support the slowest table first. A table that cannot yet write sentences labels the drawing; a table that finishes early writes ''There are some ___ in the ___''. Round 2: tables move one place, tick what is right and add two things in a different colour. Technique: tables as stations, then add to another table''s work."},{"slot_index":14,"teacher_says":"Go back to your own room. What did the other table add? Then one person from each table reads your best sentence.","watch_for":"Learners: back at their own tables. Every table reads one sentence. Fix one common mistake together on the board (often ''There is bed'', missing a). Leave the rooms on the tables: they help in Table task 2. Technique: share the product out loud."},{"slot_index":15,"teacher_says":"Model your own dream home, with a big smile: I have a big garden. I have four bedrooms. I have a pool! Then ask a learner: Do you have a garden? Teach the answers: Yes, I do. No, I don''t. Drill the question with the whole class.","watch_for":"Learners: at the tables. The two sentence shapes for the interview: ''I have ...'' and ''Do you have a ...? Yes, I do. / No, I don''t.'' Also ''How many bedrooms do you have?'' for stronger learners. It is a DREAM home, so it can be as big and silly as they like. Technique: model with a volunteer before pairs try."},{"slot_index":16,"teacher_says":"Spin the wheel. The class asks one learner: Do you have a garden? The learner answers about their dream home: Yes, I do! I have a big garden. Spin again, ask someone else.","watch_for":"Learners: at the tables. Four or five spins, a different learner each time. A good answer adds a full sentence: ''Yes, I do. I have a big garden.'' Technique: practise the question before the interview."},{"slot_index":17,"teacher_says":"Draw your own dream home on the board quickly as the model, with three ''I have'' sentences. Round 1: everyone draws their OWN dream home on the table, in their own space. Round 2: find a partner from another table, go to their drawing and interview them. Write one thing your partner has next to their home: ''Ali has a pool.''","watch_for":"Learners: at the tables, the questions on both touch screens to look up. TABLE TASK 2, about 20 minutes, the proof of all three objectives: rooms and furniture labelled, ''I have'' sentences, and a partner interview with ''Do you have a ...?''. In round 2 listen for the question form and short answers; prompt ''Yes, I do'' rather than ''Yes''. Stretch: ''How many ___ do you have?'' and ''She has a ...'' when writing about the partner. Support the slowest pairs first. Technique: create, then a partner interview about it."},{"slot_index":18,"teacher_says":"Back to your own table. Which dream home was the best? One person types one sentence about their partner.","watch_for":"Learners: back at their own tables. One runner per table goes to a screen. Read each post aloud; the class guesses whose home it is. ''Has'' for he or she is a stretch: ''I have'' is fine too. Technique: capture the product, send a runner, not the room."},{"slot_index":19,"teacher_says":"The first question again: what''s in your dream home? Three or four volunteers: I have ... I have ... There is a ___ in the ___.","watch_for":"Learners: at the tables. At the start they gave one word. Now they give sentences: say so. Technique: close the loop on the opening question."}]}'::jsonb
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
  -- 1 · What's in your dream home? (3 min)
  (0, 'What''s in your dream home?', 'Launch', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-home/cover.jpg","file_name":"cover.jpg"}',
    null),

  -- 2 · Video: Georgie's empty house (3 min)
  (1, 'Video: Georgie''s empty house', 'Launch', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=Te-UyphkKRk&end=76"}',
    '{"type":"text_slide","text":"What does she need?\nWrite it on your table.","size":"xl"}'),

  -- 3 · Which room? Guess (3 min)
  (2, 'Which room? Guess', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-home/rooms-guess.jpg","file_name":"rooms-guess.jpg"}',
    null),

  -- 4 · Rooms (3 min)
  (3, 'Rooms', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-home/rooms.jpg","file_name":"rooms.jpg"}',
    null),

  -- 5 · Video: 10 furniture words (3 min)
  (4, 'Video: 10 furniture words', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=kbEOaIqBa2w&start=9&end=191"}',
    '{"type":"text_slide","text":"Watch.\nSay the word.","size":"xl"}'),

  -- 6 · In my home (3 min)
  (5, 'In my home', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-home/furniture.jpg","file_name":"furniture.jpg"}',
    null),

  -- 7 · Video: test yourself (3 min)
  (6, 'Video: test yourself', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=kbEOaIqBa2w&start=191&end=324"}',
    '{"type":"text_slide","text":"Say the word\nbefore the video!","size":"xl"}'),

  -- 8 · Video: Georgie, room by room (4 min)
  (7, 'Video: Georgie, room by room', 'Establish', 4, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=Te-UyphkKRk&start=90&end=200"}',
    '{"type":"text_slide","text":"Bedroom?\nDining room?\nKitchen?\nWhat does she need?","size":"xl"}'),

  -- 9 · Video: what has Georgie got? (3 min)
  (8, 'Video: what has Georgie got?', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=Te-UyphkKRk&start=219&end=362"}',
    '{"type":"text_slide","text":"Answer before\nthe video!","size":"xl"}'),

  -- 10 · There is a ... in the ... (3 min)
  (9, 'There is a ... in the ...', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-home/there-is.jpg","file_name":"there-is.jpg"}',
    null),

  -- 11 · Wordwall: furniture (5 min)
  (10, 'Wordwall: furniture', 'Apply', 5, 'screen1_continue',
    '{"type":"text_slide","text":"Find the word.\nPut it on the picture.","size":"xl","title":"Furniture"}',
    '{"type":"embed","url":"https://wordwall.net/embed/c02adc8f4a384088a1211780526aae0a?themeId=1&templateId=3&fontStackId=0","description":"Wordwall ''E1 furniture'', a Match up with real photos: drag each word onto its picture. Tap the speaker on a word to hear it. Twelve words: table, chair, sofa, rug, coffee table, lamp, armchair, television, bed, wardrobe, chest of drawers, bunk beds."}'),

  -- 12 · Wordwall: There is ... (4 min)
  (11, 'Wordwall: There is ...', 'Apply', 4, 'screen1_continue',
    '{"type":"text_slide","text":"Put the words\nin order.","size":"xl","title":"There is ..."}',
    '{"type":"embed","url":"https://wordwall.net/embed/f701f060af094fa7a71dc7eacd404769?themeId=1&templateId=72&fontStackId=0","description":"Wordwall ''There is there are furniture'', an Unjumble: drag the words into the right order. Eleven sentences, such as ''There is a bed in the bedroom.'', ''There is a cooker in the kitchen.'', ''There are some towels in the bathroom.''"}'),

  -- 13 · Which room? (4 min)
  (12, 'Which room?', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"There is a bed in the ...","options":["kitchen","bedroom","garden"],"correct":1},{"type":"true_or_false","text":"There is a fridge in the bathroom.","correct_tf":false},{"type":"multiple_choice","text":"Where is the shower?","options":["in the bathroom","in the living room","in the dining room"],"correct":0},{"type":"multiple_choice","text":"Which one is NOT furniture?","options":["sofa","kitchen","wardrobe"],"correct":1},{"type":"true_or_false","text":"There is a cooker in the kitchen.","correct_tf":true}]}',
    null),

  -- 14 · Table task 1: Room by room (14 min)
  (13, 'Table task 1: Room by room', 'Apply', 14, 'screen1_continue',
    '{"type":"rotation_timer","label":"Room by room","details":"Round 1: Your table is a ROOM. Draw it. Draw and label the furniture. Write 3 sentences: There is a ___ in the ___.\nRound 2: Move to the next table. Read. Tick the right ones. Add 2 things in a different colour.","rounds":2,"round_secs":390,"move_secs":60,"move_text":"Move to the next table. Take your pen."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-home/furniture.jpg","file_name":"furniture.jpg"}'),

  -- 15 · Read one sentence (2 min)
  (14, 'Read one sentence', 'Apply', 2, 'screen1_continue',
    '{"type":"text_slide","text":"There is a ___\nin the ___.","size":"xl","title":"Read one sentence"}',
    null),

  -- 16 · My dream home: I have ... (4 min)
  (15, 'My dream home: I have ...', 'Apply', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-home/dream.jpg","file_name":"dream.jpg"}',
    null),

  -- 17 · Spin: do you have a ...? (2 min)
  (16, 'Spin: do you have a ...?', 'Apply', 2, 'screen1_continue',
    '{"type":"wheel_spinner","prompt":"Ask: Do you have a ...?  Answer: Yes, I do. / No, I don''t.","items":["garden","big kitchen","swimming pool","TV in the bedroom","four bedrooms","two bathrooms","balcony","dining room"]}',
    null),

  -- 18 · Table task 2: My dream home (19 min)
  (17, 'Table task 2: My dream home', 'Demonstrate', 19, 'screen1_continue',
    '{"type":"rotation_timer","label":"My dream home","details":"Round 1: Draw your dream home on the table. Label the rooms and furniture. Write 3 sentences: I have ...\nRound 2: Find a partner from another table. Look at their dream home. Ask: Do you have a ...? How many bedrooms do you have? Then swap.","rounds":2,"round_secs":540,"move_secs":60,"move_text":"Find a partner from another table. Take your pen."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-home/dream.jpg","file_name":"dream.jpg"}'),

  -- 19 · Our dream homes (3 min)
  (18, 'Our dream homes', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"Our dream homes","question":"One person from each table: type one sentence about your partner''s dream home.\nExample: Amina has a big garden and four bedrooms."}',
    null),

  -- 20 · What's in your dream home? (2 min)
  (19, 'What''s in your dream home?', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-my-home/cover.jpg","file_name":"cover.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
