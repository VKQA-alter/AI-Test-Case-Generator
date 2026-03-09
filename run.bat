@echo off
REM AI Test Case Generator - Windows Run Script
REM This script builds and runs the application

echo ========================================
echo   AI Test Case Generator
echo   Building and Running...
echo ========================================
echo.

REM Check if Maven is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven from https://maven.apache.org/
    pause
    exit /b 1
)

REM Check if Java is installed
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

REM Build the project
echo [1/2] Building the project...
call mvn clean package -q
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo Build successful!
echo.

REM Run the application
echo [2/2] Running the application...
echo.
java -jar target/ai-test-case-generator-1.0.0.jar %*

echo.
echo ========================================
echo   Execution Complete
echo ========================================
pause
