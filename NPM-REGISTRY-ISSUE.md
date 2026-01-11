# 🔧 NPM Registry Issue - Troubleshooting Guide

## Problem
The Wix internal npm registry (`http://npm.dev.wixpress.com`) is blocking packages that are less than 14 days old due to security policies.

**Blocked packages:**
- `vite@7.3.1` (4 days old)
- `webidl-conversions@8.0.1` (9 days old)
- `rollup@4.55.1` (6 days old)
- `supertest@7.2.2` (5 days old)
- `superagent@10.3.0` (5 days old)
- And several others...

## Solutions

### Option 1: Wait for Packages to Age (Easiest)
Wait 5-10 more days for the packages to reach 14+ days old, then run:
```bash
npm install
```

### Option 2: Use Older Package Versions
Update `package.json` to use older versions that are already 14+ days old.

### Option 3: Request Exception from Wix IT
Contact your Wix IT team to request an exception for these specific packages.

### Option 4: Use Different Network/VPN
- Connect to a network that allows npm registry access
- Use a VPN that bypasses Wix registry restrictions
- Use a personal network connection

### Option 5: Use Public NPM Registry (If Network Allows)
If your network allows access to the public npm registry:
```bash
npm config set registry https://registry.npmjs.org/
npm install --legacy-peer-deps
```

### Option 6: Copy node_modules from Another Machine
If you have access to another machine with dependencies installed:
1. Copy `node_modules` folder from root directory
2. Copy `frontend/node_modules` folder
3. Run `npm run dev`

## Current Status
- ✅ `package-lock.json` files exist (dependencies were installed before)
- ❌ Network connectivity to npm registries is blocked
- ❌ Wix registry security policy blocking new packages

## Next Steps
1. Check with your IT team about npm registry access
2. Try connecting from a different network
3. Wait for packages to age (recommended if not urgent)
4. Request package version exceptions from Wix security team


