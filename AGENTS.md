# Architecture rules
- Existing lesson-agent deployments import teaching blocks from `_shared/lessonPromptBlocks.ts`; keep its exported values identical to the canonical generator blocks because deployment excludes sibling function folders.
- Agent conversations retain independent browser-local history, resources and drafts after creation; designer return links identify the conversation so rebuilding never overwrites the created lesson.
- Lesson-agent consumes streamed AI completions and returns JSON with whitespace heartbeats so long builds keep both network connections active without changing the client reply contract; interrupted output is never accepted as complete.
