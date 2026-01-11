#!/bin/bash
# =============================================================================
# Configure Render Environment Variables
# =============================================================================
# This script helps you configure Render services after deployment
# =============================================================================

echo ""
echo "🔧 ═══════════════════════════════════════════════"
echo "   CONFIGURE RENDER ENVIRONMENT VARIABLES"
echo "═══════════════════════════════════════════════════"
echo ""

echo "📋 Step 1: Get Your Service URLs"
echo ""
echo "   1. Go to: https://dashboard.render.com"
echo "   2. Click on 'simon-game-backend' service"
echo "   3. Copy the URL (e.g., https://simon-game-backend-xxx.onrender.com)"
echo "   4. Click on 'simon-game-frontend' service"
echo "   5. Copy the URL (e.g., https://simon-game-frontend-xxx.onrender.com)"
echo ""

read -p "   Enter Backend URL: " BACKEND_URL
read -p "   Enter Frontend URL: " FRONTEND_URL

echo ""
echo "📝 Configuration:"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo ""

# Convert https to wss for WebSocket
WEBSOCKET_URL=$(echo "$BACKEND_URL" | sed 's|https://|wss://|')

echo "🔧 Environment Variables to Set:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   BACKEND SERVICE (simon-game-backend):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   FRONTEND_URL = $FRONTEND_URL"
echo "   (NODE_ENV, PORT, JWT_SECRET should already be set)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   FRONTEND SERVICE (simon-game-frontend):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   VITE_API_URL = $BACKEND_URL"
echo "   VITE_SOCKET_URL = $WEBSOCKET_URL"
echo ""

echo "📝 Instructions:"
echo "   1. Go to Render Dashboard"
echo "   2. Open 'simon-game-backend' → Environment tab"
echo "   3. Add/Update FRONTEND_URL = $FRONTEND_URL"
echo "   4. Open 'simon-game-frontend' → Environment tab"
echo "   5. Add VITE_API_URL = $BACKEND_URL"
echo "   6. Add VITE_SOCKET_URL = $WEBSOCKET_URL"
echo "   7. Save changes (services will auto-redeploy)"
echo ""

echo "✅ After redeployment, your app will be live at:"
echo "   $FRONTEND_URL"
echo ""


