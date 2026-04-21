@echo off
setlocal
set "KIRO_EXE=%LOCALAPPDATA%\Kiro-Cli\kiro-cli.exe"

if not exist "%KIRO_EXE%" (
  echo Kiro CLI not found at %KIRO_EXE%
  echo Install it first with:
  echo irm "https://cli.kiro.dev/install.ps1" ^| iex
  exit /b 1
)

echo Archive Protocol Kiro runner
"%KIRO_EXE%" chat --no-interactive --trust-all-tools "Use kiro-implementation/emotion-voice-spec.md to improve this ElevenLabs app."
