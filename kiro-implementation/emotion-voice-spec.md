# Emotion Voice Spec

## Goal

Improve emotional delivery in `src/voice.js` without changing the assigned character identities.

## Current constraints

- Nova Sage and Lady Astra must stay clearly feminine.
- Core AI must stay robotic and male-coded.
- Ares Prime must sound commanding and urgent.
- Turing-Ω must sound controlled and analytical.
- Do not replace the current voice IDs unless there is clear evidence the mapping is wrong.

## Required behavior

- Preserve per-agent voice identity first.
- Add emotion variation second.
- Never flatten all characters into the same processed sound.
- Never let discussion silently fall back to browser speech without a visible debug signal.

## Files involved

- `src/voice.js`
- `src/App.jsx`

## Success condition

Discussion lines sound distinct per agent, result narration works, and onboarding narration does not break discussion voice identity.
