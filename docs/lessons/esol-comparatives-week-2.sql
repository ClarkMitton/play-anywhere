-- ─────────────────────────────────────────────────────────────
-- ESOL COMPARATIVES WEEK 2 · 60 minutes · 16 steps · ESOL Entry 2
-- Built from Shamim Nizami's PowerPoint (Shamim/Comparatives and Superlatives/
-- Comparatives and superlatives.ppt, comparative slides only), the Ellii video
-- "Comparative Adjectives", two Wordwalls and the British Council's comparatives page.
-- No printing: learners write on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The slides are in the app's own media storage (lesson-media/lessons/esol-comparatives/),
-- so they show straight away. Copies are kept in public/lessons/esol-comparatives/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Comparatives Week 2: more than',
    'Week 2 of 2 on comparatives for ESOL Entry 2: more with long adjectives, good/better and bad/worse, than not then, and using comparatives to argue. Built from Shamim Nizami''s PowerPoint, the second half of the Ellii video, the British Council''s comparatives test and two photos. Learners write on the whiteboard tables and use the touch screens once. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"One question runs through Week 2: city or countryside, where is life better? Learners answer with one word in minute one and with comparatives in the last task. The week climbs from Week 1: a one-minute -er race, then the new step, more with long adjectives, then good/better and bad/worse, then choosing between -er and more, which is the analyse step. Shamim''s slides 6, 7 and 8 are the spine, in her order. The second half of the Ellii video teaches more and the irregular forms, and its practice section becomes a race at the tables. One trip to the touch screens covers the British Council''s test 2, which is about city, countryside and nature, and a question round. The last task: half the tables argue for the city, half for the countryside, then each table answers the other side. Nothing is printed.","objectives":["Choose -er or more for an adjective, and use better and worse.","Compare two things in a sentence with than, not then: The city is more exciting than the countryside.","Compare two real choices in several sentences, give a reason for a decision and answer another table''s argument."],"run_sheet":[{"slot_index":0,"teacher_says":"City or countryside: where is life better? Hands up for the city. Hands up for the countryside. Why? Ask three or four learners.","watch_for":"Learners: standing at the tables, each with a pen. Count the hands and write the numbers on the board. Expect one word: busy, quiet, shops, nice. Keep their words on the board: the last step asks again. Technique: open a question now and answer it properly at the end."},{"slot_index":1,"teacher_says":"Last week we learned -er. One minute: write the -er word for each one on your table. Go!","watch_for":"Learners: at the tables, writing. Answers: hotter, happier, nicer, busier, cheaper, bigger. Ask a table for each rule number from last week (4, 3, 2, 3, 1, 4). Technique: retrieval practice before new learning."},{"slot_index":2,"teacher_says":"Now a long word. Expensive. A phone is expensive. A car is ... ? Try it. Write it on your table.","watch_for":"Learners: at the tables. Let them try: expensiver, more expensive. Do not say which is right. Clap the syllables together: ex-pen-sive, three claps. Technique: predict before reveal."},{"slot_index":3,"teacher_says":"Say this BEFORE the clip starts: listen for three words. Expensive becomes what? Good becomes what? Bad becomes what? Write them on your table.","watch_for":"Learners: at the tables, writing as they watch. The clip plays 1:47 to 3:17 (90 seconds) and moves on by itself. Answers: more expensive, better, worse. It also gives modern: more modern, far: farther or further, and five example sentences (bigger than, better than, lazier than, more famous than, more expensive than). Technique: a watching task set before the clip."},{"slot_index":4,"teacher_says":"Expensive: more expensive. Was your table right? Read Shamim''s words with me. Clap them: com-for-ta-ble. Long word: more.","watch_for":"Learners: at the tables. This is Shamim''s slide 6. She calls it irregular; tell learners it is the rule for long words: two or more claps, use more. Do not add -er as well: more expensiver is wrong. Technique: open the floor to the watching task, then the rule."},{"slot_index":5,"teacher_says":"These three are different. Good: better. Bad: worse. Far: farther. Thumbs up for good, thumbs down for bad. I say good, you say better and show me. I say bad, you say worse.","watch_for":"Learners: at the tables, with thumbs. Shamim''s slide 7. Far comes up less: farther and further are both fine. Expect ''more good'' and ''badder'': these are the mistakes to stop. Technique: words with gestures, then call and response."},{"slot_index":6,"teacher_says":"I say a word. Clap it. Then show me: one finger for -er, two for more. Cheap. Modern. Dangerous. Lazy. Fast. Beautiful.","watch_for":"Learners: at the tables, clapping then showing fingers. Answers: cheaper (1), more modern (2), more dangerous (2), lazier (1: two claps but ends in y), faster (1), more beautiful (2). Lazy is the trap: two claps but -ier. Technique: a quick check where they stand, with clapping."},{"slot_index":7,"teacher_says":"Twelve words about places. Draw two columns on your table: -ER and MORE. Put each word in a column and write the comparative. Careful: one word is a trick.","watch_for":"Learners: at the tables. TABLE TASK 1. Write the twelve words on the board before you start the timer. Good is the trick: it goes in neither column, it is better. Round 2: tables move one place, circle mistakes and write one sentence with than using a word from each column. Stretch: which words are about the city and which about the countryside? With one table, pairs swap inside the table. Technique: sort and justify, then check another table."},{"slot_index":8,"teacher_says":"Back to your own table. Check the columns. Who found the trick? Good: better, not more good.","watch_for":"Learners: back at their own tables, checking. Busy and noisy end in y, so -ier, even with two claps. Safe takes r only (rule 2). Ask which mistakes the other table circled. Technique: self-check against a model."},{"slot_index":9,"teacher_says":"Say this BEFORE the clip starts: a word comes. Say the comparative before the video does. Then write it on your table.","watch_for":"Learners: at the tables, writing. Pause the video when each word appears and press play when most tables have written. Words: tall (the example), careful, good, noisy, dangerous, bad. Answers: taller, more careful, better, noisier, more dangerous, worse. Careful is new: two claps, no y, so more. The lesson moves on by itself when the video ends. Technique: a race at the tables, nobody a passenger during a video."},{"slot_index":10,"teacher_says":"Shamim''s common error. Than, not then, not that. Thumbs up or down: The city is busier then the countryside. The bus is cheaper than the taxi. My town is more nicer than London. Then: now walk to the touch screens.","watch_for":"Learners: at the tables, then MOVE. Thumbs: down (than), up, down (nicer, not more nicer). Say then and than slowly so the difference is heard. Then send the class to the touch screens, half at each. Technique: error spotting with thumbs."},{"slot_index":11,"teacher_says":"At the screen, read each sentence out loud with both choices. Talk, then tap. Press Finish at the end.","watch_for":"Learners: at the touch screens, half the class at each. This trip covers this step and the next. Answers: more peaceful, happier, more relaxed, colder, more interesting, tastier, worse, cleaner. Tastier and happier are the y rule; more relaxed is new (long word). Everyone waiting says the sentence with the person next to them. Press Try again if a second group wants a turn. Technique: real sentences from a trusted source, read aloud before tapping."},{"slot_index":12,"teacher_says":"Read each question aloud. Talk to the people at your screen first, then one person taps.","watch_for":"Learners: at the touch screens. Question 3 is a best-answer question: more noisy sounds possible, but noisy ends in y, so noisier. Ask why each time. Then say clearly: back to the tables. Technique: mixed question shapes, true or false, odd one out, best answer."},{"slot_index":13,"teacher_says":"Half the tables are City, half are Countryside. Write four sentences on your table: why is your side better? Use -er, more and than. Then you will move to a table on the other side, read their sentences, and answer them.","watch_for":"Learners: at the tables. TABLE TASK 2, and the proof of all three objectives. Give tables City and Countryside in turn. Keep this slide up and start a 5 minute timer over it from the remote (Timer, Add Timer). Round 1: four sentences with at least one -er and one more. Round 2 (another 5 minutes): tables move to a table on the other side, tick the correct sentences, fix one mistake and write one answer: But the city is more exciting than the countryside! Good sentences: The countryside is cleaner than the city. The city is more exciting. Houses are cheaper in the countryside. Stretch: Life is better in the ___ because ... Technique: argue, then answer the other side."},{"slot_index":14,"teacher_says":"Go back to your own table. Read the answer the other side wrote. Then one person from each table types your best sentence.","watch_for":"Learners: at the tables. One runner per table goes to a screen. Read each post out: -er or more? Is it than? The board keeps exactly what was typed. Technique: capture the product, and send a runner, not the room."},{"slot_index":15,"teacher_says":"The first question again. Where is life better? Hands up for the city. Hands up for the countryside. Did anyone change their mind? Ask two or three volunteers to say why, with a comparative.","watch_for":"Learners: at the tables. Compare the hands with the numbers on the board from minute one. A good answer: Life is better in the countryside because it is quieter and cleaner than the city. Point at the one-word answers from the start: now they are sentences. Technique: close the loop on the opening question."}],"verify_before_teaching":["Nothing is printed. Learners write on the whiteboard tables at steps 2, 3, 4, 8, 10 and 14, so every learner needs a pen and the tables need wiping first.","Watch the video. Week 2 plays 1:47 to 3:17 (more, good/better, bad/worse, the sentence pattern and five examples) at step 4, then the practice from 3:18 at step 10. The practice shows tall, careful, good, noisy, dangerous and bad, about ten seconds each, with no speech: pause it on each word.","Open the British Council test (step 12) on a touch screen first. It has 8 questions with two choices each: more peaceful, happier, more relaxed, colder, more interesting, tastier, worse, cleaner. It is from learnenglish.britishcouncil.org, A1-A2 Comparative adjectives, test 2. Test 1 is not used.","Step 14: keep the picture slide on the big screen and start a timer over it from the remote (Timer, Add Timer): 5 minutes for round 1, then 5 for round 2. A rotation timer would hide the photos.","Shamim calls her slide 6 ''Irregular comparatives'', but more expensive follows the rule for long words. Her title is kept; the tutor note says ''long words''. Her line ''Now you try making some sentences'' on slide 8 is left out, as the next steps do this. Her slides 9 to 16 (superlatives) are not used.","Table task 1 has ''good'' in it on purpose: it fits neither column. ''Quiet'' was left out because it has two syllables but takes -er (quieter), which breaks the simple rule. If it comes up, accept quieter.","Who is in the photos: an older Sikh man in a turban, a young Black woman, an East Asian student and a man in a wheelchair in the city; an older white woman with a walking stick and a South Asian family, the mother in a headscarf, in the countryside.","The whole class moves twice: to the touch screens after step 11, and back to the tables after step 13. At step 15 one person per table goes to a screen."],"safety_note":null,"media_requests":[],"brief":{"topic":"Comparatives with more, better and worse","level":"Entry 2","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · City or countryside? (3 min)
  (0, 'City or countryside?', 'Launch', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w2-02-city-or-countryside.png","file_name":"w2-02-city-or-countryside.png"}',
    null),

  -- 2 · Last week: -er race (3 min)
  (1, 'Last week: -er race', 'Launch', 3, 'screen1_continue',
    '{"type":"text_slide","text":"Write the -er word.  One minute.\n\nhot     happy     nice\nbusy     cheap     big","title":"Last week","size":"lg"}',
    null),

  -- 3 · Expensive? (2 min)
  (2, 'Expensive?', 'Establish', 2, 'screen1_continue',
    '{"type":"text_slide","text":"expensive  →  ???\n\nTry it. Write it on your table.","title":"A long word","size":"lg"}',
    null),

  -- 4 · Video: more (3 min)
  (3, 'Video: more', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=wXiD0FdON7k&start=107&end=197"}',
    '{"type":"text_slide","text":"Listen for:\n1  expensive  →  ?\n2  good  →  ?\n3  bad  →  ?","size":"lg"}'),

  -- 5 · Long words: more (2 min)
  (4, 'Long words: more', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w2-06-more.png","file_name":"w2-06-more.png"}',
    null),

  -- 6 · Good, better (2 min)
  (5, 'Good, better', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w2-07-irregular.png","file_name":"w2-07-irregular.png"}',
    null),

  -- 7 · Clap it (3 min)
  (6, 'Clap it', 'Establish', 3, 'screen1_continue',
    '{"type":"text_slide","text":"1 clap:  -er\n2 claps + y:  -ier\nlong word:  more\n\ncheap   modern   dangerous\nlazy   fast   beautiful","title":"Clap it","size":"lg"}',
    null),

  -- 8 · -er or more? (8 min)
  (7, '-er or more?', 'Apply', 8, 'screen1_continue',
    '{"type":"rotation_timer","label":"-er or more?","details":"Round 1: Two columns on your table: -ER and MORE. Put each word in a column and write the comparative.\nbig  cheap  safe  clean  busy  noisy\nexpensive  dangerous  peaceful  crowded  beautiful  good\nRound 2: Move. Check another table''s columns. Circle any mistakes. Write one sentence with than.","rounds":2,"round_secs":210,"move_secs":30,"move_text":"Stand up. Move to the next table."}',
    null),

  -- 9 · Answers (2 min)
  (8, 'Answers', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w2-09-answers.png","file_name":"w2-09-answers.png"}',
    null),

  -- 10 · Video: say it first (3 min)
  (9, 'Video: say it first', 'Apply', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=wXiD0FdON7k&start=198"}',
    '{"type":"text_slide","text":"Say it first.\nThen write it on your table.","size":"lg"}'),

  -- 11 · Than, not then (2 min)
  (10, 'Than, not then', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w2-08-errors.png","file_name":"w2-08-errors.png"}',
    null),

  -- 12 · British Council test (5 min)
  (11, 'British Council test', 'Apply', 5, 'screen1_continue',
    '{"type":"text_slide","text":"Choose the correct word.\nTalk first. Then tap.","size":"lg"}',
    '{"type":"embed","url":"https://gamedata.britishcouncil.org/lep25_embed/MjQ1OTE=/le","description":"British Council LearnEnglish, A1-A2 ''Comparative adjectives: 2''. Eight sentences about city, countryside and nature, each with two choices (for example ''a _____ life'': peacefuller / more peaceful). Tap an answer for each, then Finish to see the score; Try again resets it."}'),

  -- 13 · Which one? (4 min)
  (12, 'Which one?', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"true_or_false","text":"expensive  →  more expensive","correct_tf":true},{"type":"multiple_choice","text":"Which one takes MORE?","options":["cheap","busy","dangerous"],"correct":2},{"type":"multiple_choice","text":"The city is ___ than the village.","options":["noisier","more noisy","noisyer"],"correct":0},{"type":"true_or_false","text":"good  →  gooder","correct_tf":false},{"type":"multiple_choice","text":"The countryside is quieter ___ the city.","options":["then","than","that"],"correct":1}]}',
    null),

  -- 14 · Your side is better! (12 min)
  (13, 'Your side is better!', 'Demonstrate', 12, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w2-10-argue.png","file_name":"w2-10-argue.png"}',
    null),

  -- 15 · Our best sentence (3 min)
  (14, 'Our best sentence', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"City or countryside?","question":"One person from each table: type your best sentence.\nExample: The countryside is cleaner than the city."}',
    null),

  -- 16 · City or countryside? Again (3 min)
  (15, 'City or countryside? Again', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w2-02-city-or-countryside.png","file_name":"w2-02-city-or-countryside.png"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
