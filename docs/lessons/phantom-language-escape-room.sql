-- ─────────────────────────────────────────────────────────────
-- Phantom of the Opera · language escape room (image sheets)
-- 17 steps · whiteboard challenges on the touch screens
-- Pictures and the music loop live in lesson-media/lessons/phantom-escape-room/
-- (already uploaded). The music is read from ai_notes.ambient_url and plays on
-- the Host, pausing during the two video clips. Needs the app update that
-- adds the background music player.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Phantom of the Opera: Language Escape Room',
    'Help Raoul save Christine. Six language challenges are written on at the touch screens, each one earns a clue, and the clues come together at the end. Opens with the trailer, ends with the chandelier crash, with organ music in the background.',
    41,
    false,
    true,
    now(),
    '{"rationale": "An escape-room style language lesson. The class helps Raoul save Christine by solving six language challenges (definitions, synonyms, antonyms, present simple, past simple and mixed grammar). Each challenge is shown on the big screen and written on over the sheet on the touch screens, then earns a clue. All six clues come together in the last task. It opens with the trailer and ends with the chandelier crash, with quiet organ music under the picture slides.", "objectives": ["Use topic vocabulary, synonyms and antonyms correctly.", "Choose and write the correct present and past simple verb forms.", "Combine clues to solve a final task."], "run_sheet": [{"slot_index": 0, "teacher_says": "Lights down, sound up. Welcome to the Opera House. Just watch and listen.", "watch_for": "Everyone watching the big screen, same clip on all three. The music track pauses itself while the clip plays."}, {"slot_index": 1, "teacher_says": "Read the title together. Who has heard of the Phantom of the Opera?", "watch_for": "Take one or two answers. The ambient organ music comes back under the picture."}, {"slot_index": 2, "teacher_says": "Read Raoul''s letter slowly, in a low voice. Christine is in danger. We must solve the puzzles to save her.", "watch_for": "Ask: what does Raoul want us to do? Close the question the whole lesson answers."}, {"slot_index": 3, "teacher_says": "Circle the word with the correct meaning for each. Say the words out loud. Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 1 is AVS."}, {"slot_index": 4, "teacher_says": "Clue earned. Write the letters down: AVS.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 5, "teacher_says": "Choose the correct synonym for each word. Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 2 is EC."}, {"slot_index": 6, "teacher_says": "Clue earned. Write the letters down: EC.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 7, "teacher_says": "Choose the best antonym. There may be two or three. Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 3 is HIR."}, {"slot_index": 8, "teacher_says": "Clue earned. Write the letters down: HIR.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 9, "teacher_says": "Choose the correct verb form. Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 4 is ST."}, {"slot_index": 10, "teacher_says": "Clue earned. Write the letters down: ST.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 11, "teacher_says": "Complete with the correct Past Simple form. Regular or irregular? Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 5 is NIE."}, {"slot_index": 12, "teacher_says": "Clue earned. Write the letters down: NIE.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 13, "teacher_says": "Present or past? Correct the mistake if there is one. Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 6 is NOW."}, {"slot_index": 14, "teacher_says": "Clue earned. Write the letters down: NOW.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 15, "teacher_says": "The chandelier is shaking. Put all the clues together and write the secret on the touch screen.", "watch_for": "Learners write all six clues (AVS, EC, HIR, ST, NIE, NOW) and try to work out the final word or phrase. Check what they send to the big screen."}, {"slot_index": 16, "teacher_says": "If your answer was right, you escaped. Watch what you missed.", "watch_for": "Full focus on the clip, all three screens. Let the room react. It ends the lesson."}], "verify_before_teaching": ["The background music is a generated organ loop (ambient-organ.wav) and plays on the Host after the first click or keypress. It pauses during the two clips.", "Watch both clips before the session: trailer UTAj7TH08AM and chandelier cQpJRWY4Nrs.", "Work out the final answer from the clues AVS, EC, HIR, ST, NIE, NOW and check the order before teaching.", "Clue letters in the images should be checked against your answer sheet."], "safety_note": null, "brief": {"topic": "Phantom of the Opera escape room: language challenges", "level": "Entry 2", "department": "Adult Skills", "three_screens": true}, "ambient_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/ambient-organ.wav"}'::jsonb
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
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=UTAj7TH08AM"}',
    null),

  -- 2 · The Phantom of the Opera (1 min)
  (1, 'The Phantom of the Opera', 'Launch', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p01.jpg", "file_name": "p01.jpg"}',
    null),

  -- 3 · A letter from Raoul (2 min)
  (2, 'A letter from Raoul', 'Launch', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p02.jpg", "file_name": "p02.jpg"}',
    null),

  -- 4 · Challenge 1: Phantom definitions (4 min)
  (3, 'Challenge 1: Phantom definitions', 'Establish', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 1: Phantom definitions", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p03.jpg", "file_name": "p03.jpg"}',
    null),

  -- 5 · Clue 1 earned (1 min)
  (4, 'Clue 1 earned', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p04.jpg", "file_name": "p04.jpg"}',
    null),

  -- 6 · Challenge 2: Synonyms (4 min)
  (5, 'Challenge 2: Synonyms', 'Establish', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 2: Synonyms", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p05.jpg", "file_name": "p05.jpg"}',
    null),

  -- 7 · Clue 2 earned (1 min)
  (6, 'Clue 2 earned', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p06.jpg", "file_name": "p06.jpg"}',
    null),

  -- 8 · Challenge 3: Antonyms (4 min)
  (7, 'Challenge 3: Antonyms', 'Apply', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 3: Antonyms", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p07.jpg", "file_name": "p07.jpg"}',
    null),

  -- 9 · Clue 3 earned (1 min)
  (8, 'Clue 3 earned', 'Apply', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p08.jpg", "file_name": "p08.jpg"}',
    null),

  -- 10 · Challenge 4: Present Simple (4 min)
  (9, 'Challenge 4: Present Simple', 'Apply', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 4: Present Simple", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p09.jpg", "file_name": "p09.jpg"}',
    null),

  -- 11 · Clue 4 earned (1 min)
  (10, 'Clue 4 earned', 'Apply', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p10.jpg", "file_name": "p10.jpg"}',
    null),

  -- 12 · Challenge 5: Past Simple (4 min)
  (11, 'Challenge 5: Past Simple', 'Apply', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 5: Past Simple", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p11.jpg", "file_name": "p11.jpg"}',
    null),

  -- 13 · Clue 5 earned (1 min)
  (12, 'Clue 5 earned', 'Apply', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p12.jpg", "file_name": "p12.jpg"}',
    null),

  -- 14 · Challenge 6: The ultimate grammar mission (4 min)
  (13, 'Challenge 6: The ultimate grammar mission', 'Demonstrate', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 6: The ultimate grammar mission", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p13.jpg", "file_name": "p13.jpg"}',
    null),

  -- 15 · Clue 6 earned (1 min)
  (14, 'Clue 6 earned', 'Demonstrate', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p14.jpg", "file_name": "p14.jpg"}',
    null),

  -- 16 · Hurry up! Put the clues together (4 min)
  (15, 'Hurry up! Put the clues together', 'Demonstrate', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Put all the clues together", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/p15.jpg", "file_name": "p15.jpg"}',
    null),

  -- 17 · The chandelier falls (2 min)
  (16, 'The chandelier falls', 'Demonstrate', 2, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=cQpJRWY4Nrs"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
