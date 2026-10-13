-- ─────────────────────────────────────────────────────────────
-- ESOL ADJECTIVES · 60 minutes · 24 steps · ESOL Entry 2
-- Built from Shamim Nizami's PowerPoint (Shamim/E2/Adjectives/adjectives.ppt)
-- and one YouTube video (Ellii, "Adjectives"), used in two parts.
-- No printing: learners write on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The slides are in the app's own media storage (lesson-media/lessons/esol-adjectives/),
-- so they show straight away. Copies are kept in public/lessons/esol-adjectives/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Adjectives',
    'Adjectives for ESOL Entry 2: describing people, and where the adjective goes. Built around Shamim Nizami''s PowerPoint, with one short video used in two parts and five picture prompts. Learners write on the whiteboard tables and use the touch screens once. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"One idea runs through the hour: adjectives let us describe people, and they go in two places in a sentence. Shamim''s PowerPoint is the spine, in her order. Her nine sentence slides are a fast warm-up where learners write their own adjectives first and then see hers, three of them as a task on the tables. Her moods and personality slides turn the lesson to people. The Ellii video then gives the two patterns, and its own practice section becomes a race at the tables. The last task is Shamim''s own: write about a classmate with positive adjectives, now using both patterns, and improve another pair''s work. Nothing is printed. Learners write on the whiteboard tables throughout and make one trip to the touch screens.","objectives":["Identify the adjectives in a sentence and say what each one describes.","Use an adjective in front of a noun, and after is or are, in a correct sentence.","Write three sentences about a classmate with positive adjectives, and improve another pair''s sentences."],"run_sheet":[{"slot_index":0,"teacher_says":"Think about a friend. What is he or she like? Ask three learners, one at a time, and wait for each answer.","watch_for":"Learners: standing at the tables, each with a pen. Do not teach anything yet. Expect one word: nice, good, kind. Write two or three of their words on the board and leave them there until the end. Technique: open a question now and answer it properly in the last step."},{"slot_index":1,"teacher_says":"Look at the picture. Write words on your table. Tell me about the boy. Tell me about the street. You have two minutes. How many words can your table write?","watch_for":"Learners: at the tables, writing on the table top. Do not say the word adjective yet. Any true word is welcome: young, happy, fast, blue, small, old, long. Count the words on each table out loud. Technique: do it before being told. The words they write become the first examples."},{"slot_index":2,"teacher_says":"Point at the words on one table. Young. Fast. Happy. These words have a name. They are adjectives. Adjectives are describing words. Say it with me.","watch_for":"Learners: at the tables. This is Shamim''s first slide. Have each table draw a circle round three of their own words and say: these are adjectives. Technique: name the idea after learners have already used it."},{"slot_index":3,"teacher_says":"Read the first sentence. Now read the second one. Which words are new? Healthy tells us about which word? Narrow tells us about which word?","watch_for":"Learners: at the tables. A good answer names the pair: healthy describes the boy, narrow describes the street. Ask who wrote a word like these in the last step. Point out where the adjective sits: in front of the noun. Technique: predict, then reveal and compare."},{"slot_index":4,"teacher_says":"Two sentences from Shamim. Find the adjectives. Write them on your table. Then draw an arrow from each adjective to the thing it describes.","watch_for":"Learners: at the tables, writing. Answers: soft and colourful describe the jumper, deep and blue describe the pool. Stretch: write one more adjective for the jumper and one more for the pool. Shamim''s slides 3 and 4 share this screen. Technique: every learner finds and writes, nobody only watches."},{"slot_index":5,"teacher_says":"A new picture. Three adjectives for this house. One minute. Go.","watch_for":"Learners: at the tables, writing. Keep it fast and a little noisy. Likely words: big, old, dark, scary, cold, empty. Do not give the word creepy yet. Technique: a timed race, then reveal."},{"slot_index":6,"teacher_says":"Here is Shamim''s sentence. Large. Old. Creepy. Did your table get one of these? Creepy means it makes you feel a little afraid. Show me a creepy face.","watch_for":"Learners: at the tables. Praise any table with a matching word or a good different one, such as scary. Three adjectives can sit together in front of one noun. Technique: compare your answer with a model."},{"slot_index":7,"teacher_says":"Three plain sentences. Make them better. Write them on your table and add adjectives. Then you will move, read another table''s work and underline their adjectives.","watch_for":"Learners: at the tables. TABLE TASK 1. Write the three plain sentences on the board before you start the timer, in case the wording on screen is hard to read from the back. Round 1: each table writes all three with adjectives added. Round 2: tables move one place, underline every adjective they find and tick the sentence they like best. Stretch: two adjectives for one noun, or an adjective for the sky as well as the lightning. With one table, pairs swap inside the table. Technique: create, then check each other''s work."},{"slot_index":8,"teacher_says":"Go back to your own table. Look at the ticks. Now look at Shamim''s sentences. Which of your adjectives are the same? Which of yours do you like more?","watch_for":"Learners: back at their own tables. Shamim''s slides 6, 7 and 8 share this screen, as the answers to the task. Read each one aloud and have a table read out their own version. There is no single right answer: quiet, busy and long are all good for the street. Technique: compare with a model, and value different correct answers."},{"slot_index":9,"teacher_says":"Now a person. Pens down. One adjective for this lady. Do not write it. Tell your table.","watch_for":"Learners: at the tables, talking, not writing. From here the lesson is about describing people. Listen for happy, beautiful, proud, confident. Take one word from each table. Technique: speak it before you see it."},{"slot_index":10,"teacher_says":"Shamim''s word is glamorous. Say it: glam-or-ous. It means beautiful in an exciting way, like a film star. Is glamorous a good thing to say about a person?","watch_for":"Learners: at the tables. Drill the word, stress on the first part. It is a positive word, which matters for the last task. Technique: choral drill of one new word."},{"slot_index":11,"teacher_says":"Read it with me. Large. Fierce. Show me large. Show me fierce. Now show me freezing cold. Show me glamorous. Show me creepy.","watch_for":"Learners: at the tables, standing and acting. Fierce means angry and ready to fight. Call the adjectives quickly, in any order, and join in. Technique: act the meaning, so the word is remembered with the body and not only read."},{"slot_index":12,"teacher_says":"Adjectives can describe how a person feels today: a good mood. And what a person is always like: hardworking. Am I in a good mood today? Who here is hardworking?","watch_for":"Learners: at the tables. Mood is today, personality is every day. Keep it light and let them answer about you. Technique: check the idea with questions about real people in the room."},{"slot_index":13,"teacher_says":"Four people. What is each person like? Not what they look like. What they are like inside. Talk to your table. Write one adjective for each person.","watch_for":"Learners: at the tables, talking then writing four words. Top left: a woman working out a hard sum. Top right: a man carrying a neighbour''s shopping. Bottom left: a woman climbing a cliff. Bottom right: a woman who does not see money falling from her bag. Accept anything that fits: clever, kind, helpful, brave, busy. Technique: predict before reveal."},{"slot_index":14,"teacher_says":"Meet Nafeesa, Khurram, Shamila and Sadia. Read the adjectives with me. Now thumbs up if it is a good thing to say about a person, thumbs down if it is not. Clever. Thoughtful. Adventurous. Careless. Then: now walk to the touch screens.","watch_for":"Learners: at the tables, then MOVE. Thoughtful means you think about other people. Adventurous means you like new and exciting things. Careless means you do not take care. Three thumbs up and one down: careless is a negative adjective. Say that the last task uses positive adjectives only. Then send the class to the touch screens, half at each. Technique: a quick check where they stand, with thumbs."},{"slot_index":15,"teacher_says":"Read each question aloud to the whole class. Talk to the people at your screen first, then one person taps.","watch_for":"Learners: at the touch screens, half the class at each. This trip covers this step and the next. Every sentence comes from Shamim''s slides. The last question is a best-answer question: clever is a good word too, so ask why thoughtful fits better. Technique: mixed question shapes, true or false, odd one out and best answer."},{"slot_index":16,"teacher_says":"A good classmate is… what? Type one positive adjective. Then let the next person type. While you wait, tell the person next to you your word.","watch_for":"Learners: at the touch screens, taking turns to type. The big words are the ones many people chose. Read them out: kind, friendly, helpful, funny, clever. Add any that are missing, such as patient or polite. These words are the word bank for the last task, so copy six or seven onto the board. Then say clearly: back to the tables. Technique: real answers from the room become the teaching material."},{"slot_index":17,"teacher_says":"Say this BEFORE the clip starts: listen for three things. One: a colour. Two: a feeling. Three: where is the adjective in the sentence? Write your answers on the table.","watch_for":"Learners: back at the tables, writing as they watch. The clip plays the first 2 minutes 31 seconds, then stops and moves on by itself. Colours in it: yellow, red, blue. Feelings: hungry, tired, happy. From 1:05 it gives two patterns: adjective then noun (I have a red car) and is or are then adjective (The student is tired). The voice is clear and slow, American English: it says color. Technique: a watching task set before the clip."},{"slot_index":18,"teacher_says":"What colour did you hear? What feeling? And where is the adjective? Take answers from different tables. Then: I say a sentence, you show me one finger or two. She is a very hardworking student. Nafeesa is very clever. They live in a big blue house. The children are happy.","watch_for":"Learners: at the tables. These are the three questions they were watching for. Pattern 1: the adjective is in front of the noun. Pattern 2: the adjective comes after is or are. Finger answers: hardworking student is 1, Nafeesa is clever is 2, big blue house is 1, the children are happy is 2. If fingers are mixed, write the sentence on the board and underline the adjective and the word after it. Technique: open the floor to the watching task, then check where they stand with fingers."},{"slot_index":19,"teacher_says":"Say this BEFORE the clip starts: the words are in the wrong order. Write the sentence on your table before the answer comes. Table against table.","watch_for":"Learners: at the tables, writing. The clip shows one example (The apple is red), then five mixed-up sentences with a picture. Each stays for about ten seconds before the answer appears, which is too fast for writing, so PAUSE the video when the mixed-up words appear and press play when most tables have written. Answers: The cats are hungry. We live in a small house. They have an expensive car. The cookie is delicious. I see a beautiful sunset. Ask each time: pattern 1 or pattern 2? The lesson moves on by itself when the video ends. Technique: a race at the tables, with nobody a passenger during a video."},{"slot_index":20,"teacher_says":"Shamim''s last task. Work with the person next to you. First ask your partner two things: What do you like? What are you good at? Then you will write three sentences about them.","watch_for":"Learners: at the tables, in pairs. Write a model on the board about yourself or a colleague, because the slide goes when the timer starts: Amina is kind. Amina is a hardworking student. She is very funny. Say the rules: positive adjectives only, and about what the person is like, not what they look like. Anyone who would rather not be described can have their partner write about a friend or someone in their family. Technique: show a model and the success criteria before the task."},{"slot_index":21,"teacher_says":"Three sentences about your partner, on the table. Use positive adjectives. One sentence with is, and one with an adjective in front of a noun. Then you will move and check another pair''s work.","watch_for":"Learners: at the tables. TABLE TASK 2, and the proof of all three objectives. Round 1: each learner writes three sentences about their partner. A good set uses three different adjectives, both patterns, a capital letter and a full stop. Round 2: tables move one place. They circle every adjective, tick the best sentence and fix one thing, such as a missing capital, a missing full stop or an adjective in the wrong place (a friend kind). Stretch: add because (Omar is funny because he tells good jokes), or use two adjectives together. A learner who finds writing hard writes one sentence and says the other two. Technique: create, then improve each other''s work."},{"slot_index":22,"teacher_says":"Go back to your own table and read what the other pair wrote. Then one person from each table: go to a touch screen and type your table''s best sentence. Start with a capital letter. End with a full stop.","watch_for":"Learners: at the tables. One runner per table goes to a screen. Everyone else reads the board as it fills and finds the adjective in each sentence. Check with the person described: is it true? Do you like it? Technique: capture the product, and send a runner, not the room."},{"slot_index":23,"teacher_says":"The first question again. What is your friend like? Ask two or three volunteers to say three sentences about their partner.","watch_for":"Learners: at the tables. Point at the words you wrote on the board in the first minute and say so: at the start you said nice and good, now you say three sentences with different adjectives. Ask the class which adjective was new for them today. Technique: close the loop on the opening question."}],"verify_before_teaching":["Watch the video (4 minutes 18 seconds, Ellii, American English). The lesson plays it in two parts: step 18 stops at 2:31 (&end=151), step 20 starts at 2:32 (&start=152). Change those numbers on the links if a cut feels wrong.","Step 20: practise pausing the video on the big screen. Each mixed-up sentence shows for about ten seconds before its answer. The five answers are in the tutor note. The second one (We live in a small house) was read from the answer frame, not from the mixed-up words, so check it by eye.","Slides: Shamim''s slides were rebuilt from the text and clip art in adjectives.ppt, because an old .ppt cannot be opened here. Her order and wording are kept. Slides 3 and 4 share one screen, and slides 6, 7 and 8 share one screen as the answers to the table task.","Changed from the PowerPoint: the worksheet lines are left out because nothing is printed (do the worksheet on adjectives, the word cards, the gap fill, and the whole last slide of worksheets 1 to 3). A full stop was added to ''in the dark sky''. Her clip art of the lady was replaced with a photo, because the drawing shows a showgirl in a leotard. The dog slide had no picture and still has none.","The five photos (slide-01 to slide-05) were made with Canva''s AI and have no words in them. Who is in them: an East Asian woman, a young Black man and a white woman who uses a wheelchair (slide 1); a Black boy of about ten (slide 2); nobody (slide 3); a larger Black woman in her fifties (slide 4); a young woman in a hijab, an older South Asian man and an older South Asian woman, a South Asian woman in her forties and a young South Asian woman (slide 5).","Slide 5 was made to match Shamim''s four sentences: top left Nafeesa (clever), top right Khurram (thoughtful), bottom left Shamila (adventurous), bottom right Sadia (careless with her money). Check you are happy with how each is shown.","Nothing is printed. Learners write on the whiteboard tables at steps 2, 5, 6, 8, 14, 18, 20 and 22, so every learner needs a pen and the tables need wiping first.","The whole class moves twice: to the touch screens after step 15, and back to the tables after step 17. At step 23 only one person per table goes to a screen.","The last task describes real classmates. Keep it to personality and to positive adjectives, never looks, and let anyone swap to describing a friend or family member.","There is no model on screen during the two table tasks (steps 8 and 22): the slide goes when the timer starts. Write the plain sentences, and later your model, on the board first.","The shared board at step 23 keeps capital letters and full stops exactly as typed. The word cloud at step 17 turns everything into small letters, which is fine for adjectives."],"safety_note":null,"media_requests":[],"brief":{"topic":"Adjectives: describing people","level":"Entry 2","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · What is your friend like? (2 min)
  (0, 'What is your friend like?', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/slide-01.jpg","file_name":"slide-01.jpg","title":"What is your friend like?"}',
    null),

  -- 2 · What can you see? (3 min)
  (1, 'What can you see?', 'Launch', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/slide-02.jpg","file_name":"slide-02.jpg","title":"What can you see? Write words on your table."}',
    null),

  -- 3 · Adjectives are describing words (1 min)
  (2, 'Adjectives are describing words', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/01-title.png","file_name":"01-title.png"}',
    null),

  -- 4 · The healthy boy (2 min)
  (3, 'The healthy boy', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/02-boy.png","file_name":"02-boy.png"}',
    null),

  -- 5 · Find the adjectives (2 min)
  (4, 'Find the adjectives', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/03-04-jumper-pool.png","file_name":"03-04-jumper-pool.png"}',
    null),

  -- 6 · Three words, one minute (1 min)
  (5, 'Three words, one minute', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/slide-03.jpg","file_name":"slide-03.jpg","title":"Three words. One minute."}',
    null),

  -- 7 · The large old creepy house (1 min)
  (6, 'The large old creepy house', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/05-house.png","file_name":"05-house.png"}',
    null),

  -- 8 · Make it better (6 min)
  (7, 'Make it better', 'Establish', 6, 'screen1_continue',
    '{"type":"rotation_timer","label":"Make it better","details":"Round 1: Write these on your table. Add adjectives.\nI saw lightning in the sky.\nTom walked down the street.\nI walked through the snow.\nRound 2: Read another table''s sentences. Underline the adjectives. Tick the best sentence.","rounds":2,"round_secs":150,"move_secs":30,"move_text":"Stand up. Move to the next table."}',
    null),

  -- 9 · Shamim's sentences (2 min)
  (8, 'Shamim''s sentences', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/06-08-lightning-tom-snow.png","file_name":"06-08-lightning-tom-snow.png"}',
    null),

  -- 10 · One word for the lady (1 min)
  (9, 'One word for the lady', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/slide-04.jpg","file_name":"slide-04.jpg","title":"One word. Tell your table."}',
    null),

  -- 11 · The glamorous lady (1 min)
  (10, 'The glamorous lady', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/09-lady.png","file_name":"09-lady.png"}',
    null),

  -- 12 · Act the adjective (1 min)
  (11, 'Act the adjective', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/10-dog.png","file_name":"10-dog.png"}',
    null),

  -- 13 · Moods and personality (1 min)
  (12, 'Moods and personality', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/11-remember.png","file_name":"11-remember.png"}',
    null),

  -- 14 · What are they like? (2 min)
  (13, 'What are they like?', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/slide-05.jpg","file_name":"slide-05.jpg","title":"What is each person like?"}',
    null),

  -- 15 · Describing personality (2 min)
  (14, 'Describing personality', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/12-personality.png","file_name":"12-personality.png"}',
    null),

  -- 16 · Spot the adjective (4 min)
  (15, 'Spot the adjective', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"true_or_false","text":"Tom walked down the quiet narrow street.\nQuiet is an adjective.","correct_tf":true},{"type":"multiple_choice","text":"I walked through the freezing cold snow.\nWhich word is NOT an adjective?","options":["freezing","cold","snow"],"correct":2},{"type":"multiple_choice","text":"The large fierce dog chased me.\nWhat is large and fierce?","options":["the dog","me","chased"],"correct":0},{"type":"true_or_false","text":"Careless is a positive adjective.","correct_tf":false},{"type":"multiple_choice","text":"My friend always helps other people.\nWhich is the best word for my friend?","options":["clever","thoughtful","careless"],"correct":1}]}',
    null),

  -- 17 · A good classmate is… (3 min)
  (16, 'A good classmate is…', 'Apply', 3, 'screen2_submit',
    '{"type":"word_cloud","title":"A good classmate is…","prompt":"Type one positive adjective.","max_words":2}',
    null),

  -- 18 · Video: adjectives (3 min)
  (17, 'Video: adjectives', 'Apply', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=LiYxv0vudmc&end=151"}',
    '{"type":"text_slide","text":"Listen for:\n1  a colour\n2  a feeling\n3  Where is the adjective?","size":"lg"}'),

  -- 19 · Where does the adjective go? (3 min)
  (18, 'Where does the adjective go?', 'Apply', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/two-patterns.png","file_name":"two-patterns.png"}',
    null),

  -- 20 · Video: put the words in order (3 min)
  (19, 'Video: put the words in order', 'Apply', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=LiYxv0vudmc&start=152"}',
    '{"type":"text_slide","text":"Put the words in order.\nWrite the sentence\non your table.","size":"lg"}'),

  -- 21 · Think about your classmates (1 min)
  (20, 'Think about your classmates', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/13-classmates.png","file_name":"13-classmates.png"}',
    null),

  -- 22 · My classmate (11 min)
  (21, 'My classmate', 'Demonstrate', 11, 'screen1_continue',
    '{"type":"rotation_timer","label":"My classmate","details":"Round 1: Write 3 sentences about your partner on the table. Positive adjectives only.\nOne like this: Amina is kind.\nOne like this: Amina is a kind friend.\nRound 2: Read another pair''s sentences. Circle the adjectives. Tick the best sentence. Fix one thing.","rounds":2,"round_secs":300,"move_secs":30,"move_text":"Stand up. Move to the next table."}',
    null),

  -- 23 · Our best sentence (2 min)
  (22, 'Our best sentence', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"padlet","title":"Our best sentence","question":"Type the best sentence from your table.\nExample: Amina is a kind friend."}',
    null),

  -- 24 · What is your friend like? Again (2 min)
  (23, 'What is your friend like? Again', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-adjectives/slide-01.jpg","file_name":"slide-01.jpg","title":"What is your friend like?"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
