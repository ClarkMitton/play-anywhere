-- ─────────────────────────────────────────────────────────────
-- OUR FIRST FLAT · rooms, furniture and cleaning equipment
-- 60 minutes · 15 steps · Preparing for Adulthood · Entry 1
-- Built from Kim's Skills Flat Preparing for Adulthood, Book 1 (pages 4 to 13).
-- Two hotspot hunts, two whiteboards drawn over a picture, and three table tasks.
-- No printing: learners write and draw on the whiteboard tables.
-- Generated: edit the lesson in the Stage Designer afterwards, not here.
--
-- Run once in the SQL editor. Re-running inserts a second copy.
-- Each row is: big screen, then touch screens. null means the touch screens
-- show the same as the big screen.
-- The pictures are in the app's own media storage (lesson-media/lessons/kim-first-flat/),
-- so they show straight away. Copies are kept in public/lessons/kim-first-flat/.
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured, ai_generated, generated_at, ai_notes)
  values (
    'Our First Flat: Rooms, Furniture and Cleaning',
    'Preparing for adulthood, Entry 1: what rooms are in a flat, what goes in each, and what we clean with. Built from Kim''s Skills Flat Book 1. Learners turn the tables into the four rooms, hunt for furniture and cleaning equipment on the touch screens, draw in what a bathroom is missing, then furnish and check a room. No printing needed.',
    60,
    false,
    true,
    now(),
    '{"rationale":"One idea runs through the hour: every room in a flat needs its own furniture and its own cleaning things. The hook is a lovely bathroom with no toilet, sink or mirror, so learners open a question (what does a room need?) that the last step answers. Learners act out the four rooms before they are told the names, then turn four tables into the four rooms and write a spider diagram on each, adding to the last table''s work. One trip to the touch screens covers four steps: two hotspot hunts (furniture in the living room, then the four things we clean with), a matching board (draw a line from equipment to its room) and a drawing on the bathroom photo (what is missing). Back at the tables learners spin for a room, write four furniture things, three cleaning things and a reason on the table, then check another table''s list. Nothing is printed: pictures are on the screens, writing is on the tables. Everything is read aloud, so nobody has to read.","objectives":["Name the four rooms in a flat.","Say what furniture and equipment goes in each room.","Match cleaning equipment to the job it does and the room it lives in.","Spot what a room is missing and say why it matters."],"run_sheet":[{"slot_index":0,"teacher_says":"Look at this bathroom. It looks nice. Would you live here? Hands up for yes. Thumbs down for no. Now look again. What is missing? Say it. Then write or draw one missing thing on your table.","watch_for":"Learners: at the tables, on the big screen. Do not give the answers. Listen for toilet, sink, mirror, towel, bin. Accept a drawing or a gesture instead of a word. Technique: a hook that opens a question the last step answers (what does a room NEED?). Read everything aloud, nobody has to read."},{"slot_index":1,"teacher_says":"This is a flat. It has four rooms, 1, 2, 3, 4. I will act. You guess the room. Show me with your fingers.","watch_for":"Learners: at the tables. Mime sleeping, cooking, washing and relaxing on the sofa, one at a time. Learners hold up 1 to 4 fingers. Do not say the room names yet. Technique: predict before reveal (act it out, then give the words)."},{"slot_index":2,"teacher_says":"Now the names. Living room. Kitchen. Bedroom. Bathroom. Say it with me. Point to the bedroom. Point to the kitchen.","watch_for":"Learners: at the tables. Say each name, learners repeat, then you call a name and they point at the screen. Quick fire at the end. Technique: choral repetition then pointing (check understanding with no writing)."},{"slot_index":3,"teacher_says":"This is a spider diagram. The room is in the middle. The things are round it. Garden: grass, flowers, bench, shed. Now you do it for a room in the flat.","watch_for":"Learners: at the tables. Draw the same GARDEN spider on the whiteboard or on one table too, because this slide disappears when the timer starts. Say what good looks like: room name in the middle, a line to each thing, a word or a drawing. Technique: model before the task."},{"slot_index":4,"teacher_says":"Each table is a room. Look at the table. What room are you? Write it in the middle. Write the things you find in that room. When the bell goes, move. Add what they forgot.","watch_for":"Learners: at the tables, standing. SET UP BEFORE: write LIVING ROOM, KITCHEN, BEDROOM and BATHROOM in marker in one corner of four tables. The photos are on the touch screens during the timer. If learners cannot see those screens from the tables, point at the room on the table and say the room name. With fewer than 4 tables, set rounds to the number of tables. Pre-entry friendly: drawing counts as writing. Stretch: add where it goes (next to, under). Technique: station rotation, then add to another group''s work in a different colour."},{"slot_index":5,"teacher_says":"Everybody to a touch screen. Half here, half there. Tap what you find in the living room. When you tap, say the word. Press Finish when you have found them all.","watch_for":"Learners: MOVE to the touch screens now (move one of two). Each screen finds every item for itself. Each tap that is right shows a green ring and the word. Say the word with the learner. There are eight. Keep the pace: this is the first of four screen steps in a row. Technique: tap to find, say it aloud."},{"slot_index":6,"teacher_says":"This is a cupboard. Some things clean. Some things do not clean. Tap only the things we CLEAN with. Four things.","watch_for":"Learners: at the touch screens. There are four cleaning things among nine: hoover, mop and bucket, dustpan and brush, toilet brush. The kettle, toaster, microwave, hairdryer and router are not for cleaning. A wrong tap shows a cross, so use it to ask why not. Say each name aloud and what it cleans (floor, toilet). Technique: odd one out, then say the job."},{"slot_index":7,"teacher_says":"Look at the pictures on the left. Where does each one live? Draw a line to the room. Use your finger. When you finish, press Send to big screen.","watch_for":"Learners: at the touch screens. Five things on the left, four rooms on the right: hoover, mop, toilet brush, iron, kettle. Common answers: toilet brush to bathroom, kettle to kitchen, iron to bedroom, hoover to living room, mop to kitchen or bathroom. A hoover and a mop can live in more than one room, so accept a reason. Put the drawings on the big screen and ask ''Why?'' Technique: match, then justify. Use the Send to big screen button so the drawings can be compared."},{"slot_index":8,"teacher_says":"Remember the bathroom? Draw what is missing. Draw a toilet. Draw a sink. What else does a bathroom need? Then press Send to big screen.","watch_for":"Learners: at the touch screens. They draw on top of the bathroom photo. Expect toilet, sink, mirror, towel, bin, toilet brush. Read out two sent drawings and ask ''Why does a bathroom need this?'' A drawing is as good as a word. This is the analyse step: spotting what a room is missing and why it matters. Technique: critique a picture, then add to it."},{"slot_index":9,"teacher_says":"Back to your tables. Spin the wheel. This is your room.","watch_for":"Learners: MOVE back to the tables (move two of two). Spin once for each table. If the same room comes up twice, spin again. Technique: a wheel gives every table a different job without the tutor choosing."},{"slot_index":10,"teacher_says":"Write your room in the middle. Write four furniture things. Write three cleaning things. Then say one reason: why does this room need them?","watch_for":"Learners: at the tables, writing or drawing on the table. Success criteria: four furniture, three cleaning things, one reason, all in the right room. Cleaning things should match the room (toilet brush for bathroom, dustpan for kitchen or living room). The reason can be spoken, not written. Stretch: add the price of one thing. Technique: create a product tested against criteria."},{"slot_index":11,"teacher_says":"Move to the next table. Read their room. Would you live here? Tick the right things. Add one thing they forgot.","watch_for":"Learners: at the tables, moving once between tables. Listen for ''it needs a ...''. A good answer names the missing thing and why. Technique: create, then judge each other''s work against the criteria."},{"slot_index":12,"teacher_says":"One person from each table, go to a touch screen. Type your room and what it needs. Everyone else, stay at the table.","watch_for":"Learners: one runner per table at the touch screens, everyone else stays. The lists are saved as evidence. Read two out loud and ask the room if they would live there. Technique: capture the product."},{"slot_index":13,"teacher_says":"Here is the bathroom again. Would you live here now? What does it need? Say it.","watch_for":"Learners: at the tables. Close the loop opened in the first step. Learners should now name a toilet, sink, mirror, towel, bin and a toilet brush for cleaning. This shows the lesson idea: every room needs its furniture and its cleaning things. Technique: return to the opening question."},{"slot_index":14,"teacher_says":"Last thing. How sure are you? Pick a face. Happy face means very sure.","watch_for":"Learners: one runner per table at a touch screen, or everyone in turn if there is time. Faces, no numbers. Ask two learners which room they know best. Technique: self-assessment with faces."}],"verify_before_teaching":["NO PRINTING. Pictures are on the screens and learners write on the whiteboard tables.","BEFORE learners arrive, write LIVING ROOM, KITCHEN, BEDROOM and BATHROOM in marker in a corner of four tables (step 5 uses them as stations).","Draw the GARDEN spider diagram from step 4 on a whiteboard, because the slide disappears when the station timer starts.","Pens: learners need two colours each, because round two adds to another table''s work in a different colour.","The living room photo hotspot circles were placed by eye. Tap each of the eight once in the preview and check the green ring lands on the right object.","The room and equipment pictures are Kim''s own from Skills Flat Book 1 (pages 5 to 13). The lesson uses ten of her 15 equipment pictures: nine in the cupboard (hoover, mop and bucket, dustpan and brush, toilet brush, kettle, toaster, microwave, hairdryer, router) plus the iron on the matching board. The washing machine, air fryer, oven, ironing board and fire extinguisher are left for follow-up lessons.","The kitchen photo has no fridge or sink, and the bedroom has no wardrobe. Ask learners what else the room needs and let them add it in the stations.","The whole class moves twice: to the touch screens at step 6, and back to the tables at step 10. At steps 13 and 15 only one person per table goes to a screen.","With fewer than four tables, set the station rounds to the number of tables in the designer.","Check the touch screens can be seen from the tables. If not, say the room name from the table instead of using the grid photo.","All pictures are in the app''s media storage and load straight away."],"safety_note":null,"brief":{"topic":"Our first flat: rooms, furniture and cleaning equipment","level":"Entry 1","department":"Adult Skills","three_screens":true}}'::jsonb
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
  -- 1 · Would you live here? (3 min)
  (0, 'Would you live here?', 'Launch', 3, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/slide-01-would-you-live-here.jpg","file_name":"slide-01-would-you-live-here.jpg"}',
    null),

  -- 2 · What happens in each room? (2 min)
  (1, 'What happens in each room?', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/slide-02-what-happens.jpg","file_name":"slide-02-what-happens.jpg"}',
    null),

  -- 3 · The four rooms (2 min)
  (2, 'The four rooms', 'Establish', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/slide-03-four-rooms.jpg","file_name":"slide-03-four-rooms.jpg"}',
    null),

  -- 4 · Spider diagram (1 min)
  (3, 'Spider diagram', 'Establish', 1, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/slide-05-spider-model.jpg","file_name":"slide-05-spider-model.jpg"}',
    null),

  -- 5 · Room stations (12 min)
  (4, 'Room stations', 'Establish', 12, 'screen1_continue',
    '{"type":"rotation_timer","label":"Your table is a room. Write the room in the middle. Write or draw the things you find around it.","details":"Round 1: your room.\nRounds 2 to 4: move on. Look at what the last table wrote. ADD what they missed, in a different pen colour.","rounds":4,"round_secs":150,"move_secs":20,"move_text":"Move to the next room. Take your pen."}',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/slide-04-room-grid.jpg","file_name":"slide-04-room-grid.jpg"}'),

  -- 6 · Furniture hunt (5 min)
  (5, 'Furniture hunt', 'Apply', 5, 'screen1_continue',
    '{"type":"hazard_hotspots","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/room-living-room.jpg","title":"Tap what you find in the living room. Say its name!","hotspots":[{"id":"sofa","x":60,"y":58,"r":5,"label":"sofa"},{"id":"armchair","x":17,"y":67,"r":7,"label":"armchair"},{"id":"lamp","x":29,"y":45,"r":4.5,"label":"lamp"},{"id":"table","x":45,"y":64,"r":4.5,"label":"coffee table"},{"id":"rug","x":60,"y":78,"r":6,"label":"rug"},{"id":"plant","x":71,"y":51,"r":6.5,"label":"plant"},{"id":"window","x":47.5,"y":28.5,"r":8,"label":"window"},{"id":"picture","x":10,"y":27,"r":6.5,"label":"picture"}]}',
    null),

  -- 7 · Cleaning cupboard (4 min)
  (6, 'Cleaning cupboard', 'Apply', 4, 'screen1_continue',
    '{"type":"hazard_hotspots","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/hotspot-cleaning-cupboard.jpg","title":"Tap the things we CLEAN with","hotspots":[{"id":"hoover","x":50,"y":27,"r":7,"label":"hoover"},{"id":"mop","x":17.6,"y":55.6,"r":7,"label":"mop and bucket"},{"id":"dustpan","x":82.3,"y":55.6,"r":7,"label":"dustpan and brush"},{"id":"toilet","x":82.3,"y":84.1,"r":7,"label":"toilet brush"}]}',
    null),

  -- 8 · Where does it live? (5 min)
  (7, 'Where does it live?', 'Apply', 5, 'screen1_continue',
    '{"type":"whiteboard","title":"Where does it live? Draw a line.","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/whiteboard-match.jpg"}',
    null),

  -- 9 · What is missing? (5 min)
  (8, 'What is missing?', 'Apply', 5, 'screen1_continue',
    '{"type":"whiteboard","title":"What is missing? Draw it in.","image_url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/room-bathroom.jpg"}',
    null),

  -- 10 · Back to your table (2 min)
  (9, 'Back to your table', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"wheel_spinner","prompt":"Spin for your table''s room","items":["Living room","Kitchen","Bedroom","Bathroom"]}',
    null),

  -- 11 · Furnish your room (8 min)
  (10, 'Furnish your room', 'Demonstrate', 8, 'screen1_continue',
    '{"type":"text_slide","title":"Your room","text":"4 furniture\n3 cleaning things\n1 reason","size":"xl"}',
    '{"type":"countdown_timer","label":"Furnish your room. Write your list on the table.","duration_secs":480}'),

  -- 12 · Check another table's room (4 min)
  (11, 'Check another table''s room', 'Demonstrate', 4, 'screen1_continue',
    '{"type":"rotation_timer","label":"Read their list. Would you live here? Add one thing they forgot.","details":"Round 1 and 2: move on. Use a different colour. Tick what is right. Add one thing.","rounds":2,"round_secs":90,"move_secs":20,"move_text":"Move to the next table. Take your pen."}',
    null),

  -- 13 · Our room lists (3 min)
  (12, 'Our room lists', 'Demonstrate', 3, 'screen1_continue',
    '{"type":"padlet","title":"Our flat","question":"One person from each table: type your room and what it needs."}',
    null),

  -- 14 · Would you live here now? (2 min)
  (13, 'Would you live here now?', 'Demonstrate', 2, 'screen1_continue',
    '{"type":"image","url":"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/kim-first-flat/slide-14-live-here-now.jpg","file_name":"slide-14-live-here-now.jpg"}',
    null),

  -- 15 · How sure are you? (2 min)
  (14, 'How sure are you?', 'Demonstrate', 2, 'screen2_submit',
    '{"type":"confidence_checker","prompt":"How sure are you that you can say what goes in each room?","scale_mode":"emoji","max":5}',
    null)
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, touch);
