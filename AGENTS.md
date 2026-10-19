# Architecture rules
- Existing lesson-agent deployments import teaching blocks from `_shared/lessonPromptBlocks.ts`; keep its exported values identical to the canonical generator blocks because deployment excludes sibling function folders.
- Agent conversations retain independent browser-local history, resources and drafts after creation; designer return links identify the conversation so rebuilding never overwrites the created lesson.
- Lesson-agent consumes complete provider streams and sends JSON whitespace heartbeats; reject interrupted output rather than accepting a partial lesson or exposing JSON parser errors.
