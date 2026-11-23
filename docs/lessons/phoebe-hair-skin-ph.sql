-- ─────────────────────────────────────────────────────────────
-- HAIR, SKIN AND pH · 60 minutes · 16 steps · Hairdressing (Phoebe)
-- Built from Phoebe's lesson plan, her "Week 9 theory - shampooing" and
-- "pH of products" slides, and two community Wordwalls.
-- No printing: learners write on the whiteboard tables and the touch-screen
-- whiteboards.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The pictures are in the app's media storage (lesson-media/lessons/phoebe-hair-skin-ph/).
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Hair, Skin and pH',
    'Phoebe''s shampooing theory lesson: a team race to label the hair and skin, a pH scale challenge on the touch-screen whiteboards, her apply questions at the whiteboard tables, predictions for the pH practical, and Family Fortunes. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"Phoebe''s own lesson structure, kept close: a hair and skin labelling challenge (Launch, 10 minutes), the pH scale challenge with her three apply questions (Establish and Apply, 35 minutes), and Family Fortunes (Demonstrate, 15 minutes). The labelling uses two community Wordwalls on the touch screens as a team race, with Phoebe''s own labelled diagrams as the answers. Teams place five products on a blank pH scale on the touch-screen whiteboards before anything is taught, then Phoebe''s Pearson pH scale reveals the answer and her slides explain acid and alkaline. Tables draw the cuticle open and closed, answer her apply questions, and predict the pH of the five products from her practical, saved on the shared board for the practical session. Nothing is printed.","objectives":["Outline the basic structure of the hair and skin.","Explain how acid and alkaline products affect the cuticle.","Predict the effect of shampooing, conditioning and chemical products on the hair, using the pH scale."],"run_sheet":[{"slot_index":0,"teacher_says":"Split into two teams. Team A, go to Touch Screen 1. Team B, Touch Screen 2. Today is hair, skin and pH, ready for the pH testing practical.","watch_for":"Learners: MOVE into two teams, one at each touch screen. These are three of Phoebe''s intentions from her Week 9 slide; porosity and elasticity, tools and the practical itself are in other sessions. Technique: share the intentions, then get straight into a challenge."},{"slot_index":1,"teacher_says":"One learner at a time drags a label onto the hair, then passes to the next person. Tap Start. Go.","watch_for":"Learners: at the touch screens, in teams. Three labels, so it is quick: it activates the words before the skin. The Wordwall times them, so compare times between teams. Technique: a team race that recalls prior learning."},{"slot_index":2,"teacher_says":"Now the skin. Same rules: one learner, one label, then pass on. Look out for the gland that makes oil.","watch_for":"Learners: at the touch screens. Eight labels, so let every learner have a turn. These are the parts on Phoebe''s skin slide. If a team stalls, tell them to use Wordwall''s ''Submit answers'' to see which are wrong and try again. Technique: a team race."},{"slot_index":3,"teacher_says":"Phoebe''s diagrams. Check your labels. Which part protects the hair? Which part gives it strength? And look at your screen: which gland produces oil?","watch_for":"Learners: at the touch screens. Big screen: Phoebe''s hair structure. Touch screens: her skin structure. Answers: the cuticle protects; the cortex gives strength (and holds the colour); the sebaceous gland produces oil (sebum). Ask a different learner for each. Technique: AfL questions, cold-called."},{"slot_index":4,"teacher_says":"On your touch screen there is a pH scale, 1 to 14. As a team, write each of these five where you think it goes. Conditioner, shampoo, water, bleach, hair colour. Then press Send to big screen.","watch_for":"Learners: at the touch screens. Do not teach acid and alkaline yet: the teams place the products first, then Phoebe teaches. Technique: do it before being told."},{"slot_index":5,"teacher_says":"Write each product next to its number. Draw a line from the word to the scale if it helps. When your team agrees, press Send to big screen.","watch_for":"Learners: at the touch screens, writing on a blank 1 to 14 scale. Both teams'' scales appear side by side on the big screen when sent. Common mistakes: water placed as acid, shampoo placed as very alkaline, conditioner placed as neutral. Leave them: the next step corrects them. Technique: team prediction, made visible."},{"slot_index":6,"teacher_says":"Here is the real scale, from Phoebe''s slides. Water: 7, neutral. pH balanced shampoo and conditioner: 4.5 to 5.5, the same as hair and skin. Permanent colour and bleach: 8 to 10, alkaline. Which team was closer?","watch_for":"Learners: at the touch screens, looking at the big screen. This is the Pearson pH scale from Phoebe''s ''pH of products'' slides. Point to the bottom: the cuticle is tightly closed around 4.5 to 5.5, opens above 7 so chemicals can enter the cortex, and the hair breaks up at the far end. Technique: compare the prediction with the model."},{"slot_index":7,"teacher_says":"Phoebe''s slide: 1 to 6.9 is acid, 7 is neutral, 7.1 to 14 is alkaline. Hair and skin sit at about 4.5 to 5.5, slightly acid.","watch_for":"Learners: at the touch screens or moving towards the tables. Phoebe''s wording from her ''pH of products'' slide 3. Technique: name the idea after learners have used it."},{"slot_index":8,"teacher_says":"Acid closes the cuticle: smooth and shiny. Alkaline opens it, so chemicals can get into the cortex. The more alkaline, the more damage. Neutral is 7. Now go to your tables.","watch_for":"Learners: listening, then MOVE to the tables. Phoebe''s ''pH of products'' slide 5, close to her wording. Ask: so why do we condition after colour? (To close the cuticle again.) Technique: explain, then check with a why question."},{"slot_index":9,"teacher_says":"On your table, draw two hairs. One with the cuticle closed, like roof tiles lying flat: acid. One with it open, scales lifted: alkaline. Write which products do each, and draw lines to label them. Four minutes.","watch_for":"Learners: at the whiteboard tables. Draw a quick example on the board first, because the big screen shows the timer. A good table has: closed = conditioner, pH balanced shampoo; open = bleach, colour, perm solution; and an arrow showing chemicals getting into the cortex. Stretch: add where water goes (neutral) and what happens at pH 14 (the hair breaks up). Technique: turn the explanation into a diagram."},{"slot_index":10,"teacher_says":"Talk as a team first. Write one answer on your table. Then show me.","watch_for":"Learners: at the tables. Answer: bleach (pH 9 to 11), or permanent colour and perm solution. Ask why: they are alkaline. Technique: discuss, commit in writing, then reveal."},{"slot_index":11,"teacher_says":"Same again. Talk, agree, write.","watch_for":"Learners: at the tables. Answer: conditioner (pH 3.5 to 5, acid), because it closes the cuticle so it lies flat and reflects light. A pH balanced shampoo is a good second answer. Technique: discuss, commit, reveal."},{"slot_index":12,"teacher_says":"Last one. What would happen if the cuticle stays open? As many effects as you can in two minutes.","watch_for":"Learners: at the tables. Good answers: hair feels rough and dry, looks dull, tangles, loses moisture and colour fades, chemicals can get in, it is weaker and breaks (porous, poor elasticity). That links to porosity and elasticity testing, another of Phoebe''s intentions. Technique: list, then pool across tables."},{"slot_index":13,"teacher_says":"In the practical you will test five products with pH strips. Predict now, at your table: acid or alkaline, and does it open or close the cuticle? Then one runner per table types your predictions on a touch screen.","watch_for":"Learners: at the tables, then ONE RUNNER per table goes to a touch screen. These are the five products Phoebe tests in the pH practical, which happens in another session. The board saves the predictions so they can be checked against the test results. Expected: lacquer removing shampoo slightly alkaline (it lifts product build-up); cleansing shampoo about neutral to slightly acid; pH balancing conditioner acid (about 3.5 to 4.5); perm solution alkaline (about 8.5 to 9.5); perm neutraliser acid (about 3 to 4), which closes the cuticle and fixes the curl. Use Phoebe''s exact values if she has them. Technique: predict now, test later."},{"slot_index":14,"teacher_says":"Family Fortunes. Team A against Team B. I read the question, one person from each team answers. The top answers are on the board.","watch_for":"Learners: at the tables, in their two teams, facing the big screen. The game is a Canva Code game on the big screen (see verify_before_teaching: paste its link in the designer to replace this cover slide). Five rounds from Phoebe''s plan: a layer of the hair; a product used in shampooing; something that opens the cuticle; something in the skin structure; something that affects hair condition. Use any answer a team gives that is not on the board as a teaching moment. Technique: retrieval as a team game."},{"slot_index":15,"teacher_says":"Who won? Remember: acid closes the cuticle, alkaline opens it, neutral is 7. Next time you will test your predictions with pH strips.","watch_for":"Learners: at the tables. Close on the pH scale they will use in the practical. Technique: summarise the one idea."}],"verify_before_teaching":["Family Fortunes (step 15) needs the Canva Code game. Publish it in Canva, then in the designer change step 15''s big screen to an embed with the game''s link. Until then that step shows a Family Fortunes title slide.","Play both Wordwalls (steps 2 and 3) once. They are community activities, not Phoebe''s: ''The structure of a hair shaft'' (Zahrascience) and ''Hair and Skin Structure'' (Janehughes). Check the skin labels match what Phoebe teaches.","pH values in the notes are typical textbook ranges. Phoebe offered the pH of each product she tests; if she sends them, put them in the notes for step 14 so the predictions can be checked properly.","Nothing is printed. Learners write on the whiteboard tables at steps 10 to 15, and on the touch-screen whiteboards at step 6.","The class works in two teams all lesson. They start at the touch screens (steps 1 to 8), move to the tables at step 9, and one runner per table goes to a touch screen at step 14.","The level was not given. It is most likely Level 1: Phoebe''s pH slides are from the same Pearson hair and skin pack as Hayley''s Level 1 material, and her intentions use outline, explain and identify."],"safety_note":null,"media_requests":[],"brief":{"topic":"Hair and skin structure, and the pH scale (shampooing theory)","level":"Level 1","department":"Professional and Creative","three_screens":true}}'::jsonb
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
  -- 1 · Hair, skin and pH (1 min)
  (0, 'Hair, skin and pH', 'Launch', 1, 'screen1_continue',
    '{"type":"designed_slide","layout":"steps","look":"clean","kicker":"Shampooing theory","title":"Today","points":["Outline the basic structure of the hair and skin","Explain how pH affects the hair and skin","Identify the effects of using the wrong products on the hair"],"chip":"Team A: Touch Screen 1   ·   Team B: Touch Screen 2"}',
    null),

  -- 2 · Label the hair (3 min)
  (1, 'Label the hair', 'Launch', 3, 'screen1_continue',
    '{"type":"text_slide","title":"Label the hair","text":"One person at a time.\nDrag a label onto the right part.\nThen pass it on.\n\nWhich team finishes first?","size":"lg"}',
    '{"type":"embed","url":"https://wordwall.net/embed/e6b1e88f21eb469597f2044a581a63d6?themeId=1","description":"Wordwall labelled diagram ''The structure of a hair shaft'' (by Zahrascience): an unlabelled hair shaft with three pins. Learners drag Cuticle, Cortex and Medulla onto the pins. Tap Start first."}'),

  -- 3 · Label the skin (4 min)
  (2, 'Label the skin', 'Launch', 4, 'screen1_continue',
    '{"type":"text_slide","title":"Now the skin","text":"Same again.\nOne person, one label.\n\nWhich gland makes oil?","size":"lg"}',
    '{"type":"embed","url":"https://wordwall.net/embed/d5f60cd0bc9c4e0d86fc3a4319a8c853?themeId=1","description":"Wordwall labelled diagram ''Hair and Skin Structure'' (by Janehughes): a skin section with eight labels to drag onto pins: epidermis, dermis, hair follicle, sebaceous gland, sweat gland, dermal papilla, capillaries/blood vessels and one more. Tap Start first."}'),

  -- 4 · Check: hair and skin (2 min)
  (3, 'Check: hair and skin', 'Launch', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phoebe-hair-skin-ph/hair-structure.jpg","file_name":"hair-structure.jpg","title":"Which part protects the hair? Which part gives it strength?"}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phoebe-hair-skin-ph/skin-structure.jpg","file_name":"skin-structure.jpg","title":"Which gland produces oil?"}'),

  -- 5 · pH scale challenge (1 min)
  (4, 'pH scale challenge', 'Establish', 1, 'screen1_continue',
    '{"type":"designed_slide","layout":"statement","look":"bold","kicker":"pH scale challenge","title":"Where do these go on the pH scale?","text":"Conditioner  ·  Shampoo  ·  Water  ·  Bleach  ·  Hair colour"}',
    null),

  -- 6 · Place the products (7 min)
  (5, 'Place the products', 'Establish', 7, 'screen1_continue',
    '{"type":"whiteboard","title":"Where do these go on the pH scale?"}',
    '{"type":"whiteboard","title":"Write: conditioner, shampoo, water, bleach, hair colour","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phoebe-hair-skin-ph/ph-scale-blank.png","file_name":"ph-scale-blank.png"}'),

  -- 7 · Reveal: the pH scale (4 min)
  (6, 'Reveal: the pH scale', 'Establish', 4, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phoebe-hair-skin-ph/ph-scale.jpg","file_name":"ph-scale.jpg"}',
    null),

  -- 8 · The pH scale (2 min)
  (7, 'The pH scale', 'Establish', 2, 'screen1_continue',
    '{"type":"designed_slide","layout":"compare","look":"clean","kicker":"Facts about hair and skin","title":"The pH scale measures how acidic or alkaline a product is","columns":[{"heading":"Acid: 1.0 to 6.9","text":"Neutral is 7.0"},{"heading":"Alkaline: 7.1 to 14.0","text":"Hair and skin are about 4.5 to 5.5"}]}',
    null),

  -- 9 · Acid closes, alkaline opens (3 min)
  (8, 'Acid closes, alkaline opens', 'Establish', 3, 'screen1_continue',
    '{"type":"designed_slide","layout":"compare","look":"clean","kicker":"The pH scale","title":"What does pH do to the cuticle?","columns":[{"heading":"Acid: closes the cuticle","text":"Acid-based products close the cuticle scales, so the hair is smooth and shiny. For example, conditioner."},{"heading":"Alkaline: opens the cuticle","text":"Most chemical products are alkaline. They open the cuticle and may damage the hair. The more alkaline, the more damage."}],"chip":"Neutral = pH 7"}',
    null),

  -- 10 · Draw the cuticle (5 min)
  (9, 'Draw the cuticle', 'Apply', 5, 'screen1_continue',
    '{"type":"host_timer","label":"Draw the cuticle: closed and open","duration_secs":240}',
    '{"type":"text_slide","title":"On your table","text":"Draw two hairs.\n1  Cuticle CLOSED (acid)\n2  Cuticle OPEN (alkaline)\n\nWrite which products do each.\nDraw lines to label them.","size":"md"}'),

  -- 11 · Apply: most likely to open the cuticle? (2 min)
  (10, 'Apply: most likely to open the cuticle?', 'Apply', 2, 'screen1_continue',
    '{"type":"designed_slide","layout":"question","look":"bold","kicker":"Apply challenge 1","title":"Which product is most likely to open the cuticle?","text":"Talk as a team. Write your answer on the table."}',
    null),

  -- 12 · Apply: smoother hair? (2 min)
  (11, 'Apply: smoother hair?', 'Apply', 2, 'screen1_continue',
    '{"type":"designed_slide","layout":"question","look":"bold","kicker":"Apply challenge 2","title":"Which product would leave the hair feeling smoother?","text":"Talk as a team. Write your answer on the table."}',
    null),

  -- 13 · Apply: if the cuticle stays open? (3 min)
  (12, 'Apply: if the cuticle stays open?', 'Apply', 3, 'screen1_continue',
    '{"type":"designed_slide","layout":"question","look":"bold","kicker":"Apply challenge 3","title":"What would happen if the cuticle stays open?","text":"Talk as a team. Write as many effects as you can."}',
    null),

  -- 14 · Predict before the practical (6 min)
  (13, 'Predict before the practical', 'Apply', 6, 'screen1_continue',
    '{"type":"padlet","title":"Predict before the practical","question":"Lacquer removing shampoo, cleansing shampoo, pH balancing conditioner, perm solution, perm neutraliser.\nPredict each one: acid or alkaline? Opens or closes the cuticle?"}',
    null),

  -- 15 · Family Fortunes (14 min)
  (14, 'Family Fortunes', 'Demonstrate', 14, 'screen1_continue',
    '{"type":"designed_slide","layout":"cover","look":"night","kicker":"Team A v Team B","title":"Family Fortunes","text":"Hair, skin and pH"}',
    '{"type":"text_slide","title":"Family Fortunes","text":"Talk as a team.\nOne answer at a time.\nThree wrong answers and the other team can steal.","size":"lg"}'),

  -- 16 · Ready for the practical (1 min)
  (15, 'Ready for the practical', 'Demonstrate', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/phoebe-hair-skin-ph/ph-scale.jpg","file_name":"ph-scale.jpg","title":"Acid closes. Alkaline opens. Neutral is 7."}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
