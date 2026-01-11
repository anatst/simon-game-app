# 🚀 Quick Deploy to Render - Final Steps

Since you've already created the Blueprint (Step 2), your services are deploying!

## ✅ Current Status

- ✅ Repository: https://github.com/anatst/simon-game-app
- ✅ Blueprint created on Render
- ✅ Services deploying: `simon-game-backend` and `simon-game-frontend`

## 🎯 What to Do Now

### Step 1: Wait for Deployment (5-10 minutes)

1. Go to: https://dashboard.render.com
2. You should see two services:
   - `simon-game-backend` (Web Service)
   - `simon-game-frontend` (Static Site)
3. Wait until both show **"Live"** status (green)

### Step 2: Get Your Service URLs

1. Click on **`simon-game-backend`**
   - Copy the URL (e.g., `https://simon-game-backend-xxx.onrender.com`)
2. Click on **`simon-game-frontend`**
   - Copy the URL (e.g., `https://simon-game-frontend-xxx.onrender.com`)

### Step 3: Configure Environment Variables

#### Backend Service (`simon-game-backend`):

1. Open the service → Click **"Environment"** tab
2. Add/Update:
   ```
   FRONTEND_URL = https://simon-game-frontend-xxx.onrender.com
   ```
   (Use your actual frontend URL)
3. Click **"Save Changes"**

#### Frontend Service (`simon-game-frontend`):

1. Open the service → Click **"Environment"** tab
2. Add:
   ```
   VITE_API_URL = https://simon-game-backend-xxx.onrender.com
   VITE_SOCKET_URL = wss://simon-game-backend-xxx.onrender.com
   ```
   (Use your actual backend URL, note `wss://` for WebSocket)
3. Click **"Save Changes"**

### Step 4: Wait for Redeploy

- Services will automatically redeploy after you save environment variables
- Wait 2-3 minutes for redeployment to complete

### Step 5: Test Your App! 🎉

1. Open your frontend URL in a browser
2. Create a game
3. Share the link with friends!

## 🔍 Troubleshooting

**If backend fails to build:**
- Check build logs in Render dashboard
- Verify `tsc-alias` is in `dependencies` (not `devDependencies`)

**If services don't connect:**
- Verify environment variables are set correctly
- Check that URLs use `https://` (not `http://`)
- WebSocket URL must use `wss://` (not `https://`)

**Backend health check:**
- Test: `https://your-backend-url.onrender.com/health`
- Should return: `{"status":"ok",...}`

## 📝 Quick Reference

**Backend Environment Variables:**
- `NODE_ENV=production` ✅ (auto-set)
- `PORT=10000` ✅ (auto-set)
- `JWT_SECRET` ✅ (auto-generated)
- `FRONTEND_URL` ⚠️ (you need to set this)

**Frontend Environment Variables:**
- `VITE_API_URL` ⚠️ (you need to set this)
- `VITE_SOCKET_URL` ⚠️ (you need to set this)

---

**Your app will be live once you complete Step 3!** 🚀


