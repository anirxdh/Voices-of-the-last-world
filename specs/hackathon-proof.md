# Hackathon Proof Spec

## Goal

Make the Kiro workflow visible enough that judges can see this project was developed through specifications, not only manual coding.

## Required Evidence

1. A spec file exists for the feature being improved.
2. Kiro reads that spec.
3. Kiro changes the codebase.
4. The resulting feature is visible in the running app.

## Requirements

- Every recorded Kiro pass should reference at least one file from `specs/`, `kiro-specs/`, or `kiro-implementation/`.
- The resulting change should be visible in the UI or audio experience.
- The change should be narrow enough to understand quickly in a short demo clip.
- The implementation should improve maintainability, not just add effect-heavy noise.

## Good Demo Candidates

- debate pacing and text/speech synchronization
- clearer result outcome presentation
- stronger voice identity
- cleaner fallback behavior
- smoother transitions between scenario, selection, and discussion

## Anti-Patterns

- giant prompts with unrelated goals
- invisible refactors only
- “we used Kiro” with no evidence
- last-minute speculative changes that risk the demo
