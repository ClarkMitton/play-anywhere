-- ─────────────────────────────────────────────────────────────
-- CUSTOMER SERVICE AND PROFESSIONAL IMAGE · 90 minutes · 26 steps · Level 1 Hairdressing
-- Built from "Customer service ppt week 1 theory.pptx" and
-- "professional image ppt week 1 theory.ppt", with the "Presenting a
-- professional image" Kahoot opened from a button on the big screen.
-- No printing: learners write on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The Kahoot button needs the app update that adds links to text slides.
-- The pictures are in the app's media storage (lesson-media/lessons/salon-image-customer-service/).
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Customer Service and Professional Image',
    'Week 1 theory for Level 1 Hairdressing: first impressions, a professional image, body language, communication on reception, dealing with different clients, and the laws that protect clients. Ends with each table writing a salon code of conduct. Includes the professional image Kahoot. No printing needed.',
    90,
    false,
    true,
    now(),
    '{"rationale":"Week 1 theory for Level 1 Hairdressing, built from two PowerPoints: Customer service and Presenting a professional image. One question runs through the 90 minutes: when a client walks in, what do they judge you on? Learners answer it on the tables, then build the answer up: a mind map of customer service, a predicted drawing of a professional stylist checked against the slide, quick judgements on what to wear and on body language, the reception rules, and the four laws that protect clients. They apply it on the touch screens (which law?), plan and act out a greeting for one of the six clients from the group activity, and play the professional image Kahoot. The product is a salon code of conduct written on the table and checked by another table. Nothing is printed.","objectives":["Describe a professional image in the salon.","Explain how communication and body language affect clients.","Adapt communication for different clients.","Name the laws that protect clients: Data Protection, Equality, consumer protection, and Health and Safety at Work."],"run_sheet":[{"slot_index":0,"teacher_says":"A client walks into the salon. Before you have said a word, what are they judging you on? Write it on your table. You have one minute.","watch_for":"Learners: standing at the whiteboard tables, each with a pen. Good answers: uniform, hair, smile, body language, cleanliness, whether you look up. Keep the tables'' answers: the code of conduct at the end is built from them. Technique: open a question now and answer it at the end."},{"slot_index":1,"teacher_says":"Write CUSTOMER SERVICE in the middle of your table. Branch out: what does it mean, what does good service look like, what does bad service look like? Five minutes. Draw your example on the board first.","watch_for":"Learners: at the tables. This is the mind map activity from the customer service slides. Draw a model on the board before the timer starts, because the big screen shows the timer. Stretch: add one bad experience you have had as a customer, and what should have happened. Technique: activate what learners already know."},{"slot_index":2,"teacher_says":"Here is the slide. Tick each one your table has. Which did nobody get? Probably confidentiality: we come back to that with the law.","watch_for":"Learners: at the tables, ticking their mind maps. Her four points from the customer service slide, in her words. Technique: self-check against a model."},{"slot_index":3,"teacher_says":"By the end of today your table will write the code of conduct for a salon. Everything we do builds to it.","watch_for":"Learners: at the tables. Name the final product now so learners collect ideas for it all lesson. Technique: share the goal and the product at the start."},{"slot_index":4,"teacher_says":"First impressions are important, and our appearance is part of that. Some salons have a uniform or dress code. A professional appearance gives clients confidence in your ability.","watch_for":"Learners: at the tables. Her words from the professional image slides. Link back to step 1: their answers were mostly about appearance. Technique: connect to the opening question."},{"slot_index":5,"teacher_says":"Before you see the slide: draw a quick stylist on your table, stick figure is fine. Label everything that makes them look professional. Head to toe.","watch_for":"Learners: at the tables, drawing. Expect: uniform, hair, shoes. Push for the ones learners forget: nails, smell, no chewing gum, no smoking in uniform. Technique: do it before being told."},{"slot_index":6,"teacher_says":"Her list. Tick each one on your drawing, add the ones you missed. Why flat, closed-toe shoes? Why not smoke in your uniform?","watch_for":"Learners: at the tables. Her slide with her uniform pictures. Answers: closed shoes protect your feet from dropped scissors, chemicals and hot tools, and you stand all day; the client will smell the smoke. Also her daily cleansing slide: a daily shower or bath removes stale sweat, dirt and bacteria that cause body odour. Technique: check the prediction, then ask why."},{"slot_index":7,"teacher_says":"Four pictures. On your table, write 1 to 4, and a tick or a cross: would you wear it in the salon? Then I ask why.","watch_for":"Learners: at the tables. Her ''What to wear'' slide. Answers: 1 tick (uniform); 2 cross (high heels: unsafe, you stand all day); 3 cross (loose, floaty layers catch on equipment and in chemicals); 4 tick (flat, closed shoes). One picture from her original slide, a meme mocking a woman''s body, was left out on purpose. Technique: quick judgement, then justify."},{"slot_index":8,"teacher_says":"Body language. Write 1 to 8 on your table, and P for positive or N for negative. Number 8 is a tricky one: talk about it.","watch_for":"Learners: at the tables. Her body language pictures, numbered. Do not reveal yet. Technique: decide before the reveal; number 8 is a best-answer debate."},{"slot_index":9,"teacher_says":"Check yours. Folded arms, yawning, eye-rolling and pointing are negative. Smiling and open body language are positive. Number 8: what do you think?","watch_for":"Learners: at the tables. Number 8 (looking away, hand on chin) could be thinking or bored, which is the point: a client reads it as not listening. Her Kahoot asks about folded arms and frowning, and smiling and open body language, so this sets it up. Technique: self-check, then discuss the grey area."},{"slot_index":10,"teacher_says":"To work in a busy salon there are codes of conduct to follow at all times. Remember this slide: your table writes its own code of conduct at the end.","watch_for":"Learners: at the tables. Her eight rules from the professionalism slides, in two columns. Ask: which of these is hardest to keep on a busy Saturday? Technique: model the final product''s content."},{"slot_index":11,"teacher_says":"Her six rules for reception. Turn to the person next to you: greet them as a client, using three of these. Then swap.","watch_for":"Learners: at the tables, in pairs. Her communication on reception slide. Thirty seconds each way. Listen for a smile, a name, an open question. ''Adapt your communication'' leads into the client activity later. Technique: practise straight after the model."},{"slot_index":12,"teacher_says":"Before the slides: which laws protect clients in a salon? Write every one you can name, even half a name.","watch_for":"Learners: at the tables. Learners may know the Health and Safety at Work Act already. Accept ''the data one'' and ''the equality one''. Technique: predict, then reveal."},{"slot_index":13,"teacher_says":"Record cards, phone numbers, allergies. Who in this salon can see them? Where are they kept?","watch_for":"Learners: at the tables. Her Data Protection slide. Link back to ''maintain client confidentiality'' from the start. Ask: is it OK to talk about a client''s colour disaster at the front desk? Technique: make the law concrete in the salon."},{"slot_index":14,"teacher_says":"Nine protected characteristics. How many did your table already know? A salon cannot refuse or treat a client worse because of any of them.","watch_for":"Learners: at the tables. Her Equality Act slide and pictures. Keep it professional and kind; some learners may share a characteristic. Ask: how might a salon make a service accessible for a client in a wheelchair, or a client who prefers a female stylist for religious reasons? Technique: apply the law to service."},{"slot_index":15,"teacher_says":"Retail matters. If you tell a client a shampoo will stop hair loss, and it does not, which law?","watch_for":"Learners: at the tables. Her consumer protection slide. Answer: Trade Descriptions Act (a false claim). A faulty hairdryer sold in the salon: Sale of Goods. Technique: apply with a quick example."},{"slot_index":16,"teacher_says":"Last one. The employer''s job and your job. Then everyone to the touch screens.","watch_for":"Learners: at the tables, then MOVE to the touch screens, half the class at each. Her Health and Safety slide. Technique: close the teaching part."},{"slot_index":17,"teacher_says":"Read each question aloud. Talk at your screen, then one person taps. Take turns.","watch_for":"Learners: at the touch screens, half the class at each. Mixed question shapes: which law, true or false, odd one out. Q4: hair type is not a protected characteristic, though refusing a client for a hair texture linked to race could be. Technique: apply the law to salon cases."},{"slot_index":18,"teacher_says":"Back to your tables. One spin per table: that is your client. These are from the group activity on her slides.","watch_for":"Learners: MOVE back to the tables, one runner per table watches the spin. Spin once per table and write each table''s client on the board. Her slide says ''A Romanian client with poor English skills''; the wheel says ''a client with little English'' so nobody is singled out by nationality. Technique: random allocation."},{"slot_index":19,"teacher_says":"On your table: how would you deal with your client? Write what you would SAY, what you would DO, and one thing you would AVOID. Then pick two people to act it out at reception.","watch_for":"Learners: at the tables. Her group activity. Good ideas: hard of hearing, face them, speak clearly, write it down; mum with kids, stay calm, offer something for the children, keep the area safe; over friendly teen, polite but professional, no gossip; mature gent, respectful, ask how he would like to be addressed; old school friend, friendly but professional, keep it confidential; little English, simple words, gestures, pictures of styles, check understanding, never laugh. Stretch: which law links to your client? Technique: plan, then perform."},{"slot_index":20,"teacher_says":"One table at a time, show us the greeting at reception. Everyone else: one thing they did really well, and one tip.","watch_for":"Learners: at the tables, one pair from each table performing. Thirty to forty-five seconds each. Look for her six reception rules: clear speech, smile, open body language, questions, information, listening. Keep it kind; the person playing the client should not overact. Technique: perform and give peer feedback."},{"slot_index":21,"teacher_says":"Kahoot time. One phone per table, play as a team. Join at kahoot.it with the PIN on the big screen.","watch_for":"Learners: at the tables, one phone per table. Press ''Open the Kahoot'' on the big screen: it opens Kahoot in a new tab. Choose Host live, and Team mode if you want one device per table. Ten questions on communication, uniform, hygiene, make-up, tone of voice, body language and shoes. When it finishes, close the Kahoot tab to come back to the lesson. If phones are not allowed, read the questions out and tables write their answers on the table. Technique: retrieval quiz as a team."},{"slot_index":22,"teacher_says":"Wipe your table. Write the code of conduct for your salon: what a new junior must do. Four parts: how we look, how we communicate, how we treat every client, and the laws we follow.","watch_for":"Learners: at the tables. Write the four headings on the board too, because the next step shows a timer. Success criteria: at least two rules in each part, each starting with a verb (Wear, Smile, Keep...), and one law named. Technique: create a product against criteria."},{"slot_index":23,"teacher_says":"Eight minutes. Everyone writes at least one rule. Use your mind map, your drawing and your client plan.","watch_for":"Learners: at the tables, writing. Push for specific rules: not ''look nice'' but ''wear a clean, pressed uniform''. Stretch: a rule for what to do if a client complains. The timer moves on by itself. Technique: create."},{"slot_index":24,"teacher_says":"Move one table round. Tick the rules that are clear, circle one that could be better, and add one rule they missed.","watch_for":"Learners: MOVE one table clockwise. Watch that feedback is kind and specific. Technique: peer assessment against criteria."},{"slot_index":25,"teacher_says":"Back to the start: what does a client judge you on? Each table, read us the best rule from the code you checked.","watch_for":"Learners: at the tables. Close the loop with step 1. Every answer should now name image, communication, the way we treat clients, or the law. Technique: close the loop."}],"verify_before_teaching":["The Kahoot (step 22) opens from a button on the big screen into a new tab, because Kahoot refuses to be shown inside the lesson. Decide beforehand whether learners can use phones; one per table in Team mode is enough. If not, read the questions out.","One picture from the ''What to wear'' slide was left out: a meme captioned ''Latesha Ruined Casual Friday For Everyone'' that mocks a Black woman''s body. It is not suitable for the big screen.","The client ''A Romanian client with poor English skills'' became ''a client with little English'' on the wheel, so no nationality is singled out in a diverse room. The tutor note keeps the original wording.","Nothing is printed. Learners write on the whiteboard tables in almost every step; tables need wiping before step 23.","The whole class moves twice: to the touch screens after step 17, and back to the tables at step 19. At step 25 every table moves round one.","Timers at steps 2, 20, 24 and 25 move on by themselves. Pause if a table needs longer."],"safety_note":null,"media_requests":[],"brief":{"topic":"Customer service and presenting a professional image","level":"Level 1","department":"Professional and Creative","three_screens":true}}'::jsonb
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
  -- 1 · Seven seconds (2 min)
  (0, 'Seven seconds', 'Launch', 2, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"question","kicker":"Customer service and professional image","title":"A client walks in. In the first few seconds, what do they judge you on?","text":"Write it on your table.","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-image-customer-service/salon-photo.jpg"}',
    null),

  -- 2 · Customer service: mind map (6 min)
  (1, 'Customer service: mind map', 'Launch', 6, 'screen1_continue',
    '{"type":"host_timer","label":"Mind map: what does customer service mean?","duration_secs":300}',
    '{"type":"text_slide","title":"Mind map","text":"Customer service:\nwhat does it mean?\n\nWrite it in the middle.\nBranch out with ideas.","size":"lg"}'),

  -- 3 · Customer service: what it means (2 min)
  (2, 'Customer service: what it means', 'Launch', 2, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"steps","kicker":"Customer service","title":"What does it mean?","points":["Offer a quality service throughout the service","Going the extra mile","Be respectful of others","Maintain client confidentiality"]}',
    null),

  -- 4 · Today (2 min)
  (3, 'Today', 'Launch', 2, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"steps","kicker":"Today","title":"By the end you will write your salon''s code of conduct","points":["Describe a professional image","Explain how communication and body language affect clients","Adapt your communication for different clients","Name the laws that protect clients"]}',
    null),

  -- 5 · First impressions (2 min)
  (4, 'First impressions', 'Establish', 2, 'screen1_continue',
    '{"type":"designed_slide","look":"paper","layout":"statement","kicker":"Presenting a professional image","title":"First impressions are important","text":"A professional appearance sets a good standard for your working life and gives clients confidence in your ability."}',
    null),

  -- 6 · What does a professional stylist look like? (4 min)
  (5, 'What does a professional stylist look like?', 'Establish', 4, 'screen1_continue',
    '{"type":"text_slide","title":"Predict","text":"Draw a stylist on your table.\nLabel everything that makes\nthem look professional.","size":"lg"}',
    null),

  -- 7 · Professional hairstylist image (3 min)
  (6, 'Professional hairstylist image', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-image-customer-service/professional-image.jpg","file_name":"professional-image.jpg"}',
    null),

  -- 8 · Wear it or not? (3 min)
  (7, 'Wear it or not?', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-image-customer-service/wear-it-or-not.jpg","file_name":"wear-it-or-not.jpg"}',
    null),

  -- 9 · Body language: positive or negative? (4 min)
  (8, 'Body language: positive or negative?', 'Establish', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-image-customer-service/body-language.jpg","file_name":"body-language.jpg"}',
    null),

  -- 10 · Body language: answers (2 min)
  (9, 'Body language: answers', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-image-customer-service/body-language-answers.jpg","file_name":"body-language-answers.jpg"}',
    null),

  -- 11 · Professionalism: codes of conduct (3 min)
  (10, 'Professionalism: codes of conduct', 'Establish', 3, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"compare","kicker":"Professionalism","title":"Codes of conduct for a professional service","columns":[{"heading":"With clients and colleagues","text":"Be friendly and courteous when greeting clients. Be loyal to your employer, colleagues and the salon. Be dependable and punctual. Use appropriate language at all times."},{"heading":"Standards","text":"Keep clients'' belongings and records secure. Follow the law and the salon''s rules. The highest standards of hygiene. Make a good impression and protect your reputation."}]}',
    null),

  -- 12 · Communication on reception (3 min)
  (11, 'Communication on reception', 'Establish', 3, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"steps","kicker":"Customer service","title":"Communication on reception","points":["Speak clearly and at a good pace","Smile and use open body language","Ask questions if you are not sure about any points","Give clients as much information as possible","Adapt your communication for different clients","Show that you are listening"]}',
    null),

  -- 13 · Laws that protect clients (3 min)
  (12, 'Laws that protect clients', 'Establish', 3, 'screen1_continue',
    '{"type":"text_slide","title":"Predict","text":"Which laws protect\nour clients?\n\nWrite every one you know.","size":"lg"}',
    null),

  -- 14 · Data Protection Act (2 min)
  (13, 'Data Protection Act', 'Establish', 2, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"steps","kicker":"The law","title":"Data Protection Act: the code of practice","points":["The information must be kept secure","It must be accurate and relevant to the needs of the business","If a client asks for their information, you must let them see it","It must only be kept for as long as necessary"]}',
    null),

  -- 15 · The Equality Act 2010 (3 min)
  (14, 'The Equality Act 2010', 'Establish', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-image-customer-service/equality-act.jpg","file_name":"equality-act.jpg"}',
    null),

  -- 16 · Consumer protection (2 min)
  (15, 'Consumer protection', 'Establish', 2, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"compare","kicker":"The law","title":"Consumer protection","columns":[{"heading":"Sale of Goods Act 1979; Sale and Supply of Goods Act 1994","text":"Goods must be fit for purpose and not faulty, do what it is claimed they will do, and be as described."},{"heading":"Trade Descriptions Act 1968","text":"It is a criminal offence for a trader to make false claims about goods or services offered for sale."}]}',
    null),

  -- 17 · Health and Safety at Work Act (2 min)
  (16, 'Health and Safety at Work Act', 'Establish', 2, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"compare","kicker":"The law","title":"Health and Safety at Work Act","columns":[{"heading":"Employers","text":"Have a legal duty to make the workplace as safe as possible. They carry out risk assessments to check for hazards and minimise risks."},{"heading":"Employees","text":"Have a legal duty to work responsibly and safely, follow the rules set out by the salon manager, and must not tamper with safety equipment."}]}',
    null),

  -- 18 · Which law? (5 min)
  (17, 'Which law?', 'Apply', 5, 'screen2_submit',
    '{"type":"question_round","questions":[{"type":"multiple_choice","text":"A client asks to see what is written on her record card.\nWhich law says you must let her?","options":["Data Protection Act","Equality Act","Trade Descriptions Act"],"correct":0},{"type":"true_or_false","text":"A salon can refuse to book a client because of her religion.","correct_tf":false},{"type":"multiple_choice","text":"A stylist tells a client a serum will repair split ends for good. It does not.\nWhich law?","options":["Health and Safety at Work Act","Trade Descriptions Act","Data Protection Act"],"correct":1},{"type":"multiple_choice","text":"Odd one out. Which is NOT a protected characteristic?","options":["Age","Disability","Hair type","Pregnancy and maternity"],"correct":2},{"type":"true_or_false","text":"Client records can be kept for ever, just in case.","correct_tf":false},{"type":"multiple_choice","text":"A client''s hairdryer bought in the salon breaks after a week.\nWhich law protects her?","options":["Sale of Goods Act","Equality Act","Health and Safety at Work Act"],"correct":0}]}',
    null),

  -- 19 · Which client will you get? (2 min)
  (18, 'Which client will you get?', 'Apply', 2, 'screen1_continue',
    '{"type":"wheel_spinner","prompt":"Your client. How would you deal with them?","items":["A client who is hard of hearing","A mum with two boisterous kids","An over friendly teenage girl","A mature gent","An old school friend","A client with little English"]}',
    null),

  -- 20 · Plan your greeting (6 min)
  (19, 'Plan your greeting', 'Apply', 6, 'screen1_continue',
    '{"type":"host_timer","label":"Plan how you will deal with your client","duration_secs":300}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-image-customer-service/six-clients.png","file_name":"six-clients.png"}'),

  -- 21 · Reception: show us (7 min)
  (20, 'Reception: show us', 'Apply', 7, 'screen1_continue',
    '{"type":"text_slide","title":"Reception","text":"Greet your client.\n\nClass: thumbs up for\none thing they did well.","size":"lg"}',
    null),

  -- 22 · Kahoot: presenting a professional image (8 min)
  (21, 'Kahoot: presenting a professional image', 'Apply', 8, 'screen1_continue',
    '{"type":"text_slide","title":"Kahoot","text":"Presenting a\nprofessional image","subtitle":"One phone per table. Join at kahoot.it","size":"lg","link":{"url":"https://create.kahoot.it/share/presenting-a-professional-image-quiz/7b923a05-cf4e-4db8-9a8f-c9d261208034","label":"Open the Kahoot"}}',
    '{"type":"text_slide","title":"Kahoot","text":"Join at\nkahoot.it\n\nOne phone per table.\nAgree before you tap.","size":"lg"}'),

  -- 23 · Your salon's code of conduct (1 min)
  (22, 'Your salon''s code of conduct', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"designed_slide","look":"bold","layout":"steps","kicker":"Final task","title":"Write the code of conduct for a new junior","points":["How we look: a professional image","How we speak and listen: communication and body language","How we treat every client, including the six clients","The laws we follow"]}',
    null),

  -- 24 · Write it (8 min)
  (23, 'Write it', 'Demonstrate', 8, 'screen1_continue',
    '{"type":"host_timer","label":"Write your salon''s code of conduct","duration_secs":480}',
    '{"type":"text_slide","title":"Code of conduct","text":"1  How we look\n2  How we communicate\n3  How we treat every client\n4  The laws we follow\n\nTwo rules each.\nStart each one with a verb.","size":"md"}'),

  -- 25 · Swap and check (4 min)
  (24, 'Swap and check', 'Demonstrate', 4, 'screen1_continue',
    '{"type":"host_timer","label":"Check another table''s code of conduct","duration_secs":210}',
    '{"type":"text_slide","title":"Check it","text":"Tick each rule that is clear.\nCircle one that could be better.\nAdd ONE rule they missed.","size":"lg"}'),

  -- 26 · In the first few seconds (1 min)
  (25, 'In the first few seconds', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"designed_slide","look":"clean","layout":"question","kicker":"Back to the start","title":"A client walks in. What do they judge you on?","text":"Read us the best rule on the table you checked.","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/salon-image-customer-service/salon-photo.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
