@echo off
echo === Faculty Data Migration Script ===
echo This script will:
echo 1. Drop existing faculty data
echo 2. Update database schema
echo 3. Migrate all faculty data from JSON files
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is required but not installed.
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting migration...
python migrate_faculty_data.py

echo.
echo Migration completed!
echo You can now access the faculty data through your application.
pause
