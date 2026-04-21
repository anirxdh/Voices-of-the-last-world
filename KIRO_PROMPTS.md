# Kiro Prompts For This Project

Use these directly in Kiro so the workflow looks intentional and spec-driven.

## Prompt 1: Voice Identity

```text
Read specs/audio.md and kiro-specs/voice-emotion-system.md.
Improve the voice behavior without changing the assigned character identities.
Preserve Nova Sage and Lady Astra as feminine voices and Core AI as robotic.
Do not introduce browser fallback silently.
Make only focused, reviewable changes.
```

## Prompt 2: Debate Polish

```text
Read specs/game-loop.md and specs/ui.md.
Refine the discussion phase so it feels more cinematic and conversational.
Keep the layout centered, preserve the left/right exchange, and avoid introducing extra clutter.
Make the implementation maintainable and avoid broad unrelated edits.
```

## Prompt 3: Result Screen

```text
Read specs/ui.md and specs/scenarios.md.
Improve the mission result screen so the outcome feels clearer, more visual, and more premium.
Preserve the current game loop and avoid changing core simulation logic unless necessary.
```

## Prompt 4: Reliability Pass

```text
Review the codebase for demo-breaking risks in audio playback, state transitions, and asset usage.
Fix only issues that affect the live demo quality.
Prefer clean code and deletion of dead code over quick hacks.
```

## Prompt 5: Submission Pass

```text
Treat this as a hackathon submission cleanup.
Refactor for readability, reduce noisy code, preserve behavior, and improve maintainability.
Do not redesign the product.
Focus on clear modules, dead-code removal, and demo reliability.
```
