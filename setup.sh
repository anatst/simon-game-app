#!/bin/bash
# =============================================================================
# Simon Game - Quick Setup Script
# =============================================================================
# Run this script to set up the project for local development.
# Usage: npm run go
# =============================================================================

set -e

# Check if timeout command is available (use gtimeout on macOS if installed via brew)
TIMEOUT_CMD="timeout"
if ! command -v timeout > /dev/null 2>&1; then
  if command -v gtimeout > /dev/null 2>&1; then
    TIMEOUT_CMD="gtimeout"
  else
    echo "   ⚠️  Warning: 'timeout' command not found. Install 'coreutils' for timeout support."
    TIMEOUT_CMD=""
  fi
fi

echo ""
echo "🎮 ═══════════════════════════════════════════════"
echo "   SIMON GAME - SETUP"
echo "═══════════════════════════════════════════════════"
echo ""

# Copy env files
echo "📋 Setting up environment files..."

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "   ✅ Created .env from .env.example"
  else
    echo "   ⚠️  .env.example not found, creating minimal .env"
    cat > .env << EOF
JWT_SECRET=dev-secret-change-in-production
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF
    echo "   ✅ Created minimal .env"
  fi
else
  echo "   ⏭️  .env already exists, skipping"
fi

if [ ! -f frontend/.env ]; then
  if [ -f frontend/.env.example ]; then
    cp frontend/.env.example frontend/.env
    echo "   ✅ Created frontend/.env from frontend/.env.example"
  else
    echo "   ⚠️  frontend/.env.example not found, creating minimal frontend/.env"
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=ws://localhost:3000
EOF
    echo "   ✅ Created minimal frontend/.env"
  fi
else
  echo "   ⏭️  frontend/.env already exists, skipping"
fi

echo ""

# Set npm registry (required for Wix internal network)
echo "🔧 Configuring npm registry..."
npm config set registry http://npm.dev.wixpress.com
echo "   ✅ Registry set to: $(npm config get registry)"

echo ""

# Install dependencies with timeout
echo "📦 Installing backend dependencies..."
echo "   ⏳ This may take a few minutes (timeout: 10 minutes)..."
if [ -n "$TIMEOUT_CMD" ]; then
  if ! $TIMEOUT_CMD 600 npm install --legacy-peer-deps; then
    echo "   ❌ Failed to install backend dependencies (timed out or failed)"
    echo "   💡 Try running manually: npm install --legacy-peer-deps"
    exit 1
  fi
else
  if ! npm install --legacy-peer-deps; then
    echo "   ❌ Failed to install backend dependencies"
    echo "   💡 Try running: npm install --legacy-peer-deps"
    exit 1
  fi
fi

echo ""
echo "📦 Installing frontend dependencies..."
echo "   ⏳ This may take a few minutes (timeout: 10 minutes)..."
cd frontend
if [ -n "$TIMEOUT_CMD" ]; then
  if ! $TIMEOUT_CMD 600 npm install --legacy-peer-deps; then
    echo "   ❌ Failed to install frontend dependencies (timed out or failed)"
    echo "   💡 Try running manually: cd frontend && npm install --legacy-peer-deps"
    cd ..
    exit 1
  fi
else
  if ! npm install --legacy-peer-deps; then
    echo "   ❌ Failed to install frontend dependencies"
    echo "   💡 Try running: cd frontend && npm install --legacy-peer-deps"
    cd ..
    exit 1
  fi
fi
cd ..

echo ""
echo "🚀 Starting servers to verify setup..."
echo ""

# Check if concurrently is installed
if ! command -v concurrently > /dev/null 2>&1 && [ ! -f node_modules/.bin/concurrently ]; then
  echo "   ⚠️  'concurrently' not found. Installing..."
  npm install concurrently --no-save --legacy-peer-deps || {
    echo "   ❌ Failed to install concurrently"
    echo "   💡 Install manually: npm install concurrently --legacy-peer-deps"
    exit 1
  }
fi

