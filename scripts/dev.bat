@echo off
REM NIT Goa Development Server Startup Script for Windows
REM This script cleans up ports and starts both frontend and backend servers

setlocal enabledelayedexpansion

REM Get command line argument
set "command=%1"
if "%command%"=="" set "command=start"

echo ================================
echo    NIT Goa Development Server   
echo ================================

REM Handle different commands
if /i "%command%"=="help" goto show_help
if /i "%command%"=="-h" goto show_help
if /i "%command%"=="--help" goto show_help
if /i "%command%"=="stop" goto stop_servers
if /i "%command%"=="clean" goto cleanup_only
if /i "%command%"=="install" goto install_deps
if /i "%command%"=="client" goto start_client_only
if /i "%command%"=="server" goto start_server_only
if /i "%command%"=="start" goto start_both
if /i "%command%"=="dev" goto start_both
goto start_both

:cleanup_ports
echo [INFO] Cleaning up ports...
REM Kill processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
REM Kill processes on port 3001  
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| find ":3001" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
echo [SUCCESS] Ports 3000 and 3001 are now available
goto :eof

:check_dependencies
echo [INFO] Checking dependencies...
if not exist "node_modules" (
    echo [WARNING] Root dependencies not found. Installing...
    call npm install
)
if not exist "client\node_modules" (
    echo [WARNING] Client dependencies not found. Installing...
    cd client
    call npm install
    cd ..
)
if not exist "server\node_modules" (
    echo [WARNING] Server dependencies not found. Installing...
    cd server
    call npm install
    cd ..
)
echo [SUCCESS] All dependencies are installed
goto :eof

:start_both
call :cleanup_ports
call :check_dependencies
echo [INFO] Starting development servers...
echo [INFO] Backend server: http://localhost:3001
echo [INFO] Frontend server: http://localhost:3000
echo [INFO] Press Ctrl+C to stop both servers
call npx concurrently --names "BACKEND,FRONTEND" --prefix-colors "red,blue" --kill-others "cd server && npm run dev" "cd client && npm start"
goto end

:start_client_only
call :cleanup_ports
echo [INFO] Starting frontend server only...
echo [INFO] Frontend server: http://localhost:3000
echo [INFO] Press Ctrl+C to stop the server
cd client
call npm start
cd ..
goto end

:start_server_only
call :cleanup_ports
echo [INFO] Starting backend server only...
echo [INFO] Backend server: http://localhost:3001
echo [INFO] Press Ctrl+C to stop the server
cd server
call npm run dev
cd ..
goto end

:stop_servers
echo [INFO] Stopping all development servers...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| find ":3001" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
echo [SUCCESS] All development servers stopped
goto end

:cleanup_only
call :cleanup_ports
goto end

:install_deps
echo [INFO] Installing all dependencies...
call npm run install-all
echo [SUCCESS] All dependencies installed
goto end

:show_help
echo Usage: %0 [OPTION]
echo.
echo Options:
echo   start, dev    Start both frontend and backend servers (default)
echo   stop          Stop all development servers
echo   client        Start only frontend server
echo   server        Start only backend server
echo   install       Install all dependencies
echo   clean         Clean up ports only
echo   help          Display this help message
echo.
echo Examples:
echo   %0              # Start both servers
echo   %0 start        # Start both servers
echo   %0 client       # Start only frontend
echo   %0 server       # Start only backend
echo   %0 stop         # Stop all servers
goto end

:end
if /i "%command%"=="help" goto skip_pause
if /i "%command%"=="-h" goto skip_pause
if /i "%command%"=="--help" goto skip_pause
if /i "%command%"=="stop" goto skip_pause
if /i "%command%"=="clean" goto skip_pause
if /i "%command%"=="install" goto skip_pause
pause

:skip_pause
