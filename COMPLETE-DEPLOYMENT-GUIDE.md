# 🚀 Complete Render Deployment - Automated Steps

## ✅ What's Already Done

1. ✅ Repository created: https://github.com/anatst/simon-game-app
2. ✅ Code pushed to GitHub
3. ✅ `render.yaml` configured correctly
4. ✅ Render CLI installed

## 🎯 Next Steps (Automated via CLI)

### Step 1: Authenticate with Render

Run this command in your terminal:

```bash
render login
```

This will:
- Open your browser
- Ask you to authorize Render CLI
- Save your authentication

### Step 2: Deploy Services

After authentication, run:

```bash
render deploy
```

This will:
- Read your `render.yaml`
- Create both services (backend + frontend)
- Start the deployment
- Show you the service URLs

### Step 3: Configure Environment Variables

After deployment completes, you'll get URLs like:
- Backend: `https://simon-game-backend-xxx.onrender.com`
- Frontend: `https://simon-game-frontend-xxx.onrender.com`

Then configure environment variables:

**Backend Service:**
```bash
render env:set FRONTEND_URL=https://simon-game-frontend-xxx.onrender.com --service simon-game-backend
```

**Frontend Service:**
```bash
render env:set VITE_API_URL=https://simon-game-backend-xxx.onrender.com --service simon-game-frontend
render env:set VITE_SOCKET_URL=wss://simon-game-backend-xxx.onrender.com --service simon-game-frontend
```

## Alternative: Manual Dashboard

If CLI doesn't work, use the dashboard:
1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Select `anatst/simon-game-app`
4. Click "Apply"
5. Wait for deployment
6. Configure environment variables in each service

## 🎉 Done!

Your app will be live at the frontend URL!


