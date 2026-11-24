-- ─────────────────────────────────────────────────────────────
-- ESOL PAST SIMPLE · 120 minutes · 27 steps · ESOL Entry 2
-- Built from Shamim Nizami's PowerPoint "past simple updated.ppt", the Ellii video
-- "Simple Past", BBC Learning English "Easy English Conversations 13", two Wordwalls,
-- two hotspot pictures and a verb-family whiteboard.
-- No printing: learners write on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The pictures are in the app's own media storage (lesson-media/lessons/esol-past-simple/),
-- so they show straight away. Copies are kept in public/lessons/esol-past-simple/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Past Simple: Who Ate the Cake?',
    'Past simple for ESOL Entry 2 in two hours: what happened at the party last night, and who ate the birthday cake? Built from Shamim Nizami''s PowerPoint, with two short videos, two Wordwalls, two tap-to-find pictures, a verb-family whiteboard and an alibi game. Learners write on the whiteboard tables. No printing needed.',
    120,
    false,
    true,
    now(),
    '{"rationale":"One story runs through the two hours: a birthday party last night. In the first hour learners work out what happened from the room the morning after; in the second they find out who ate the birthday cake. Shamim''s PowerPoint is the spine: her regular verbs with didn''t, her irregular verbs, her seven spelling-pattern slides turned into verb families, was and were, her time expressions, her questions with did and with was and were, and her interview questions as the detectives'' question bank. The Ellii ''Simple Past'' video (the same series as her adjectives and comparatives lessons) teaches -ed and the irregulars, and its practice section is a race. The BBC''s ''What did you do at the weekend?'' shows the questions in a real conversation. Two hotspot pictures (the party room and the kitchen) and a whiteboard of verb families make one trip to the touch screens in each hour. Two long table tasks: the party story, then the alibi game. Nothing is printed.","objectives":["Write regular and irregular past forms, using the spelling families: worked, studied, drank, bought, kept.","Say and write what happened, and what didn''t happen, with was or were and time words: At 9pm they ate pizza. The music was loud.","Question two people about last night, compare their answers and decide who is telling the truth, giving a reason."],"run_sheet":[{"slot_index":0,"teacher_says":"Look at this room. This is the morning after a birthday party. What happened last night? Take any words: party, pizza, dog, music.","watch_for":"Learners: standing at the tables, each with a pen. Do not teach anything yet. Expect single words or present tense: they eat pizza. Write two or three answers on the board exactly as said and leave them there: the end of the hour comes back to them. The cake is not in this room. Keep that for the second hour. Technique: open a question now and answer it properly later."},{"slot_index":1,"teacher_says":"Mime four things you did last night, one at a time, without speaking: cook, watch TV, phone a friend, go to bed. After each one ask: what did I do? Tables write it on the table.","watch_for":"Learners: at the tables, writing. Do it before teaching any rule. Accept ''you cook'', ''you cooking'', anything: then say it back in the past, ''Yes! I cooked.'', and write cooked on the board. Count how many tables already used -ed or went. Technique: do it before being told, then recast."},{"slot_index":2,"teacher_says":"Say this BEFORE the clip starts: listen for three words. Watch becomes what? Play becomes what? Study becomes what? Write them on your table.","watch_for":"Learners: at the tables, writing as they watch. Ellii ''Simple Past'', 0:23 to 1:34, then it moves on by itself. Answers: watched, played (She played the guitar at my party last month), studied (y becomes ied). It also says the form is the same for every person. Technique: a watching task set before the clip."},{"slot_index":3,"teacher_says":"What did you write? Watched, played, studied. Now Shamim''s slide: regular verbs, add -ed. Same for I, you, he, she, they. And the negative: didn''t work, not didn''t worked.","watch_for":"Learners: at the tables. This is Shamim''s slide 3. Say the three ways -ed sounds with a gesture: worked /t/, played /d/, wanted /id/ (an extra beat). Quick check: say ''She didn''t cooked'': thumbs up or down? Down. Technique: open the floor to the watching task, then the rule."},{"slot_index":4,"teacher_says":"Say this BEFORE the clip starts: these verbs do not take -ed. The video says them, you say them after it, all together. Then write three on your table.","watch_for":"Learners: at the tables, speaking then writing. 1:34 to 3:18: do/did, drink/drank, eat/ate, go/went, have/had, run/ran, say/said, sing/sang, sleep/slept, write/wrote, then examples (My dog slept on my bed last night). Pause if they need longer to repeat. It moves on by itself. Technique: choral repetition with the model."},{"slot_index":5,"teacher_says":"Shamim''s irregular verbs. Read them with me. Go: went. Come: came. Then: I came here last year. When did YOU come to Bradford? I came here in ...","watch_for":"Learners: at the tables. Shamim''s slide 4. Let two or three learners say when they came here, only if they want to: ''I came here two years ago'' is a good answer. Technique: make the model sentence personal."},{"slot_index":6,"teacher_says":"Irregular verbs have families. Drink, drank. So ring is ...? Rang! Each table: choose one family. Write the past of every verb in it on your table. Then: now walk to the touch screens.","watch_for":"Learners: at the tables, then MOVE. Shamim''s seven ''Patterns of spelling'' slides (11, 12, 13, 20, 21, 22, 23) on one screen. Give each table a different family. Do not give answers yet: the answers come at the screens. Then send the class to the touch screens, half at each. Technique: spot the pattern before being told."},{"slot_index":7,"teacher_says":"At your screen: draw a line from each verb to its family. Take turns: one line each. Say the past out loud as you draw. Then send it to the big screen.","watch_for":"Learners: at the touch screens, half the class at each. This trip covers this step and the next three. Answers: swim, ring to drink/drank; think, bring to buy/bought; sleep, meet to keep/kept; know, throw to blow/blew; cut, hit to put/put; speak, choose to break/broke. Compare both screens'' boards on the big screen: where are they different? Technique: drawing as writing, then compare two groups'' work."},{"slot_index":8,"teacher_says":"Look at the big screen. Check your lines. Which family was the hardest?","watch_for":"Learners: at the touch screens, looking at the big screen. Put, shut, cut, hit: no change at all. Caught and taught are spelled -aught, not -ought. Technique: self-check against a model."},{"slot_index":9,"teacher_says":"Take turns. Drag one verb each. Say the verb before you drag it: walk, walked.","watch_for":"Learners: at the touch screens. This is Shamim''s slide 24 (regular or irregular) as a game. Watch shopped (double p) and tried (y to ied). Everyone waiting says the present: sat, sit. Technique: a game in learners'' hands, said before it is tapped."},{"slot_index":10,"teacher_says":"Tap something in the room. A sentence appears. Read it out loud to everyone at your screen. Find all eight. Then say clearly: back to the tables.","watch_for":"Learners: at the touch screens. Eight things to find: the dog (slept), the hats (wore), the pizza boxes (ate), the guitar (played), the broken glass (broke), the presents (opened), the cups (drank), the balloons (blew up). Point out which are regular (played, opened) and which families the others come from (drank, blew, broke). Then MOVE back to the tables. Technique: tap to find, then say it."},{"slot_index":11,"teacher_says":"One more verb: be. I was, she was, you were, they were. The party was great. The music was loud. The guests were happy. Your turn: say one about the party.","watch_for":"Learners: back at the tables. Shamim''s slide 10. Good answers: The room was messy. The dog was tired. The balloons were pink. Technique: model, then make it about the picture."},{"slot_index":12,"teacher_says":"Shamim''s time words. Yesterday I went shopping, or I went shopping yesterday: both are fine. Last night, at 9pm, in the evening. Tell your table: what did you do yesterday evening?","watch_for":"Learners: at the tables, talking. Shamim''s slides 5 and 6 on one screen. Listen for last night and at 9pm: they are needed in both table tasks. Technique: quick pair talk before writing."},{"slot_index":13,"teacher_says":"Write the story of the party on your table. Eight sentences. One with didn''t. One with was or were. Use time words: at 8pm, later. Then you will move and check another table''s story.","watch_for":"Learners: at the tables. TABLE TASK 1. Keep this slide up and start a timer over it from the remote (Timer, Add Timer): 8 minutes, then 8 more. The spelling families are on the touch screens, so learners can walk over and check. Round 1: eight sentences. Good: At 8pm the guests arrived. They ate pizza and drank lemonade. Someone broke a glass. The music was loud. They didn''t eat the cake! Round 2: tables move one place, underline every past verb, tick regular or irregular above it and fix one mistake. Stretch: who came to the party? Invent names and say what each person did. Technique: write from a picture, then check another table''s work."},{"slot_index":14,"teacher_says":"Go back to your own table. A quick race: say the past verb before the video shows it. Pause, say, play.","watch_for":"Learners: back at their own tables. Pause on each gap. Answers: I drank coffee yesterday morning. He played the guitar yesterday. She watched TV last night. We went to Paris eight years ago. The student was tired after class. It moves on by itself when it ends: the next step starts the second hour. Technique: a fast reset after a long task."},{"slot_index":15,"teacher_says":"Tell the story with drama: there was a big chocolate birthday cake in the kitchen at 10pm. At midnight, it was gone! Everyone says: not me! Today we find out who ate it. Look at the kitchen. What can you see?","watch_for":"Learners: at the tables. Let them notice: crumbs, a fork, a red scarf, footprints, an open door. Do not explain the clues yet: they come at the touch screens. Technique: a mystery that the last task solves."},{"slot_index":16,"teacher_says":"To find the cake thief, we ask questions. Shamim''s rule: did, then the verb. Did you go? Not did you went. What did you eat? Where did you go?","watch_for":"Learners: at the tables. Shamim''s slides 25 and 9 on one screen. Drill three questions with rising and falling voice: Did you go out? (up), What did you eat? (down). Technique: choral drill of the question shape."},{"slot_index":17,"teacher_says":"Say this BEFORE the clip starts: four people talk about their weekend. Listen: what did Tim do? What did Sian make? Where did Georgie go swimming? Write the answers on your table.","watch_for":"Learners: at the tables, writing. BBC Learning English, Easy English Conversations 13, 0:06 to 2:17 (British English), then it moves on by itself. Answers: Tim went hiking, ate pasta with friends, watched a horror film. Buli went to the beach and had a strawberry ice cream. Sian made a chocolate cake (''My family ate it all!'') and played frisbee. Georgie went swimming at the swimming pool and read a detective story. Technique: a watching task set before the clip."},{"slot_index":18,"teacher_says":"What did Tim do? What did Sian make? Where did Georgie go swimming? Then: they asked more questions after the first one. What did they ask?","watch_for":"Learners: at the tables. The same three questions they listened for. Then collect the follow-up questions on the board: What did you eat? What film did you watch? What kind of cake did you make? What else did you do? These are the detectives'' questions later. Sian''s family ate her cake: a joke to enjoy. Technique: open the floor to the watching task."},{"slot_index":19,"teacher_says":"Say this BEFORE the clip starts: now Tim asks YOU. When the video stops talking, answer to the person next to you.","watch_for":"Learners: at the tables, in pairs, speaking. 2:23 to 3:18: How was your weekend? What did you do? What else did you do? What did you eat? The video gives example answers after each gap; pause longer if needed. It moves on by itself. Technique: answer a real question in the gap, nobody a passenger during a video."},{"slot_index":20,"teacher_says":"One more question shape. Were you at the party? Was she in the kitchen? No, I wasn''t. No, they weren''t. Then: now walk to the touch screens.","watch_for":"Learners: at the tables, then MOVE. Shamim''s slides 14 and 15 on one screen. Detectives will need: Where were you at 11pm? Were you in the kitchen? Then send the class to the touch screens, half at each. Technique: model the question the task needs, just before it is needed."},{"slot_index":21,"teacher_says":"Take turns. Drag the words into a question. Everyone at your screen asks the question out loud, and the person next to you answers.","watch_for":"Learners: at the touch screens, half the class at each. This trip covers this step and the next. These are almost exactly the detectives'' questions. Waiting learners ask and answer the question on screen. Technique: build the question, then use it at once."},{"slot_index":22,"teacher_says":"Tap a clue in the kitchen. A question appears. Read it out and ask the person next to you. Find all nine. Then say clearly: back to the tables.","watch_for":"Learners: at the touch screens. Nine clues, each with a detective''s question: the cake stand, a fork, glasses, chocolate on the fridge, the clock, a red scarf, muddy footprints, the open door, a phone. Answers must use the past: No, I didn''t. I was at home. Then MOVE back to the tables. Technique: tap to find, then ask."},{"slot_index":23,"teacher_says":"At every table, two people are suspects. They were together last night from 7 to 11. The others are detectives. Suspects: plan your story. Detectives: write your questions. Then you interview the suspects one at a time. If their answers are different three times: guilty!","watch_for":"Learners: at the tables. Choose two suspects per table (confident speakers first time). Model it with a volunteer: Where were you at 8pm? We were at a restaurant. What did you eat? Curry. Show the question bank on the touch screens: it is Shamim''s Yesterday and Last Saturday questions turned into detective questions. Technique: model the task and its success criteria before it starts."},{"slot_index":24,"teacher_says":"Round 1: plan and write questions. Round 2: interview suspect 1. Round 3: interview suspect 2, then circle every answer that is different.","watch_for":"Learners: at the tables. TABLE TASK 2, and the proof of all three objectives. The question bank stays on the touch screens. Round 1: suspects plan by the wall and write nothing down; detectives write eight questions, at least one with was or were. Round 2: suspect 2 waits by the wall, out of earshot. Detectives write answers in a column on the table. Round 3: suspect 2 answers the same questions in a second column; circle each difference. Three or more circles: guilty. Listen for ''Did you went'': fix it to ''Did you go''. Stretch: a follow-up question for every answer (What did you eat? What kind of curry?). If there is time, swap roles. Technique: an information gap where the questions have a real purpose."},{"slot_index":25,"teacher_says":"One detective from each table: type your verdict and one reason. Suspect 1 said ... Suspect 2 said ...","watch_for":"Learners: at the tables. One runner per table goes to a screen. Read each verdict out and ask the suspects: was it true? The reason is the evidence for the last objective: two past sentences that do not match. Technique: capture the product, and send a runner, not the room."},{"slot_index":26,"teacher_says":"Back to the party. What happened last night? Ask two volunteers to tell it in three sentences. Then: who ate the cake? Let the class decide which table''s suspects were the best liars.","watch_for":"Learners: at the tables. Point at the words on the board from minute one (they eat pizza) and compare: now it is They ate pizza, someone broke a glass, the music was loud. Nobody really ate the cake, so let the class choose a winner. Technique: close the loop on the opening question."}],"verify_before_teaching":["Nothing is printed. Learners write on the whiteboard tables at steps 2, 3, 5, 7, 14, 18 and 25, so every learner needs a pen and the tables need wiping first, and again at the break if there is one.","Watch both videos. Ellii ''Simple Past'' (5:48) plays three times: 0:23 to 1:34 (regular), 1:34 to 3:18 (irregular, listen and repeat) and 3:58 to the end (a gap-fill race: drank, played, watched, went, was). BBC Learning English ''Easy English Conversations 13'' (4:53) plays 0:06 to 2:17 (the conversations) and 2:23 to 3:18 (your turn). Both transcripts were read in full when the lesson was built.","Open both Wordwalls on a touch screen. ''Simple Past Verbs'' (Group sort, step 10) sorts 18 past verbs into regular and irregular. ''Past simple questions NEF Ele 5C'' (Unjumble, step 22) builds going-out questions. An E2 irregular verbs Match up (wordwall.net/resource/124172274) was also found and could replace the group sort.","Tap every hotspot in the preview (steps 11 and 23) and move any circle that misses. The party has 8; the kitchen has 9. The kitchen clock shows about ten to eleven, not exactly eleven.","Step 14: keep the picture slide up and start a timer over it from the remote (Timer, Add Timer): 8 minutes, then 8 more. A rotation timer would hide the picture. Step 25 uses the rotation timer, because the question bank stays on the touch screens.","Step 8 is a whiteboard over a verb-family board on the big screen and both touch screens: learners draw lines and send them to the big screen.","Shamim''s slides are rebuilt with her wording. Not used: her title and ''Past tense'' overview, ''Do the worksheet'' (slide 7), ''Put the pictures in order'' (slide 16, whose pictures were not in the file). Slides 17 to 19 (Yesterday, Last Saturday, This morning) became the detectives'' question bank, changed to ''last night''.","The two pictures were made with Canva''s AI and have no people and no words in them.","The whole class moves four times: to the touch screens after step 7, back after step 11, to the screens after step 21, back after step 23. At step 26 one person per table goes to a screen.","If there is a break, take it after step 15 (the video race): the second hour starts with the cake."],"safety_note":null,"media_requests":[],"brief":{"topic":"Past simple: what happened, and who ate the cake?","level":"Entry 2","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · What happened last night? (3 min)
  (0, 'What happened last night?', 'Launch', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/party.jpg","file_name":"party.jpg","title":"What happened here last night?"}',
    null),

  -- 2 · What did I do last night? (3 min)
  (1, 'What did I do last night?', 'Launch', 3, 'screen1_continue',
    '{"type":"text_slide","text":"Watch me.\nWrite what I did\non your table.","title":"What did I do last night?","size":"lg"}',
    null),

  -- 3 · Video: -ed (3 min)
  (2, 'Video: -ed', 'Establish', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=MI3S3kdkofo&start=23&end=94"}',
    '{"type":"text_slide","text":"Listen for:\n1  watch  →  ?\n2  play  →  ?\n3  study  →  ?","size":"lg"}'),

  -- 4 · Regular verbs (3 min)
  (3, 'Regular verbs', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-03-regular.png","file_name":"ps-03-regular.png"}',
    null),

  -- 5 · Video: irregular verbs (4 min)
  (4, 'Video: irregular verbs', 'Establish', 4, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=MI3S3kdkofo&start=94&end=198"}',
    '{"type":"text_slide","text":"Say it after the video.\nThen write 3 on your table.","size":"lg"}'),

  -- 6 · Irregular verbs (2 min)
  (5, 'Irregular verbs', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-04-irregular.png","file_name":"ps-04-irregular.png"}',
    null),

  -- 7 · Spelling families (3 min)
  (6, 'Spelling families', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-11-families.png","file_name":"ps-11-families.png"}',
    null),

  -- 8 · Draw a line to the family (5 min)
  (7, 'Draw a line to the family', 'Apply', 5, 'screen1_continue',
    '{"type":"whiteboard","title":"Draw a line to the family","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-whiteboard-families.png","file_name":"ps-whiteboard-families.png"}',
    null),

  -- 9 · Families: answers (2 min)
  (8, 'Families: answers', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-11-families-answers.png","file_name":"ps-11-families-answers.png"}',
    null),

  -- 10 · Regular or irregular? (4 min)
  (9, 'Regular or irregular?', 'Apply', 4, 'screen1_continue',
    '{"type":"text_slide","text":"Regular or irregular?\nSort the verbs.","size":"lg"}',
    '{"type":"embed","url":"https://wordwall.net/embed/772e782f7f0a46bc9e9a51e6a79eace2?themeId=1","description":"Wordwall ''Simple Past Verbs'' (Group sort). Drag each past verb into Regular or Irregular: walked, waited, shopped, talked, loved, tried, cleaned, visited, wanted; sat, took, felt, ran, wrote, had, bought, caught, made."}'),

  -- 11 · What happened at the party? (5 min)
  (10, 'What happened at the party?', 'Apply', 5, 'screen1_continue',
    '{"type":"hazard_hotspots","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/party.jpg","title":"Tap what happened. Say the sentence!","hotspots":[{"id":"dog","x":10,"y":30,"r":7,"label":"The dog slept on the chair."},{"id":"hats","x":44,"y":23,"r":5.5,"label":"They wore party hats."},{"id":"pizza","x":45,"y":41,"r":5,"label":"They ate pizza."},{"id":"guitar","x":87,"y":25,"r":6,"label":"Someone played the guitar."},{"id":"glass","x":18,"y":69,"r":5,"label":"Someone broke a glass."},{"id":"presents","x":78,"y":74,"r":8,"label":"They opened the presents."},{"id":"cups","x":35,"y":71,"r":4,"label":"They drank lemonade."},{"id":"balloons","x":27,"y":89,"r":4,"label":"They blew up balloons."}]}',
    null),

  -- 12 · Was and were (2 min)
  (11, 'Was and were', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-10-was-were.png","file_name":"ps-10-was-were.png"}',
    null),

  -- 13 · Time words (2 min)
  (12, 'Time words', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-05-time.png","file_name":"ps-05-time.png"}',
    null),

  -- 14 · The party story (18 min)
  (13, 'The party story', 'Apply', 18, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-party-task.png","file_name":"ps-party-task.png"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-11-families-answers.png","file_name":"ps-11-families-answers.png"}'),

  -- 15 · Video: race (3 min)
  (14, 'Video: race', 'Apply', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=MI3S3kdkofo&start=238"}',
    '{"type":"text_slide","text":"Say the past\nbefore the video does.","size":"lg"}'),

  -- 16 · Who ate the cake? (3 min)
  (15, 'Who ate the cake?', 'Apply', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-cake.png","file_name":"ps-cake.png"}',
    null),

  -- 17 · Questions with did (2 min)
  (16, 'Questions with did', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-25-did.png","file_name":"ps-25-did.png"}',
    null),

  -- 18 · Video: what did you do? (5 min)
  (17, 'Video: what did you do?', 'Apply', 5, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=kTf0V4HyFtM&start=6&end=137"}',
    '{"type":"text_slide","text":"Listen for:\n1  What did Tim do?\n2  What did Sian make?\n3  Where did Georgie\n    go swimming?","size":"lg"}'),

  -- 19 · What did they ask? (3 min)
  (18, 'What did they ask?', 'Apply', 3, 'screen1_continue',
    '{"type":"text_slide","text":"1  What did Tim do?\n2  What did Sian make?\n3  Where did Georgie go swimming?\n\nWhat else did they ask?","title":"What did you hear?","size":"lg"}',
    null),

  -- 20 · Your turn: answer Tim (3 min)
  (19, 'Your turn: answer Tim', 'Apply', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=kTf0V4HyFtM&start=143&end=198"}',
    '{"type":"text_slide","text":"Answer the questions.\nTell the person\nnext to you.","size":"lg"}'),

  -- 21 · Was? Were? (2 min)
  (20, 'Was? Were?', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-14-was-questions.png","file_name":"ps-14-was-questions.png"}',
    null),

  -- 22 · Put the questions in order (4 min)
  (21, 'Put the questions in order', 'Apply', 4, 'screen1_continue',
    '{"type":"text_slide","text":"Put the words in order.\nSay the question.","size":"lg"}',
    '{"type":"embed","url":"https://wordwall.net/embed/f2229c230cf843749c2ec26d6cadce2d?themeId=43","description":"Wordwall ''Past simple questions NEF Ele 5C'' (Unjumble). Drag the words into order to make a question about going out last night, for example: Did you go out last night? What did you wear? Where did you go? What did you have to eat? Who did you meet?"}'),

  -- 23 · The clues (5 min)
  (22, 'The clues', 'Apply', 5, 'screen1_continue',
    '{"type":"hazard_hotspots","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/cake.jpg","title":"Find the clues. Read the question!","hotspots":[{"id":"stand","x":22.5,"y":58,"r":7,"label":"The empty cake stand: who ate the cake?"},{"id":"fork","x":30.5,"y":74,"r":3.5,"label":"A fork: Did you eat the cake?"},{"id":"glasses","x":7,"y":44,"r":4,"label":"Glasses: Who wore glasses at the party?"},{"id":"fridge","x":30.5,"y":24,"r":5,"label":"Chocolate on the fridge: Did you open the fridge?"},{"id":"clock","x":48.5,"y":11,"r":5,"label":"The clock: Where were you at 11pm?"},{"id":"scarf","x":55,"y":70,"r":6,"label":"A red scarf: Did you wear a red scarf?"},{"id":"footprints","x":66,"y":71,"r":6,"label":"Muddy footprints: Did you go into the garden?"},{"id":"door","x":67,"y":27,"r":5,"label":"The open door: How did you get home?"},{"id":"phone","x":93,"y":36,"r":4,"label":"A phone: Who did you call?"}]}',
    null),

  -- 24 · The alibi: rules (3 min)
  (23, 'The alibi: rules', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"designed_slide","layout":"steps","look":"night","kicker":"Table task 2","title":"The alibi","points":["Suspects (2): plan last night, 7pm to 11pm. Where were you? What did you do, eat, wear?","Detectives: write 8 questions on your table.","Interview suspect 1 alone. Write the answers.","Interview suspect 2 alone. Write the answers.","3 different answers? Guilty!"]}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-alibi-questions-tall.png","file_name":"ps-alibi-questions-tall.png"}'),

  -- 25 · The alibi (22 min)
  (24, 'The alibi', 'Demonstrate', 22, 'screen1_continue',
    '{"type":"rotation_timer","label":"The alibi","details":"Round 1: Suspects stand by the wall and plan last night, 7pm to 11pm. Detectives write 8 questions on the table.\nRound 2: Suspect 1 comes back. Detectives ask the questions and write the answers.\nRound 3: Suspect 2 comes back. Same questions. Write the answers next to suspect 1''s. Circle the differences.","rounds":3,"round_secs":360,"move_secs":20,"move_text":"Next suspect, come to the table."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/ps-alibi-questions-tall.png","file_name":"ps-alibi-questions-tall.png"}'),

  -- 26 · Guilty or not? (3 min)
  (25, 'Guilty or not?', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"Guilty or not guilty?","question":"One person from each table: guilty or not? Give one reason.\nExample: Guilty! Suspect 1 said they ate curry. Suspect 2 said they ate pizza."}',
    null),

  -- 27 · What happened last night? Again (3 min)
  (26, 'What happened last night? Again', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/esol-past-simple/party.jpg","file_name":"party.jpg","title":"What happened last night? Who ate the cake?"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
