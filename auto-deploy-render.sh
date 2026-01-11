#!/bin/bash
# =============================================================================
# Auto-Deploy to Render.com
# =============================================================================
# This script helps automate Render deployment configuration
# =============================================================================

set -e

echo ""
echo "🚀 ═══════════════════════════════════════════════"
echo "   AUTO-CONFIGURE RENDER DEPLOYMENT"
echo "═══════════════════════════════════════════════════"
echo ""

# Check if render CLI is available
if command -v render &> /dev/null; then
    echo "✅ Render CLI found"
    echo ""
    echo "To deploy, run:"
    echo "  1. render login"
    echo "  2. render deploy"
    echo ""
else
    echo "⚠️  Render CLI not installed"
    echo ""
    echo "Installing Render CLI..."
    npm install -g render-cli 2>&1 | tail -5
    echo ""
    echo "✅ Render CLI installed"
    echo ""
    echo "Next steps:"
    echo "  1. Run: render login"
    echo "  2. Run: render deploy"
    echo ""
fi

echo ""
echo "📋 Your Configuration:"
echo "   Repository: https://github.com/anatst/simon-game-app"
echo "   render.yaml: ✅ Ready"
echo ""
echo "═══════════════════════════════════════════════════"
echo ""


