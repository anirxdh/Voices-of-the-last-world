# Kiro Setup For This Project

This repo should be presented as a `Kiro + ElevenLabs` build, not just a React app with voice.

The Hack #5 page says judges want projects that showcase `Kiro's spec-driven development` and `ElevenLabs APIs`, and it explicitly recommends using the ElevenLabs Kiro Power:
- Hack page: https://hacks.elevenlabs.io/hackathons/4
- Rules: https://hacks.elevenlabs.io/terms

## Recommended Kiro Workflow

1. Open the repo in Kiro or use Kiro CLI.
2. Install the ElevenLabs Kiro Power.
3. Start with one of the specs in `specs/` or `kiro-specs/`.
4. Ask Kiro to implement one narrow improvement at a time.
5. Review the generated code and test the app.
6. Record the spec -> implementation -> working feature flow for the demo.

## Best Spec Files To Start From

- `specs/game-loop.md`
- `specs/audio.md`
- `specs/ui.md`
- `kiro-specs/voice-emotion-system.md`
- `kiro-implementation/emotion-voice-spec.md`

## Best Kiro Tasks For Judges

These are strong because they are visible in the demo and clearly connected to specs:

1. Tighten voice identity without breaking assigned characters.
2. Improve debate pacing so text and speech feel synchronized.
3. Refine the mission result screen into a clearer cinematic payoff.
4. Improve scenario-to-selection continuity and transitions.
5. Add stronger fallback handling for voice failures.

## How To Use Kiro CLI

If Kiro CLI is already installed and logged in:

```powershell
cmd /c run-kiro.bat
```

If you need to verify login:

```powershell
& 'C:\Users\rashm\AppData\Local\Kiro-Cli\kiro-cli.exe' profile
```

## What To Show In The Demo

- the spec file
- Kiro reading the spec
- Kiro making the change
- the game running with the new behavior

That sequence is what makes the Kiro usage legible to judges.
