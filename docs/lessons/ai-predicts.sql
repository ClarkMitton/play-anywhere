-- ─────────────────────────────────────────────────────────────
-- AI PREDICTS, IT DOESN'T THINK · 60 minutes · 23 steps · Level 2
-- A fresh start on Us vs AI, with one objective. Tiny AI (Canva Code), the
-- sandwich clip, touch-screen whiteboards and a real AI picture to catch out.
-- Every screen says what to do at every step, for people new to the room.
-- No printing: learners write on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The pictures are in the app's media storage (lesson-media/lessons/ai-predicts/).
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'AI Predicts, It Doesn''t Think',
    'Level 2, any course. One idea: AI predicts from patterns, it does not think. Tiny AI with a small and a big word pool, the sandwich clip, drawing a watch and being the AI on the touch-screen whiteboards, catching real AI mistakes in a picture, and designing a request AI will get wrong. Ends with learners'' views of AI. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"A fresh start on the Us vs AI lesson, with one idea only: AI does not think, it predicts from the patterns it has learned. The first version had four objectives in 45 minutes and felt rushed. Launch: Tiny AI, a next-word predictor that has read three sentences, and learners answering a question with only its six words. Establish: the sandwich clip, then the idea named, then Tiny AI again with a bigger pool and learners rewriting their answer. Apply: drawing a watch on the touch-screen whiteboards, catching four real AI mistakes in a picture made for the lesson, comparing two real AI clocks, and being the AI themselves on the whiteboards, then explaining two mistakes at the tables. Demonstrate: each table designs a request AI will get wrong and says why, then everyone gives feedback on the touch screens. Every screen says what to do at every step, for staff and learners who are new to the room. Nothing is printed.","objectives":["Explain why AI gets things confidently wrong: it predicts from the patterns it has learned; it does not think."],"run_sheet":[{"slot_index":0,"teacher_says":"Welcome. This room has three places to work. The big screen tells you what to do. You write on the tables with these pens. The touch screens come later, and the big screen will tell you when. Stand at a table and pick up a pen.","watch_for":"Learners: arriving, then standing at the whiteboard tables. Press Next on the big screen to move through the lesson; the preview notes show what each screen is doing. Hand out pens. Groups of three to five per table. Technique: set the routines of the room before the content."},{"slot_index":1,"teacher_says":"First question. Is AI clever, or is it just guessing? Write CLEVER or GUESSING on your table, and one reason why. Thirty seconds.","watch_for":"Learners: at the tables, writing. Count the tables out loud: how many clever, how many guessing. Do not answer it. Leave it on the tables: the last steps come back to it. Technique: open a question and close it at the end."},{"slot_index":2,"teacher_says":"This is Tiny AI. It has only read three sentences: I like chips. I like my dog. My dog likes chips. I will start a sentence. Before I click, shout out the word you think it will pick next.","watch_for":"Learners: at the tables, facing the big screen. On the big screen: check SMALL POOL is selected. Press the starter ''I''. Ask the room to shout the next word before every click, then click the top bar. Then press ''Auto reply'' and let it run: it loops (''I like my dog likes chips...''). Press ''Show what I learned from'' to show the three sentences. Ask: why can it only say these words? Answer: they are all it has ever read. Technique: predict, then watch the machine predict."},{"slot_index":3,"teacher_says":"Your turn to be Tiny AI. Answer the question ''What did you do at the weekend?'' on your table, using only these six words. Two minutes. Then we read them out.","watch_for":"Learners: at the tables, writing. Expect ''I like my dog'' or ''my dog likes chips'': nothing about the weekend, because those words are not in the pool. Read two or three out. Ask: was that a good answer to the question? Why not? Leave the answers on the tables for step 11. Technique: feel the limit before it is explained."},{"slot_index":4,"teacher_says":"A real person asks ChatGPT how to cut a sandwich and follows it exactly. Watch for three things. Write your answers on the table while it plays.","watch_for":"Learners: at the tables. Read the three questions aloud before pressing Next. The same questions stay on the touch screens during the video. Technique: set the watching task before the clip."},{"slot_index":5,"teacher_says":"Watch, and write as you go.","watch_for":"Learners: at the tables, writing while they watch. The video plays on the big screen with sound, and the lesson moves on by itself when it ends. Technique: a watching task with a written output."},{"slot_index":6,"teacher_says":"What was it asked to do? What did it do? And the big one: whose mistake was it, the AI''s or the person giving the instruction?","watch_for":"Learners: at the tables. Take the first two quickly, then let the room argue the third. Do NOT settle it: say ''we come back to this at the end''. Technique: discuss the questions set before the clip."},{"slot_index":7,"teacher_says":"A chatbot does what Tiny AI did. It looks at the words so far and picks the most likely next word. Then the next. Then the next. The cat sat on the... mat. You all knew it, because you have heard it hundreds of times.","watch_for":"Learners: at the tables. Ask the room ''The cat sat on the...'' before you say it: they will shout ''mat''. That is prediction from patterns. Technique: name the idea after learners have done it."},{"slot_index":8,"teacher_says":"Tiny AI read three sentences. A real chatbot, a Large Language Model, has read more text than you could read in thousands of lifetimes. Same trick: a much bigger pool.","watch_for":"Learners: at the tables. Keep it short: the next step shows what a bigger pool does. Technique: one idea per slide."},{"slot_index":9,"teacher_says":"Now Tiny AI has read thirty sentences. Same starter. Shout the next word before I click. Is it better now?","watch_for":"Learners: at the tables, facing the big screen. On the big screen: switch to BIG POOL. Press ''My weekend was'' and click through, then ''At the weekend I'' and press Auto reply. The replies now make sense. Then type or start with a word it has never seen (try ''holiday''): it says it has nothing to predict. Point: more learning gives better guesses, but they are still guesses. It does not know what a weekend is. Technique: the same test with one thing changed."},{"slot_index":10,"teacher_says":"Rewrite your weekend answer on the table. You can now use any word on the big screen. Three minutes. Is your answer better than the first one?","watch_for":"Learners: at the tables, writing. Compare the two answers on each table: the second is longer, makes sense, and answers the question. Ask: did your ''AI'' understand the question, or just have better words? Technique: improve your own work with more information."},{"slot_index":11,"teacher_says":"Everyone up. Half of you to each touch screen. One or two people draw the hands at half past three on the watch. Then press Send to big screen.","watch_for":"Learners: MOVE to the touch screens, half the class at each. The touch screen shows a blank watch face; learners draw with a finger and press ''Send to big screen''. Both drawings appear side by side on the big screen. Everyone gets it right. Hold on to that. Technique: do the task before seeing the AI attempt it."},{"slot_index":12,"teacher_says":"We asked an AI picture tool for a classroom with a clock at half past three, a left-handed student, and a glass of water full to the brim. Tap everything it got wrong. There are four. It is a race: which screen finds all four first? Careful: not everything is wrong.","watch_for":"Learners: at the touch screens. They tap the picture; a correct tap circles the mistake, a wrong tap shows a red cross. Each touch screen plays on its own, so it is a race: the big screen shows Screen 1 against Screen 2, out of 4. The four: the clock says about half past ten (the hour hand went to 10, where most clocks in photos point); the pen is in her right hand (most photos show right-handed writers); the glass is about three-quarters full (most photos show that); the notebook writing is scribble (it copies the look of writing, not words). Trap: WEDNESDAY on the board is spelled right. Press Reveal all on the big screen when they stall. This picture was really made by AI for this lesson. Technique: spot the pattern in someone else''s mistakes."},{"slot_index":13,"teacher_says":"We asked an AI tool for half past three twice this week. In a busy classroom picture it drew half past ten. Asked for a watch on its own, it got close. Why the difference?","watch_for":"Learners: at the touch screens, looking at the big screen. Both pictures are real results from November 2026. Good answer: on its own, the request is simple; in a busy picture, the most common clock pattern wins. Newer tools have learned from a bigger pool, so they get closer than older ones did. Technique: compare two results to find the cause."},{"slot_index":14,"teacher_says":"Now YOU be the AI. Write the first word that comes into your head after each one. Don''t think. Then send it to the big screen and we compare the two screens.","watch_for":"Learners: at the touch screens, writing on the board. Six starters: Once upon a (time), Fish and (chips), Can I have a cup of (tea), See you (later/soon), Happy birthday to (you), It''s raining cats and (dogs). Both screens will match almost exactly. Ask: why did both screens write the same? Because you have heard these patterns thousands of times. That is all AI does, with a bigger pool. Then say clearly: back to your tables. Technique: experience the mechanism yourself."},{"slot_index":15,"teacher_says":"Back to your tables. Pick two of the AI''s mistakes. For each one, write: We asked for... It drew... because most pictures it learned from show... Three and a half minutes.","watch_for":"Learners: MOVE back to the tables. Write the sentence frame on the board before the timer starts, because the big screen only shows the timer. Good answer: ''We asked for a left-handed writer. It drew a right-handed one, because most pictures it learned from show right-handed people.'' Stretch: who could this be unfair to? (Left-handed people, anyone who is not ''the usual''.) The timer moves on by itself. Technique: analyse cause and effect with a frame."},{"slot_index":16,"teacher_says":"Back to the sandwich. Whose mistake was it? The AI did not know what a sandwich is. It predicted the most likely meaning of the words. A clearer instruction gives it less to guess.","watch_for":"Learners: at the tables. Let two tables answer using today''s words: predict, pattern, pool. Both answers are partly right: the AI guessed, and the instruction left room to guess. Technique: answer the question opened at the start of Establish."},{"slot_index":17,"teacher_says":"Your challenge. Think of something to ask an AI that it will probably get wrong, like the clock. Write what you would ask, what it will give you, and why. Use the pool.","watch_for":"Learners: at the tables. Copy the three lines onto the board before pressing Next, because the next step shows a timer. Ideas if a table is stuck: a left-handed guitarist, a clock at twenty to seven, a full glass of juice, a cat with three legs, a very old footballer. Technique: create a test that shows understanding."},{"slot_index":18,"teacher_says":"Five minutes. Every person writes at least one idea. Then pick your table''s best.","watch_for":"Learners: at the tables, writing. Push for the ''because'': that is the objective. A strong answer: ''We ask for a left-handed guitarist. It will give us a right-handed one, because its pool is full of right-handed guitarists.'' The timer moves on by itself. Technique: create, against a frame."},{"slot_index":19,"teacher_says":"One table at a time: read us your best. Class: thumbs up if you think the AI really would get it wrong.","watch_for":"Learners: at the tables. Quick: one line per table. Then say clearly: everyone to the touch screens for the last two questions. Technique: share and judge."},{"slot_index":20,"teacher_says":"Everyone to the touch screens. Each person taps an answer: has today changed how much you trust what AI tells you?","watch_for":"Learners: MOVE to the touch screens, half the class at each. Each person taps once. The results build on the big screen and are saved, as feedback on learners'' views of AI. Technique: real opinions, recorded."},{"slot_index":21,"teacher_says":"Last one. Finish the sentence: AI is... One or two words each.","watch_for":"Learners: at the touch screens, taking turns to type. The cloud builds on the big screen and is saved. Read the biggest words aloud. Technique: a one-word exit reflection."},{"slot_index":22,"teacher_says":"Back to the first question. Clever, or guessing? It is guessing, very well, from a huge pool. It is not thinking. So you check what it gives you.","watch_for":"Learners: at the touch screens or tables. Look back at CLEVER or GUESSING on the tables: how many would change their answer now? Next lessons in this set: how to write instructions AI can follow, whether you can trust what AI makes, and AI in your course. Technique: close the loop."}],"verify_before_teaching":["Steps 3 and 10 need the Tiny AI Canva Code game. Until its link is added, they show a placeholder slide.","Watch the sandwich clip (step 6) before teaching. It moves on by itself when it ends.","The classroom picture (step 13) and both clocks on step 14 were made by an AI picture tool for this lesson in November 2026, so the mistakes in them are real. Results change as the tools improve.","Nothing is printed. Learners write on the whiteboard tables throughout, and on the touch-screen whiteboards at steps 12 and 15.","The whole class moves three times, each announced on the big screen: to the touch screens at step 12, back to the tables at step 16, and to the touch screens at step 21.","Timers at steps 16 and 19 move on by themselves. Pause if a table needs longer."],"safety_note":null,"media_requests":[],"brief":{"topic":"AI predicts, it doesn''t think","level":"Level 2","department":"Science and Digital","three_screens":true}}'::jsonb
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
  -- 1 · How this room works (2 min)
  (0, 'How this room works', 'Launch', 2, 'screen1_continue',
    '{"type":"designed_slide","look":"night","layout":"steps","kicker":"Welcome to the Immersive Room","title":"Three places to work","points":["Big screen: watch here. It tells you what to do next.","Tables: you write ON them with the pens.","Touch screens: wait until you are told to go to them."],"chip":"NOW: stand at a table and pick up a pen"}',
    '{"type":"text_slide","title":"Not yet!","text":"Stand at a table\nand pick up a pen.\n\nWe use this screen later.","size":"lg"}'),

  -- 2 · Is AI clever, or just guessing? (1 min)
  (1, 'Is AI clever, or just guessing?', 'Launch', 1, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"question","kicker":"First question","title":"Is AI clever, or is it just guessing?","text":"Write CLEVER or GUESSING on your table, and one reason.","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/ai-predicts/students.jpg"}',
    '{"type":"text_slide","title":"On your table","text":"Write:\nCLEVER or GUESSING\n\nand one reason.","size":"lg"}'),

  -- 3 · Tiny AI: the small pool (4 min)
  (2, 'Tiny AI: the small pool', 'Launch', 4, 'screen1_continue',
    '{"type":"designed_slide","look":"night","layout":"cover","kicker":"Tiny AI","title":"Tiny AI: small pool","text":"Tutor: the Tiny AI game goes here (add its Canva link in the designer)."}',
    '{"type":"text_slide","title":"Shout it out!","text":"What word\ncomes next?\n\nWatch the big screen.","size":"lg"}'),

  -- 4 · Only these words (3 min)
  (3, 'Only these words', 'Launch', 3, 'screen1_continue',
    '{"type":"designed_slide","look":"bold","layout":"statement","kicker":"Your turn to be Tiny AI","title":"What did you do at the weekend?","text":"Answer using ONLY these words:  I · like · likes · chips · my · dog","chip":"Write your answer on your table. 2 minutes."}',
    '{"type":"text_slide","title":"Only these words","text":"I   like   likes\nchips   my   dog\n\nWhat did you do\nat the weekend?","size":"lg"}'),

  -- 5 · Watch for (1 min)
  (4, 'Watch for', 'Establish', 1, 'screen1_continue',
    '{"type":"text_slide","title":"Watch for","text":"1  What was the AI asked to do?\n2  What did it do instead?\n3  Whose mistake was it?","size":"md"}',
    null),

  -- 6 · Video: Me vs ChatGPT (3 min)
  (5, 'Video: Me vs ChatGPT', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=83cDUAJnyR4"}',
    '{"type":"text_slide","title":"Watch for","text":"1  What was it asked to do?\n2  What did it do instead?\n3  Whose mistake was it?","size":"md"}'),

  -- 7 · Who got it wrong? (2 min)
  (6, 'Who got it wrong?', 'Establish', 2, 'screen1_continue',
    '{"type":"text_slide","title":"Talk at your table","text":"1  What was it asked to do?\n2  What did it do instead?\n3  Whose mistake was it:\n   the AI''s, or the instruction''s?","size":"md"}',
    '{"type":"text_slide","title":"Not now","text":"Stay at your table.\nWatch the big screen.","size":"lg"}'),

  -- 8 · It predicts the next word (2 min)
  (7, 'It predicts the next word', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/us-vs-ai/slide-04.jpg","file_name":"slide-04.jpg"}',
    '{"type":"text_slide","title":"Not now","text":"Stay at your table.\nWatch the big screen.","size":"lg"}'),

  -- 9 · A much bigger pool (1 min)
  (8, 'A much bigger pool', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/us-vs-ai/slide-03.jpg","file_name":"slide-03.jpg"}',
    '{"type":"text_slide","title":"Not now","text":"Stay at your table.\nWatch the big screen.","size":"lg"}'),

  -- 10 · Tiny AI: the big pool (5 min)
  (9, 'Tiny AI: the big pool', 'Establish', 5, 'screen1_continue',
    '{"type":"designed_slide","look":"night","layout":"cover","kicker":"Tiny AI","title":"Tiny AI: big pool","text":"Tutor: the Tiny AI game goes here (add its Canva link in the designer)."}',
    '{"type":"text_slide","title":"Shout it out!","text":"What word\ncomes next?\n\nWatch the big screen.","size":"lg"}'),

  -- 11 · Rewrite with the big pool (4 min)
  (10, 'Rewrite with the big pool', 'Establish', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/ai-predicts/big-pool.jpg","file_name":"big-pool.jpg"}',
    '{"type":"text_slide","title":"On your table","text":"Rewrite your weekend answer.\n\nYou can now use any word\nfrom the BIG pool\non the big screen.","size":"lg"}'),

  -- 12 · MOVE: draw the watch (4 min)
  (11, 'MOVE: draw the watch', 'Apply', 4, 'screen1_continue',
    '{"type":"whiteboard","title":"MOVE: half of you to each touch screen. Draw the hands at half past three, then press Send to big screen."}',
    '{"type":"whiteboard","title":"Draw the hands at half past three","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/ai-predicts/draw-the-watch.png","file_name":"draw-the-watch.png"}'),

  -- 13 · Catch the AI's guesses (5 min)
  (12, 'Catch the AI''s guesses', 'Apply', 5, 'screen1_continue',
    '{"type":"hazard_hotspots","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/ai-predicts/classroom.jpg","title":"We asked AI for: a clock at half past three, a LEFT-handed student, a glass full to the brim. Tap what it got wrong.","hotspots":[{"id":"clock","x":90.7,"y":10,"r":7,"label":"Clock says 10:30"},{"id":"hand","x":22.4,"y":75.9,"r":6,"label":"RIGHT hand"},{"id":"glass","x":68.9,"y":77.8,"r":6,"label":"Glass not full"},{"id":"writing","x":43.2,"y":85.2,"r":7,"label":"Scribble, not words"}]}',
    null),

  -- 14 · What AI drew (2 min)
  (13, 'What AI drew', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/ai-predicts/watches.jpg","file_name":"watches.jpg"}',
    '{"type":"text_slide","title":"Look at the big screen","text":"Same question,\ntwo answers.","size":"lg"}'),

  -- 15 · Be the AI (3 min)
  (14, 'Be the AI', 'Apply', 3, 'screen1_continue',
    '{"type":"whiteboard","title":"Be the AI: write the word that comes next. Don''t think! Then press Send to big screen."}',
    '{"type":"whiteboard","title":"Write the next word. Then press Send to big screen.","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/ai-predicts/be-the-ai.png","file_name":"be-the-ai.png"}'),

  -- 16 · MOVE: why did it guess wrong? (4 min)
  (15, 'MOVE: why did it guess wrong?', 'Apply', 4, 'screen1_continue',
    '{"type":"host_timer","label":"Back at your table: why did the AI guess wrong?","duration_secs":210}',
    '{"type":"text_slide","title":"Back to your table","text":"Pick 2 of the AI''s mistakes.\nFor each, write:\n\nWe asked for...\nIt drew...\nbecause most pictures it\nlearned from show...","size":"md"}'),

  -- 17 · Back to the sandwich (2 min)
  (16, 'Back to the sandwich', 'Apply', 2, 'screen1_continue',
    '{"type":"text_slide","title":"Back to the sandwich","text":"Whose mistake was it?\n\nThe AI predicted the most likely\nmeaning of the words it was given.","size":"md"}',
    '{"type":"text_slide","title":"Not now","text":"Stay at your table.\nWatch the big screen.","size":"lg"}'),

  -- 18 · Catch it out (1 min)
  (17, 'Catch it out', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"designed_slide","look":"bold","layout":"steps","kicker":"Your challenge","title":"Catch AI out","points":["Think of something to ask an AI that it will probably get WRONG","Write: We ask for ___","Write: It will give us ___","Write: because its pool is full of ___"],"chip":"Write it on your table. Next: 5 minutes."}',
    '{"type":"text_slide","title":"Not now","text":"Stay at your table.\nWatch the big screen.","size":"lg"}'),

  -- 19 · Write your challenge (5 min)
  (18, 'Write your challenge', 'Demonstrate', 5, 'screen1_continue',
    '{"type":"host_timer","label":"Catch AI out: write your challenge","duration_secs":300}',
    '{"type":"text_slide","title":"On your table","text":"We ask for ___\nIt will give us ___\nbecause its pool\nis full of ___","size":"md"}'),

  -- 20 · Read us your best (1 min)
  (19, 'Read us your best', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"text_slide","title":"Read us your best","text":"We ask for...\nIt will give us...\nbecause its pool is full of...","size":"lg"}',
    '{"type":"text_slide","title":"Not now","text":"Stay at your table.\nWatch the big screen.","size":"lg"}'),

  -- 21 · MOVE: has today changed your mind? (2 min)
  (20, 'MOVE: has today changed your mind?', 'Demonstrate', 2, 'screen2_submit',
    '{"type":"voting","question":"Has today changed how much you trust AI''s answers?","options":["Yes, a lot","A bit","No","Not sure"]}',
    null),

  -- 22 · AI is... (2 min)
  (21, 'AI is...', 'Demonstrate', 2, 'screen2_submit',
    '{"type":"word_cloud","title":"AI is...","prompt":"Finish the sentence in one or two words: AI is...","max_words":2}',
    null),

  -- 23 · Clever, or guessing? (1 min)
  (22, 'Clever, or guessing?', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"designed_slide","look":"night","layout":"statement","kicker":"Back to the first question","title":"AI is not thinking. It is predicting.","text":"It picks the most likely next word, or the most likely picture, from everything it has learned. So you check it.","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/ai-predicts/students.jpg"}',
    '{"type":"text_slide","title":"Thank you!","text":"AI is not thinking.\nIt is predicting.","size":"lg"}')
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
