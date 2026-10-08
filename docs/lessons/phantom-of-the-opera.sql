-- ─────────────────────────────────────────────────────────────
-- Phantom of the Opera · escape the theatre
-- 45 minutes · 15 steps · ESOL Entry 2 · group work at the whiteboard tables
-- Needs the printed table packs: public/lessons/phantom-of-the-opera/printables.html
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Phantom of the Opera: Escape the Theatre',
    'An escape room for ESOL Entry 2. Learners are locked in the Paris Opera House with the Phantom and must read clues and follow instructions to escape before the chandelier falls. Cinematic clips on all screens, three puzzles at the whiteboard tables and a final riddle. Needs the printed table packs.',
    45,
    false,
    true,
    now(),
    '{"rationale":"The class is locked in the Paris Opera House with the Phantom. One idea runs through it: reading short clues and following instructions. Learners act out First, Next, Then, Finally before they see the words, then solve three table puzzles that each need a different reading skill: telling orders from facts, putting orders in sequence, and following place words on a map. The last riddle only works if they have understood all three, and the answer is typed to a shared board. Cinematic clips open the lesson, cover the one whole-class move, and close the story.","objectives":["Identify the instruction in a short note.","Put instructions in order using first, next, then and finally.","Follow directions that use place words such as next to, under, behind and in front of."],"run_sheet":[{"slot_index":0,"teacher_says":"Lights down, sound up. Welcome to the Opera House. Do not talk. Just watch and listen.","watch_for":"Learners: wherever they stand. Full focus, the same clip on all three screens. Close the blinds if you can. Technique: a cinematic hook that builds mood before any language is taught."},{"slot_index":1,"teacher_says":"Read the letter slowly, in a low voice. Then say: the doors are locked. How do we get out? We read the clues and we do what they say.","watch_for":"Learners: at the tables, envelopes closed. Ask: what is a clue? Take one or two answers. Technique: in role, opening the question the whole lesson answers."},{"slot_index":2,"teacher_says":"Do not show the screen yet. Say the four orders out loud with the order words, slowly. Learners do them. Then show the screen.","watch_for":"Learners: at the tables. Say each order, pause, and watch who copies. Then reveal the slide so they see the words they just acted on. Technique: act it out before being told (total physical response), then connect to the written words."},{"slot_index":3,"teacher_says":"Point to real things in the room. The pen is next to the board. The bin is under the table. Who is behind you? Who is in front of you?","watch_for":"Learners: at the tables. Use real objects first, then learners say one sentence each to their neighbour. Technique: teach the words with the room itself."},{"slot_index":4,"teacher_says":"Open envelope one. Some cards are orders. Some are just facts. Find the orders and put them in order. The circled letters make a secret word.","watch_for":"Learners: at the tables, in groups, everyone holding a card. The answer is MASK (answer sheet is page one of the pack). Watch for tables that include a fact card. Stretch: write one more order of your own using First, Next, Then or Finally. Technique: sort, sequence, then check another group''s work."},{"slot_index":5,"teacher_says":"Is your word MASK? If not, look at your cards again. Which order word was wrong?","watch_for":"Learners: at the tables. Do not explain; let tables fix their own order. Technique: self-check against the answer."},{"slot_index":6,"teacher_says":"Open envelope two. Put your finger on the dressing room. Read each direction. Follow it. Where do you finish?","watch_for":"Learners: at the tables. They finish in THE ORGAN, so code word two is ORGAN. Round 2 is the stretch for everyone: write directions to Box Five (it is above the dressing room) using place words. Technique: follow written directions on a map, then create directions for others."},{"slot_index":7,"teacher_says":"The Phantom takes you to the lake. Walk to the touch screens now, quietly, while the music plays. Half to each screen.","watch_for":"Learners: MOVE to the touch screens during the clip, watching the big screen as they walk. This is the first of two whole-class moves. Technique: use the music to cover the move."},{"slot_index":8,"teacher_says":"The guard asks three questions. Talk with your partner first. Then tap your answer.","watch_for":"Learners: at the touch screens, in pairs. Mixed question shapes on purpose: best answer, true or false, best answer. For question two, ask a learner to say why it is false. Technique: check understanding before the final task."},{"slot_index":9,"teacher_says":"Draw the way from the dressing room to Box Five. Then say your directions out loud to the room.","watch_for":"Learners: at the touch screens. Drawings appear on the big screen. Ask two learners to describe their route with next to, above, in front of. Keep this to a few minutes; then send everyone back. Technique: a visible product, learners explain in their own words."},{"slot_index":10,"teacher_says":"Quickly, back to your tables. The chandelier is shaking. One last envelope.","watch_for":"Learners: MOVE back to the tables. This is the second whole-class move. Wait for everyone to stand at a table before you start the timer."},{"slot_index":11,"teacher_says":"Open the last envelope. This is the Phantom''s last note. Read it together. Follow every order. Write what you say at the door.","watch_for":"Learners: at the tables, the whole group reading one note. The answer is ORGAN, MASK, then knock three times. Success criteria: your answer uses the room word first, the key word second, and the knock. Stretch box on the note: write a riddle note for another table. Technique: demonstrate learning with a product tested against criteria."},{"slot_index":12,"teacher_says":"One person from each table, go to a touch screen. Type exactly what your table says and does at the door.","watch_for":"Learners: one runner per table at the touch screens, everyone else stays put. Read the answers out. A correct one has ORGAN before MASK and the knock. Ask the room to check each one against the note. Technique: close the loop with a visible answer."},{"slot_index":13,"teacher_says":"If your words were right, you escaped. Watch what you missed.","watch_for":"Learners: wherever they stand. Full focus, the same clip on all three screens. Let the room react. Technique: a cinematic reward that closes the story."},{"slot_index":14,"teacher_says":"Last thing. How sure are you now that you can read instructions and follow them? Tap a face.","watch_for":"Learners: one runner per table at a touch screen, or everyone if you prefer. Ask two learners which clue was the hardest, and which order word helped most."}],"verify_before_teaching":["PRINT FIRST: open /lessons/phantom-of-the-opera/printables.html on the same web address as this app. Print pages 2 to 4 once for each table, cut the cards, and put each table''s set in an envelope marked 1, 2 or 3. Page 1 is your answer sheet.","Watch all three clips before the session. They were found by search and not played end to end: check they are the right clips, the sound works, and the trimmed endings (90, 100 and 60 seconds) cut at a good place. Change the numbers after end= in the link if not.","The Music of the Night clip is a live concert recording and may start with applause. Add &start=NN to the link to skip it.","Slides 1 to 5 were made with Canva''s AI (public/lessons/phantom-of-the-opera/). Check them on the big screen: the red line on the last slide is dark on black, and in the behind picture the key leans beside the mirror, so point at it and say behind the mirror. Slide 2 shows four adult learners: a woman in a hijab, an older Black man, a South Asian man and a white woman who uses a wheelchair.","The whole class moves twice: to the touch screens at step 8, and back to the tables at step 11. At step 13 only one person per table goes to a screen.","With only one or two tables, skip the move in Scenes 1 and 2 and have the table check its own work against the screen.","Check the Entry 2 reading level of each card against your group. Shorten any that are too long.","The shared board answers are saved. Read them afterwards in Admin, Data."],"safety_note":null,"brief":{"topic":"Phantom of the Opera escape room: reading clues and following instructions","level":"Entry 2","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · Curtain up (2 min)
  (0, 'Curtain up', 'Launch', 2, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=UTAj7TH08AM&end=90"}',
    null),

  -- 2 · A letter from the Phantom (2 min)
  (1, 'A letter from the Phantom', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"/lessons/phantom-of-the-opera/slide-01.jpg","file_name":"slide-01.jpg"}',
    null),

  -- 3 · Act it out (2 min)
  (2, 'Act it out', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"/lessons/phantom-of-the-opera/slide-02.jpg","file_name":"slide-02.jpg"}',
    null),

  -- 4 · Where is it? (1 min)
  (3, 'Where is it?', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"/lessons/phantom-of-the-opera/slide-03.jpg","file_name":"slide-03.jpg"}',
    null),

  -- 5 · Scene 1: The dressing room (8 min)
  (4, 'Scene 1: The dressing room', 'Apply', 8, 'screen1_continue',
    '{"type":"rotation_timer","label":"Scene 1: The dressing room","details":"Round 1: Open envelope 1. Find the four orders. Put them in order. Write the secret word on the table.\nRound 2: Move on. Check the next table. Do you agree?","rounds":2,"round_secs":210,"move_secs":30,"move_text":"Move to the next table. Take nothing with you."}',
    null),

  -- 6 · Code word one (1 min)
  (5, 'Code word one', 'Apply', 1, 'screen1_continue',
    '{"type":"image","url":"/lessons/phantom-of-the-opera/slide-04.jpg","file_name":"slide-04.jpg"}',
    null),

  -- 7 · Scene 2: The map (8 min)
  (6, 'Scene 2: The map', 'Apply', 8, 'screen1_continue',
    '{"type":"rotation_timer","label":"Scene 2: The map of the theatre","details":"Round 1: Open envelope 2. Start in the dressing room. Follow the three directions with your finger. Write the room where you finish.\nRound 2: Move on. Check the next table. Then write directions from the dressing room to Box Five.","rounds":2,"round_secs":210,"move_secs":30,"move_text":"Move to the next table. Take nothing with you."}',
    null),

  -- 8 · Scene 3: The lake (2 min)
  (7, 'Scene 3: The lake', 'Apply', 2, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=3X-u7Qvh1JE&end=100"}',
    null),

  -- 9 · Scene 3: The guard's questions (3 min)
  (8, 'Scene 3: The guard''s questions', 'Apply', 3, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"The Phantom says: Say the first word. Do not say the second word. The words are MASK and ORGAN. What do you say?","options":["MASK","ORGAN","MASK and ORGAN"],"correct":0},{"type":"true_or_false","text":"The Phantom says: First, say ORGAN. Then, say MASK. So you say MASK first.","correct_tf":false},{"type":"multiple_choice","text":"The door is next to the stage. The key is under the door. Where is the key?","options":["Under the door","Next to the stage","Under the stage"],"correct":0}]}',
    null),

  -- 10 · Draw the way to Box Five (3 min)
  (9, 'Draw the way to Box Five', 'Apply', 3, 'screen1_continue',
    '{"type":"whiteboard","title":"Draw the way: dressing room to Box Five"}',
    null),

  -- 11 · Back to the tables (1 min)
  (10, 'Back to the tables', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"image","url":"/lessons/phantom-of-the-opera/slide-05.jpg","file_name":"slide-05.jpg"}',
    null),

  -- 12 · Scene 4: The last riddle (6 min)
  (11, 'Scene 4: The last riddle', 'Demonstrate', 6, 'screen1_continue',
    '{"type":"countdown_timer","label":"Scene 4: The Phantom''s last riddle\nOpen envelope 3. Read the note. Follow every order. Write on the table exactly what you say and do at the door.","duration_secs":360}',
    null),

  -- 13 · Say it to the door (2 min)
  (12, 'Say it to the door', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"padlet","title":"Say it to the door","question":"One person from each table: type exactly what your table says and does at the door."}',
    null),

  -- 14 · The chandelier falls (2 min)
  (13, 'The chandelier falls', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=Uwn2gA_P44s&end=60"}',
    null),

  -- 15 · How sure are you? (2 min)
  (14, 'How sure are you?', 'Demonstrate', 2, 'screen2_submit',
    '{"type":"confidence_checker","prompt":"How sure are you that you can follow written instructions in English?","scale_mode":"emoji","max":5}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
