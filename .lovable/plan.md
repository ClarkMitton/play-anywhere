This is a large change touching the designer, host, both student screens, and the slot renderer. I'll break it into 4 phases that can ship in order. Before starting I need a few decisions from you.

## Phase 1 — Timeline slot thumbnails

In `admin.designer.$lessonId.tsx`, replace each slot's label-only card with a mini "screen stack":
- Top (≈65% height): Host preview thumbnail with corner tag "H"
- Bottom row: Student 1 + Student 2 mini previews with "1" / "2" tags
- Each thumbnail uses the same SlotRenderer logic at scaled-down size (CSS `transform: scale()` on a fixed-size 16:9 inner container so real text/image/bg colour shows)
- Empty slot → faded box with "No content"
- Rounded corners, subtle border, hover glow, consistent sizes across slots

## Phase 2 — Confidence Checker mode

New slot type `confidence_checker` with config:
- `prompt` (string)
- `scaleType`: `numbers` (1–10) or `emojis` (5-step 😟 😐 🙂 😄 🤩)

Behaviour:
- Host: prompt + live distribution chart, reset button
- Both student screens: scale buttons; tap submits
- Side screens locked from manual config; designer hides per-screen editors for this slot type and shows "Controlled by Host Mode" banner
- Responses stored in a new `responses` table keyed by `(session_id, slot_index, screen)` with realtime subscription

## Phase 3 — Voting Mode

New slot type `voting` with config:
- `question`
- `options[]` (2–4 labels, default A/B/C/D, presets Yes/No)

Behaviour:
- Host: question + live bar chart with counts and %
- Student screens: large option buttons (one per option)
- Reuses the same `responses` table; option index = response value
- Reset votes button on host

## Phase 4 — Quiz Mode (Buzzers)

New slot type `quiz` with config:
- `team1Name`, `team2Name` (defaults "Team 1" / "Team 2")
- `questions[]` each `{ question, answer? }`

Behaviour:
- Host: current question, both team scores, "first buzzed" highlight, controls: Reveal Answer (if any), Next Question, Reset Buzzers, +1/+5 per team
- Student 1 = Team 1 BUZZ button; Student 2 = Team 2 BUZZ button
- First press locks both, registers winner; scores persist across questions in the slot
- Uses a `quiz_state` table (or extends `responses`) with realtime: `{ session_id, slot_index, current_q, buzzed_team, team1_score, team2_score }`

## Technical notes

- New DB tables `responses` and `quiz_state` with RLS + GRANTs, realtime enabled
- New SlotRenderer cases: `confidence_checker`, `voting`, `quiz` — with `screen` prop variant (host/s1/s2)
- Remote/student screens detect synchronized slot types and render the synced view instead of their per-slot config
- Designer: when a synchronized slot type is chosen, hide the S1/S2 editor panels and show a "Controlled by Host" notice; thumbnails in Phase 1 still render the synced previews

## Questions before I start

1. Do you want all 4 phases in one go, or ship Phase 1 (thumbnails) first so you can review, then the 3 activity modes?
2. For the quiz, should "Reset Buzzers" also clear the per-question winner highlight only, or also reset scores? (I'll default to: Reset Buzzers = just buzzers; separate "Reset Scores" button.)
3. For Voting Mode, do you want the option to show results on student screens after they vote, or keep student screens on the buttons until host moves on? (I'll default to: show "✓ Vote recorded" on student after tap, no chart.)