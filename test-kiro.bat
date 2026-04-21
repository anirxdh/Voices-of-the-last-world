@echo off
REM Quick test to verify Kiro setup
setlocal
set "KIRO_EXE=%LOCALAPPDATA%\Kiro-Cli\kiro-cli.exe"

echo Testing Kiro Setup
echo.

if "%KIRO_API_KEY%"=="" (
  echo KIRO_API_KEY is NOT set
  echo.
  echo PowerShell: $env:KIRO_API_KEY = "ksk_your_key_here"
  echo CMD:        set KIRO_API_KEY=ksk_your_key_here
  exit /b 1
)

echo KIRO_API_KEY is set
echo Value: %KIRO_API_KEY:~0,10%...
echo.

if not exist "%KIRO_EXE%" (
  echo Official Kiro CLI not found
  exit /b 1
)

"%KIRO_EXE%" --version
if errorlevel 1 (
  echo Kiro CLI executable is not runnable
  exit /b 1
)

"%KIRO_EXE%" profile >nul 2>&1
if errorlevel 1 (
  echo Kiro CLI installed, but not logged in
  echo Run: "%KIRO_EXE%" login --use-device-flow
  exit /b 1
)

echo Kiro CLI is installed and logged in
echo You're ready to run: run-kiro.bat
