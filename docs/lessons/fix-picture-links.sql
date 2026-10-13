-- ─────────────────────────────────────────────────────────────
-- FIX PICTURE LINKS · safe to run more than once
--
-- Lessons used to point at pictures and sound inside the app's own files
-- (/lessons/<name>/...). Those only load after a publish, and showed as broken
-- pictures until then. The files are now in the app's media storage
-- (lesson-media/lessons/<name>/...), which loads straight away.
--
-- This points every lesson, and every session already started from one, at
-- the storage copy. Run it once in the SQL editor.
-- ─────────────────────────────────────────────────────────────

update slots
set
  host_content    = replace(host_content::text,    '"/lessons/', '"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/')::jsonb,
  screen1_content = replace(screen1_content::text, '"/lessons/', '"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/')::jsonb,
  screen2_content = replace(screen2_content::text, '"/lessons/', '"https://sxrhecwyhqwdwwfawojn.supabase.co/storage/v1/object/public/lesson-media/lessons/')::jsonb
where host_content::text    like '%"/lessons/%'
   or screen1_content::text like '%"/lessons/%'
   or screen2_content::text like '%"/lessons/%';
