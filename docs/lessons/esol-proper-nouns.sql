-- ─────────────────────────────────────────────────────────────
-- ESOL PROPER NOUNS · 60 minutes · 29 steps
-- Built from Shamim Nizami's "Proper nouns" slides plus three YouTube clips.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The pictures live in public/lessons/esol-proper-nouns/ and only appear once
-- that folder has been pushed and the app republished.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'ESOL Proper Nouns',
    'Common nouns, proper nouns and capital letters for ESOL learners. Slides by Shamim Nizami, with three short videos and practice on the touch screens.',
    60,
    false,
    true,
    now(),
    '{"rationale": "Built from Shamim Nizami''s Proper Nouns slides, kept in their original order. The slides teach common nouns first so that proper nouns have something to be compared with. The videos are spread out, and each is followed by slides or an activity on the same idea, so learners use what they have just watched. The three sets of sentences get harder, and the last set is done alone as the check on learning.", "objectives": ["Identify common nouns and proper nouns in a sentence.", "Explain that a proper noun is a special name and needs a capital letter.", "Use capital letters correctly for names, places, days, months and the word I when writing sentences."], "run_sheet": [{"slot_index": 0, "teacher_says": "Today we look at nouns, and at the nouns that need a capital letter.", "watch_for": "Everyone can see a screen before you move on."}, {"slot_index": 1, "teacher_says": "Tap the face that shows how you feel about capital letters. There is no wrong answer.", "watch_for": "Learners come to a touch screen one at a time. Move on when everyone has tapped."}, {"slot_index": 2, "teacher_says": "A noun is the name of a thing. Cat, car, house. Say them with me.", "watch_for": "Ask for one more noun from the room before moving on."}, {"slot_index": 3, "teacher_says": "These are nouns too. Plane, ice-cream, college, bed.", "watch_for": "Check learners know each word."}, {"slot_index": 4, "teacher_says": "The words for people are nouns: doctor, pilot, teacher, mum, vet.", "watch_for": "Ask: what other jobs do you know?"}, {"slot_index": 5, "teacher_says": "Some nouns are feelings. You cannot touch love or anger, but they are still nouns.", "watch_for": "This idea is harder. Give one more example, such as happiness."}, {"slot_index": 6, "teacher_says": "All the words so far are common nouns. They start with a small letter.", "watch_for": "Point back to the lower-case words on the earlier slides."}, {"slot_index": 7, "teacher_says": "Look around you. Type one thing you can see. Table, chair, window.", "watch_for": "The cloud shows every word in small letters, which is right for common nouns."}, {"slot_index": 8, "teacher_says": "A flock of sheep. A pride of lions. Do you know any more?", "watch_for": "Take one or two answers only, for example a team of players."}, {"slot_index": 9, "teacher_says": "Watch this teacher explain nouns. Listen for the difference between a common noun and a proper noun.", "watch_for": "The lesson plays the first 7 minutes 40 seconds only, then stops. If it carries on into ''Singular and Plural Nouns'', move on."}, {"slot_index": 10, "teacher_says": "Now the important one for today. A proper noun is a special name, and it needs a capital letter.", "watch_for": "Stress the word DO."}, {"slot_index": 11, "teacher_says": "Your name is a proper noun. So is the name of your town and your country.", "watch_for": "Ask two or three learners which country or city they are from, and write it up with a capital."}, {"slot_index": 12, "teacher_says": "Famous buildings have names too, so they have capital letters.", "watch_for": "Ask for a special building in Bradford or in a learner''s home country."}, {"slot_index": 13, "teacher_says": "Days, months and special days all start with a capital letter.", "watch_for": "Ask: what day is it today? What month is it?"}, {"slot_index": 14, "teacher_says": "We also use capitals for these. For example Bradford College, Nike, BD7 1AY, Mr and Mrs.", "watch_for": "Give one real example for each. Insurance number means National Insurance number."}, {"slot_index": 15, "teacher_says": "Two more rules. The word I is always a capital. Every sentence starts with a capital.", "watch_for": "Learners often write a small i. Say it clearly."}, {"slot_index": 16, "teacher_says": "This video goes over everything we have just learned about proper nouns.", "watch_for": "The video is about 3 minutes. Ask for one example afterwards."}, {"slot_index": 17, "teacher_says": "Four quick questions. Answer on either touch screen.", "watch_for": "If question 2 goes wrong, go back over common nouns before the next part."}, {"slot_index": 18, "teacher_says": "Three sentences each time. Only one is right. Talk to your partner, then tap.", "watch_for": "Some learners put a capital on every word. Question 2 and question 4 will show this."}, {"slot_index": 19, "teacher_says": "Write these sentences correctly. Add the capital letters and the full stops.", "watch_for": "Walk round. Look for the small i and for missed capitals in the middle of a sentence."}, {"slot_index": 20, "teacher_says": "Check your work. Give yourself a tick for each capital letter.", "watch_for": "Ask who got every capital. Go over any sentence most people missed."}, {"slot_index": 21, "teacher_says": "Five more. These have famous places and buildings in them.", "watch_for": "Names with more than one word, such as Blue Mosque, need a capital on each main word."}, {"slot_index": 22, "teacher_says": "Check your work again. Did you remember the capital I?", "watch_for": "Point out that ''of'' in Great Wall of China stays small."}, {"slot_index": 23, "teacher_says": "Listen to the video. Write a list of the proper nouns you hear.", "watch_for": "The video is about 3 and a half minutes. Learners need paper and a pen."}, {"slot_index": 24, "teacher_says": "Type one proper noun from your notes. Do not forget the capital letter.", "watch_for": "This board shows words exactly as typed. Praise correct capitals and fix one together."}, {"slot_index": 25, "teacher_says": "The last four. Work on your own this time, no help.", "watch_for": "This is the check on today''s learning. Note who still needs support."}, {"slot_index": 26, "teacher_says": "Check your answers. There are 13 capital letters. How many did you get?", "watch_for": "Collect scores with a show of hands."}, {"slot_index": 27, "teacher_says": "Tap the face again. How do you feel about capital letters now?", "watch_for": "The big screen compares the start with now."}, {"slot_index": 28, "teacher_says": "Well done everyone. Proper nouns always start with a capital letter.", "watch_for": ""}], "verify_before_teaching": ["The second video (Shaw English, NOUNS) is a 54 minute course. The lesson plays only the first chapter, ''What is a noun?'', and stops at 7 minutes 40 seconds. Watch that part first to check it suits the group.", "Watch all three videos through. The third (GrammarSongs) is American, so it says ''capitalized''.", "Two spellings in the last set of sentences were corrected from the original slides: ''egpyt'' to ''egypt'' and ''spinx'' to ''sphinx''.", "The answer slide writes ''Programme Manager'' with capitals and ''department'' without. Change it if you teach this differently.", "The pictures are the original clip-art from the slides, shown small. Check they appear on all three screens before the lesson.", "Timings are tight for a 60 minute lesson. The sentence-writing steps are the ones to shorten if you run over."], "safety_note": null, "media_requests": [], "brief": {"topic": "Proper nouns and capital letters", "level": "Entry 2", "department": "Adult Skills", "three_screens": true}}'::jsonb
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
  -- 1 · Nouns: what you need to know (1 min)
  (0, 'Nouns: what you need to know', 'Launch', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/esol-proper-nouns/01-title.png", "title": "NOUNS\nWhat you need to know!", "file_name": "01-title.png"}',
    null),

  -- 2 · How do you feel at the start? (2 min)
  (1, 'How do you feel at the start?', 'Launch', 2, 'screen2_submit',
    '{"type": "confidence_checker", "prompt": "How do you feel about using capital letters?", "scale_mode": "emoji", "optional_qualitative": false, "checkpoint": "start"}',
    null),

  -- 3 · A noun is a naming word (1 min)
  (2, 'A noun is a naming word', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/esol-proper-nouns/02-naming-words.png", "title": "A noun is a naming word", "file_name": "02-naming-words.png"}',
    null),

  -- 4 · More nouns (1 min)
  (3, 'More nouns', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/esol-proper-nouns/03-more-nouns.png", "title": "Nouns name things and places", "file_name": "03-more-nouns.png"}',
    null),

  -- 5 · People are nouns (1 min)
  (4, 'People are nouns', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/esol-proper-nouns/04-people.png", "title": "People", "file_name": "04-people.png"}',
    null),

  -- 6 · Nouns you cannot see (1 min)
  (5, 'Nouns you cannot see', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/esol-proper-nouns/05-feelings.png", "title": "Nouns can also be things that you can''t see, such as emotions", "file_name": "05-feelings.png"}',
    null),

  -- 7 · Common nouns (1 min)
  (6, 'Common nouns', 'Establish', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "These nouns are called common nouns.", "size": "lg", "subtitle": "They do not have capital letters at the beginning."}',
    null),

  -- 8 · Name a common noun (2 min)
  (7, 'Name a common noun', 'Establish', 2, 'screen2_submit',
    '{"type": "word_cloud", "title": "Common nouns", "prompt": "Look around the room. Type a common noun you can see.", "max_words": 2}',
    null),

  -- 9 · Collective nouns (1 min)
  (8, 'Collective nouns', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/esol-proper-nouns/07-collective.png", "title": "A collective noun is the name for a group of people, objects or animals", "file_name": "07-collective.png"}',
    null),

  -- 10 · Video: Nouns and proper nouns (8 min)
  (9, 'Video: Nouns and proper nouns', 'Establish', 8, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=gES-AewCOAI&end=460"}',
    '{"type": "text_slide", "text": "Watch the big screen", "size": "xl", "subtitle": "What is a noun? What is a proper noun?"}'),

  -- 11 · Proper nouns (1 min)
  (10, 'Proper nouns', 'Establish', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "But some other nouns are called proper nouns.", "size": "lg", "subtitle": "They DO have capital letters."}',
    null),

  -- 12 · Names of people and places (2 min)
  (11, 'Names of people and places', 'Establish', 2, 'screen1_continue',
    '{"type": "image", "url": "/lessons/esol-proper-nouns/09-people-places.png", "title": "People''s names and names of places are proper nouns.\nThey always start with a capital letter.", "file_name": "09-people-places.png"}',
    null),

  -- 13 · Special buildings (1 min)
  (12, 'Special buildings', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/esol-proper-nouns/10-buildings.png", "title": "Names of special buildings are proper nouns and have capital letters", "file_name": "10-buildings.png"}',
    null),

  -- 14 · Special days, months and days (1 min)
  (13, 'Special days, months and days', 'Establish', 1, 'screen1_continue',
    '{"type": "image", "url": "/lessons/esol-proper-nouns/11-special-days.png", "title": "Special days, months of the year and days of the week have capital letters", "file_name": "11-special-days.png"}',
    null),

  -- 15 · More capital letters (2 min)
  (14, 'More capital letters', 'Establish', 2, 'screen1_continue',
    '{"type": "text_slide", "text": "We also use capital letters for:\nOrganisations · Brand names · Postcodes\nInsurance numbers · Abbreviations · Titles", "size": "md"}',
    null),

  -- 16 · Two rules to remember (1 min)
  (15, 'Two rules to remember', 'Establish', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "Remember: I is always a capital.", "size": "lg", "subtitle": "We always use a capital letter at the beginning of a sentence."}',
    null),

  -- 17 · Video: What are proper nouns? (4 min)
  (16, 'Video: What are proper nouns?', 'Establish', 4, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=X2L_hq9GRic"}',
    '{"type": "text_slide", "text": "Watch the big screen", "size": "xl", "subtitle": "What is a proper noun? Listen for examples."}'),

  -- 18 · Common or proper? (3 min)
  (17, 'Common or proper?', 'Establish', 3, 'screen2_submit',
    '{"type": "question_round", "questions": [{"type": "multiple_choice", "text": "Which word is a proper noun?", "options": ["city", "Bradford", "river"], "correct": 1}, {"type": "multiple_choice", "text": "Which word is a common noun?", "options": ["Monday", "Poland", "teacher"], "correct": 2}, {"type": "true_or_false", "text": "Proper nouns start with a capital letter.", "correct_tf": true}, {"type": "multiple_choice", "text": "Which word needs a capital letter?", "options": ["diwali", "festival", "holiday"], "correct": 0}]}',
    null),

  -- 19 · Spot the mistake (3 min)
  (18, 'Spot the mistake', 'Apply', 3, 'screen2_submit',
    '{"type": "question_round", "questions": [{"type": "multiple_choice", "text": "Which sentence is correct?", "options": ["I live in Bradford.", "i live in Bradford.", "I live in bradford."], "correct": 0}, {"type": "multiple_choice", "text": "Which sentence is correct?", "options": ["My sister is called amina.", "My Sister is called Amina.", "My sister is called Amina."], "correct": 2}, {"type": "multiple_choice", "text": "Which sentence is correct?", "options": ["We go to college on monday.", "We go to college on Monday.", "We go to College on monday."], "correct": 1}, {"type": "multiple_choice", "text": "Which sentence is correct?", "options": ["We celebrate eid with our family.", "We celebrate Eid with our family.", "We Celebrate Eid With Our Family."], "correct": 1}]}',
    null),

  -- 20 · Punctuate these sentences 1 (4 min)
  (19, 'Punctuate these sentences 1', 'Apply', 4, 'screen1_continue',
    '{"type": "text_slide", "text": "i live in bradford\nmonika was born in poland\nnafeesa went to the leeds music festival on saturday\nsadia works for nationwide building society\nvanessa is the programme manager for the esol department\ncristina is the ctl", "size": "md", "subtitle": "Punctuate these sentences. Write them in your book."}',
    null),

  -- 21 · Check your answers 1 (1 min)
  (20, 'Check your answers 1', 'Apply', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "I live in Bradford.\nMonika was born in Poland.\nNafeesa went to the Leeds Music Festival on Saturday.\nSadia works for Nationwide Building Society.\nVanessa is the Programme Manager for the ESOL department.\nCristina is the CTL.", "size": "md", "subtitle": "Check your answers. Tick each capital letter you got right."}',
    null),

  -- 22 · Punctuate these sentences 2 (3 min)
  (21, 'Punctuate these sentences 2', 'Apply', 3, 'screen1_continue',
    '{"type": "text_slide", "text": "i have been to see the blue mosque in istanbul\nlast year i went to barcelona in spain\ni really want to go and see machu picchu in peru\nthe great wall of china is the longest wall in the world\nthe sydney opera house is a beautiful building", "size": "md", "subtitle": "Punctuate these sentences. Write them in your book."}',
    null),

  -- 23 · Check your answers 2 (1 min)
  (22, 'Check your answers 2', 'Apply', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "I have been to see the Blue Mosque in Istanbul.\nLast year I went to Barcelona in Spain.\nI really want to go and see Machu Picchu in Peru.\nThe Great Wall of China is the longest wall in the world.\nThe Sydney Opera House is a beautiful building.", "size": "md", "subtitle": "Check your answers. Tick each capital letter you got right."}',
    null),

  -- 24 · Video: Listen and make notes (4 min)
  (23, 'Video: Listen and make notes', 'Apply', 4, 'screen1_continue',
    '{"type": "youtube", "url": "https://www.youtube.com/watch?v=yuuyewH_cpI"}',
    '{"type": "text_slide", "text": "Listen and make notes", "size": "xl", "subtitle": "Write down the proper nouns you hear."}'),

  -- 25 · Share your proper nouns (2 min)
  (24, 'Share your proper nouns', 'Apply', 2, 'screen1_continue',
    '{"type": "padlet", "title": "Proper nouns", "question": "Type a proper noun from your notes. Remember the capital letter!"}',
    null),

  -- 26 · Punctuate these sentences 3 (4 min)
  (25, 'Punctuate these sentences 3', 'Demonstrate', 4, 'screen1_continue',
    '{"type": "text_slide", "text": "my husband went to egypt to see the sphinx but didn''t take me\nprincess diana went to india to see the taj mahal alone\nthere is a famous temple in greece called the parthenon\nhindus are celebrating diwali today", "size": "md", "subtitle": "Work on your own. Punctuate these sentences."}',
    null),

  -- 27 · Check your answers 3 (1 min)
  (26, 'Check your answers 3', 'Demonstrate', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "My husband went to Egypt to see the Sphinx but didn''t take me.\nPrincess Diana went to India to see the Taj Mahal alone.\nThere is a famous temple in Greece called the Parthenon.\nHindus are celebrating Diwali today.", "size": "md", "subtitle": "Check your answers. How many capital letters did you get?"}',
    null),

  -- 28 · How do you feel now? (2 min)
  (27, 'How do you feel now?', 'Demonstrate', 2, 'screen2_submit',
    '{"type": "confidence_checker", "prompt": "How do you feel about using capital letters?", "scale_mode": "emoji", "optional_qualitative": false, "checkpoint": "final"}',
    null),

  -- 29 · Well done (1 min)
  (28, 'Well done', 'Demonstrate', 1, 'screen1_continue',
    '{"type": "text_slide", "text": "Well done!", "size": "2xl", "subtitle": "Proper nouns always start with a capital letter."}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
