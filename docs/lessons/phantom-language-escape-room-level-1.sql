-- ─────────────────────────────────────────────────────────────
-- Phantom of the Opera · language escape room, LEVEL 1 (image sheets)
-- 17 steps · whiteboard challenges on the touch screens
-- Pictures and the music loop live in lesson-media/lessons/phantom-level-1/
-- (already uploaded; the music loop is shared with the Entry 2 version). The music is read from ai_notes.ambient_url and plays on
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
    'Phantom of the Opera: Language Escape Room (Level 1)',
    'Help Raoul save Christine. Level 1 version. Six language challenges (vocabulary, synonyms, odd one out and tenses) are written on at the touch screens, each one earns a clue, and the clues come together at the end. Opens with the trailer, ends with the chandelier crash, with organ music in the background.',
    41,
    false,
    true,
    now(),
    '{"rationale": "The Level 1 version of the Phantom language escape room. The class helps Raoul save Christine by solving six language challenges (vocabulary match, synonyms, odd one out, present simple or continuous, past simple or present perfect, and mixed tenses). Each challenge is shown on the big screen and written on over the sheet on the touch screens, then earns a clue. All six clues come together in the last task. It opens with the trailer and ends with the chandelier crash, with quiet organ music under the picture slides.", "objectives": ["Match topic vocabulary to meanings and synonyms, and explain an odd one out.", "Choose between present simple, present continuous, past simple and present perfect using time clues.", "Combine clues to solve a final task."], "run_sheet": [{"slot_index": 0, "teacher_says": "Lights down, sound up. Welcome to the Opera House. Just watch and listen.", "watch_for": "Everyone watching the big screen, same clip on all three. The music track pauses itself while the clip plays."}, {"slot_index": 1, "teacher_says": "Read the title together. Who has heard of the Phantom of the Opera?", "watch_for": "Take one or two answers. The ambient organ music comes back under the picture."}, {"slot_index": 2, "teacher_says": "Read Raoul''s letter slowly, in a low voice. Christine is in danger. We must solve the puzzles to save her.", "watch_for": "Ask: what does Raoul want us to do? Close the question the whole lesson answers."}, {"slot_index": 3, "teacher_says": "Match each word, 1 to 10, with its meaning, A to J. Draw a line or write the letter next to the number. Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 1 is VAS."}, {"slot_index": 4, "teacher_says": "Clue earned. Write the letters down: VAS.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 5, "teacher_says": "Match each word with the word or phrase that means the same or nearly the same. Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 2 is EC."}, {"slot_index": 6, "teacher_says": "Clue earned. Write the letters down: EC.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 7, "teacher_says": "In each group of four, circle the odd one out and say why it does not belong. Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 3 is HIR."}, {"slot_index": 8, "teacher_says": "Clue earned. Write the letters down: HIR.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 9, "teacher_says": "Write the verb in the present simple or the present continuous. Look for the clue words: usually, now, at the moment, Listen! Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 4 is ST."}, {"slot_index": 10, "teacher_says": "Clue earned. Write the letters down: ST.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 11, "teacher_says": "Write the verb in the past simple or the present perfect. Is the time finished, or is it connected to now? Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 5 is NIE."}, {"slot_index": 12, "teacher_says": "Clue earned. Write the letters down: NIE.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 13, "teacher_says": "Choose the right tense for each sentence: present simple, present continuous, past simple or present perfect. Write on the touch screen over the sheet. Press Send to big screen when you are done.", "watch_for": "Learners at the touch screens draw straight on the sheet. Drawings appear on the big screen. Check answers together, then reveal the clue. Clue 6 is NOW."}, {"slot_index": 14, "teacher_says": "Clue earned. Write the letters down: NOW.", "watch_for": "Learners need to keep every clue. Slow down so they copy it. The letters make the final answer."}, {"slot_index": 15, "teacher_says": "The chandelier is shaking. Put all the clues together and write the secret on the touch screen.", "watch_for": "Learners write all six clues (VAS, EC, HIR, ST, NIE, NOW) and try to work out the final word or phrase. Check what they send to the big screen."}, {"slot_index": 16, "teacher_says": "If your answer was right, you escaped. Watch what you missed.", "watch_for": "Full focus on the clip, all three screens. Let the room react. It ends the lesson."}], "verify_before_teaching": ["The background music is a generated organ loop (ambient-organ.wav) and plays on the Host after the first click or keypress. It pauses during the two clips.", "Watch both clips before the session: trailer UTAj7TH08AM and chandelier cQpJRWY4Nrs.", "Work out the final answer from the clues AVS, EC, HIR, ST, NIE, NOW and check the order before teaching.", "The first clue on this set reads VAS (the Entry 2 set reads AVS). Check every clue against your answer sheet."], "safety_note": null, "brief": {"topic": "Phantom of the Opera escape room: language challenges", "level": "Level 1", "department": "Adult Skills", "three_screens": true}, "ambient_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-escape-room/ambient-organ.wav"}'::jsonb
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
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p01.jpg", "file_name": "p01.jpg"}',
    null),

  -- 3 · A letter from Raoul (2 min)
  (2, 'A letter from Raoul', 'Launch', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p02.jpg", "file_name": "p02.jpg"}',
    null),

  -- 4 · Challenge 1: Vocabulary match (4 min)
  (3, 'Challenge 1: Vocabulary match', 'Establish', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 1: Vocabulary match", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p03.jpg", "file_name": "p03.jpg"}',
    null),

  -- 5 · Clue 1 earned (1 min)
  (4, 'Clue 1 earned', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p04.jpg", "file_name": "p04.jpg"}',
    null),

  -- 6 · Challenge 2: Synonyms (4 min)
  (5, 'Challenge 2: Synonyms', 'Establish', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 2: Synonyms", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p05.jpg", "file_name": "p05.jpg"}',
    null),

  -- 7 · Clue 2 earned (1 min)
  (6, 'Clue 2 earned', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p06.jpg", "file_name": "p06.jpg"}',
    null),

  -- 8 · Challenge 3: Odd one out (4 min)
  (7, 'Challenge 3: Odd one out', 'Apply', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 3: Odd one out", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p07.jpg", "file_name": "p07.jpg"}',
    null),

  -- 9 · Clue 3 earned (1 min)
  (8, 'Clue 3 earned', 'Apply', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p08.jpg", "file_name": "p08.jpg"}',
    null),

  -- 10 · Challenge 4: Present simple or present continuous (4 min)
  (9, 'Challenge 4: Present simple or present continuous', 'Apply', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 4: Present simple or present continuous", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p09.jpg", "file_name": "p09.jpg"}',
    null),

  -- 11 · Clue 4 earned (1 min)
  (10, 'Clue 4 earned', 'Apply', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p10.jpg", "file_name": "p10.jpg"}',
    null),

  -- 12 · Challenge 5: Past simple or present perfect (4 min)
  (11, 'Challenge 5: Past simple or present perfect', 'Apply', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 5: Past simple or present perfect", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p11.jpg", "file_name": "p11.jpg"}',
    null),

  -- 13 · Clue 5 earned (1 min)
  (12, 'Clue 5 earned', 'Apply', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p12.jpg", "file_name": "p12.jpg"}',
    null),

  -- 14 · Challenge 6: Mixed tense challenge (4 min)
  (13, 'Challenge 6: Mixed tense challenge', 'Demonstrate', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Challenge 6: Mixed tense challenge", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p13.jpg", "file_name": "p13.jpg"}',
    null),

  -- 15 · Clue 6 earned (1 min)
  (14, 'Clue 6 earned', 'Demonstrate', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p14.jpg", "file_name": "p14.jpg"}',
    null),

  -- 16 · Hurry up! Put the clues together (4 min)
  (15, 'Hurry up! Put the clues together', 'Demonstrate', 4, 'screen1_continue',
    '{"type": "whiteboard", "title": "Put all the clues together", "image_url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phantom-level-1/p15.jpg", "file_name": "p15.jpg"}',
    null),

  -- 17 · The chandelier falls (2 min)
  (16, 'The chandelier falls', 'Demonstrate', 2, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=cQpJRWY4Nrs"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
