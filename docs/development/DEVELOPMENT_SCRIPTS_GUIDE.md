# Development Scripts Guide

This document explains how to use the various development scripts available for the NIT Goa project.

## Quick Start

### Using NPM Scripts (Recommended)

```bash
# Start both frontend and backend with port cleanup
npm run dev

# Or alternatively
npm start
```

### Using Shell Script (Advanced)

```bash
# Start both servers
./scripts/dev.sh

# Start only frontend
./scripts/dev.sh client

# Start only backend  
./scripts/dev.sh server

# Stop all servers
./scripts/dev.sh stop
```

### Using Windows Batch Script

```cmd
# Double-click or run from command prompt
scripts\dev.bat
```

## Available NPM Scripts

### Development Scripts
- `npm run dev` - **Main development command** - Cleans ports and starts both servers
- `npm start` - Alias for `npm run dev`
- `npm run dev-client` - Start only frontend server (port 3000)
- `npm run dev-server` - Start only backend server (port 3001)

### Installation Scripts
- `npm run install-all` - Install dependencies for root, client, and server
- `npm run install-client` - Install only frontend dependencies
- `npm run install-server` - Install only backend dependencies

### Utility Scripts
- `npm run cleanup-ports` - Clean up ports 3000 and 3001
- `npm run stop` - Stop all development servers
- `npm run build` - Build frontend for production
- `npm run deploy` - Build and deploy to Firebase

### Testing Scripts
- `npm test` - Run all tests (frontend + backend)
- `npm run test-client` - Run only frontend tests
- `npm run test-server` - Run only backend tests

### Code Quality Scripts
- `npm run lint` - Run linting for both frontend and backend
- `npm run lint-client` - Run linting for frontend only
- `npm run lint-server` - Run linting for backend only

## Shell Script Features

The `./scripts/dev.sh` script provides additional features:

### Commands
- `./scripts/dev.sh` or `./scripts/dev.sh start` - Start both servers
- `./scripts/dev.sh client` - Start only frontend
- `./scripts/dev.sh server` - Start only backend
- `./scripts/dev.sh stop` - Stop all servers
- `./scripts/dev.sh install` - Install all dependencies
- `./scripts/dev.sh clean` - Clean up ports only
- `./scripts/dev.sh help` - Show help message

### Features
- ✅ **Colored output** for better readability
- ✅ **Port conflict resolution** - Automatically kills processes on ports 3000/3001
- ✅ **Dependency checking** - Installs missing dependencies automatically
- ✅ **Error handling** - Graceful error messages and recovery
- ✅ **Status messages** - Clear feedback on what's happening

## Port Configuration

- **Frontend (React)**: http://localhost:3000
- **Backend (Express)**: http://localhost:3001
- **API Proxy**: Frontend requests to `/api/*` are proxied to backend

## Troubleshooting

### Port Already in Use
Both npm scripts and shell script automatically handle port conflicts by killing existing processes.

Manual cleanup:
```bash
# Kill processes on ports 3000 and 3001
npm run cleanup-ports

# Or manually
lsof -ti:3000,3001 | xargs kill -9
```

### Dependencies Missing
```bash
# Install all dependencies
npm run install-all

# Or use the shell script
./scripts/dev.sh install
```

### Permission Denied (macOS/Linux)
```bash
# Make shell script executable
chmod +x scripts/dev.sh
```

## Development Workflow

1. **First time setup**:
   ```bash
   git clone <repository>
   cd nitgoa
   npm run install-all
   ```

2. **Daily development**:
   ```bash
   npm run dev
   # Both servers start automatically
   # Frontend: http://localhost:3000
   # Backend: http://localhost:3001
   ```

3. **Stop servers**:
   ```bash
   # Press Ctrl+C in terminal, or
   npm run stop
   ```

4. **Individual server development**:
   ```bash
   # Frontend only
   npm run dev-client
   
   # Backend only
   npm run dev-server
   ```

## Windows Users

Use the batch script for a Windows-friendly experience:
```cmd
# Navigate to project directory
cd path\to\nitgoa

# Run the batch script
scripts\dev.bat
```

The batch script provides:
- Automatic port cleanup
- Dependency checking
- Both servers started simultaneously

## Tips

1. **Use `npm run dev`** for most development work
2. **Use shell script** for more control and better output
3. **Use individual scripts** when debugging specific parts
4. **Always run from project root** directory
5. **Check console output** for any error messages
