-- ─────────────────────────────────────────────────────────────
-- SALON: WHO KEEPS US SAFE? · 60 minutes · 24 steps · Level 1 Hairdressing
-- Session 2 of Hayley's health and safety unit (VTCT UV10477).
-- Built from Hayley's slides (HS Acts.ppt, Health and safety hazards and
-- hygiene.pptx) and her fill-the-gaps sheet, rebuilt in Canva, with two
-- YouTube clips (BBC London; Christian Weaver, The Law in 60 Seconds).
-- No printing: learners write on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The slides are in the app's own media storage (lesson-media/lessons/salon-who-keeps-us-safe/),
-- so they show straight away. Copies are kept in public/lessons/salon-who-keeps-us-safe/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Salon: Who Keeps Us Safe?',
    'Session 2 of health and safety in the salon for Level 1 Hairdressing (VTCT UV10477). The employer''s responsibilities and your own duties under each law, and why hygiene stops infection. Built from Hayley''s slides, with a BBC report on a dirty barbershop. Learners make a Day One induction board on the whiteboard tables and judge another table''s. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"Session 2 of Hayley''s health and safety unit (VTCT UV10477, Follow health and safety in the salon). Session 1 covered hazards, hazard and risk, five laws as a carousel, COSHH, the Saturday Shift game and a mini risk assessment. This session fills the gaps in learning outcome 1: the employer''s responsibilities (1f, on the external paper), the laws not yet met (Workplace Regulations, Manual Handling, PUWER, Environmental Protection Act), and safe and hygienic working (1c and 1g). One question runs through the hour: on your first day, who keeps the salon safe, the employer or me? A BBC report on a dirty barbershop opens it, and learners keep an EMPLOYER and ME list on their table all lesson. Hayley''s own slides (HS Acts, Hazards and hygiene, the fill-the-gaps sheet) are rebuilt in Canva in her order. The product is a Day One induction board for a new junior, judged by another table as an inspector would. Fire and emergencies (outcome 2) are saved for Session 3. Nothing is printed.","objectives":["State what an employer must do to keep staff and clients safe, and name the law behind it.","Explain how good hygiene stops infection passing from one client to the next.","Judge whether a salon is meeting the law, and give a reason."],"run_sheet":[{"slot_index":0,"teacher_says":"It''s your first day at a salon. Whose job is it to keep you safe: your boss, you, or both? Draw a line down the middle of your table. Write EMPLOYER on one side and ME on the other. That line stays all lesson.","watch_for":"Learners: standing at the tables, each with a pen. Take a quick show of hands: boss, me, both. Do not give the answer; it comes back in the last step. Last week was spotting hazards and the five laws. This week is whose job each thing is, and hygiene. Technique: open a question now and close it at the end."},{"slot_index":1,"teacher_says":"Say this BEFORE the clip: this is a real BBC London report. Watch for three things: what happened to Jacob, what they found in the shop, and whose job it was to stop it. Write anything you spot on your table.","watch_for":"Learners: at the tables, writing as they watch. BBC London, 2 minutes 50 seconds, plays to the end then moves on. What is in it: Jacob got a fungal scalp infection from dirty tools and needed about four weeks of antibiotics. He describes pus and blood on his pillow, so warn the group first. Inside an East London shop the BBC found bloodstained, rusty razors. A dermatologist names folliculitis, herpes and warts. UK barbers need no licence, and London''s councils could not say how many barber shops they had. Technique: a watching task set before the clip."},{"slot_index":2,"teacher_says":"Talk at your table: whose fault was Jacob''s infection? Then write a verdict on your table: shut it down, or let it stay open? One reason.","watch_for":"Learners: at the tables. Take one verdict per table. Listen for ''the barber didn''t clean the clippers'' (the employee''s duty) and ''the owner should have trained them and checked'' (the employer''s duty). Both are right, which is the lesson. Keep their verdicts on the table: they judge again with the law at step 19. Technique: judge before being taught, then judge again."},{"slot_index":3,"teacher_says":"Say this BEFORE the clip: a barrister explains the law in about a minute and a half. Write on the EMPLOYER side of your table everything he says the employer must do.","watch_for":"Learners: at the tables, writing on the EMPLOYER side. Christian Weaver, ''The Law in 60 Seconds'', 1 minute 33 seconds. He covers: the Health and Safety at Work Act 1974; a safe system of work and a safe place of work; risk assessments; consulting staff; clear information on safety. Breaking the law can be a crime, and the Employment Rights Act 1996 means you cannot be sacked for raising a safety concern. Afterwards, ask each table for one thing they wrote. Technique: a watching task with a written output."},{"slot_index":4,"teacher_says":"Hayley''s laws. Each box says what the employer must do. Your job: on the ME side, write what YOU must do for each one. Four laws, four minutes.","watch_for":"Learners: at the tables. TABLE TASK 1. Hayley''s ''HS Acts'' slides: Health and Safety at Work Act, Workplace (Health, Safety and Welfare) Regulations, Manual Handling and PUWER (work equipment). The last three were not covered last week. Good answers: report problems; keep the salon clean; lift from the knees; only use equipment you are trained on. Stretch: give a salon example for each. Technique: predict, then check against the model."},{"slot_index":5,"teacher_says":"Let''s check. Tick each one you had on your table. Add anything you missed.","watch_for":"Learners: at the tables, ticking and adding. Ask which table got all four. Point to the PUWER line: following manufacturers'' instructions is the employee''s half of that law. Technique: self-check against a model answer."},{"slot_index":6,"teacher_says":"You met these four last week: PPE, COSHH, electricity and RIDDOR. Last week was what they mean in a salon. This time: what is YOUR duty? Three minutes.","watch_for":"Learners: at the tables, ME side. This should be faster than the first four, because they know the laws. If a table writes what the law means instead of their duty, ask ''and what do YOU have to do?''. Technique: retrieval, then a new angle on what they already know."},{"slot_index":7,"teacher_says":"Tick and add. Which one did nobody think of?","watch_for":"Learners: at the tables. Often missed: reporting when PPE supplies run low, and disposing of products correctly as part of COSHH. Technique: self-check."},{"slot_index":8,"teacher_says":"Before you show the slide: your boss has to pay for three kinds of insurance. Guess what each one is for. Then show the slide. Which one pays if a client trips? If you get hurt? If a colour goes wrong?","watch_for":"Learners: at the tables, adding to the EMPLOYER side. This is specification criterion 1f, which is on the external paper and was not in Hayley''s slides: employer''s liability, public liability and professional indemnity insurance; displaying the health and safety rules and fire plan; training; records; monitoring; asking experts. Point out that employer''s liability insurance is a legal must for any salon with staff. Technique: predict before reveal."},{"slot_index":9,"teacher_says":"Race. Write the numbers 1 to 12 down your table and the missing word next to each. Every word in the box is used once. Three minutes. Go.","watch_for":"Learners: at the tables. TABLE TASK 2. From Hayley''s fill-the-gaps sheet, rewritten a little for the screen. COSHH is dated 2002 here (the sheet said 2003). Answers: 1 hazard, 2 risk, 3 manufacturers'', 4 safety, 5 neutralisers, 6 hairdryer, 7 COSHH, 8 protective, 9 clients, 10 clothes, 11 bath, 12 deodorant. First table with all twelve wins. Technique: a timed retrieval race."},{"slot_index":10,"teacher_says":"Back to Jacob. Draw it on your table: how did the germs get from the last client to Jacob? Then draw a big X where YOU could have stopped it.","watch_for":"Learners: at the tables, drawing. A good drawing: client A, then clippers, comb, towel or the stylist''s hands, then client B. Good X''s: sterilise the tools, a fresh towel, washing or sanitising hands, a clean gown. That is the whole of ''why hygiene stops infection''. Germs need a route, and hygiene breaks it. Technique: do it before being told."},{"slot_index":11,"teacher_says":"Hayley''s four habits. Thumbs up for each one you did in the salon this week.","watch_for":"Learners: at the tables. A quick thumbs check, so keep it moving. Link each habit to the chain they just drew. Technique: a quick personal check."},{"slot_index":12,"teacher_says":"Four ways to sterilise. Which one would have saved Jacob? Clean, disinfect and sterilise are not the same thing: cleaning removes the dirt you can see, disinfecting kills most germs, sterilising kills all of them.","watch_for":"Learners: at the tables. Tools must be cleaned of hair and product first, or the solution cannot reach the surface. An autoclave sterilises with steam under pressure (metal tools). Barbicide-type solution is for combs and brushes, fully covered and changed daily. A UV cabinet keeps clean tools clean. Ask which ones this salon uses. Technique: link the new idea to the case study."},{"slot_index":13,"teacher_says":"Before the slide: which bin does each of these go in? Point at the bin you think. Then press next to see Hayley''s slide.","watch_for":"Learners: at the tables. Answers: razor blade, sharps box; tint tube, hazardous waste; hair clippings, general waste; cardboard, recycling. The next step is Hayley''s slide with all four kinds, so keep this one short. Technique: predict before reveal."},{"slot_index":14,"teacher_says":"Were you right? Salons can be fined for getting this wrong. That''s the Environmental Protection Act.","watch_for":"Learners: at the tables. The Environmental Protection Act is on the specification''s list of laws and was not covered last week. Technique: check the prediction."},{"slot_index":15,"teacher_says":"Look at the person next to you: shoes, jewellery, hair. Would they pass? Kindly.","watch_for":"Learners: at the tables. Keep it light and kind. Nobody comments on bodies, only on things you can change: shoes, jewellery, a tied-back sleeve. Technique: apply it to yourself."},{"slot_index":16,"teacher_says":"Who has to pay for all this kit? The employer, under the PPE regulations. Now, all of you to the touch screens.","watch_for":"Learners: at the tables, then MOVE. Say clearly: half the class to each touch screen. Technique: close the teaching part with the employer link."},{"slot_index":17,"teacher_says":"Read each question aloud. Talk to the people at your screen, then one person taps. Take turns tapping.","watch_for":"Learners: at the touch screens, half the class at each. The question shapes are mixed on purpose: best answer (1, 6, 7), true or false (2, 5, 8) and odd one out (3). In 6 and 7 two options sound reasonable, so ask why. Q2: false, employers cannot charge for safety equipment. Technique: mixed question shapes, talk before tapping."},{"slot_index":18,"teacher_says":"Back to the barbershop from the start. Now you know the law. Vote. Then go back to your tables.","watch_for":"Learners: at the touch screens, then MOVE back to the tables. Compare with the verdicts they wrote at step 3. Ask one person to name the laws broken: COSHH (how the products are used), PUWER (equipment in good order), and the Health and Safety at Work Act (a safe system of work). Technique: judge again with new knowledge."},{"slot_index":19,"teacher_says":"Your salon is taking on a new junior on Monday. Wipe your table and make their Day One board in three parts: what the salon promises, what I promise, and my hygiene routine.","watch_for":"Learners: back at the tables. Sketch the three columns on the board as the model, because the big screen shows a timer next. Success criteria: at least three employer promises, each with its law named; at least three ''I promise'' duties; a hygiene routine for before, during and after a client. Technique: create a product against criteria."},{"slot_index":20,"teacher_says":"Seven minutes. Every person writes something. Use your EMPLOYER and ME lists from earlier.","watch_for":"Learners: at the tables, writing. TABLE TASK 3. The brief stays on the touch screens while the timer runs. Push for a law next to every promise. Stretch: add the insurance, and one thing from the BBC report the new junior must never do. The timer moves on by itself. Technique: create, then test each other''s work."},{"slot_index":21,"teacher_says":"Move one table round. You are the inspector. Read their board. Pass, needs work, or shut down? Write your verdict, one reason and one law on their table.","watch_for":"Learners: MOVE one table clockwise. The verdict guide is on the touch screens. A strong verdict names what is missing (''no law next to the towels promise'') and a law. Watch that verdicts are fair and kind. Technique: peer assessment against criteria."},{"slot_index":22,"teacher_says":"Each table: read out the verdict you gave, and your reason. Owners: do you agree?","watch_for":"Learners: at the board they judged. Take every table if there is time. Correct any law that is wrong. If a board got SHUT DOWN, ask what one change would save it. Technique: justify a judgement aloud."},{"slot_index":23,"teacher_says":"So, on day one, whose job is it: your boss or you? (Both.) The employer gives you a safe salon, the kit and the training. You use it, follow it and report it.","watch_for":"Learners: at the tables. This closes the question from step 1. Next session: fire and emergencies (specification outcome 2). Technique: close the loop."}],"verify_before_teaching":["Watch the BBC London clip (step 2, 2 minutes 50 seconds) to the end. Jacob describes pus and blood on his pillow, and there are photos of bloodstained razors. Warn the group before it plays.","Watch the Christian Weaver clip (step 4, 1 minute 33 seconds). It is general UK workplace law, not salon-specific, which is why the next step is Hayley''s salon slides.","The slides were rebuilt from Hayley''s PowerPoints in Canva. Check the wording reads as hers. Spelling was tidied (''Lets'''' to ''Let''''s'') and COSHH is dated 2002 on the gap-fill (her sheet said 2003).","Nothing is printed. Learners write on the whiteboard tables at steps 1 to 17 and 20 to 24. Every learner needs a pen, and tables are wiped before step 20.","The whole class moves twice: to the touch screens after step 17, and back to the tables after step 19. At step 22 every table moves round one.","Steps 21 and 22 use a timer on the big screen that moves on by itself. If a table needs longer, pause before it runs out.","Fire, extinguishers, first aid and evacuation (Hayley''s fire slides, fire-fighting handout and emergency sheet) are left for Session 3, which includes the department tour."],"safety_note":"The BBC clip includes a first-hand description of a scalp infection and photos of dirty razors. Warn learners first.","media_requests":[],"brief":{"topic":"Employer responsibilities, safety and hygiene in the salon","level":"Level 1","department":"Professional and Creative","three_screens":true}}'::jsonb
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
  -- 1 · Day One: who keeps the salon safe? (2 min)
  (0, 'Day One: who keeps the salon safe?', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-01.jpg","file_name":"slide-01.jpg"}',
    null),

  -- 2 · Video: could your barber be putting you at risk? (3 min)
  (1, 'Video: could your barber be putting you at risk?', 'Launch', 3, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=nQQ8N8AU4tQ"}',
    '{"type":"text_slide","title":"Watch for","text":"1  What happened to Jacob?\n2  What did the BBC find in the barbershop?\n3  Whose job was it to stop it?","size":"lg"}'),

  -- 3 · Whose fault was it? (3 min)
  (2, 'Whose fault was it?', 'Launch', 3, 'screen1_continue',
    '{"type":"text_slide","title":"Whose fault was it?","text":"The barber?\nThe shop owner?\nNobody?\n\nShut down or stay open?\nWrite your table''s verdict.","size":"lg"}',
    null),

  -- 4 · Video: the law in 60 seconds (2 min)
  (3, 'Video: the law in 60 seconds', 'Establish', 2, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=hpxXcAq7iAE"}',
    '{"type":"text_slide","title":"Watch for","text":"Write on the EMPLOYER side:\neverything the employer\nMUST do.","size":"lg"}'),

  -- 5 · The employer must… what must YOU do? (1) (4 min)
  (4, 'The employer must… what must YOU do? (1)', 'Establish', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-02.jpg","file_name":"slide-02.jpg"}',
    null),

  -- 6 · Let's check (1) (2 min)
  (5, 'Let''s check (1)', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-03.jpg","file_name":"slide-03.jpg"}',
    null),

  -- 7 · The employer must… what must YOU do? (2) (3 min)
  (6, 'The employer must… what must YOU do? (2)', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-04.jpg","file_name":"slide-04.jpg"}',
    null),

  -- 8 · Let's check (2) (1 min)
  (7, 'Let''s check (2)', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-05.jpg","file_name":"slide-05.jpg"}',
    null),

  -- 9 · What else must the employer do? (3 min)
  (8, 'What else must the employer do?', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-06.jpg","file_name":"slide-06.jpg"}',
    null),

  -- 10 · Fill the gaps (3 min)
  (9, 'Fill the gaps', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-07.jpg","file_name":"slide-07.jpg"}',
    null),

  -- 11 · How did Jacob's infection spread? (3 min)
  (10, 'How did Jacob''s infection spread?', 'Establish', 3, 'screen1_continue',
    '{"type":"text_slide","title":"Draw it on your table","text":"How did the infection get\nfrom one client to the next?\n\nWhere could you break the chain?","size":"lg"}',
    null),

  -- 12 · Keeping clean and tidy (1 min)
  (11, 'Keeping clean and tidy', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-08.jpg","file_name":"slide-08.jpg"}',
    null),

  -- 13 · Minimising cross infection (2 min)
  (12, 'Minimising cross infection', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-09.jpg","file_name":"slide-09.jpg"}',
    null),

  -- 14 · Which bin? (2 min)
  (13, 'Which bin?', 'Establish', 2, 'screen1_continue',
    '{"type":"text_slide","title":"Which bin?","text":"Used razor blade\nEmpty tint tube\nHair clippings\nCardboard box","size":"lg"}',
    null),

  -- 15 · Waste disposal (1 min)
  (14, 'Waste disposal', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-10.jpg","file_name":"slide-10.jpg"}',
    null),

  -- 16 · Personal presentation and hygiene (1 min)
  (15, 'Personal presentation and hygiene', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-11.jpg","file_name":"slide-11.jpg"}',
    null),

  -- 17 · Protection for clients and for you (1 min)
  (16, 'Protection for clients and for you', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-12.jpg","file_name":"slide-12.jpg"}',
    null),

  -- 18 · Quick fire (5 min)
  (17, 'Quick fire', 'Apply', 5, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"A client trips over a trailing cable and breaks her wrist.\nWhich insurance pays?","options":["Employer''s liability","Public liability","Professional indemnity"],"correct":1},{"type":"true_or_false","text":"Your employer can make you pay for your own gloves.","correct_tf":false},{"type":"multiple_choice","text":"Odd one out.\nWhich is NOT a way to sterilise tools?","options":["Autoclave","Barbicide solution","A rinse under the tap","Sterilising spray"],"correct":2},{"type":"multiple_choice","text":"Where does a used razor blade go?","options":["General waste","Sharps box","Recycling"],"correct":1},{"type":"true_or_false","text":"Electrical equipment in a salon should be tested every 12 months.","correct_tf":true},{"type":"multiple_choice","text":"The glove box is empty.\nWhat is YOUR duty?","options":["Carry on carefully","Report it so more are ordered","Use a plastic bag"],"correct":1},{"type":"multiple_choice","text":"Why use a fresh towel for every client?","options":["It looks more professional","It stops germs passing between clients","The old one is wet"],"correct":1},{"type":"true_or_false","text":"If a colour goes wrong and burns a client, professional indemnity insurance covers it.","correct_tf":true}]}',
    null),

  -- 19 · Your verdict now (2 min)
  (18, 'Your verdict now', 'Apply', 2, 'screen2_submit',
    '{"type":"voting","question":"The barbershop in the BBC report: rusty, bloodstained razors. Your verdict now?","options":["Pass","Needs work","Shut down"]}',
    null),

  -- 20 · Day One induction board (1 min)
  (19, 'Day One induction board', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-13.jpg","file_name":"slide-13.jpg"}',
    null),

  -- 21 · Build your board (7 min)
  (20, 'Build your board', 'Demonstrate', 7, 'screen1_continue',
    '{"type":"host_timer","label":"Build your Day One board","duration_secs":420}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-13.jpg","file_name":"slide-13.jpg"}'),

  -- 22 · Swap and judge (4 min)
  (21, 'Swap and judge', 'Demonstrate', 4, 'screen1_continue',
    '{"type":"host_timer","label":"Judge another table''s board","duration_secs":210}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-14.jpg","file_name":"slide-14.jpg"}'),

  -- 23 · The verdict (3 min)
  (22, 'The verdict', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-14.jpg","file_name":"slide-14.jpg"}',
    null),

  -- 24 · Day One: who keeps you safe? (1 min)
  (23, 'Day One: who keeps you safe?', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-who-keeps-us-safe/slide-01.jpg","file_name":"slide-01.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
