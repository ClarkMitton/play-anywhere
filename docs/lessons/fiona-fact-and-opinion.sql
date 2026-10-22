-- ─────────────────────────────────────────────────────────────
-- Fiona · Fact and Opinion · Functional Skills Level 1 English
-- 34 steps · about 151 minutes · whiteboard tables, laptops for Teams tasks
-- Fiona's slides (from her PDF) are on the big screen in her order. Touch screens
-- add scaffolding and a few room activities. Pictures live in
-- lesson-media/lessons/fiona-fact-opinion/ (already uploaded), copies in
-- public/lessons/fiona-fact-opinion/.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Fact and Opinion: Tina Turner (Fiona, FS Level 1)',
    'Fiona''s Functional Skills Level 1 reading lesson on fact and opinion, with Tina Turner for Black History Month. Her slides on the big screen; sentence starters, a checklist, her Wordwall, a quick question round and traffic-light checks on the touch screens.',
    151,
    false,
    true,
    now(),
    '{"rationale": "Fiona''s own Functional Skills Level 1 lesson on fact and opinion, kept as her slides on the big screen in her order. The touch screens are added only where they help: a traffic-light check at the start and end, sentence starters and a checklist for a new table writing task, the opinion warning words while she teaches them, a tiger vote, her Wordwall, a built-in question round in place of Mentimeter, a watching list for the Tina Turner clip, step-by-step help for the Teams tasks, and a writing frame.", "objectives": ["Define, identify and tell apart facts and opinions.", "Analyse a text about Tina Turner for facts and opinions, and justify answers.", "Write a short piece that uses factual evidence and personal opinions."], "run_sheet": [{"slot_index": 0, "teacher_says": "Read the learning intentions together. Today is all about fact and opinion.", "watch_for": "Learners at the tables. Point to the one about Tina Turner and Black History Month."}, {"slot_index": 1, "teacher_says": "Fill in your self-assessment sheet. Then one at a time, tap your traffic light on a touch screen.", "watch_for": "Learners go to the touch screens in turn, then back to the tables. The big screen shows the count; it comes back at the end to compare. Technique: baseline self-assessment."}, {"slot_index": 2, "teacher_says": "Two topics today: fake news, and Tina Turner for Black History Month.", "watch_for": "Ask: who has seen fake news online?"}, {"slot_index": 3, "teacher_says": "Why do people believe fake news?", "watch_for": "Take two or three answers."}, {"slot_index": 4, "teacher_says": "Facts and opinions matter in life, in your reading test and in your writing test.", "watch_for": "Link to last week''s Venn diagrams."}, {"slot_index": 5, "teacher_says": "A fact can be proven. Read the three examples.", "watch_for": "Ask: how could we check that Tina Turner died on 24th May 2023?"}, {"slot_index": 6, "teacher_says": "Facts are objective and can be checked.", "watch_for": "Slides 7 and 9 ask tables to write sentences; that writing now happens in one table task after slide 14, with help on the touch screens. Here, take answers out loud."}, {"slot_index": 7, "teacher_says": "Numbers and data are a sign of a fact. 100 million records is data.", "watch_for": "Ask for another fact with a number in it, out loud."}, {"slot_index": 8, "teacher_says": "An opinion is someone''s view. It cannot be proved.", "watch_for": "Ask: is ''Tina Turner is the best female singer'' true or false? Neither: it is an opinion."}, {"slot_index": 9, "teacher_says": "Opinions are neither true nor false, so we can agree or disagree.", "watch_for": "The touch screens now show the opinion warning words. They stay up for the next four slides."}, {"slot_index": 10, "teacher_says": "How do we turn the butter opinion into a fact?", "watch_for": "Ask a table to change one of their own opinions into a fact."}, {"slot_index": 11, "teacher_says": "Writers mix fact and opinion. Read with a questioning mind.", "watch_for": "Learners at the tables."}, {"slot_index": 12, "teacher_says": "Predictions and ''should'' are opinions.", "watch_for": "Point to ''should'' and ''will'' on the touch screens."}, {"slot_index": 13, "teacher_says": "What does ''very tall'' mean? It is not defined.", "watch_for": "Ask: is ''very'' a fact word or an opinion word?"}, {"slot_index": 14, "teacher_says": "Write your sentences on the table: three facts, one with a number or a date, and three opinions about Tina Turner.", "watch_for": "Learners at the whiteboard tables. Anyone stuck can walk to a touch screen for sentence starters. A good fact can be checked; a good opinion uses a judgement word. Technique: scaffolded writing with sentence starters."}, {"slot_index": 15, "teacher_says": "Move one table on. Check their sentences with the checklist.", "watch_for": "Learners move one table clockwise. Ask two tables to read out a sentence they changed. Technique: peer assessment against criteria."}, {"slot_index": 16, "teacher_says": "Look closely. How many tigers can you see? Tap your answer.", "watch_for": "A runner from each table taps the table''s answer. Technique: read closely and challenge the text."}, {"slot_index": 17, "teacher_says": "Here they are. Always look again before you decide.", "watch_for": "Link it back: in a text, look again before deciding fact or opinion."}, {"slot_index": 18, "teacher_says": "Open Teams on your laptop and do the Edpuzzle video.", "watch_for": "Learners on their own laptops. The touch screens show the steps, so Fiona does not have to repeat them."}, {"slot_index": 19, "teacher_says": "Go to the touch screens. Sort each sentence: fact or opinion.", "watch_for": "Half the class at each touch screen, taking turns. Technique: quick sort to check understanding."}, {"slot_index": 20, "teacher_says": "Six quick questions. Talk with your partner, then tap your answer.", "watch_for": "At the touch screens, straight after the Wordwall, so nobody moves twice. Replaces Mentimeter: no phones or codes. The big screen shows the answers and the reveal."}, {"slot_index": 21, "teacher_says": "Watch and read the lyrics. Which themes can you spot? Can you find a language device?", "watch_for": "Learners back at the tables, watching the big screen. The list is on the touch screens. Ask for one device after the clip."}, {"slot_index": 22, "teacher_says": "Good accuracy on last week''s accelerators. Today we use the same text again.", "watch_for": "Learners at the tables."}, {"slot_index": 23, "teacher_says": "Open Teams and do the Edpuzzle Document about Tina Turner. It has Level 1 test questions.", "watch_for": "Learners on laptops, working on their own."}, {"slot_index": 24, "teacher_says": "If you finish, try the stretch activity.", "watch_for": ""}, {"slot_index": 25, "teacher_says": "Scan a QR code on the touch screen, or open it in Teams.", "watch_for": "Only for learners who finish early. The touch screens show both QR codes large enough to scan."}, {"slot_index": 26, "teacher_says": "Or find it in Teams Assignments.", "watch_for": ""}, {"slot_index": 27, "teacher_says": "Write about a special place. Use facts and opinions.", "watch_for": "Learners at the tables. The writing frame is on the touch screens. Success criteria: at least 2 facts (one with data) and 2 opinions."}, {"slot_index": 28, "teacher_says": "Let''s go back to the question from the start.", "watch_for": ""}, {"slot_index": 29, "teacher_says": "Give one fact and one opinion from document 2.", "watch_for": "Learners write their answer with document 2 in front of them."}, {"slot_index": 30, "teacher_says": "Use your traffic light cards, fill in the sheet, then tap your traffic light again.", "watch_for": "The big screen shows start and end side by side."}, {"slot_index": 31, "teacher_says": "What did you learn? What do you need to improve?", "watch_for": ""}, {"slot_index": 32, "teacher_says": "Go through the recap questions.", "watch_for": ""}, {"slot_index": 33, "teacher_says": "Homework is on Century Tech. Enjoy Tina Turner!", "watch_for": ""}], "verify_before_teaching": ["Slide 1 says 23rd October; the file name says 25th.", "Scan both QR codes on the Forms step with a phone to check which form each opens.", "Edpuzzle and Forms need learners on laptops logged into Teams. If there are no laptops in the room, skip the Edpuzzle, Forms and Edpuzzle Documents steps.", "Document 2 (Technology in the Workplace) is needed on paper for the exit ticket.", "The traffic-light check uses 1 to 3 (red, amber, green). Keep the paper sheets too if Fiona wants them.", "Watch the Tina Turner clip once to check the sound.", "Step timings add up to 151 minutes. Change them in the Stage Designer to fit the real session length."], "safety_note": null, "brief": {"topic": "Fact and opinion (Tina Turner, Black History Month)", "level": "Functional Skills", "department": "Adult Skills", "three_screens": true}}'::jsonb
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
  -- 1 · Learning intentions (3 min)
  (0, 'Learning intentions', 'Launch', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s01.jpg", "file_name": "s01.jpg"}',
    null),

  -- 2 · Starting point: traffic lights (4 min)
  (1, 'Starting point: traffic lights', 'Launch', 4, 'screen2_submit',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s02.jpg", "file_name": "s02.jpg"}',
    '{"type": "confidence_checker", "prompt": "Traffic lights: how well can you tell a fact from an opinion? 1 = red, I need help. 2 = amber, I need more practice. 3 = green, I can do it on my own.", "scale_mode": "numbers", "max": 3, "checkpoint": "start"}'),

  -- 3 · Today's topics (2 min)
  (2, 'Today''s topics', 'Launch', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s03.jpg", "file_name": "s03.jpg"}',
    null),

  -- 4 · Fake news (2 min)
  (3, 'Fake news', 'Launch', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s04.jpg", "file_name": "s04.jpg"}',
    null),

  -- 5 · Why it matters (3 min)
  (4, 'Why it matters', 'Launch', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s05.jpg", "file_name": "s05.jpg"}',
    null),

  -- 6 · What is a fact? (3 min)
  (5, 'What is a fact?', 'Establish', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s06.jpg", "file_name": "s06.jpg"}',
    null),

  -- 7 · How do you know? Facts (3 min)
  (6, 'How do you know? Facts', 'Establish', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s07.jpg", "file_name": "s07.jpg"}',
    null),

  -- 8 · Maths: data in facts (3 min)
  (7, 'Maths: data in facts', 'Establish', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s08.jpg", "file_name": "s08.jpg"}',
    null),

  -- 9 · What is an opinion? (3 min)
  (8, 'What is an opinion?', 'Establish', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s09.jpg", "file_name": "s09.jpg"}',
    null),

  -- 10 · How do you know? Opinions (3 min)
  (9, 'How do you know? Opinions', 'Establish', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s10.jpg", "file_name": "s10.jpg"}',
    '{"type": "text_slide", "title": "Opinion warning words", "text": "best · greatest · worst\nvery · really · amazing\nshould · ought to\nI think · I believe\nwill (a prediction)", "size": "md", "subtitle": "A fact can be proved. Look for numbers, dates and names."}'),

  -- 11 · What's the difference? (2 min)
  (10, 'What''s the difference?', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s11.jpg", "file_name": "s11.jpg"}',
    '{"type": "text_slide", "title": "Opinion warning words", "text": "best · greatest · worst\nvery · really · amazing\nshould · ought to\nI think · I believe\nwill (a prediction)", "size": "md", "subtitle": "A fact can be proved. Look for numbers, dates and names."}'),

  -- 12 · Mixing fact and opinion (2 min)
  (11, 'Mixing fact and opinion', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s12.jpg", "file_name": "s12.jpg"}',
    '{"type": "text_slide", "title": "Opinion warning words", "text": "best · greatest · worst\nvery · really · amazing\nshould · ought to\nI think · I believe\nwill (a prediction)", "size": "md", "subtitle": "A fact can be proved. Look for numbers, dates and names."}'),

  -- 13 · Take care: predictions and should (3 min)
  (12, 'Take care: predictions and should', 'Establish', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s13.jpg", "file_name": "s13.jpg"}',
    '{"type": "text_slide", "title": "Opinion warning words", "text": "best · greatest · worst\nvery · really · amazing\nshould · ought to\nI think · I believe\nwill (a prediction)", "size": "md", "subtitle": "A fact can be proved. Look for numbers, dates and names."}'),

  -- 14 · Take care: very (2 min)
  (13, 'Take care: very', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s14.jpg", "file_name": "s14.jpg"}',
    '{"type": "text_slide", "title": "Opinion warning words", "text": "best · greatest · worst\nvery · really · amazing\nshould · ought to\nI think · I believe\nwill (a prediction)", "size": "md", "subtitle": "A fact can be proved. Look for numbers, dates and names."}'),

  -- 15 · Table task: fact or opinion builder (10 min)
  (14, 'Table task: fact or opinion builder', 'Apply', 10, 'screen1_continue',
    '{"type": "text_slide", "title": "Fact or opinion builder", "text": "On your table, write about Tina Turner:\n3 facts (one with a number or date)\n3 opinions", "size": "md", "subtitle": "Use the help on the touch screens."}',
    '{"type": "text_slide", "title": "Help for your table", "text": "FACT starters:\nTina Turner was born in…\nIn 19… she…\nShe sold over…\n\nOPINION starters:\nI think she is…\nHer best song is…\nEveryone should…", "size": "md"}'),

  -- 16 · Table task: swap and check (6 min)
  (15, 'Table task: swap and check', 'Apply', 6, 'screen1_continue',
    '{"type": "text_slide", "title": "Swap and check", "text": "Move to the next table.\nCircle the opinion words.\nTick each fact that can be proved.", "size": "lg"}',
    '{"type": "text_slide", "title": "Checklist", "text": "Is it a FACT?\n✔ Can it be proved?\n✔ Is there a number, date or name?\n\nIs it an OPINION?\n✔ best, very, should, I think?\n✔ Could someone disagree?", "size": "md"}'),

  -- 17 · How many tigers? (3 min)
  (16, 'How many tigers?', 'Apply', 3, 'screen2_submit',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s15.jpg", "file_name": "s15.jpg"}',
    '{"type": "voting", "question": "How many tigers can you see?", "options": ["3", "5", "10", "16"]}'),

  -- 18 · Tigers: the answer (2 min)
  (17, 'Tigers: the answer', 'Apply', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s16.jpg", "file_name": "s16.jpg"}',
    null),

  -- 19 · Edpuzzle video (12 min)
  (18, 'Edpuzzle video', 'Apply', 12, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s17.jpg", "file_name": "s17.jpg"}',
    '{"type": "text_slide", "title": "On your laptop", "text": "1. Open Teams\n2. Click Assignments\n3. Click Edpuzzle Fact and Opinion\n4. Work on your own", "size": "md", "subtitle": "Stuck? Put your hand up."}'),

  -- 20 · Wordwall: fact or opinion sort (8 min)
  (19, 'Wordwall: fact or opinion sort', 'Apply', 8, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s18.jpg", "file_name": "s18.jpg"}',
    '{"type": "embed", "url": "https://wordwall.net/embed/29ad76e8601b42daa5eed70fde856f9f?themeId=1&templateId=2&fontStackId=0", "description": "Fiona''s Wordwall group sort: Fact and Opinion, Which is Which. Learners drag each sentence into Fact or Opinion."}'),

  -- 21 · Mid-point check (6 min)
  (20, 'Mid-point check', 'Apply', 6, 'screen2_submit',
    '{"type": "question_round", "questions": [{"type": "multiple_choice", "text": "Tina Turner sold over 100 million records worldwide.", "options": ["Fact", "Opinion"], "correct": 0}, {"type": "multiple_choice", "text": "Simply the Best is the greatest song ever written.", "options": ["Fact", "Opinion"], "correct": 1}, {"type": "multiple_choice", "text": "Everyone should listen to Tina Turner.", "options": ["Fact", "Opinion"], "correct": 1}, {"type": "multiple_choice", "text": "Tina Turner was born in Tennessee, USA, in 1939.", "options": ["Fact", "Opinion"], "correct": 0}, {"type": "multiple_choice", "text": "\"The concert was very loud.\" Which word shows this is an opinion?", "options": ["concert", "very", "loud"], "correct": 1}, {"type": "true_or_false", "text": "A prediction is a fact, because it might come true.", "correct_tf": false}]}',
    '{"type": "question_round", "questions": [{"type": "multiple_choice", "text": "Tina Turner sold over 100 million records worldwide.", "options": ["Fact", "Opinion"], "correct": 0}, {"type": "multiple_choice", "text": "Simply the Best is the greatest song ever written.", "options": ["Fact", "Opinion"], "correct": 1}, {"type": "multiple_choice", "text": "Everyone should listen to Tina Turner.", "options": ["Fact", "Opinion"], "correct": 1}, {"type": "multiple_choice", "text": "Tina Turner was born in Tennessee, USA, in 1939.", "options": ["Fact", "Opinion"], "correct": 0}, {"type": "multiple_choice", "text": "\"The concert was very loud.\" Which word shows this is an opinion?", "options": ["concert", "very", "loud"], "correct": 1}, {"type": "true_or_false", "text": "A prediction is a fact, because it might come true.", "correct_tf": false}]}'),

  -- 22 · Tina Turner: Simply the Best (5 min)
  (21, 'Tina Turner: Simply the Best', 'Apply', 5, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=wTm5-YZJ5q4"}',
    '{"type": "text_slide", "title": "While you watch", "text": "Which of these can you spot?\nPoverty · Racism\nDomestic abuse\nEqual opportunities\nResilience\nSuccess and achievement", "size": "md", "subtitle": "Spot a language device in the lyrics."}'),

  -- 23 · Homework feedback: Tina Turner (3 min)
  (22, 'Homework feedback: Tina Turner', 'Apply', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s21.jpg", "file_name": "s21.jpg"}',
    null),

  -- 24 · Edpuzzle Documents: Tina Turner (15 min)
  (23, 'Edpuzzle Documents: Tina Turner', 'Apply', 15, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s22.jpg", "file_name": "s22.jpg"}',
    '{"type": "text_slide", "title": "On your laptop", "text": "1. Open Teams\n2. Click Assignments\n3. Click Edpuzzle Document Tina Turner\n4. Work on your own", "size": "md", "subtitle": "Stuck? Put your hand up."}'),

  -- 25 · Stretch and challenge (2 min)
  (24, 'Stretch and challenge', 'Apply', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s23.jpg", "file_name": "s23.jpg"}',
    null),

  -- 26 · Forms: stretch activity (8 min)
  (25, 'Forms: stretch activity', 'Apply', 8, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s24.jpg", "file_name": "s24.jpg"}',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/forms-qr.jpg", "file_name": "forms-qr.jpg", "title": "Scan a QR code"}'),

  -- 27 · Forms in Teams (1 min)
  (26, 'Forms in Teams', 'Apply', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s25.jpg", "file_name": "s25.jpg"}',
    '{"type": "text_slide", "title": "On your laptop", "text": "1. Open Teams\n2. Click Assignments\n3. Click Forms Fact and Opinion\n4. Work on your own", "size": "md", "subtitle": "Stuck? Put your hand up."}'),

  -- 28 · Writing task: a special place (15 min)
  (27, 'Writing task: a special place', 'Demonstrate', 15, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s26.jpg", "file_name": "s26.jpg"}',
    '{"type": "text_slide", "title": "Writing frame", "text": "FACT: My special place is in…\nFACT with data: It is … miles from…\nOPINION: I think it is … because…\nOPINION: Everyone should…", "size": "md", "subtitle": "Use at least 2 facts and 2 opinions."}'),

  -- 29 · Exit ticket (1 min)
  (28, 'Exit ticket', 'Demonstrate', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s27.jpg", "file_name": "s27.jpg"}',
    null),

  -- 30 · Exit ticket question (4 min)
  (29, 'Exit ticket question', 'Demonstrate', 4, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s28.jpg", "file_name": "s28.jpg"}',
    null),

  -- 31 · End point: traffic lights (4 min)
  (30, 'End point: traffic lights', 'Demonstrate', 4, 'screen2_submit',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s29.jpg", "file_name": "s29.jpg"}',
    '{"type": "confidence_checker", "prompt": "Traffic lights: how well can you tell a fact from an opinion? 1 = red, I need help. 2 = amber, I need more practice. 3 = green, I can do it on my own.", "scale_mode": "numbers", "max": 3, "checkpoint": "final"}'),

  -- 32 · Self-assessment (3 min)
  (31, 'Self-assessment', 'Demonstrate', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s30.jpg", "file_name": "s30.jpg"}',
    null),

  -- 33 · Recap of learning (3 min)
  (32, 'Recap of learning', 'Demonstrate', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s31.jpg", "file_name": "s31.jpg"}',
    null),

  -- 34 · Next steps (2 min)
  (33, 'Next steps', 'Demonstrate', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/fiona-fact-opinion/s32.jpg", "file_name": "s32.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
