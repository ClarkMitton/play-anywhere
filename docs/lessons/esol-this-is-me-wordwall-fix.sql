-- Run this ONLY if you already ran esol-this-is-me.sql before 12 October's
-- Wordwall change. It moves the alphabet Wordwall from the big screen to the
-- two touch screens in the lesson you already have. Safe to run twice.
update slots s
set host_content    = '{"type":"text_slide","title":"The alphabet","text":"Open a box.\nSay the letter.","size":"xl"}'::jsonb,
    screen1_content = '{"type":"embed","url":"https://wordwall.net/embed/3290ba254468409a9835ed3daf1344d2?themeId=65&templateId=30&fontStackId=0","description":"Shamim''s Wordwall called ''alphabet''. It is an ''Open the box'' game: tap Start, then tap a numbered box to open it and show what is inside."}'::jsonb,
    screen2_content = '{"type":"embed","url":"https://wordwall.net/embed/3290ba254468409a9835ed3daf1344d2?themeId=65&templateId=30&fontStackId=0","description":"Shamim''s Wordwall called ''alphabet''. It is an ''Open the box'' game: tap Start, then tap a numbered box to open it and show what is inside."}'::jsonb
from lessons l
where s.lesson_id = l.id
  and l.title = 'ESOL This Is Me'
  and s.name = 'The alphabet: open the box';
