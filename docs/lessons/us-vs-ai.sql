-- ─────────────────────────────────────────────────────────────
-- US vs AI · what is it really doing?
-- 45 minutes · 20 steps · Level 2 and Level 3 · group work at the whiteboard tables
-- Second design. Replaces the first Us vs AI lesson: delete that one in Admin.
-- Slides: public/lessons/us-vs-ai/slide-01.jpg to slide-08.jpg (made in Canva).
-- Table packs: public/lessons/us-vs-ai/printables.html
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Us vs AI',
    'What is AI really doing? Learners sort everyday technology, act out how a chatbot works, investigate a real AI mistake and fix a bad instruction, working in groups at the whiteboard tables. Needs the printed table packs.',
    45,
    false,
    true,
    now(),
    '{"rationale": "One idea runs through the session: AI is not thinking, it is predicting from patterns. Learners first find out how much everyday technology is AI, then act out what a language model does, then analyse a real mistake, then fix an instruction and test each other''s. Most of the time is spent standing at the whiteboard tables in groups, not answering questions on screens. The sandwich clip opens a question that the last task answers.", "objectives": ["Identify different technology that uses AI, not only chatbots.", "Explain what a large language model (LLM) is and how it works.", "Analyse an AI mistake and explain why it happened.", "Rewrite an instruction so that AI gives a better result."], "run_sheet": [{"slot_index": 0, "teacher_says": "Today we are going to work out what AI is really doing. First, a short clip. Grab a pen. While you watch, write three things on your table: what the AI was asked to do, what it did instead, and whose mistake it was.", "watch_for": "Learners: tables. Give the three watching questions BEFORE you start the clip. Envelopes stay closed until you say. Technique: a watching task, so nobody is a passenger during a video."}, {"slot_index": 1, "teacher_says": "Watch, and write as you go.", "watch_for": "Learners: tables, writing while they watch. The same three questions are on the touch screens. The lesson moves on by itself when the clip ends. Technique: a hook that sets up a question you answer at the end."}, {"slot_index": 2, "teacher_says": "Look at what you wrote. What was it asked to do, and what did it do? Then the big one: whose mistake was it, the AI''s or the person giving the instruction?", "watch_for": "Learners: tables. Take the first two quickly from different tables, then let the room argue the third. Do NOT settle it. Say: we will come back to this. Technique: the questions set before the clip are the ones discussed after it."}, {"slot_index": 3, "teacher_says": "Open pack one. Sixteen cards. Sort them under the three headings on your table. If you disagree about one, write why next to it.", "watch_for": "Learners: tables. Listen for the arguments, they are the point. Sat-nav and self-checkout should split tables. Technique: card sort, everyone has a job."}, {"slot_index": 4, "teacher_says": "AI is not one thing. Some AI recognises, some recommends, some predicts, some generates. Check your table against the screen.", "watch_for": "Learners: tables. Ask which card surprised them most. The answers are on your tutor sheet. Point out most of them use AI every day without typing anything."}, {"slot_index": 5, "teacher_says": "Everyone to a touch screen, half at each. Leave the cards. Three fast ones: shout it, then tap.", "watch_for": "Learners: MOVE to the touch screens. Keep the pace up, ten seconds each. Technique: quick-fire to lock in what the sort just taught."}, {"slot_index": 6, "teacher_says": "While you are at the screens: how often do you use AI? Quick and honest, nobody is in trouble.", "watch_for": "Learners: touch screens. This is real feedback about your group, saved for later. After the card sort, expect more of them to say every day."}, {"slot_index": 7, "teacher_says": "The chatbots you know are one branch of the family. They are called large language models. Large, because of how much they have read.", "watch_for": "Learners: touch screens. Name two or three they will know. Hold up the predictive text card: it is a tiny version of the same idea."}, {"slot_index": 8, "teacher_says": "You are now the AI. Finish the sentence. One word.", "watch_for": "Learners: touch screens. The biggest word on screen is the room''s prediction. Technique: learners act out the idea before it is explained."}, {"slot_index": 9, "teacher_says": "That is all it does. It picks the most likely next word, then the next, then the next. It is not looking anything up.", "watch_for": "Learners: touch screens. Point back at their cloud: you just did it without thinking."}, {"slot_index": 10, "teacher_says": "Again, but faster. First answer in your head. Do not check.", "watch_for": "Learners: touch screens. The answer is Canberra. If Sydney is big, the room has just made an AI mistake: the most common answer beat the true one. If Canberra wins, say an AI cannot stop and check the way they did."}, {"slot_index": 11, "teacher_says": "Agree as a table before anyone taps. Two of these sound right.", "watch_for": "Learners: touch screens. Ask a table that chose ''searches the internet'' to explain. Technique: a best-answer question, where the wrong options are tempting."}, {"slot_index": 12, "teacher_says": "Easy job. Draw a clock showing half past three and send it to the big screen.", "watch_for": "Learners: touch screens. Everyone manages it. Hold on to that for the next slide. Technique: learners do the task before seeing the AI attempt it."}, {"slot_index": 13, "teacher_says": "Here is what AI picture tools draw when you ask for a watch. Look at the hands.", "watch_for": "Learners: touch screens. Wait. Let someone in the room spot it. Do not explain yet."}, {"slot_index": 14, "teacher_says": "Back to your tables. Open pack two. You have the evidence. Work out why it happened and write the chain on your table. Then you will move on and check another table''s answer.", "watch_for": "Learners: MOVE back to the tables. A good answer has three links: what it saw, the pattern, what it made. Push Level 3 groups to the stretch box. Technique: analyse, then critique another group''s reasoning."}, {"slot_index": 15, "teacher_says": "It never saw a real watch. It saw thousands of adverts, and adverts set the hands to ten past ten. It copied the pattern. That is called bias.", "watch_for": "Learners: tables. Ask the stretch question to the whole room: where could copying a pattern be unfair to people?"}, {"slot_index": 16, "teacher_says": "Back to the sandwich. If AI only has your words, the words matter. Here is what a good instruction does.", "watch_for": "Learners: tables. Leave this slide''s four points in view as long as you can. They are the success criteria."}, {"slot_index": 17, "teacher_says": "Open pack three. Rewrite your bad instruction on the table. Then move on, and be the most literal AI you can: find any way to get the other table''s instruction wrong.", "watch_for": "Learners: tables. The ''be the AI'' round is where the learning shows. Send tables back to fix the gaps that were found. Technique: create, then test each other''s work against the criteria."}, {"slot_index": 18, "teacher_says": "One person from each table, go to a touch screen and type in your final version. The one that survived.", "watch_for": "Learners: tables, one runner per table to a touch screen. Read two out. Ask the room which is hardest to break and why, using the four points. This is the evidence of the learning."}, {"slot_index": 19, "teacher_says": "So who got the sandwich wrong? AI is not thinking, it is predicting. That makes you the one in charge.", "watch_for": "Learners: tables. Go back to the opening question and let the room answer it now."}], "verify_before_teaching": ["PRINT FIRST: open /lessons/us-vs-ai/printables.html on the same web address as this app. Print pages 2 to 6 once for each table, cut the cards, and put each table''s set in an envelope. Page 1 is your answer sheet.", "Learners stand at the whiteboard tables and write on the table itself. Check there are working pens at every table.", "Watch the sandwich clip before the session. It is a comedy sketch, so check the language and tone suit your group.", "The slides were made with Canva''s AI, including the pictures. On the ''AI is a family'' slide the TV picture misspells ''Recommended''. Use it as a spot-the-AI-mistake moment, or replace the picture in Canva.", "The watches on the slide were made by AI and were asked to show ten past ten, so they illustrate the point. If you have an AI picture tool, ask it live for ''a watch showing half past three'' and see what it draws.", "The whole class moves only twice: to the touch screens at step 6 and back to the tables at step 15. At step 19 only one person per table goes to a screen.", "Table tasks use two rounds with a move in between. With only one or two tables, skip the move and have tables check their own work against the screen.", "The vote, both word clouds and the final board are saved. Read them afterwards in Admin, Data."], "safety_note": null, "media_requests": [], "brief": {"topic": "Introduction to AI: what it is really doing", "level": "Level 2", "department": "Science and Digital", "three_screens": true}}'::jsonb
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
  -- 1 · Us vs AI (1 min)
  (0, 'Us vs AI', 'Launch', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/us-vs-ai/slide-01.jpg", "file_name": "slide-01.jpg"}',
    null),

  -- 2 · Video: Me vs ChatGPT (2 min)
  (1, 'Video: Me vs ChatGPT', 'Launch', 2, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=83cDUAJnyR4"}',
    '{"type": "text_slide", "text": "1. What was the AI asked to do?\n2. What did it do instead?\n3. Whose mistake was it?", "size": "md", "title": "While you watch", "subtitle": "Write your answers on the table."}'),

  -- 3 · Talk: who got it wrong? (2 min)
  (2, 'Talk: who got it wrong?', 'Launch', 2, 'screen1_continue',
    '{"type": "text_slide", "text": "1. What was the AI asked to do?\n2. What did it do instead?\n3. Whose mistake was it?", "size": "md", "title": "Talk about it", "subtitle": "Compare what your table wrote. Be ready to say why."}',
    null),

  -- 4 · AI or not AI? (5 min)
  (3, 'AI or not AI?', 'Establish', 5, 'screen1_continue',
    '{"type": "countdown_timer", "label": "AI or not AI?\nOpen pack 1. Sort every card. Write WHY next to any you argue about.", "duration_secs": 300}',
    null),

  -- 5 · AI is a family (2 min)
  (4, 'AI is a family', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "/lessons/us-vs-ai/slide-02.jpg", "file_name": "slide-02.jpg"}',
    null),

  -- 6 · True or false? (2 min)
  (5, 'True or false?', 'Establish', 2, 'screen2_submit',
    '{"type": "question_round", "questions": [{"type": "true_or_false", "text": "A calculator uses AI.", "correct_tf": false}, {"type": "true_or_false", "text": "The predictive text on your phone uses AI.", "correct_tf": true}, {"type": "true_or_false", "text": "All AI is a chatbot.", "correct_tf": false}]}',
    null),

  -- 7 · How often do you use AI? (2 min)
  (6, 'How often do you use AI?', 'Establish', 2, 'screen2_submit',
    '{"type": "voting", "question": "How often do you use AI?", "options": ["Every day", "A few times a week", "Hardly ever", "Never"]}',
    null),

  -- 8 · What is an LLM? (1 min)
  (7, 'What is an LLM?', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/us-vs-ai/slide-03.jpg", "file_name": "slide-03.jpg"}',
    null),

  -- 9 · Be the LLM (2 min)
  (8, 'Be the LLM', 'Establish', 2, 'screen2_submit',
    '{"type": "word_cloud", "title": "The cat sat on the…", "prompt": "Type the next word. One word."}',
    null),

  -- 10 · It predicts the next word (1 min)
  (9, 'It predicts the next word', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/us-vs-ai/slide-04.jpg", "file_name": "slide-04.jpg"}',
    null),

  -- 11 · Be the LLM again (2 min)
  (10, 'Be the LLM again', 'Establish', 2, 'screen2_submit',
    '{"type": "word_cloud", "title": "The capital of Australia is…", "prompt": "Type the FIRST answer in your head. No checking."}',
    null),

  -- 12 · Best answer (2 min)
  (11, 'Best answer', 'Establish', 2, 'screen2_submit',
    '{"type": "question_round", "questions": [{"type": "multiple_choice", "text": "Which is the BEST description of a chatbot?", "options": ["It searches the internet for the right answer", "It predicts likely words from patterns it has read", "It thinks about your question, then explains"], "correct": 1}, {"type": "multiple_choice", "text": "Which is the odd one out?", "options": ["ChatGPT", "Copilot", "Face unlock"], "correct": 2}]}',
    null),

  -- 13 · Draw the time (2 min)
  (12, 'Draw the time', 'Apply', 2, 'screen1_continue',
    '{"type": "whiteboard", "title": "Draw a clock showing half past three"}',
    null),

  -- 14 · Ask AI to draw a watch (1 min)
  (13, 'Ask AI to draw a watch', 'Apply', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/us-vs-ai/slide-05.jpg", "file_name": "slide-05.jpg"}',
    null),

  -- 15 · Case file: why ten past ten? (6 min)
  (14, 'Case file: why ten past ten?', 'Apply', 6, 'screen1_continue',
    '{"type": "rotation_timer", "label": "Case file: why is it always ten past ten?", "details": "Round 1: open pack 2. Solve the case. Write your answer on the table.\nRound 2: move on. Check the next table''s answer. Add to it or challenge it.", "rounds": 2, "round_secs": 150, "move_secs": 20, "move_text": "Move to the next table"}',
    null),

  -- 16 · Why ten past ten? (1 min)
  (15, 'Why ten past ten?', 'Apply', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/us-vs-ai/slide-06.jpg", "file_name": "slide-06.jpg"}',
    null),

  -- 17 · Fix the instruction (1 min)
  (16, 'Fix the instruction', 'Demonstrate', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/us-vs-ai/slide-07.jpg", "file_name": "slide-07.jpg"}',
    null),

  -- 18 · Rewrite it, then break it (6 min)
  (17, 'Rewrite it, then break it', 'Demonstrate', 6, 'screen1_continue',
    '{"type": "rotation_timer", "label": "Fix the instruction", "details": "Round 1: rewrite your bad instruction on the table so it cannot go wrong.\nRound 2: move on. You are the AI. Find a way to get theirs wrong.", "rounds": 2, "round_secs": 150, "move_secs": 20, "move_text": "Move to the next table"}',
    null),

  -- 19 · Best instruction (3 min)
  (18, 'Best instruction', 'Demonstrate', 3, 'screen1_continue',
    '{"type": "padlet", "title": "Our best instruction", "question": "Type your table''s final instruction. The one that could not be broken."}',
    null),

  -- 20 · You write the instructions (1 min)
  (19, 'You write the instructions', 'Demonstrate', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/us-vs-ai/slide-08.jpg", "file_name": "slide-08.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
