-- ─────────────────────────────────────────────────────────────
-- The Five Parties: Who Wins Your Vote?
-- 120 minutes (with a 10 minute break) · 31 steps · Level 2 · 15 learners
-- Whiteboard tables, no printing.
-- Pictures live in lesson-media/lessons/five-uk-parties/ (already uploaded), copies in
-- public/lessons/five-uk-parties/. Slides 1 to 8 are the teacher's Canva deck.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'The Five Parties: Who Wins Your Vote?',
    'Level 2 citizenship. Learners guess whose policy is whose, place the five largest UK parties from left to right, match the leaders, research health, education and immigration on the touch screens, then run an assigned party''s plan for a Bradford issue and pitch it to a voter. Whiteboard tables, no printing. Two hours with a break.',
    120,
    false,
    true,
    now(),
    '{"rationale": "One idea runs through the session: every party offers a different deal to different people. Learners first guess whose policy is whose, place the five parties from left to right and meet the leaders, then research health, education and immigration on the touch screens before a quiz. After the break their table runs an assigned party''s plan for a Bradford issue the class chose, and finally pitches it to one voter. Most of the time is at the whiteboard tables, with no printing.", "objectives": ["Locate the five major UK parties along the left-right political spectrum.", "Compare party manifestos on healthcare, education, and immigration.", "Identify current party leaders and describe their role in party identity.", "Analyse how party policies across the five parties affect local communities and public spending.", "Justify how party platforms appeal to different groups of voters."], "run_sheet": [{"slot_index": 0, "teacher_says": "Today is about the five biggest parties in Parliament. By the end, your table will be a campaign team trying to win one voter over.", "watch_for": "Learners at the whiteboard tables, about five per table. Pens out. Technique: set the destination, so they know where the lesson ends."}, {"slot_index": 1, "teacher_says": "Five real policies, party names hidden. Write 1 to 5 on your table and guess which party said each one. Argue about it as a table.", "watch_for": "At the tables. Technique: predict before reveal. Do not help; listen for reasons (''that sounds left wing because...''). Answers: 1 Green, 2 Reform UK, 3 Lib Dem, 4 Conservative, 5 Labour."}, {"slot_index": 2, "teacher_says": "Score yourselves. Which one fooled you? Here is today''s question: can you tell a party from its policy, and who is each party trying to win? We answer it at the very end.", "watch_for": "Hands up for five out of five. Ask a table to write the question in a corner of their table, so it is there to close the loop in the last step."}, {"slot_index": 3, "teacher_says": "Politicians are often described as left or right. Read these with me. These are tendencies, not rules.", "watch_for": "At the tables. Teach before you test: this is the only definition they get before placing the parties. Check one learner can put it in their own words."}, {"slot_index": 4, "teacher_says": "Draw your line and place the five parties on it. Use the policies you just guessed. Every party needs a reason underneath.", "watch_for": "Good answer: Green furthest left, then Labour, Lib Dem near the centre, Conservative centre-right, Reform UK furthest right, each with a reason. Stretch: draw a second line for immigration only. Does anyone move?"}, {"slot_index": 5, "teacher_says": "Look at the top row: how each party is usually described. Move any party on your line that is in the wrong place. Where did your table disagree?", "watch_for": "Ask a table that moved something to explain why. Point out that left and right simplify things: Reform UK is right-wing on immigration but promises to keep the NHS tax-funded."}, {"slot_index": 6, "teacher_says": "Five parties, two minutes each. For each one, write ONE word on your table under that party on your line: its big idea.", "watch_for": "Watching task at the tables. Labour is in government with about 400 MPs. These ''five missions'' were set under Keir Starmer; Andy Burnham became leader and Prime Minister in July, so ask: what might change when a party changes leader? We come back to it at the leaders step."}, {"slot_index": 7, "teacher_says": "The Official Opposition. One word for their big idea.", "watch_for": "Scrapping the Climate Change Act is the furthest any large party has gone against net zero. A good word: ''lower'', ''borders'', ''growth''."}, {"slot_index": 8, "teacher_says": "The third largest party in the Commons. One word.", "watch_for": "71 MPs. A good word: ''fair'', ''care'', ''centre''. ''Reform politics'' means changing how MPs are elected."}, {"slot_index": 9, "teacher_says": "Only 8 MPs, but high in the polls. One word.", "watch_for": "ECHR is the European Convention on Human Rights, not the EU: a common mix-up worth naming. A good word: ''borders'', ''sovereign''."}, {"slot_index": 10, "teacher_says": "The Green Party of England and Wales. One word.", "watch_for": "5 MPs. Scotland has its own Scottish Greens. A good word: ''climate'', ''public'', ''fairer''. Ask: has your line changed after the tour?"}, {"slot_index": 11, "teacher_says": "Match each photo to a leader and a party. Write A to E on your table.", "watch_for": "Predict before reveal. Many will expect Keir Starmer as Prime Minister: a useful mistake. Answers: A Badenoch (Conservative), B Polanski (Green), C Burnham (Labour), D Farage (Reform UK), E Davey (Lib Dem)."}, {"slot_index": 12, "teacher_says": "Score yourselves. Andy Burnham has been Prime Minister since July.", "watch_for": "Hands up for five out of five. Leader of the Opposition means leading the largest party not in government."}, {"slot_index": 13, "teacher_says": "Talk at your table and write one answer to each question. Then I''ll take one answer from each table.", "watch_for": "Technique: think, pair, share. A good answer links the leader to the party''s image: who it attracts, what it is known for, how much media attention it gets."}, {"slot_index": 14, "teacher_says": "Everyone up: to the touch screens, half the class at each. Three quick research sprints, then a quiz on exactly this.", "watch_for": "Whole-class move 1 of 3. Seven or eight per screen: ask those at the front to read aloud. Teach before you test: the quiz comes straight from these three cards. Answers: more money: Green; spend differently: Reform UK."}, {"slot_index": 15, "teacher_says": "Next card. Three things to find.", "watch_for": "Answers: Green; Lib Dems; Conservatives."}, {"slot_index": 16, "teacher_says": "Last card. Two things to find.", "watch_for": "Answers: Lib Dems and Greens; Reform UK (''net negative immigration''). Keep the discussion on policies, not on people."}, {"slot_index": 17, "teacher_says": "Everyone answers on the touch screens. Some questions have two answers that look right: pick the best one.", "watch_for": "Mixed question types: true or false for pace, best answer and odd one out for debate. After any question where the room split, ask one person from each side why."}, {"slot_index": 18, "teacher_says": "Up to three answers each. What matters most to people your age in Bradford?", "watch_for": "Expect buses, jobs, rent, mental health, cost of living, safety, things to do, uni costs, climate. This chooses what the tables work on after the break."}, {"slot_index": 19, "teacher_says": "Vote for the issue you most want to work on.", "watch_for": "The top issues become the tables'' issues, one per table. If the word cloud threw up something big that is not here, say so and use it instead."}, {"slot_index": 20, "teacher_says": "Ten-minute break. Come back to the tables, not the screens.", "watch_for": "Whole-class move 2 of 3: back to the tables after the break. Use the break to write each table''s issue from the vote on its table."}, {"slot_index": 21, "teacher_says": "One spin per table. This is your party for the rest of the lesson. You argue for it whether or not you agree with it.", "watch_for": "Spin once per table and spin again on a repeat. Political balance: parties are assigned, so nobody shares their own views or is judged on them."}, {"slot_index": 22, "teacher_says": "Round 1: write your party''s plan on the table. Need evidence? Send ONE runner to the touch screens for the spending card. Round 2: move one table on, read their plan, and challenge it in a different colour from the other side of the line.", "watch_for": "Objective 4: local community and public spending. A good answer names a real policy, a real source of money (tax on wealth or banks, borrowing, welfare savings) and real Bradford people who gain or lose. Runner, not the room. With one table, skip the move and challenge your own plan."}, {"slot_index": 23, "teacher_says": "One speaker per table, one minute, using the frames on screen. Then the table that challenged you gives its best challenge.", "watch_for": "Technique: structured talk with sentence frames. Listen for who pays: it is the part most often missed."}, {"slot_index": 24, "teacher_says": "Same party, new job: win one voter over. One spin per table.", "watch_for": "Read each voter out with a detail: Amira votes for the first time; Jordan drives to work; Mrs Begum is waiting for a hip operation; Tomasz pays business rates; Priya pays rent and a student loan; Dev takes the bus to college; Grace works shifts; Callum is worried about prices."}, {"slot_index": 25, "teacher_says": "Write a three-sentence pitch from your party to your voter. The three things it must do are on screen.", "watch_for": "Objective 5: justify how a platform appeals to a group. A good pitch uses a real policy, links it to the voter''s life, and answers a real worry. Stretch: which party would your voter actually lean towards, and why?"}, {"slot_index": 26, "teacher_says": "One runner per table types your pitch on a touch screen. Then each table reads its pitch out to the room.", "watch_for": "Runner, not the room. Everyone else listens and judges against the three points. The board is saved as evidence: read it later in Admin, Data."}, {"slot_index": 27, "teacher_says": "Everyone to the touch screens. Vote for the pitch that best fitted its voter. Not your own table, and not the party you like.", "watch_for": "Whole-class move 3 of 3. Peer judgement against criteria. Number the tables out loud first."}, {"slot_index": 28, "teacher_says": "Half the class at each screen: Government against Opposition. Buzz first, answer out loud.", "watch_for": "Fast recall of things already taught. Read the question, first buzz answers, keep it quick."}, {"slot_index": 29, "teacher_says": "One tap before we finish.", "watch_for": "Saved in Admin, Data."}, {"slot_index": 30, "teacher_says": "Back to our first question: can you tell a party from its policy, and who is each party trying to win? Next time you see a policy on your feed, ask two things: who is it for, and who pays?", "watch_for": "Close the loop. A good answer: mostly yes, because each party''s policies follow from its place on the line and the voters it wants, but parties borrow ideas (Reform UK and the NHS). Note: this slide says the Greens are UK-wide; it is the Green Party of England and Wales."}], "verify_before_teaching": ["Check the leaders are still current. Andy Burnham has been Labour leader since 17 July 2026 and Prime Minister since 20 July. Zack Polanski was standing in the Holborn and St Pancras by-election: if he has won a seat, change question 3 at the leaders talk step.", "Slide 2 (Labour) shows the ''five missions'' set under Keir Starmer. They may have changed under Burnham.", "Slide 1 originally said the Greens'' representation was ''variable''. It now says 5 MPs, from Parliament''s state of the parties. Slide 8 still calls the Greens UK-wide: it is the Green Party of England and Wales.", "Your Canva comparison page cannot be shown inside the app (Canva blocks it), so its health, education, immigration and spending rows are picture cards on the touch screens, word for word.", "No printing. Learners stand at the whiteboard tables and write on the table. Check there are working pens at every table. Three tables of five suits 15 learners.", "The whole class moves three times: to the touch screens at the health research step, back to the tables after the break, and to the screens for the best-pitch vote. Everything else is a runner.", "The quiz, word cloud, votes, pitch board and confidence check are saved. Read them afterwards in Admin, Data.", "Leader portraits are UK Parliament official portraits (CC BY 3.0); Zack Polanski''s photo is from Bristol Green Party (CC0). Credits are on the slides."], "safety_note": "Political balance: present the parties fairly, do not share your own political views, and keep debate on policies, not people. Tables argue for an assigned party and the pitch vote judges fit to the voter, not which party is best. If a comment targets a group of people, for example migrants, challenge it calmly using college values.", "media_requests": [], "brief": {"topic": "The five largest UK political parties", "level": "Level 2", "three_screens": true}}'
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
  -- 1 · The five largest parties (1 min)
  (0, 'The five largest parties', 'Launch', 1, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/slide-01.jpg", "file_name": "slide-01.jpg"}',
    null),

  -- 2 · Whose policy is it? (6 min)
  (1, 'Whose policy is it?', 'Launch', 6, 'screen1_continue',
    '{"type": "text_slide", "title": "Whose policy is it?", "text": "1. Abolish university tuition fees and give free school meals to every child.\n2. Leave the European Convention on Human Rights.\n3. A GP appointment within seven days, or 24 hours if urgent.\n4. Cut green taxes and scrap the Climate Change Act.\n5. Recruit 6,500 specialist teachers and offer free breakfast clubs in primary schools.\n\nLabour · Conservative · Lib Dem · Reform UK · Green", "size": "md", "subtitle": "Write 1 to 5 on your table and the party you think said it."}',
    null),

  -- 3 · The answers (2 min)
  (2, 'The answers', 'Launch', 2, 'screen1_continue',
    '{"type": "text_slide", "title": "The answers", "text": "1. Green Party\n2. Reform UK\n3. Liberal Democrats\n4. Conservatives\n5. Labour", "size": "md", "subtitle": "Score your table. Which one fooled you, and why?"}',
    null),

  -- 4 · What do left and right mean? (2 min)
  (3, 'What do left and right mean?', 'Establish', 2, 'screen1_continue',
    '{"type": "text_slide", "title": "Left, centre, right", "text": "LEFT: more public spending, higher taxes on the wealthy, more public ownership. Equality first.\n\nCENTRE: a mix of both.\n\nRIGHT: lower taxes, a smaller state, free markets. Tradition and strong borders first.", "size": "md"}',
    null),

  -- 5 · Left to right (7 min)
  (4, 'Left to right', 'Establish', 7, 'screen1_continue',
    '{"type": "countdown_timer", "label": "Left to right\nDraw a long line on your table. LEFT at one end, RIGHT at the other.\nPlace all five parties on it. Write one reason under each.", "duration_secs": 420}',
    null),

  -- 6 · Check your line (3 min)
  (5, 'Check your line', 'Establish', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/slide-07.jpg", "file_name": "slide-07.jpg"}',
    null),

  -- 7 · Labour (2 min)
  (6, 'Labour', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/slide-02.jpg", "file_name": "slide-02.jpg"}',
    null),

  -- 8 · Conservatives (2 min)
  (7, 'Conservatives', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/slide-03.jpg", "file_name": "slide-03.jpg"}',
    null),

  -- 9 · Liberal Democrats (2 min)
  (8, 'Liberal Democrats', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/slide-04.jpg", "file_name": "slide-04.jpg"}',
    null),

  -- 10 · Reform UK (2 min)
  (9, 'Reform UK', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/slide-05.jpg", "file_name": "slide-05.jpg"}',
    null),

  -- 11 · Green Party (2 min)
  (10, 'Green Party', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/slide-06.jpg", "file_name": "slide-06.jpg"}',
    null),

  -- 12 · Who leads which party? (3 min)
  (11, 'Who leads which party?', 'Establish', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/leaders-match.jpg", "file_name": "leaders-match.jpg"}',
    null),

  -- 13 · The five leaders (2 min)
  (12, 'The five leaders', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/leaders-reveal.jpg", "file_name": "leaders-reveal.jpg"}',
    null),

  -- 14 · How does a leader shape a party? (5 min)
  (13, 'How does a leader shape a party?', 'Establish', 5, 'screen1_continue',
    '{"type": "text_slide", "title": "How does a leader shape a party?", "text": "1. Andy Burnham replaced Keir Starmer in July. What changes when a party changes leader?\n\n2. Nigel Farage was famous before Reform UK. Does a famous leader help a small party?\n\n3. Zack Polanski is not an MP. Does a leader need a seat in Parliament?", "size": "md", "subtitle": "Talk at your table. Write one answer to each on the table."}',
    null),

  -- 15 · Research: health (2 min)
  (14, 'Research: health', 'Establish', 2, 'screen1_continue',
    '{"type": "text_slide", "title": "Research sprint 1 of 3: Health", "text": "At the touch screens, read what each party says about the NHS.\n\nFind one party that wants MORE money for the NHS.\nFind one that wants to SPEND it DIFFERENTLY.", "size": "md"}',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/policy-health.jpg", "file_name": "policy-health.jpg"}'),

  -- 16 · Research: education (2 min)
  (15, 'Research: education', 'Establish', 2, 'screen1_continue',
    '{"type": "text_slide", "title": "Research sprint 2 of 3: Education", "text": "Who wants to scrap university tuition fees?\n\nWho talks about SEND and mental-health staff in schools?\n\nWho is against VAT on private-school fees?", "size": "md"}',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/policy-education.jpg", "file_name": "policy-education.jpg"}'),

  -- 17 · Research: immigration (2 min)
  (16, 'Research: immigration', 'Establish', 2, 'screen1_continue',
    '{"type": "text_slide", "title": "Research sprint 3 of 3: Immigration", "text": "Find two parties that want safe routes for refugees.\n\nFind the party that wants more people to leave than arrive.", "size": "md"}',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/policy-immigration.jpg", "file_name": "policy-immigration.jpg"}'),

  -- 18 · Quiz: health, education, immigration (7 min)
  (17, 'Quiz: health, education, immigration', 'Establish', 7, 'screen1_continue',
    '{"type": "question_round", "questions": [{"type": "multiple_choice", "text": "Which party wants to abolish university tuition fees?", "options": ["Labour", "Green Party", "Conservative", "Reform UK"], "correct": 1}, {"type": "true_or_false", "text": "Reform UK wants the NHS to stay funded by taxes.", "correct_tf": true}, {"type": "multiple_choice", "text": "Odd one out: two of these want safe routes for refugees. Which one does NOT?", "options": ["Liberal Democrats", "Green Party", "Reform UK"], "correct": 2}, {"type": "multiple_choice", "text": "''A GP appointment within seven days'' is whose policy?", "options": ["Labour", "Liberal Democrat", "Conservative"], "correct": 1}, {"type": "true_or_false", "text": "The Conservatives want to put VAT on private-school fees.", "correct_tf": false}, {"type": "multiple_choice", "text": "Best answer: which party wants ''net negative'' immigration, with more people leaving than arriving?", "options": ["Conservative", "Reform UK"], "correct": 1}, {"type": "multiple_choice", "text": "6,500 new specialist teachers and free primary breakfast clubs: whose plan?", "options": ["Labour", "Green Party", "Liberal Democrat"], "correct": 0}, {"type": "true_or_false", "text": "The Liberal Democrats want more SEND funding in schools.", "correct_tf": true}, {"type": "multiple_choice", "text": "Best answer: which party proposes limits on doctors'' strikes?", "options": ["Conservative", "Reform UK"], "correct": 0}]}',
    null),

  -- 19 · What matters to you? (3 min)
  (18, 'What matters to you?', 'Apply', 3, 'screen1_continue',
    '{"type": "word_cloud", "title": "What matters to you?", "prompt": "What issue matters most to people your age in Bradford? One or two words.", "max_words": 3}',
    null),

  -- 20 · Choose our issues (2 min)
  (19, 'Choose our issues', 'Apply', 2, 'screen1_continue',
    '{"type": "voting", "question": "Which issue should our tables tackle after the break?", "options": ["Buses and getting around", "Jobs and wages", "Housing and rent", "Mental health services", "Cost of college and university", "Feeling safe in town"]}',
    null),

  -- 21 · Break (10 min)
  (20, 'Break', 'Apply', 10, 'screen1_continue',
    '{"type": "countdown_timer", "label": "Break\nBe back at your table when the timer ends.", "duration_secs": 600}',
    null),

  -- 22 · Spin your party (2 min)
  (21, 'Spin your party', 'Apply', 2, 'screen1_continue',
    '{"type": "wheel_spinner", "prompt": "Your table''s party for the rest of the lesson", "items": ["Labour", "Conservative", "Liberal Democrat", "Reform UK", "Green Party"]}',
    null),

  -- 23 · The Bradford budget (16 min)
  (22, 'The Bradford budget', 'Apply', 16, 'screen1_continue',
    '{"type": "rotation_timer", "label": "The Bradford budget", "details": "Your party now runs Bradford''s answer to your issue.\n1. What would your party do? Use its real policies.\n2. Who pays? Where does the money come from?\n3. Who in Bradford gains? Who loses out?\nStretch: £1 more here is £1 less somewhere else. What would you cut or tax?", "rounds": 2, "round_secs": 420, "move_secs": 30, "move_text": "Move one table on. Challenge their plan in a different colour: who has been missed?"}',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/policy-spending.jpg", "file_name": "policy-spending.jpg"}'),

  -- 24 · Our party's plan for Bradford (5 min)
  (23, 'Our party''s plan for Bradford', 'Apply', 5, 'screen1_continue',
    '{"type": "text_slide", "title": "Our party''s plan for Bradford", "text": "Our party would ...\n\nIt would be paid for by ...\n\nIt helps ... but it could hurt ...", "size": "md", "subtitle": "One speaker per table. One minute."}',
    null),

  -- 25 · Spin a voter (2 min)
  (24, 'Spin a voter', 'Demonstrate', 2, 'screen1_continue',
    '{"type": "wheel_spinner", "prompt": "The voter your table must win over", "items": ["Amira, 18, student nurse", "Jordan, 17, apprentice", "Mrs Begum, 68, retired", "Tomasz, 34, runs a takeaway", "Priya, 24, renting a flat", "Dev, 19, wheelchair user", "Grace, 45, NHS nurse, two kids", "Callum, 52, factory worker"]}',
    null),

  -- 26 · Win the voter (9 min)
  (25, 'Win the voter', 'Demonstrate', 9, 'screen1_continue',
    '{"type": "countdown_timer", "label": "Win the voter\nThree sentences, written on your table:\n1. One policy that helps them.\n2. Why it matters in their life.\n3. Answer one worry they might have about your party.", "duration_secs": 540}',
    null),

  -- 27 · Post and pitch (7 min)
  (26, 'Post and pitch', 'Demonstrate', 7, 'screen1_continue',
    '{"type": "padlet", "title": "Win the voter", "question": "Your voter, your party, and your three-sentence pitch."}',
    null),

  -- 28 · Best pitch (2 min)
  (27, 'Best pitch', 'Demonstrate', 2, 'screen1_continue',
    '{"type": "voting", "question": "Which pitch best fitted its voter? Judge the pitch, not the party.", "options": ["Table 1", "Table 2", "Table 3", "Table 4", "Table 5"]}',
    null),

  -- 29 · Final showdown (4 min)
  (28, 'Final showdown', 'Demonstrate', 4, 'screen1_continue',
    '{"type": "quiz_buzzer", "team1_name": "Government", "team2_name": "Opposition", "questions": ["Who is the Prime Minister?", "Which party is the Official Opposition?", "Who leads Reform UK?", "Which party wants to leave the European Convention on Human Rights?", "Who leads the Liberal Democrats?", "Which party sits furthest left on our line?", "Who leads the Conservatives?", "Which party wants to scrap university tuition fees?", "About how many MPs does Labour have?", "Who leads the Green Party of England and Wales?", "Name a party that supports safe routes for refugees.", "Which party promises a GP appointment within seven days?"], "answers": ["Andy Burnham (Labour)", "The Conservatives", "Nigel Farage", "Reform UK", "Ed Davey", "The Green Party", "Kemi Badenoch", "The Green Party", "About 400 (404)", "Zack Polanski", "Liberal Democrats or Green Party", "Liberal Democrats"]}',
    null),

  -- 30 · How confident are you? (1 min)
  (29, 'How confident are you?', 'Demonstrate', 1, 'screen1_continue',
    '{"type": "confidence_checker", "prompt": "How confident are you now at comparing the five parties?", "scale_mode": "emoji"}',
    null),

  -- 31 · Back to the question (3 min)
  (30, 'Back to the question', 'Demonstrate', 3, 'screen1_continue',
    '{"type": "image", "url": "https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/five-uk-parties/slide-08.jpg", "file_name": "slide-08.jpg"}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
