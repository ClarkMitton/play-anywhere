-- ─────────────────────────────────────────────────────────────
-- PATIENT ZERO · micro-organisms, cross infection and patient safety
-- 90 minutes · 28 steps · Dental nursing, Unit 202 (Level 2) · about 15 learners
-- Built from the four Unit 202 cross infection decks in Dentistry/ (transmission,
-- prevention, decontamination room, legislation), in the teacher's wording.
-- An outbreak investigation: voicemail hook, secret Patient Zero (Touch Screen 1), table
-- tasks, a hotspot crime scene, a buzzer law round and an exam-style report.
-- No printing: learners write and draw on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The pictures and voicemail are in the app's own media storage
-- (lesson-media/lessons/dental-patient-zero/), so they show straight away.
-- Copies are kept in public/lessons/dental-patient-zero/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Patient Zero: Micro-organisms, Cross Infection and Patient Safety',
    'Dental nursing, Unit 202: transmission of micro-organisms, the chain of infection, universal precautions, the instrument journey, legislation and the needle-stick protocol, run as an outbreak investigation. Three patients at Northgate Dental have the same infection and the inspectors arrive Friday; learners are the infection control team, and one of them is secretly Patient Zero all session (the first to touch Screen 1). Built from the teacher''s four cross infection decks. No printing needed.',
    90,
    false,
    true,
    now(),
    '{"rationale":"One idea runs through the session: infection spreads by routes you cannot see, and the same precautions for every patient break the chain. The hook is a voicemail transcript: three patients at Northgate Dental have the same infection and the inspectors arrive Friday. Learners are the infection control team. Unknown to them, one of them is Patient Zero from the moment they walk in (the first person to tap Touch Screen 1, so the screen and their pen become the contaminated surfaces), so transmission happens to the class before it is taught, and the reveal at the end closes the loop. The content is the teacher''s four Unit 202 decks in their wording (transmission, prevention, decontamination room, legislation), cut to fit 90 minutes. Learners predict before every reveal, work at the whiteboard tables for two thirds of the time (chain stations, wheel planning, the decontamination room drawing, the needle-stick race, the exam answer and peer marking), and make one trip to the touch screens for a question round, a hotspot crime scene and a buzzer law round. The product is the exam-style answer the teacher''s deck asks for (gloves not changed), peer-marked against the four tips and captured on a shared board. No printing.","objectives":["Identify the mode and method of micro-organism transmission, and what micro-organisms can be transferred through.","Identify individuals potentially at risk of transmission in a dental setting.","Understand the chain of infection and consider methods of breaking the chain.","Define Universal Precautions and consider how we may implement them.","Outline the Journey of Dental Instruments.","List some legislations of infection control and briefly explain.","Understand the protocol for a Needle-stick injury."],"run_sheet":[{"slot_index":0,"teacher_says":"Morning. Before you sit down, tap one of the touch screens: how confident are you that you could stop cross infection in a dental surgery? 1 is not at all, 5 is very. Then go to a table.","watch_for":"Learners: walking in past the touch screens, then to the tables. PATIENT ZERO: the FIRST learner to tap Touch Screen 1 is Patient Zero. Quietly note their name and which table they sit at, and say nothing. From now on, Touch Screen 1 and Patient Zero''s pen are ''contaminated''. Technique: baseline confidence, compared at the end."},{"slot_index":1,"teacher_says":"You are the infection control team at Northgate Dental. Samira, the practice manager, left you a voicemail last night. Read it and find three things: how many patients, who is coming and when, and what you must find out. Write the answers on your table.","watch_for":"Learners: at the tables. Set the three questions BEFORE learners read. Read it aloud yourself, like a voicemail, for anyone who would rather listen. Answers: three patients, the same infection; the inspectors on Friday; find out how it spread (who was at risk, how it travelled, what went wrong). Technique: a hook that opens a question the last step answers (how did it spread?)."},{"slot_index":2,"teacher_says":"These are the objectives from your course, and today they are also your case. By the end you will write the report the inspectors want to read.","watch_for":"Learners: at the tables. Read the objectives quickly; do not teach them yet. Technique: share the learning intentions inside the story."},{"slot_index":3,"teacher_says":"Who is at risk of transmission in a dental setting? Look at the picture. Write every person you can think of on your table. 90 seconds.","watch_for":"Learners: at the tables. Push for people who are NOT in the chair: the lab technician, the repair technician, the cleaner, the child in the waiting room. Technique: predict before reveal."},{"slot_index":4,"teacher_says":"Staff, patient, visitors, dental technicians, and the dental repair technician. Tick what you had. Who did nobody think of?","watch_for":"Learners: at the tables. The repair technician is usually missed: instruments go out for repair, so they are at risk too (this comes back in the impressions step). Technique: self-check against the answer."},{"slot_index":5,"teacher_says":"Q: What is the chain of infection and how does it relate to Dentistry? It is the passing of an infectious agent from person to person, and it has six links. Break ONE link and the infection stops.","watch_for":"Learners: at the tables. Draw the six links on the main whiteboard now, because the next slide is a timer and the chain disappears from the big screen (it stays on the touch screens). Give one dental example as a model: portal of exit = the patient''s mouth. Technique: model before the task."},{"slot_index":6,"teacher_says":"Round one: draw the six links on your table and write one dental example for each. When the bell goes, move. Round two: on the next table''s chain, write how you would break each link.","watch_for":"Learners: at the tables, moving once. Good examples: agent = Hep B; reservoir = blood or saliva; exit = mouth or a cut; transmission = aerosol, splash, sharps, hands; entry = needle-stick, mucous membranes; host = patient, nurse. Breaks: vaccination, PPE, hand washing, suction, sharps safety, decontamination. Stretch: which link does the autoclave break? Technique: create, then build on another table''s work."},{"slot_index":7,"teacher_says":"Spin. That person is in your chair. On your table: what PPE, what cleaning, anything different for them? Spin again. And again.","watch_for":"Learners: at the tables. Spin three or four times. Do NOT tell them yet: wait for someone to notice the answer is the same every time. If nobody does, ask: ''What would you do differently for your best friend?'' Technique: discovery; the trap sets up universal precautions."},{"slot_index":8,"teacher_says":"Universal Precautions: treat all in the same conditions as if they were potentially infectious. A set standard of health care. Plus checking medical histories and vaccinations: Hep B, MMR, TB.","watch_for":"Learners: at the tables. Ask why we still check medical histories if we treat everyone the same (people at higher risk of passing it on, or of catching it, such as immunodeficient patients). Technique: name the idea after learners have found it."},{"slot_index":9,"teacher_says":"There are 2 main modes of transmission: direct and indirect. Can you give me a clinical example of each? Write one of each on your table.","watch_for":"Learners: at the tables. Direct: touching a patient''s saliva with bare hands. Indirect: saliva on the light handle, then the next person touches it. Technique: retrieval before teaching the detail."},{"slot_index":10,"teacher_says":"What methods of transmission are there? Direct contact such as a handshake, coughing, sneezing and spitting, aerosols, splashes and needle-stick injury. And what can micro-organisms be transferred through? Blood, saliva and other body fluids.","watch_for":"Learners: at the tables. Ask: what do I mean by aerosols? Do not answer: the clip next does. Technique: open a question for the video to close."},{"slot_index":11,"teacher_says":"Read the three questions on the touch screens out loud before you press play. Write your answers on the table while you watch.","watch_for":"Learners: at the tables. University of Michigan clip, 46 seconds. Answers: high-speed drilling and ultrasonic cleaning; an aerosol can be either: breathed in directly, or it settles on surfaces (indirect); better airflow, barriers, scheduling, and in your practice suction and PPE. The lesson moves on when the clip ends. Technique: watching task, questions set first."},{"slot_index":12,"teacher_says":"Same three questions. One table at a time, give me one answer.","watch_for":"Learners: at the tables. Push question 2: an aerosol can land on a surface far from the chair, which makes it indirect too. Link it to the voicemail: could aerosol have spread it at Northgate? Technique: the floor opens to the questions they watched for."},{"slot_index":13,"teacher_says":"The inspectors will check the decontamination room. What is the journey of dental instruments? Draw a diagram of the room layout on your table: the machines, what each one does, and the order. Dirty to clean.","watch_for":"Learners: at the tables, drawing. Good looks like: a one-way route from dirty to clean, five numbered steps, each machine labelled with its job. Stretch: show where the bag goes for a vacuum and a non-vacuum autoclave. Technique: attempt the task before the model (their own slide 8 task)."},{"slot_index":14,"teacher_says":"1 Manual cleaning, 2 Ultrasonic, 3 Washer disinfector, 4 Rinse and inspect, 5 Autoclave. If there is a deposit still present, the cycle should start again. Non-vacuum: autoclave then bag. Vacuum: bag first then autoclave.","watch_for":"Learners: at the tables. Each table checks its own drawing and corrects it in a different colour. Technique: self-correction against a model."},{"slot_index":15,"teacher_says":"What infection control procedures should we do for impressions, and for dental instruments needing repair? Remember who was at risk: the technician and the repair technician.","watch_for":"Learners: at the tables. Link back to the ''who is at risk'' answer. Technique: connect new content to an earlier step."},{"slot_index":16,"teacher_says":"Legislations of infection control. Think about ones you already know. The inspectors will ask which ones Northgate broke. Then: half of you to each touch screen.","watch_for":"Learners: at the tables, then the WHOLE CLASS MOVES to the touch screens (half to each) at the end of this step. Give one line on each law. Technique: front-load what the next game tests."},{"slot_index":17,"teacher_says":"Each touch screen is a team. Agree, then tap. Seven questions.","watch_for":"Learners: at the touch screens, half at each. The big screen shows live results. Question 5 is the universal precautions trap. Technique: retrieval practice, mixed question types."},{"slot_index":18,"teacher_says":"This is the surgery the day the three patients were treated. Find the six mistakes. Each screen must find all six itself. First team to six, press Finish.","watch_for":"Learners: at the touch screens. The big screen shows each team''s count. When both finish, Reveal all. For each one ask: which link of the chain does this break? Technique: apply knowledge to a scene, team race."},{"slot_index":19,"teacher_says":"Buzz, then name the law Northgate broke. Screen 1 is Team Gloves, screen 2 is Team Visor.","watch_for":"Learners: at the touch screens. Accept a well-argued second law (waste can break more than one). At the end: back to your tables. Technique: buzzer for fast recall of what was just taught."},{"slot_index":20,"teacher_says":"(Loudly, as they get back to the tables.) Your colleague has just pricked their finger on a used needle. What do you do? 60 seconds. Write it on your table. Go!","watch_for":"Learners: the WHOLE CLASS MOVES back to the tables during this step. Start it fast and loud: the urgency is the point. Technique: do it before being told."},{"slot_index":21,"teacher_says":"Protocols for needle-stick injury: Bleed it, Wash it, Seal it, Record it, Report it. Also consider the correct disposal of sharps. How many did your table get, in the right order?","watch_for":"Learners: at the tables. Ask: why record AND report? (Follow-up testing and protection for the injured person, and so the practice can stop it happening again.) Technique: self-check, then link to their own placement."},{"slot_index":22,"teacher_says":"This is the exam question, and it is your report to the inspectors. Explain the transmission of micro-organisms if gloves are not changed. Use the four tips: mode, method, what it may be through, and the consequences.","watch_for":"Learners: at the tables, writing as a table. Good looks like: indirect (and direct) contact; gloves touch saliva or blood, then a surface or the next patient; through blood, saliva or other body fluids; the next patient or a colleague is infected, and the chain continues. Stretch: add which link of the chain changing gloves breaks. Technique: exam-style product tested against criteria."},{"slot_index":23,"teacher_says":"Move to the next table and mark their report: tick each of the four tips they hit. Then move again and add one thing that would get them more marks.","watch_for":"Learners: moving between tables. Listen for tables that miss ''consequences'': it is the part most often dropped in the exam. Technique: peer assessment against success criteria."},{"slot_index":24,"teacher_says":"Back to your own table. Choose your best sentence. One person from each table types it on a touch screen. Then everyone come to the touch screens.","watch_for":"Learners: one runner per table at first, then the WHOLE CLASS MOVES to the touch screens for the last three steps. Read two or three out. This board is the evidence of learning. Technique: capture the product."},{"slot_index":25,"teacher_says":"One of you has been Patient Zero since you walked in: the first person to touch Screen 1 this morning. (Name them.) Now: stand up if you touched Touch Screen 1 today. Stand up if you used a pen from their table, or one that travelled in the rotations. Stand up if you shook anyone''s hand. Look around. How did it reach you? One word on the touch screen.","watch_for":"Learners: at the touch screens. Expect almost everyone standing by the end. Expect: screen, pen, handshake, table. Point at the word cloud: every one of those is a method of transmission, and nobody felt a thing. Close the loop with the voicemail: this is how it spread at Northgate. Technique: close the loop the hook opened."},{"slot_index":26,"teacher_says":"Same question as when you walked in. Tap again. The big screen shows the start against now.","watch_for":"Learners: at the touch screens. Talk about the shift, and ask anyone who did not move what would help. Technique: confidence comparison."},{"slot_index":27,"teacher_says":"Practice reopened. Same precautions. Every patient. Every time. Wash your hands on the way out: you know why.","watch_for":"Learners: at the touch screens, then leaving. Technique: a memorable close."}],"verify_before_teaching":["NO PRINTING. Pictures are on the screens; learners write and draw on the whiteboard tables. 15 learners works as four tables of three or four.","PATIENT ZERO needs nothing bought: the first learner to tap Touch Screen 1 at step 1 is Patient Zero. Note their name and table, keep it secret until step 26. Touch Screen 1 is the shared surface (like a light handle) and their pen travels in the two rotations.","Pens: two colours per table (the chain stations and peer marking add in a different colour).","Draw the six links of the chain on the main whiteboard before step 7: the rotation timer hides the chain slide on the big screen (it stays on the touch screens).","Facts kept from the teacher''s slides that should be checked against the practice''s own policy and HTM01-05: impressions in disinfectant for 10 minutes; the needle-stick steps (Bleed it, Wash it, Seal it, Record it, Report it) and who to report to; vacuum autoclave bag first, non-vacuum bag after.","The one-line meanings under each law on the legislation slide, and the buzzer answers matching breaches to laws, were written for this lesson, not taken from the teacher''s slides. Check them. The teacher''s slide names ''Special Waste and Hazardous Waste Regulations 2005''; the current English rules are the Hazardous Waste (England and Wales) Regulations 2005.","Crime scene hotspots: six circles placed by eye on an AI picture. Tap each once in the preview and check the green ring lands on the mop, food and drink, sharps bin, phone, gloves and spill.","The voicemail is on screen as a written transcript. A computer-voice recording of it (voicemail-practice-manager.wav) is in the media storage if you ever want to add it with Audio & Image in the designer.","Watch the clip (Michigan Engineering, 46 seconds, start 20s to 66s) with sound before the session.","The whole class moves four times: to the tables at the start, to the touch screens at step 18, back to the tables at step 21, and to the touch screens for the last three steps.","All pictures are in the app''s media storage and load straight away."],"safety_note":"Infection control and needle-stick procedure are regulated practice: follow the placement''s own policy where it differs from the slides."}'
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
  -- 1 · Arrival: how confident are you? (2 min)
  (0, 'Arrival: how confident are you?', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-01-practice-closed.jpg","file_name":"slide-01-practice-closed.jpg"}',
    '{"type":"confidence_checker","prompt":"How confident are you that you could stop cross infection in a dental surgery?","scale_mode":"numbers","max":5,"checkpoint":"start"}'),

  -- 2 · The voicemail (4 min)
  (1, 'The voicemail', 'Launch', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-01b-voicemail.jpg","file_name":"slide-01b-voicemail.jpg"}',
    '{"type":"text_slide","title":"Find out","text":"How many patients?\nWho is coming, and when?\nWhat must you find out?","size":"xl"}'),

  -- 3 · Your mission (2 min)
  (2, 'Your mission', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-02-objectives.jpg","file_name":"slide-02-objectives.jpg"}',
    '{"type":"text_slide","title":"Mission","text":"Find out how it spread.\nStop it happening again.","size":"xl"}'),

  -- 4 · Who is at risk? (2 min)
  (3, 'Who is at risk?', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-03-who-is-at-risk.jpg","file_name":"slide-03-who-is-at-risk.jpg"}',
    '{"type":"countdown_timer","label":"Write on your table: who could catch it here?","duration_secs":90}'),

  -- 5 · Who is at risk: answer (1 min)
  (4, 'Who is at risk: answer', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-04-at-risk-answer.jpg","file_name":"slide-04-at-risk-answer.jpg"}',
    '{"type":"text_slide","text":"Tick what you got.\nAdd what you missed.","size":"xl"}'),

  -- 6 · The chain of infection (2 min)
  (5, 'The chain of infection', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-05-chain-of-infection.jpg","file_name":"slide-05-chain-of-infection.jpg"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-05-chain-of-infection.jpg","file_name":"slide-05-chain-of-infection.jpg"}'),

  -- 7 · Chain stations (6 min)
  (6, 'Chain stations', 'Establish', 6, 'screen1_continue',
    '{"type":"rotation_timer","label":"Draw the six links on your table. Write a dental example for each link.","details":"Round 2: move to the next table. On THEIR chain, write how to BREAK each link, in a different colour.","rounds":2,"round_secs":150,"move_secs":20,"move_text":"Move to the next table. Take your pen."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-05-chain-of-infection.jpg","file_name":"slide-05-chain-of-infection.jpg"}'),

  -- 8 · Who's in the chair? (4 min)
  (7, 'Who''s in the chair?', 'Establish', 4, 'screen1_continue',
    '{"type":"wheel_spinner","prompt":"Who is in the chair? Plan their precautions.","items":["Patient with Hep B","Patient with HIV","Patient with a history of cold sores","Patient who is immunodeficient","A healthy-looking teenager","A visitor''s child","The practice manager","Your best friend"]}',
    '{"type":"text_slide","title":"Plan it on your table","text":"PPE?\nCleaning?\nAnything different?","size":"xl"}'),

  -- 9 · Universal precautions (3 min)
  (8, 'Universal precautions', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-06-precautions.jpg","file_name":"slide-06-precautions.jpg"}',
    '{"type":"text_slide","text":"Same answer every time?\nThat is the point.","size":"xl"}'),

  -- 10 · Direct or indirect? (2 min)
  (9, 'Direct or indirect?', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-07-modes.jpg","file_name":"slide-07-modes.jpg"}',
    '{"type":"countdown_timer","label":"Write one DIRECT and one INDIRECT example on your table.","duration_secs":90}'),

  -- 11 · Methods of transmission (3 min)
  (10, 'Methods of transmission', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-08-methods.jpg","file_name":"slide-08-methods.jpg"}',
    '{"type":"text_slide","text":"Which ones happen in a dental surgery every day?","size":"xl"}'),

  -- 12 · Video: aerosols in the surgery (2 min)
  (11, 'Video: aerosols in the surgery', 'Establish', 2, 'screen1_continue',
    '{"type":"youtube","url":"https://www.youtube.com/watch?v=fcJEc40cD8o&start=20&end=66"}',
    '{"type":"text_slide","title":"Watch for","text":"1. Which TWO procedures make aerosols?\n2. Is an aerosol direct or indirect?\n3. How could we stop the spread?","size":"lg"}'),

  -- 13 · What did you see? (2 min)
  (12, 'What did you see?', 'Establish', 2, 'screen1_continue',
    '{"type":"text_slide","title":"What did you see?","text":"1. Which TWO procedures make aerosols?\n2. Is an aerosol direct or indirect?\n3. How could we stop the spread?","size":"lg"}',
    '{"type":"text_slide","text":"Answers on your table.","size":"xl"}'),

  -- 14 · Instrument journey: draw it (7 min)
  (13, 'Instrument journey: draw it', 'Establish', 7, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-09-journey-task.jpg","file_name":"slide-09-journey-task.jpg"}',
    '{"type":"countdown_timer","label":"Draw the decontamination room. Number the steps. Dirty to clean.","duration_secs":360}'),

  -- 15 · Instrument journey: check (3 min)
  (14, 'Instrument journey: check', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-10-journey-answer.jpg","file_name":"slide-10-journey-answer.jpg"}',
    '{"type":"text_slide","text":"Check your drawing.\nWrong order? Start again.","size":"xl"}'),

  -- 16 · Impressions and repairs (2 min)
  (15, 'Impressions and repairs', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-11-impressions-repairs.jpg","file_name":"slide-11-impressions-repairs.jpg"}',
    '{"type":"text_slide","text":"Before it leaves the practice:\ndisinfected?\nmarked?","size":"xl"}'),

  -- 17 · The laws (3 min)
  (16, 'The laws', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-12-legislation.jpg","file_name":"slide-12-legislation.jpg"}',
    '{"type":"text_slide","text":"Next: the crime scene.\nWhich law did they break?","size":"xl"}'),

  -- 18 · Transmission round (4 min)
  (17, 'Transmission round', 'Apply', 4, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"true_or_false","text":"A handshake is direct transmission.","correct_tf":true},{"type":"multiple_choice","text":"Saliva gets on the light handle. The next patient catches it from the handle. This is...","options":["Direct transmission","Indirect transmission"],"correct":1},{"type":"multiple_choice","text":"Which one makes an aerosol?","options":["Hand washing","High-speed drilling","Checking a medical history"],"correct":1},{"type":"multiple_choice","text":"Micro-organisms can be transferred through...","options":["Blood only","Saliva only","Blood, saliva and other body fluids"],"correct":2},{"type":"true_or_false","text":"Full precautions are only needed for patients who say they have an infection.","correct_tf":false},{"type":"multiple_choice","text":"Which machine sterilises the instruments?","options":["Ultrasonic","Washer disinfector","Autoclave"],"correct":2},{"type":"multiple_choice","text":"Vacuum autoclave: when do you bag the instruments?","options":["Before the autoclave","After the autoclave","You do not bag them"],"correct":0}]}',
    null),

  -- 19 · Crime scene (5 min)
  (18, 'Crime scene', 'Apply', 5, 'screen1_continue',
    '{"type":"hazard_hotspots","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/hotspot-surgery.jpg","title":"Find the 6 infection control mistakes","hotspots":[{"id":"mop","x":13,"y":52,"r":6.5,"label":"Red mop in the surgery (wrong colour)"},{"id":"food","x":49.5,"y":22,"r":4.5,"label":"Food and drink on the clinical worktop"},{"id":"sharps","x":91,"y":18,"r":5,"label":"Overfilled sharps bin, lid open"},{"id":"phone","x":79,"y":45,"r":4.5,"label":"Mobile phone on the instrument tray"},{"id":"gloves","x":47,"y":54,"r":4,"label":"Used gloves left on the chair"},{"id":"spill","x":26.5,"y":85,"r":4.5,"label":"Blood spill not cleaned up"}]}',
    null),

  -- 20 · Which law did they break? (5 min)
  (19, 'Which law did they break?', 'Apply', 5, 'screen1_continue',
    '{"type":"quiz_buzzer","team1_name":"Team Gloves","team2_name":"Team Visor","questions":["A red mop is being used in the surgery.","The sharps bin is overflowing with the lid open.","Instruments went back in the drawer without going through the autoclave.","Staff were not given gloves or visors to wear.","Clinical waste went in the ordinary outside bin.","Where do you get your decontamination information from?"],"answers":["National Colour-Coding of cleaning equipment and materials","Special Waste and Hazardous Waste Regulations 2005","HTM01-05","Health & Safety at Work Act 1974","Environmental Protection Act 1990 (and the Hazardous Waste Regulations)","HTM01-05"]}',
    null),

  -- 21 · Needle-stick! (2 min)
  (20, 'Needle-stick!', 'Apply', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-13-needle-stick-emergency.jpg","file_name":"slide-13-needle-stick-emergency.jpg"}',
    '{"type":"countdown_timer","label":"NEEDLE-STICK! Write the steps on your table.","duration_secs":60}'),

  -- 22 · Needle-stick protocol (3 min)
  (21, 'Needle-stick protocol', 'Apply', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-14-needle-stick-protocol.jpg","file_name":"slide-14-needle-stick-protocol.jpg"}',
    '{"type":"text_slide","text":"Who do you report it to at your placement?\nFind out this week.","size":"xl"}'),

  -- 23 · Write your report (7 min)
  (22, 'Write your report', 'Demonstrate', 7, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-15-exam-question.jpg","file_name":"slide-15-exam-question.jpg"}',
    '{"type":"countdown_timer","label":"Write your answer on the table: mode, method, through, consequences.","duration_secs":420}'),

  -- 24 · Mark another table (4 min)
  (23, 'Mark another table', 'Demonstrate', 4, 'screen1_continue',
    '{"type":"rotation_timer","label":"Read their answer. Tick each tip they hit: mode, method, through, consequences.","details":"Round 2: move again. Add ONE thing that would get them more marks, in a different colour.","rounds":2,"round_secs":100,"move_secs":20,"move_text":"Move to the next table. Take your pen."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-15-exam-question.jpg","file_name":"slide-15-exam-question.jpg"}'),

  -- 25 · Our best answers (3 min)
  (24, 'Our best answers', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"Report to the inspectors","question":"One person per table: type your table''s best sentence from the report."}',
    null),

  -- 26 · Patient Zero (4 min)
  (25, 'Patient Zero', 'Demonstrate', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-16-patient-zero.jpg","file_name":"slide-16-patient-zero.jpg"}',
    '{"type":"word_cloud","prompt":"How did it reach you? One word.","title":"Patient Zero","max_words":2}'),

  -- 27 · How confident are you now? (2 min)
  (26, 'How confident are you now?', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"confidence_checker","prompt":"How confident are you that you could stop cross infection in a dental surgery?","scale_mode":"numbers","max":5,"checkpoint":"final"}',
    '{"type":"confidence_checker","prompt":"How confident are you that you could stop cross infection in a dental surgery?","scale_mode":"numbers","max":5,"checkpoint":"final"}'),

  -- 28 · Practice reopened (1 min)
  (27, 'Practice reopened', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/dental-patient-zero/slide-17-practice-reopened.jpg","file_name":"slide-17-practice-reopened.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
