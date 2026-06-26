-- ─────────────────────────────────────────────────────────────
-- STARTER TEMPLATE LESSON
-- A clean 7-slot lesson that follows Launch → Establish → Apply → Demonstrate.
-- Participants clone this in the designer as a starting point.
-- Run once in the Supabase SQL editor. Safe to re-run (it inserts a new copy each time).
-- ─────────────────────────────────────────────────────────────

with new_lesson as (
  insert into lessons (title, description, estimated_duration_mins, featured)
  values (
    '⭐ Starter Template — copy me',
    'A clean lesson skeleton. Duplicate the slots you like and replace the placeholder text.',
    35,
    false
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
  v.host::jsonb, v.s1::jsonb, v.s2::jsonb
from new_lesson nl, (values
  -- 1 · Title (same on all three screens)
  (0, 'Title', 'Launch', 3, 'screen1_continue',
    '{"type":"text_slide","text":"Your lesson title","subtitle":"Your name · today''s date","size":"xl"}',
    '{"type":"text_slide","text":"Your lesson title","subtitle":"Your name · today''s date","size":"xl"}',
    '{"type":"text_slide","text":"Your lesson title","subtitle":"Your name · today''s date","size":"xl"}'),

  -- 2 · Warm-up confidence check (baseline)
  (1, 'Starting confidence', 'Launch', 4, 'screen2_submit',
    '{"type":"confidence_checker","prompt":"How confident do you feel about today''s topic?","scale_mode":"numbers","max":5,"optional_qualitative":true}',
    '{"type":"confidence_checker","prompt":"How confident do you feel about today''s topic?","scale_mode":"numbers","max":5,"optional_qualitative":true}',
    '{"type":"confidence_checker","prompt":"How confident do you feel about today''s topic?","scale_mode":"numbers","max":5,"optional_qualitative":true}'),

  -- 3 · Teach / show (swap this for an image, video, YouTube or website)
  (2, 'Teach', 'Establish', 10, 'screen1_continue',
    '{"type":"text_slide","text":"Add your teaching content here","subtitle":"Change this slot to an Image, YouTube, Video or Embed","size":"lg"}',
    '{"type":"text_slide","text":"Add your teaching content here","subtitle":"Change this slot to an Image, YouTube, Video or Embed","size":"lg"}',
    '{"type":"text_slide","text":"Add your teaching content here","subtitle":"Change this slot to an Image, YouTube, Video or Embed","size":"lg"}'),

  -- 4 · Check understanding — multiple choice (Host shows, Screen 2 answers, Screen 1 reveals)
  (3, 'Check understanding', 'Apply', 6, 'screen2_submit',
    '{"type":"multiple_choice","id":"11111111-1111-1111-1111-111111111111","text":"Your question goes here?","options":["Option A","Option B","Option C"],"correct":0}',
    '{"type":"teacher_note","text":"Question: Your question goes here?\n\nWhen students are ready, click ''Reveal Results''.","has_reveal_button":true,"question_id":"11111111-1111-1111-1111-111111111111"}',
    '{"type":"multiple_choice","id":"11111111-1111-1111-1111-111111111111","text":"Your question goes here?","options":["Option A","Option B","Option C"],"correct":0}'),

  -- 5 · Discuss / decide — voting
  (4, 'Vote', 'Apply', 4, 'screen2_submit',
    '{"type":"voting","question":"What should we do next?","options":["Yes","No","Not sure"]}',
    '{"type":"voting","question":"What should we do next?","options":["Yes","No","Not sure"]}',
    '{"type":"voting","question":"What should we do next?","options":["Yes","No","Not sure"]}'),

  -- 6 · Exit confidence check (compare to the start)
  (5, 'Ending confidence', 'Demonstrate', 4, 'screen2_submit',
    '{"type":"confidence_checker","prompt":"How confident do you feel now?","scale_mode":"numbers","max":5,"optional_qualitative":true}',
    '{"type":"confidence_checker","prompt":"How confident do you feel now?","scale_mode":"numbers","max":5,"optional_qualitative":true}',
    '{"type":"confidence_checker","prompt":"How confident do you feel now?","scale_mode":"numbers","max":5,"optional_qualitative":true}'),

  -- 7 · Close
  (6, 'Well done', 'Demonstrate', 2, 'timed',
    '{"type":"text_slide","text":"Well done!","subtitle":"Thanks for taking part","size":"2xl"}',
    '{"type":"text_slide","text":"Well done!","subtitle":"Thanks for taking part","size":"2xl"}',
    '{"type":"text_slide","text":"Well done!","subtitle":"Thanks for taking part","size":"2xl"}')
) as v(order_index, name, lead_phase, duration_mins, end_behaviour, host, s1, s2);
