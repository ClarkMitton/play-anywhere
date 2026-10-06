-- ─────────────────────────────────────────────────────────────
-- US vs AI · an introduction to AI and critical thinking
-- 45 minutes · 21 steps · Level 2 and Level 3
-- Built around three short clips from USvsAI/AI Introductions.txt.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Us vs AI',
    'An introduction to AI and critical thinking for Level 2 and 3. Three short clips show AI getting it wrong, and learners work out why, then tell us what they think of AI.',
    45,
    false,
    true,
    now(),
    '{"rationale": "Built around three short clips, each one showing AI getting something wrong in a different way: taking an instruction literally, being confidently wrong, and copying patterns. Each clip is followed by the idea it demonstrates and then something for learners to do with it. The session also gathers the group''s real views on AI at four points, so the college leaves with feedback as well as learners leaving with three checks.", "objectives": ["Describe in simple terms how a chatbot produces an answer.", "Identify three ways AI gets things wrong: taking words literally, being confidently wrong, and copying bias.", "Apply three checks before trusting or using something AI has produced."], "run_sheet": [{"slot_index": 0, "teacher_says": "Today is us against the machines. By the end you will know how AI really works, and how to catch it out.", "watch_for": "Get a quick show of hands: who has used AI this week?"}, {"slot_index": 1, "teacher_says": "Be honest. Nobody is in trouble for any answer.", "watch_for": "This is real feedback about your group. Note the split: it tells you how to pitch the rest."}, {"slot_index": 2, "teacher_says": "One to five. How sure are you that you would notice if AI gave you a wrong answer?", "watch_for": "Most groups score themselves high here. Remember the number for the end."}, {"slot_index": 3, "teacher_says": "One word. The first thing that comes into your head when you hear AI.", "watch_for": "Read out the biggest words. Ask one person why they chose theirs."}, {"slot_index": 4, "teacher_says": "Watch this. Work out exactly where it goes wrong.", "watch_for": "About a minute and a half. Let them laugh, then ask: was the AI being stupid, or doing what it was told?"}, {"slot_index": 5, "teacher_says": "A person fills in the gaps with common sense. AI cannot. It only has the words you gave it.", "watch_for": "Link it to their own use: a vague question gets a vague or wrong answer."}, {"slot_index": 6, "teacher_says": "One sentence. Tell an AI to make toast so that it cannot possibly get it wrong.", "watch_for": "Pick two or three and find the gap out loud: which bread, how long, butter on which side? It is harder than it looks."}, {"slot_index": 7, "teacher_says": "An easy one. How many Rs are in the word strawberry? Shout it out, then watch.", "watch_for": "About a minute. Afterwards ask: a five year old can do this, so why can''t it?"}, {"slot_index": 8, "teacher_says": "It is not looking anything up. It is guessing the next word, very quickly, from everything it has read. Usually the guess is right. It sounds just as confident when it is not.", "watch_for": "This is the key idea of the session. Check it has landed before the questions."}, {"slot_index": 9, "teacher_says": "Three quick questions. Talk to the people at your screen, then answer.", "watch_for": "If a screen gets the first one wrong, go back over ''it predicts'' before moving on."}, {"slot_index": 10, "teacher_says": "Easy job. Draw a clock showing half past three and send it to the big screen. You have two minutes.", "watch_for": "They will all manage it. That is the point: hold on to it for the next slide."}, {"slot_index": 11, "teacher_says": "You just drew half past three with no trouble. Ask an AI image tool for a watch and it very often gives you ten past ten, whatever time you asked for.", "watch_for": "Ask: if it copies watch adverts, what else might it copy? Steer towards unfair patterns about people, jobs or places."}, {"slot_index": 12, "teacher_says": "Three real situations. What would you actually do?", "watch_for": "The third one will start a debate. Let it run for a minute, then give your course''s actual rule."}, {"slot_index": 13, "teacher_says": "This is the same request made to AI a couple of years apart. Watch how much it changes.", "watch_for": "Under a minute. Ask: which version would fool you?"}, {"slot_index": 14, "teacher_says": "The funny mistakes are disappearing. That does not mean it stopped being wrong. It means you can no longer tell by looking.", "watch_for": "Do not let the room conclude that AI is rubbish. The message is: powerful, and needs checking."}, {"slot_index": 15, "teacher_says": "Honestly. Could you tell a real video from an AI one right now?", "watch_for": "More real feedback. Compare it with how confident they said they were at the start."}, {"slot_index": 16, "teacher_says": "Three checks, every time. Does it make sense? Can I find it somewhere else? Would I put my name on it?", "watch_for": "Ask learners to say them back without looking. They need these for the quiz."}, {"slot_index": 17, "teacher_says": "Screen 1 against Screen 2. First to buzz answers. Get it wrong and the other team can steal.", "watch_for": "Answers show on your phone only. Accept any sensible wording."}, {"slot_index": 18, "teacher_says": "This one is for us. What should the college do about AI? One idea, or one thing that worries you.", "watch_for": "This is the feedback to keep. Read a few out without naming anyone, and thank them."}, {"slot_index": 19, "teacher_says": "Same question as the start. One to five: would you notice if AI got it wrong?", "watch_for": "The score often goes DOWN, because they now know how hard it is. Say that this is a good result."}, {"slot_index": 20, "teacher_says": "AI is a brilliant tool and it is not going away. Use it. Just never switch your own brain off.", "watch_for": ""}], "verify_before_teaching": ["Watch all three clips before the session. They are comedy and social media clips, not teaching videos, so check the language and tone suit your group.", "Chatbots improve all the time. If a learner tests ''how many Rs in strawberry'' live, it may now answer correctly. Treat that as a teaching point: it was fixed because people caught it.", "The 10:10 slide is based on an article about AI image tools copying watch adverts. If you have an image tool to hand, try it live. If it draws another time, say so honestly.", "The question about handing in AI-written work has ''it may break the rules'' as its answer. Check your course''s and awarding body''s actual rules on AI so you can state them.", "The whiteboard step needs the whiteboard on the big screen as well as the touch screens, which this lesson already has.", "Learners'' answers to the votes, the word cloud and the two shared boards are saved. Look at them afterwards in Admin, Data: they are the feedback this session was built to collect."], "safety_note": null, "media_requests": [], "brief": {"topic": "Introduction to AI and critical thinking", "level": "Level 2", "department": "Science and Digital", "three_screens": true}}'::jsonb
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
  -- 1 · Us vs AI (1 min)
  (0, 'Us vs AI', 'Launch', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "US vs AI", "size": "2xl", "title": "An introduction to AI", "subtitle": "Who is smarter? Let''s find out."}',
    null),

  -- 2 · How often do you use AI? (2 min)
  (1, 'How often do you use AI?', 'Launch', 2, 'screen2_submit',
    '{"type": "voting", "question": "How often do you use AI?", "options": ["Every day", "A few times a week", "Hardly ever", "Never"]}',
    null),

  -- 3 · Starting confidence (2 min)
  (2, 'Starting confidence', 'Launch', 2, 'screen2_submit',
    '{"type": "confidence_checker", "prompt": "How confident are you that you can tell when AI has got something wrong?", "scale_mode": "numbers", "max": 5, "optional_qualitative": false, "checkpoint": "start"}',
    null),

  -- 4 · AI in one word (2 min)
  (3, 'AI in one word', 'Launch', 2, 'screen2_submit',
    '{"type": "word_cloud", "title": "AI in one word", "prompt": "What is the first word you think of?"}',
    null),

  -- 5 · Video: Me vs ChatGPT (2 min)
  (4, 'Video: Me vs ChatGPT', 'Establish', 2, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=83cDUAJnyR4"}',
    '{"type": "text_slide", "text": "Watch the big screen", "size": "xl", "subtitle": "What goes wrong, and why?"}'),

  -- 6 · It does what you say (2 min)
  (5, 'It does what you say', 'Establish', 2, 'screen1_continue',
    '{"type": "text_slide", "text": "AI does what you SAY,\nnot what you MEAN.", "size": "lg", "title": "What went wrong?", "subtitle": "It has no common sense. It only has your words."}',
    null),

  -- 7 · Instruct the robot (2 min)
  (6, 'Instruct the robot', 'Establish', 2, 'screen1_continue',
    '{"type": "padlet", "title": "Instruct the robot", "question": "Tell an AI how to make toast in ONE sentence. Make it impossible to get wrong."}',
    null),

  -- 8 · Video: Rs in strawberry (2 min)
  (7, 'Video: Rs in strawberry', 'Establish', 2, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/shorts/8T4KiWP4Hs4"}',
    '{"type": "text_slide", "text": "Watch the big screen", "size": "xl", "subtitle": "How many Rs are in strawberry?"}'),

  -- 9 · It predicts, it does not know (2 min)
  (8, 'It predicts, it does not know', 'Establish', 2, 'screen1_continue',
    '{"type": "text_slide", "text": "AI predicts the next likely word.", "size": "lg", "title": "Why can''t it count?", "subtitle": "It does not count, check or know. It can sound sure and still be wrong."}',
    null),

  -- 10 · Quick check (3 min)
  (9, 'Quick check', 'Establish', 3, 'screen2_submit',
    '{"type": "question_round", "questions": [{"type": "multiple_choice", "text": "How does a chatbot write its answer?", "options": ["It looks it up in a database", "It predicts the next likely words", "It asks a human expert"], "correct": 1}, {"type": "true_or_false", "text": "If AI sounds confident, the answer must be right.", "correct_tf": false}, {"type": "true_or_false", "text": "AI understands what words mean, the same way people do.", "correct_tf": false}]}',
    null),

  -- 11 · Draw the time (3 min)
  (10, 'Draw the time', 'Apply', 3, 'screen1_continue',
    '{"type": "whiteboard", "title": "Draw a clock showing half past three"}',
    null),

  -- 12 · Stuck at ten past ten (2 min)
  (11, 'Stuck at ten past ten', 'Apply', 2, 'screen1_continue',
    '{"type": "text_slide", "text": "Ask AI to draw a watch.\nIt usually shows 10:10.", "size": "lg", "title": "Now ask an AI", "subtitle": "Adverts nearly always show watches at 10:10, so that is what AI has seen. It copies the pattern. This is called bias."}',
    null),

  -- 13 · Trust it or check it? (3 min)
  (12, 'Trust it or check it?', 'Apply', 3, 'screen2_submit',
    '{"type": "question_round", "questions": [{"type": "multiple_choice", "text": "AI gives you a statistic and names a source. What should you do?", "options": ["Use it, it has a source", "Find the source and check it", "Change the number a little"], "correct": 1}, {"type": "multiple_choice", "text": "You ask AI how much of a medicine to take. What should you do?", "options": ["Follow what it says", "Check the label or ask a pharmacist", "Ask the AI again"], "correct": 1}, {"type": "multiple_choice", "text": "AI writes your whole assignment and you hand it in. Whose work is it?", "options": ["Mine, I typed the question", "Not mine, and it may break the rules", "The AI company''s"], "correct": 1}]}',
    null),

  -- 14 · Video: Will Smith eating spaghetti (2 min)
  (13, 'Video: Will Smith eating spaghetti', 'Apply', 2, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=dWFb0cFWT9Y"}',
    '{"type": "text_slide", "text": "Watch the big screen", "size": "xl", "subtitle": "Spot the difference between then and now."}'),

  -- 15 · Getting better, fast (1 min)
  (14, 'Getting better, fast', 'Apply', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "From nightmare spaghetti\nto nearly real.", "size": "lg", "title": "AI is improving fast", "subtitle": "The mistakes are getting harder to spot. So your checking matters more, not less."}',
    null),

  -- 16 · Could you spot a fake? (2 min)
  (15, 'Could you spot a fake?', 'Apply', 2, 'screen2_submit',
    '{"type": "voting", "question": "Could you tell an AI video from a real one today?", "options": ["Always", "Usually", "Sometimes", "No chance"]}',
    null),

  -- 17 · Three checks (2 min)
  (16, 'Three checks', 'Apply', 2, 'screen1_continue',
    '{"type": "text_slide", "text": "1. Does it make sense?\n2. Can I find it somewhere else?\n3. Would I put my name on it?", "size": "md", "title": "3 checks before you trust AI"}',
    null),

  -- 18 · Us vs AI: the quiz (4 min)
  (17, 'Us vs AI: the quiz', 'Demonstrate', 4, 'screen1_continue',
    '{"type": "quiz_buzzer", "team1_name": "Screen 1", "team2_name": "Screen 2", "questions": ["What time do AI pictures of watches usually show?", "AI copies unfair patterns from its data. What is that called?", "How does a chatbot choose what to write next?", "Name one of the 3 checks before you trust AI.", "How many Rs are in strawberry?"], "answers": ["10:10 (ten past ten)", "Bias", "It predicts the next likely word", "Does it make sense / Can I find it elsewhere / Would I put my name on it", "Three"]}',
    null),

  -- 19 · Your view on AI (3 min)
  (18, 'Your view on AI', 'Demonstrate', 3, 'screen1_continue',
    '{"type": "padlet", "title": "Your view", "question": "What should our college do about AI? Give one idea or one worry."}',
    null),

  -- 20 · Confidence now (2 min)
  (19, 'Confidence now', 'Demonstrate', 2, 'screen2_submit',
    '{"type": "confidence_checker", "prompt": "How confident are you that you can tell when AI has got something wrong?", "scale_mode": "numbers", "max": 5, "optional_qualitative": false, "checkpoint": "final"}',
    null),

  -- 21 · You are in charge (1 min)
  (20, 'You are in charge', 'Demonstrate', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "Use AI.\nDon''t trust it blindly.", "size": "xl", "subtitle": "You are still the one in charge."}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
