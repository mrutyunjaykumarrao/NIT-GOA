#!/bin/bash

# NIT Goa Development Server Startup Script
# This script cleans up ports and starts both frontend and backend servers

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}   NIT Goa Development Server   ${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill processes on specific ports
cleanup_ports() {
    local ports_to_clean="$1"  # Can be "both", "client", or "server"
    
    case "$ports_to_clean" in
        "both"|"")
            print_status "Cleaning up both ports..."
            
            # Clean up port 3000 (Frontend)
            if check_port 3000; then
                print_warning "Port 3000 is in use, killing processes..."
                lsof -ti:3000 | xargs kill -9 2>/dev/null || true
                sleep 1
            fi
            
            # Clean up port 3001 (Backend)
            if check_port 3001; then
                print_warning "Port 3001 is in use, killing processes..."
                lsof -ti:3001 | xargs kill -9 2>/dev/null || true
                sleep 1
            fi
            
            print_success "Ports 3000 and 3001 are now available"
            ;;
        "client")
            print_status "Cleaning up client port..."
            
            # Clean up port 3000 (Frontend) only
            if check_port 3000; then
                print_warning "Port 3000 is in use, killing processes..."
                lsof -ti:3000 | xargs kill -9 2>/dev/null || true
                sleep 1
            fi
            
            print_success "Port 3000 is now available"
            ;;
        "server")
            print_status "Cleaning up server port..."
            
            # Clean up port 3001 (Backend) only
            if check_port 3001; then
                print_warning "Port 3001 is in use, killing processes..."
                lsof -ti:3001 | xargs kill -9 2>/dev/null || true
                sleep 1
            fi
            
            print_success "Port 3001 is now available"
            ;;
    esac
}

# Function to check if dependencies are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check root node_modules
    if [ ! -d "node_modules" ]; then
        print_warning "Root dependencies not found. Installing..."
        npm install
    fi
    
    # Check client dependencies
    if [ ! -d "client/node_modules" ]; then
        print_warning "Client dependencies not found. Installing..."
        cd client && npm install && cd ..
    fi
    
    # Check server dependencies
    if [ ! -d "server/node_modules" ]; then
        print_warning "Server dependencies not found. Installing..."
        cd server && npm install && cd ..
    fi
    
    print_success "All dependencies are installed"
}

# Function to start development servers
start_servers() {
    print_status "Starting development servers..."
    
    # Check if concurrently is available
    if ! command -v npx >/dev/null 2>&1; then
        print_error "npx is not available. Please install Node.js properly."
        exit 1
    fi
    
    print_status "🚀 Starting backend server on http://localhost:3001"
    print_status "🚀 Starting frontend server on http://localhost:3000"
    print_status "Press Ctrl+C to stop both servers"
    
    # Start both servers using concurrently
    npx concurrently \
        --names "BACKEND,FRONTEND" \
        --prefix-colors "red,blue" \
        --kill-others \
        "cd server && npm run dev" \
        "cd client && npm start"
}

# Function to display help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start, dev    Start both frontend and backend servers (default)"
    echo "  stop          Stop all development servers"
    echo "  client        Start only frontend server"
    echo "  server        Start only backend server"
    echo "  install       Install all dependencies"
    echo "  clean         Clean up ports only"
    echo "  help          Display this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Start both servers"
    echo "  $0 start        # Start both servers"
    echo "  $0 client       # Start only frontend"
    echo "  $0 server       # Start only backend"
    echo "  $0 stop         # Stop all servers"
}

# Main script logic
main() {
    print_header
    
    case "${1:-start}" in
        "start"|"dev"|"")
            cleanup_ports "both"
            check_dependencies
            start_servers
            ;;
        "stop")
            print_status "Stopping all development servers..."
            lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || true
            print_success "All development servers stopped"
            ;;
        "client")
            cleanup_ports "client"
            print_status "Starting frontend server only..."
            cd client && npm start
            ;;
        "server")
            cleanup_ports "server"
            print_status "Starting backend server only..."
            cd server && npm run dev
            ;;
        "install")
            print_status "Installing all dependencies..."
            npm run install-all
            print_success "All dependencies installed"
            ;;
        "clean")
            cleanup_ports "both"
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Please run this script from the root directory of the NIT Goa project"
    exit 1
fi

# Run main function
main "$@"
