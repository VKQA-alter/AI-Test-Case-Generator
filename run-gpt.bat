@echo off
REM AI Test Case Generator - Windows GPT Run Script
REM This script runs the application using OpenAI GPT

echo ========================================
echo   AI Test Case Generator - GPT Mode
echo ========================================
echo.

REM Check if API key is set
if "%OPENAI_API_KEY%"=="" (
    echo ERROR: OPENAI_API_KEY environment variable is not set
    echo.
    echo Please set your API key first:
    echo   set OPENAI_API_KEY=sk-your-api-key-here
    echo.
    echo Or edit this script and add your API key directly.
    pause
    exit /b 1
)

REM Configuration - Edit these values if needed
set API_URL=https://api.openai.com/v1/chat/completions
set MODEL=gpt-4

REM Uncomment for GPT-3.5-turbo (faster and cheaper):
REM set MODEL=gpt-3.5-turbo

echo Configuration:
echo   API URL: %API_URL%
echo   Model: %MODEL%
echo   API Key: %OPENAI_API_KEY:~0,8%****
echo.

REM Build if JAR doesn't exist
if not exist "target\ai-test-case-generator-1.0.0.jar" (
    echo Building project...
    call mvn clean package -q
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Build failed
        pause
        exit /b 1
    )
)

REM Run the application
echo Running with OpenAI GPT...
echo.
java -jar target/ai-test-case-generator-1.0.0.jar ^
  --api-url=%API_URL% ^
  --model=%MODEL% ^
  --api-key=%OPENAI_API_KEY% ^
  %*

echo.
echo ========================================
echo   Execution Complete
echo ========================================
pause
