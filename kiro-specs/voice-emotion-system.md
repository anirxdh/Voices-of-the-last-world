# Voice Emotion System

Use Kiro to add bounded emotion-aware voice settings on top of the current ElevenLabs mapping.

## Inputs

- agent name
- spoken line
- current base settings

## Output

- final bounded settings for the ElevenLabs request

## Rules

- Ares Prime: urgent, sharp, commanding
- Nova Sage: warm, calm, reassuring
- Lady Astra: elevated, elegant, dramatic
- Turing-Ω: precise, controlled, thoughtful
- Core AI: cold, minimal, synthetic

## Guardrails

- Clamp values to safe ranges.
- Prefer slight variation over dramatic distortion.
- Preserve intelligibility.
- Keep `Core AI` as the only heavily processed post-playback voice unless explicitly changed.
