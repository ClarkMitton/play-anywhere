-- ─────────────────────────────────────────────────────────────
-- ESOL COMPARATIVES WEEK 1 · 60 minutes · 16 steps · ESOL Entry 2
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
    'ESOL Comparatives Week 1: -er than',
    'Week 1 of 2 on comparatives for ESOL Entry 2: short adjectives, the four -er spelling rules, and than. Built from Shamim Nizami''s PowerPoint, with both of her Wordwalls, the first half of one short video and three photo pairs to compare. Learners write on the whiteboard tables and use the touch screens once. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"One idea runs through Week 1: when we compare two things with a short adjective, we add -er and use than. The tutor holds up two things in minute one and learners say what they can; in the last minute they compare the two houses in full sentences. Shamim''s comparatives slides are the spine, in her order: what a comparative is, her four spelling rules, her ''Now you try'' as the first table task, and her answers. The first half of the Ellii video teaches -er only; its second half (more, good/better) is kept for Week 2, so the two weeks climb. Both Wordwalls and a question round share one trip to the touch screens. The last task: each table compares a pair of photos in five sentences, then another table checks the spelling against the four rules. Nothing is printed.","objectives":["Make the comparative of short adjectives, spelling it with the right rule: colder, later, happier, bigger.","Compare two things in a sentence with than: The puppy is smaller than the dog."],"run_sheet":[{"slot_index":0,"teacher_says":"Look at the two houses. Which house do you like? Why? Ask three or four learners.","watch_for":"Learners: standing at the tables, each with a pen. Do not teach anything yet. Expect single words: big, new, old, nice, small. Write two or three of their answers on the board and leave them there. This question comes back in the last step. Technique: open a question now and answer it properly at the end."},{"slot_index":1,"teacher_says":"Hold up two pens, one longer. This pen is long. This pen is longer. Now hold up two bags. This bag is big. This bag is bigger. Your turn: take two things from your table. Tell your table.","watch_for":"Learners: at the tables, holding pens, phones, bags, keys. Do it before explaining anything. Listen for -er words: longer, bigger, smaller, heavier. Some will say ''more big'': do not correct yet, just notice who. Technique: do it before being told."},{"slot_index":2,"teacher_says":"Read it with me. Younger. Harder. These are comparatives. We use them to compare two things. And we use than. Sadia is younger than Shamaila.","watch_for":"Learners: at the tables. This is Shamim''s slide 2. Point at the orange -er and the green than every time. ''It is harder to find a job now'' compares now with before: a change. Technique: name the idea after learners have already used it."},{"slot_index":3,"teacher_says":"Say this BEFORE the clip starts: listen for three words. Short becomes what? Big becomes what? Hungry becomes what? Write them on your table.","watch_for":"Learners: at the tables, writing as they watch. The clip plays 0:32 to 1:47 (about 75 seconds), then moves on by itself. Answers: shorter, bigger (double the g), hungrier (y becomes i). It also says noisy becomes noisier. The examples at the start include ''more beautiful'': leave ''more'' for next week. Technique: a watching task set before the clip."},{"slot_index":4,"teacher_says":"What did you write? Short: shorter. Big: bigger. Hungry: hungrier. Now Shamim''s four rules. Read each one with me. Which rule is big? Which rule is hungry?","watch_for":"Learners: at the tables. These are the same three words they listened for, and the video gave three of Shamim''s four rules. Rule 2 (late, later) was not in the video. Point at the numbers 1 to 4: learners use them in the next two steps. Technique: open the floor to the watching task, then connect it to the rule."},{"slot_index":5,"teacher_says":"I say a word, you show me the rule on your fingers. Nice! Hot! Easy! Tall! Sad! Busy! Then say the -er word together.","watch_for":"Learners: at the tables, holding up fingers. Answers: nice 2 (nicer), hot 4 (hotter), easy 3 (easier), tall 1 (taller), sad 4 (sadder), busy 3 (busier). Mixed fingers mean go back to the rules slide. Technique: a quick check where they stand, no screens needed."},{"slot_index":6,"teacher_says":"Shamim''s seventeen words. Write the -er word for each one on your table. Then you will move, check another table''s words and write the rule number next to each.","watch_for":"Learners: at the tables. TABLE TASK 1. Show the ''Now you try'' slide on the touch screens and write the 17 words on the board before you start the timer. Round 1: each table writes all 17. Round 2: tables move one place, tick or fix each word and write the rule number beside it, which is the harder job. Stretch: put three of the words in a sentence with than. With one table, pairs swap inside the table. Technique: do it, then check someone else''s work against the rules."},{"slot_index":7,"teacher_says":"Go back to your own table. Check the answers. Which words did the other table fix? Orange words need care. Dry: drier. Slim: slimmer. Wet: wetter. Then: now walk to the touch screens.","watch_for":"Learners: back at their own tables, checking, then MOVE. This is Shamim''s answer slide with the rule number added. The usual mistakes: dryer, slimer, hoter, larger written as largeer. Then send the class to the touch screens, half at each. Technique: self-check against a model."},{"slot_index":8,"teacher_says":"At the screen, take turns. Read the sentence out loud with the right word before you tap.","watch_for":"Learners: at the touch screens, half the class at each. This trip covers this step and the next two. Everyone waiting says the sentence too. One question offers ''funnyer'' as a wrong answer: ask why it is wrong (rule 3: funnier). Technique: a game in learners'' hands, with the sentence said before the tap."},{"slot_index":9,"teacher_says":"One person spins. Everyone at your screen says the -er word. The spinner makes a sentence with than about something in this room. Then the next person spins.","watch_for":"Learners: at the touch screens. A good answer: My bag is heavier than your bag. Friendly and quiet have two syllables but take -er (friendlier, quieter): accept them and say these are special. Keep sentences about things, not people''s bodies. Technique: spin, say, then make it real."},{"slot_index":10,"teacher_says":"Read each question aloud. Talk to the people at your screen first, then one person taps.","watch_for":"Learners: at the touch screens. Mixed shapes: true or false, best answer, odd one out. After each answer ask which rule it is. Then say clearly: back to the tables. Technique: mixed question shapes, each tied back to a rule."},{"slot_index":11,"teacher_says":"Back at your tables. Read the three sentences with me. What comes after the -er word? Than. Now I say a sentence, you show me thumbs up or down. The dog is bigger than the puppy. The bus is fast than the bike. My bag is heavier then your bag.","watch_for":"Learners: at the tables. Thumbs: up, down (faster), down (than, not then). The first two sentences are from the video. Point at the line at the top: thing, is, -er, than, thing. Technique: a quick check where they stand with thumbs."},{"slot_index":12,"teacher_says":"Look at the dogs. Tell your table three sentences. Small, big, old, young, happy. Do not write yet.","watch_for":"Learners: at the tables, talking. Good answers: The puppy is smaller than the dog. The dog is older than the puppy. The puppy is happier than the dog. Listen for than. Technique: say it before you write it."},{"slot_index":13,"teacher_says":"Each table gets a letter: A, B or C. Write five sentences comparing your two pictures, on your table. Use -er and than. Check the spelling with the rules. Then you will move and check another table.","watch_for":"Learners: at the tables. TABLE TASK 2, and the proof of both objectives. Give each table A, B or C (a fourth table takes A). Keep this slide up and start a 5 minute timer over it from the remote (Timer, Add Timer), so the pictures stay on screen. Round 1: five sentences. Round 2 (another 5 minutes): tables move one place, check every -er word against the four rules, tick the best sentence and fix one mistake. Good set: five different adjectives, at least one from rules 2, 3 or 4 (nicer, heavier, bigger), than every time. Stretch: which one do you like? Why? I like the bike because it is cheaper. Technique: create, then check each other''s work against the rules."},{"slot_index":14,"teacher_says":"Go back to your own table and read the ticks. Then one person from each table: type your best sentence. Capital letter, full stop.","watch_for":"Learners: at the tables. One runner per table goes to a screen. Read each sentence out: which rule is the -er word? Is than there? The board keeps exactly what was typed. Technique: capture the product, and send a runner, not the room."},{"slot_index":15,"teacher_says":"The first question again. Which house do you like? Why? Answer with than. Ask two or three volunteers.","watch_for":"Learners: at the tables. A good answer: I like the new house because it is bigger than the old house. Or: I like the old house. It is smaller and cheaper. Point at the one-word answers on the board from the start. Next week: long words like expensive. Technique: close the loop on the opening question."}],"verify_before_teaching":["Nothing is printed. Learners write on the whiteboard tables at steps 4, 7, 8 and 14, so every learner needs a pen and the tables need wiping first.","Watch the video (Ellii, ''Comparative Adjectives'', 4 minutes 51 seconds). Week 1 plays 0:32 to 1:47, which is what comparatives are and the three -er rules. It stops before ''more''. Week 2 plays the rest. It says ''color'' (American English).","Both Wordwalls are by lgillies, not Shamim. The picture quiz (''Team 1 - comparatives'') has about nine questions such as ''The dog is ... than the puppy.'' with four options; one distractor is spelled ''funnyer'' on purpose, and ''granddaughter'' is misspelled ''grandaughter'' in one question. The spin the wheel (''Comparatives'') has 17 short adjectives. Open both before the lesson.","Step 14: keep the picture slide on the big screen and start a timer over it from the remote (Timer, Add Timer): 5 minutes for round 1, then 5 for round 2. A rotation timer would hide the photos.","Shamim''s slides 2 to 5 are rebuilt with her wording, in her order. Her title slide is left out because each week opens on a photo. Her ''Now you try'' words became Table task 1.","Who is in the photos: an older Black man and a young white woman with the dogs, a woman in a hijab on the bike. The houses have nobody in them.","The whole class moves twice: to the touch screens after step 8, and back to the tables after step 11. At step 15 one person per table goes to a screen.","Week 2 starts with a one-minute -er race on the tables, so note who struggled with the spelling rules today."],"safety_note":null,"media_requests":[],"brief":{"topic":"Comparatives with -er and than","level":"Entry 2","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · Which house? (3 min)
  (0, 'Which house?', 'Launch', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/still-houses.jpg","file_name":"still-houses.jpg","title":"Which house do you like? Why?"}',
    null),

  -- 2 · Two things (3 min)
  (1, 'Two things', 'Launch', 3, 'screen1_continue',
    '{"type":"text_slide","text":"This pen is long.\nThis pen is longer.\n\nYour turn: two things\nfrom your table.","title":"Two things","size":"lg"}',
    null),

  -- 3 · Comparatives (2 min)
  (2, 'Comparatives', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w1-02-comparatives.png","file_name":"w1-02-comparatives.png"}',
    null),

  -- 4 · Video: -er (3 min)
  (3, 'Video: -er', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=wXiD0FdON7k&start=32&end=107"}',
    '{"type":"text_slide","text":"Listen for:\n1  short  →  ?\n2  big  →  ?\n3  hungry  →  ?","size":"lg"}'),

  -- 5 · Regular comparatives (3 min)
  (4, 'Regular comparatives', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w1-03-regular.png","file_name":"w1-03-regular.png"}',
    null),

  -- 6 · Show me the rule (2 min)
  (5, 'Show me the rule', 'Establish', 2, 'screen1_continue',
    '{"type":"text_slide","text":"Which rule? Show me 1, 2, 3 or 4.\n\nnice     hot     easy\ntall     sad     busy","title":"Show me the rule","size":"lg"}',
    null),

  -- 7 · Now you try (8 min)
  (6, 'Now you try', 'Apply', 8, 'screen1_continue',
    '{"type":"rotation_timer","label":"Now you try","details":"Round 1: Write the -er word on your table.\nsafe  clean  dry  heavy  light  easy  high  low  wide\nhot  slim  large  noisy  wet  happy  fast  slow\nRound 2: Move. Check another table''s words. Write the rule, 1 2 3 or 4, next to each one.","rounds":2,"round_secs":210,"move_secs":30,"move_text":"Stand up. Move to the next table."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w1-04-now-you-try.png","file_name":"w1-04-now-you-try.png"}'),

  -- 8 · Answers (2 min)
  (7, 'Answers', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w1-05-answers.png","file_name":"w1-05-answers.png"}',
    null),

  -- 9 · Wordwall: which word? (4 min)
  (8, 'Wordwall: which word?', 'Apply', 4, 'screen1_continue',
    '{"type":"text_slide","text":"Choose the right word.\nSay the sentence.","size":"lg"}',
    '{"type":"embed","url":"https://wordwall.net/embed/73f391d7aa0c439f8bee8b0216d6ca22?themeId=21","description":"Wordwall ''Team 1 - comparatives'' (lgillies). A picture quiz: a sentence with a gap and a photo, for example ''The dog is ... than the puppy.'', and four -er words to choose from. About nine questions."}'),

  -- 10 · Wordwall: spin it (4 min)
  (9, 'Wordwall: spin it', 'Apply', 4, 'screen1_continue',
    '{"type":"text_slide","text":"Spin.\nSay the -er word.\nMake a sentence with than.","size":"lg"}',
    '{"type":"embed","url":"https://wordwall.net/embed/3c028dbe4a2f4d3fa838b44773b47517?themeId=21","description":"Wordwall ''Comparatives'' (lgillies). Spin the wheel: tap to spin and it lands on one of 17 short adjectives: happy, tall, short, old, young, friendly, quiet, smart, fast, slow, loud, busy, heavy, light, nice, hot, cold."}'),

  -- 11 · Spot the mistake (4 min)
  (10, 'Spot the mistake', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"true_or_false","text":"hot  →  hoter","correct_tf":false},{"type":"multiple_choice","text":"The bus is ___ than the bike.","options":["bigger","more big","big"],"correct":0},{"type":"multiple_choice","text":"Which one is spelled WRONG?","options":["happier","bigger","easyer"],"correct":2},{"type":"true_or_false","text":"nice  →  nicer","correct_tf":true},{"type":"multiple_choice","text":"My bag is heavy.\nYour bag is ___ than my bag.","options":["heavyer","heavier","more heavy"],"correct":1}]}',
    null),

  -- 12 · Compare two things (3 min)
  (11, 'Compare two things', 'Apply', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w1-06-pattern.png","file_name":"w1-06-pattern.png"}',
    null),

  -- 13 · Say it first (2 min)
  (12, 'Say it first', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/still-dogs.jpg","file_name":"still-dogs.jpg","title":"Say 3 sentences. The puppy is ___er than the dog."}',
    null),

  -- 14 · Compare the two (12 min)
  (13, 'Compare the two', 'Demonstrate', 12, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/w1-07-compare.png","file_name":"w1-07-compare.png"}',
    null),

  -- 15 · Our best sentence (3 min)
  (14, 'Our best sentence', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"Our best sentence","question":"One person from each table: type your table''s best sentence.\nExample: The puppy is smaller than the dog."}',
    null),

  -- 16 · Which house? Again (2 min)
  (15, 'Which house? Again', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-comparatives/still-houses.jpg","file_name":"still-houses.jpg","title":"Which house do you like? Why?"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