# Clean up any existing servers on these ports
if command -v lsof > /dev/null 2>&1; then
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
  lsof -ti:5173 | xargs kill -9 2>/dev/null || true
  sleep 1
fi

# Start servers in background
echo "   ⏳ Starting servers..."
npm run dev > /tmp/simon-setup.log 2>&1 &
SERVER_PID=$!

# Verify the process actually started
sleep 2
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "   ❌ Failed to start servers. Check logs:"
  echo "   📄 cat /tmp/simon-setup.log"
  exit 1
fi

# Wait for servers to start with progressive checks
echo "   ⏳ Waiting for servers to start..."
BACKEND_RUNNING=false
FRONTEND_RUNNING=false

for i in {1..15}; do
  sleep 2
  
  # Check backend with timeout
  if [ "$BACKEND_RUNNING" = false ]; then
    if curl -s --max-time 2 http://localhost:3000/health > /dev/null 2>&1; then
      echo "   ✅ Backend is running on http://localhost:3000"
      BACKEND_RUNNING=true
    fi
  fi
  
  # Check frontend with timeout
  if [ "$FRONTEND_RUNNING" = false ]; then
    if curl -s --max-time 2 http://localhost:5173 > /dev/null 2>&1; then
      echo "   ✅ Frontend is running on http://localhost:5173"
      FRONTEND_RUNNING=true
    fi
  fi
  
  # If both are running, break early
  if [ "$BACKEND_RUNNING" = true ] && [ "$FRONTEND_RUNNING" = true ]; then
    break
  fi
  
  # Show progress every 6 seconds
  if [ $((i % 3)) -eq 0 ]; then
    echo "   ⏳ Still waiting... ($((i * 2))s elapsed)"
  fi
done

if [ "$BACKEND_RUNNING" = false ]; then
  echo "   ⚠️  Backend health check failed (may still be starting)"
fi

if [ "$FRONTEND_RUNNING" = false ]; then
  echo "   ⚠️  Frontend not responding (may still be starting)"
fi

# Kill the servers with timeout protection
echo ""
echo "   🛑 Stopping test servers..."

# Function to kill process safely with timeout
kill_process() {
  local pid=$1
  if kill -0 $pid 2>/dev/null; then
    kill $pid 2>/dev/null || true
    sleep 1
    # Force kill if still running
    if kill -0 $pid 2>/dev/null; then
      kill -9 $pid 2>/dev/null || true
    fi
  fi
}

# Kill main process and children
if kill -0 $SERVER_PID 2>/dev/null; then
  kill_process $SERVER_PID
  
  # Kill child processes with timeout
  if command -v pkill > /dev/null 2>&1; then
    pkill -P $SERVER_PID 2>/dev/null || true
    sleep 1
  fi
fi

# Kill by port as fallback (more reliable) with timeout
if command -v lsof > /dev/null 2>&1; then
  # Use timeout for lsof to prevent hanging
  if [ -n "$TIMEOUT_CMD" ]; then
    $TIMEOUT_CMD 5 sh -c 'lsof -ti:3000 | xargs kill -9 2>/dev/null || true' || true
    $TIMEOUT_CMD 5 sh -c 'lsof -ti:5173 | xargs kill -9 2>/dev/null || true' || true
  else
    lsof -ti:3000 2>/dev/null | head -5 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 2>/dev/null | head -5 | xargs kill -9 2>/dev/null || true
  fi
fi

sleep 1

# Show setup log if there were issues
if [ "$BACKEND_RUNNING" = false ] || [ "$FRONTEND_RUNNING" = false ]; then
  echo ""
  echo "   ⚠️  Some servers didn't start properly. Check logs:"
  echo "   📄 tail -n 50 /tmp/simon-setup.log"
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "   ✅ SETUP COMPLETE - ALL TESTS PASSED!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "   Your app is ready! To start playing:"
echo ""
echo "   1. Run:  npm run dev"
echo "   2. Open: http://localhost:5173"
echo ""
echo "═══════════════════════════════════════════════════"
echo ""
