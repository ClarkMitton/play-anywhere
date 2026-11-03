-- ─────────────────────────────────────────────────────────────
-- ESOL ADJECTIVES 2: WHO IS IT? · 60 minutes · 16 steps · ESOL Entry 2
-- Follows ESOL Adjectives. Built from Shamim Nizami's note (Shamim/Shamim
-- adjectives 2.txt): one YouTube video (ESLvideo.com, "Describing People ~ Who
-- is it?") and her group sort Wordwall, with seven slides made in Canva.
-- No printing: learners write and draw on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The slides are in the app's own media storage (lesson-media/lessons/esol-adjectives-2/),
-- so they show straight away. Copies are kept in public/lessons/esol-adjectives-2/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Adjectives 2: Who is it?',
    'Adjectives for ESOL Entry 2, part two: describing what people look like with is, has and is wearing. Follows ESOL Adjectives. Built from Shamim Nizami''s video and Wordwall, with Canva slides. Learners draw and write on the whiteboard tables, use the touch screens once, and finish by describing a secret person for another table to find. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"One question runs through the hour: who is it? How do we describe a person so someone else can find them? It follows on from ESOL Adjectives, which described personality, and moves to appearance. Learners first sort the adjectives they know into personality and appearance, then learn three patterns: is + adjective, has + hair (length, style, colour) and is wearing. Shamim''s video is a real Who is it? game, played at the tables. A picture dictation is the first table task. One trip to the touch screens covers Shamim''s group sort Wordwall and a question round. The last task is an information gap: each table describes a secret person from a line-up of eight, and another table must find them. Pictures of strangers are used throughout, never classmates, so nobody''s looks are discussed. Nothing is printed.","objectives":["Sort adjectives into personality and appearance.","Describe appearance with is + adjective, has + hair in the right order (length, style, colour) and is wearing.","Write three sentences about a person so another table can find them, and check another table''s description."],"run_sheet":[{"slot_index":0,"teacher_says":"Look at the photo. I am thinking of one person. Listen. She is wearing a hijab. Who is it? Point. Now: he has a beard. Who is it? Point.","watch_for":"Learners: standing at the tables, each with a pen. Do not teach anything yet. They point, then say the person''s place: on the left, on the right. Ask: how did you know? Expect one word: hijab, beard. Write two or three of their words on the board and leave them there until the end. Technique: open a question now (how do we describe a person so someone can find them?) and answer it properly in the last step."},{"slot_index":1,"teacher_says":"Last time we used adjectives for personality: what a person is like inside. Today: appearance, what a person looks like. Draw a line down your table. Write PERSONALITY on one side and APPEARANCE on the other. Two minutes: write every adjective you know in the right column.","watch_for":"Learners: at the tables, writing on the table top. This links to ESOL Adjectives (the first lesson): ask for kind, clever, thoughtful, hardworking from last time. Count each table''s words aloud. Leave the columns on the table: the Wordwall later is the same sort. Stretch: add a word that could go in both (beautiful can describe a person inside and out). Technique: retrieval practice, sorting before being shown."},{"slot_index":2,"teacher_says":"She IS tall. She HAS long hair. Is, then an adjective. Has, then a thing: hair, a beard, blue eyes. I say a sentence with a gap. One finger for is, two fingers for has. She ... young. He ... a moustache. She ... short. He ... brown eyes. She ... curly hair.","watch_for":"Learners: at the tables, showing fingers. Answers: is, has, is, has, has. The common mistake is ''She is long hair''. If fingers are mixed, write the sentence on the board and ask: is there a thing after the adjective? Then it is has. Technique: a quick check where they stand, with fingers."},{"slot_index":3,"teacher_says":"Hair has an order: one, how long; two, the style; three, the colour. Long curly black hair. Now write these on your table in the right order: black / long / hair. brown / short / straight / hair. grey / curly / hair.","watch_for":"Learners: at the tables, writing. Write the three jumbled sets on the board first. Answers: long black hair, short straight brown hair, curly grey hair. Teach curly and straight with your hands. Stretch: write the hair of someone in the photo on slide one. Technique: notice the rule, then use it straight away."},{"slot_index":4,"teacher_says":"Clothes are not hair. For clothes we say is wearing. He is wearing glasses. She is wearing a red hijab. Tell me what I am wearing today. Then tell the person next to you about one thing you are wearing.","watch_for":"Learners: at the tables, in pairs. Wearing is for clothes, glasses, jewellery and a hijab or turban. Describe your own clothes as the model, so nobody''s body is described. Listen for ''I am wearing a blue jumper'', and for the article: a necklace, but glasses with no a. Technique: model on yourself, then pair practice."},{"slot_index":5,"teacher_says":"Say this BEFORE the clip starts: you will see photos of people with names. Listen to the description. Write the number and the name on your table. Ten people. Ready?","watch_for":"Learners: at the tables, writing. Video on all three screens, full focus. It is two minutes, a slow clear voice, with each description about five seconds before the next number: pause the video if tables need longer. Three photo grids: numbers 1 and 2 use Cynthia, Emma, Mathias and Gabe; 3 to 6 use Ray, Lucas, Jade, Brook, Todd, Josh, Paola and Lin; 7 to 10 use Mandy, Tom, Ash, Frank, Tori, Shane, Elijah and Julia. The video never shows the answers. Answers: 1 Cynthia, 2 Mathias, 3 Brook, 4 Jade, 5 Ray, 6 Todd, 7 Tom, 8 Julia, 9 Frank, 10 Ash. The clip stops before the photo credits. Technique: a watching task set before the clip, with every table writing."},{"slot_index":6,"teacher_says":"Check your table. How many did you get? Which one was difficult? Number 3: she has long curly black hair. Is it is or has? Number 6: he''s bald. Is it is or has?","watch_for":"Learners: at the tables, ticking their answers. Bald takes is (he is bald), a beard takes has. Read out three of the video''s sentences and have tables say is or has. If tables disagree on 9 or 10, take their reasons: that is the point. Technique: open the floor to the watching task, never straight into a quiz."},{"slot_index":7,"teacher_says":"Pens ready. Draw this person, big, on your table. Listen. He is tall. He is old. He has short curly grey hair. He has a beard. He is wearing glasses and a red scarf. I will say it again.","watch_for":"Learners: at the tables, drawing. TABLE TASK 1. Read the description three times, slowly. Nobody needs to draw well: a stick person with the right hair and glasses is perfect. Round 2: tables move one place, look at the drawing and write one sentence about it next to it (He has a beard). Stretch: two sentences, or a second person: She is young. She has long straight black hair. She is wearing a yellow hijab. At the end, say: now walk to the touch screens. Technique: a picture dictation, then write about another table''s work."},{"slot_index":8,"teacher_says":"Tap Start. Drag each word: personality or appearance. Take turns: one word each. While you wait, look at your table''s two columns. Is the word already there?","watch_for":"Learners: at the touch screens, half the class at each. This trip covers this step and the next. The game has ugly in it: say plainly that it is an appearance word and it is not kind to say about a person. Compare with the columns they wrote at step 2. Technique: a game in learners'' hands that checks an earlier table task."},{"slot_index":9,"teacher_says":"Read each question aloud. Talk to the people at your screen first, then one person taps. Then: back to the tables.","watch_for":"Learners: at the touch screens. Answers: has, true, kind (personality, the others are appearance), true, He has curly brown hair. The last is a best-answer question: the third option is nearly right, but the colour comes last. Ask why each wrong one is wrong. Then send everyone back to their tables. Technique: mixed question shapes, gap fill, true or false, odd one out and best answer."},{"slot_index":10,"teacher_says":"She is old. She has short grey hair. She is wearing glasses. Three sentences: is, has, is wearing. Now look at eight people.","watch_for":"Learners: back at the tables. Read the model and point at is, has and is wearing on the checklist. Write the checklist on the board now, because the line-up slide and the timer will cover this one: is + adjective, has + hair, is wearing. Technique: show a model and the success criteria before the task."},{"slot_index":11,"teacher_says":"Eight people. I will come to your table and whisper a number. Do not say it! Your table writes three sentences about that person. Then another table reads them and finds who it is.","watch_for":"Learners: at the tables. Walk round and whisper a different number to each table. Keep a note of which table has which. The eight: 1 a young Black woman, long braids, a yellow top. 2 a Sikh man, a blue turban, a black beard, a blue shirt. 3 an older white woman, short grey hair, glasses, a green top. 4 a young East Asian man, short black hair, a green T-shirt. 5 a South Asian woman, a pink hijab. 6 an older Black man, very short grey hair, a grey beard. 7 a young white woman, long straight red hair, a blue top. 8 a young man, curly brown hair, a beard, a beige jacket, in a wheelchair. Do not give out number 3: she is close to the model on the last slide. 3 and 4 both wear green, so tables must use the hair too. Leave this slide up as long as possible, then start the timer: tables can look at the people again during round 2 only if you go back. Technique: an information gap, so the writing has a real reader."},{"slot_index":12,"teacher_says":"Round 1: three sentences about your secret person. Don''t write the number. Round 2: move to the next table, read their sentences, and write the number you think it is.","watch_for":"Learners: at the tables. TABLE TASK 2, and the proof of the lesson. Round 1: a good description has is + an adjective, has + hair in the right order, and is wearing. Round 2: tables move one place, read, write their guess and tick one good sentence. Before round 2 starts, go back one step so the line-up is on the big screen, then come forward again: the timer covers it. Stretch: a fourth sentence with a personality adjective from last lesson (She looks friendly). Technique: create, then test it on a real reader."},{"slot_index":13,"teacher_says":"Go back to your own table. Read the guess. Is it right? Hands up if they found your person. If not: which sentence was not clear?","watch_for":"Learners: back at their own tables. A wrong guess is useful: ask which sentence could fit two people and how to fix it (add the colour, add is wearing). Technique: self-assessment against a real result."},{"slot_index":14,"teacher_says":"One person from each table: go to a touch screen and type your three sentences. No number. Everyone else: read the board and say the number.","watch_for":"Learners: at the tables. One runner per table goes to a screen. As each description appears, the class calls out the number. Check capital letters and full stops. Technique: capture the product, and send a runner, not the room."},{"slot_index":15,"teacher_says":"The first photo again. At the start you said one word: hijab, beard. Now describe one person in three sentences. Your partner points.","watch_for":"Learners: at the tables, in pairs. Point at the words you wrote on the board in the first minute: one word then, three sentences now. Ask: which is harder, is or has? Wipe the tables at the end. Technique: close the loop on the opening question."}],"verify_before_teaching":["Watch the video (ESLvideo.com, ''Describing People ~ Who is it?'', 2 minutes). It plays to 1:57 (&end=117), before the photo credits. The full transcript: 1 She has long black hair. She is wearing a gray sweatshirt. 2 He has blonde hair and blue eyes. He''s wearing a blue T-shirt. 3 She has long curly black hair. She''s wearing a necklace. 4 She is smiling. She has red hair. She has a lot of freckles. 5 He has curly brown hair. He''s wearing glasses. 6 He has a beard and mustache. He''s bald. 7 He has gray hair. He''s wearing a red shirt and a baseball cap. 8 She has short brown hair and green eyes. 9 He has short black hair and a mustache. 10 She has long blonde hair. She''s wearing a blue shirt.","The video never shows its answers. The answers in the notes were worked out from stills: 1 Cynthia, 2 Mathias, 3 Brook, 4 Jade, 5 Ray, 6 Todd, 7 Tom, 8 Julia, 9 Frank, 10 Ash. Check 9 and 10 by eye: Frank has glasses as well as a moustache, and Mandy also has long blonde hair.","The voice is American: gray, mustache. British spelling is grey, moustache. Worth saying.","Shamim''s second Wordwall (the ''Describing People - Adjectives'' Quiz, wordwall.net/resource/36754753) is left out on purpose. Question 5 shows a man dressed as a woman, labelled ''The \"woman\" is…'', with ugly as the answer, and ugly is an option on three other photos of real people. Learners play Wordwalls themselves on the touch screens, so the tutor cannot skip a question. To add it back, add an embed step with https://wordwall.net/embed/9d50a07a789b4e0f8c1a50ce71e438a1?themeId=1&templateId=5 on the touch screens.","The group sort Wordwall also contains ugly. The tutor note at step 9 says to name it as unkind.","The seven slides were made in Canva. Who is in them is listed in the WWW entry. Check you are happy with the line-up on slide 6 before teaching, because the last task depends on every person looking clearly different.","Nothing is printed. Learners write and draw on the whiteboard tables at steps 2, 4, 6, 8, 13, so every learner needs a pen and the tables need wiping first.","The whole class moves twice: to the touch screens after step 8, and back to the tables after step 10. At step 15 only one person per table goes to a screen.","The timer covers the slide in both table tasks. Write the checklist on the board at step 11, and go back to the line-up slide between rounds of step 13 if tables need it."],"safety_note":null,"media_requests":[],"brief":{"topic":"Adjectives 2: describing appearance (Who is it?)","level":"Entry 2","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · Who is it? (2 min)
  (0, 'Who is it?', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives-2/slide-01.jpg","file_name":"slide-01.jpg"}',
    null),

  -- 2 · Personality or appearance? (4 min)
  (1, 'Personality or appearance?', 'Establish', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives-2/slide-02.jpg","file_name":"slide-02.jpg"}',
    null),

  -- 3 · is or has? (3 min)
  (2, 'is or has?', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives-2/slide-03.jpg","file_name":"slide-03.jpg"}',
    null),

  -- 4 · Long, curly, black (3 min)
  (3, 'Long, curly, black', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives-2/slide-04.jpg","file_name":"slide-04.jpg"}',
    null),

  -- 5 · He is wearing (2 min)
  (4, 'He is wearing', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives-2/slide-05.jpg","file_name":"slide-05.jpg"}',
    null),

  -- 6 · Video: Who is it? (4 min)
  (5, 'Video: Who is it?', 'Apply', 4, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=YsDfuAiIzDE&end=117"}',
    null),

  -- 7 · Who did you find? (2 min)
  (6, 'Who did you find?', 'Apply', 2, 'screen1_continue',
    '{"type":"text_slide","text":"1 Cynthia   2 Mathias\n3 Brook   4 Jade   5 Ray   6 Todd\n7 Tom   8 Julia   9 Frank   10 Ash","size":"lg","title":"Who is it?"}',
    null),

  -- 8 · Listen and draw (8 min)
  (7, 'Listen and draw', 'Apply', 8, 'screen1_continue',
    '{"type":"rotation_timer","label":"Listen and draw","details":"Round 1: Listen to the teacher. Draw the person on your table.\nRound 2: Move to the next table. Look at the drawing.\nWrite one sentence about it: is, has or is wearing.","rounds":2,"round_secs":210,"move_secs":30,"move_text":"Stand up. Move to the next table."}',
    null),

  -- 9 · Wordwall: sort the adjectives (5 min)
  (8, 'Wordwall: sort the adjectives', 'Apply', 5, 'screen1_continue',
    '{"type":"text_slide","text":"Personality or appearance?\nSort the words.","size":"lg"}',
    '{"type":"embed","url":"https://wordwall.net/embed/a628f813a69c4ce78eeca8449dbdbed1?themeId=1&templateId=2","description":"Shamim''s Wordwall ''Describing People - Adjectives''. It is a Group sort: tap Start, then drag each adjective into Personality or Appearance. About 20 words, shown a few at a time, including beautiful, tall, slim, handsome, old, young and ugly."}'),

  -- 10 · is, has or wearing? (4 min)
  (9, 'is, has or wearing?', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"She ___ long black hair.","options":["is","has","is wearing"],"correct":1},{"type":"true_or_false","text":"He has short straight brown hair.\nThe order is right.","correct_tf":true},{"type":"multiple_choice","text":"Odd one out.","options":["tall","slim","kind","young"],"correct":2},{"type":"true_or_false","text":"She is wearing a necklace.","correct_tf":true},{"type":"multiple_choice","text":"Which is the best sentence?","options":["He is curly brown hair.","He has curly brown hair.","He has brown curly hair."],"correct":1}]}',
    null),

  -- 11 · Write about a person (2 min)
  (10, 'Write about a person', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives-2/slide-07.jpg","file_name":"slide-07.jpg"}',
    null),

  -- 12 · Eight people (2 min)
  (11, 'Eight people', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives-2/slide-06.jpg","file_name":"slide-06.jpg"}',
    null),

  -- 13 · Who is it? Write and guess (12 min)
  (12, 'Who is it? Write and guess', 'Demonstrate', 12, 'screen1_continue',
    '{"type":"rotation_timer","label":"Who is it?","details":"Round 1: Write 3 sentences about your secret person.\nDo NOT write the number.\nis + adjective   has + hair   is wearing\nRound 2: Move. Read. Write the number: Who is it?\nTick one good sentence.","rounds":2,"round_secs":300,"move_secs":30,"move_text":"Stand up. Move to the next table."}',
    null),

  -- 14 · Did they find you? (2 min)
  (13, 'Did they find you?', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives-2/slide-06.jpg","file_name":"slide-06.jpg"}',
    null),

  -- 15 · Our best description (3 min)
  (14, 'Our best description', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"Who is it?","question":"Type your table''s 3 sentences.\nDo not type the number!"}',
    null),

  -- 16 · Who is it? Again (2 min)
  (15, 'Who is it? Again', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives-2/slide-01.jpg","file_name":"slide-01.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
