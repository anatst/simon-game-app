# 🚀 Deploy to Render.com - Step by Step

Your `render.yaml` is ready! Follow these steps to deploy:

## Option 1: Using Render Dashboard (Recommended)

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Sign in or create an account

### Step 2: Create Blueprint from Repository
1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub account if prompted
3. Select repository: **`anatst/simon-game-app`**
4. Render will automatically detect `render.yaml`
5. Click **"Apply"**

### Step 3: Configure Environment Variables

After services are created, you'll need to set environment variables:

#### Backend Service (`simon-game-backend`):
1. Go to the service dashboard
2. Click **"Environment"** tab
3. Set:
   - `FRONTEND_URL` = `https://simon-game-frontend.onrender.com` (update after frontend deploys)
   - `JWT_SECRET` = (auto-generated, or set a secure random string)
   - `NODE_ENV` = `production` (already set)
   - `PORT` = `10000` (already set)

#### Frontend Service (`simon-game-frontend`):
1. Go to the service dashboard
2. Click **"Environment"** tab
3. Set:
   - `VITE_API_URL` = `https://simon-game-backend.onrender.com`
   - `VITE_SOCKET_URL` = `wss://simon-game-backend.onrender.com`

### Step 4: Update Backend FRONTEND_URL
After frontend deploys and you have its URL:
1. Go back to backend service
2. Update `FRONTEND_URL` to the actual frontend URL
3. Service will auto-redeploy

## Option 2: Using Render CLI

If you have Render CLI installed:

```bash
# Install Render CLI (if not installed)
npm install -g render-cli

# Login
render login

# Deploy from render.yaml
render deploy
```

## Your Repository
- **GitHub**: https://github.com/anatst/simon-game-app
- **render.yaml**: Already configured ✅

## Expected Services

1. **simon-game-backend** (Web Service)
   - Runtime: Node.js
   - Port: 10000
   - Health Check: /health

2. **simon-game-frontend** (Static Site)
   - Build: `cd frontend && npm install && npm run build`
   - Output: `frontend/dist`

## After Deployment

1. Get your service URLs from Render dashboard
2. Update environment variables as described above
3. Test your app at the frontend URL!


