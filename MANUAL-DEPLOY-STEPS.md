# 🚀 Manual Render Deployment - Step by Step

Since Render MCP requires workspace setup, here's the exact manual process:

## Step 1: Go to Render Dashboard

1. Open: https://dashboard.render.com
2. Sign in (or create account if needed)

## Step 2: Create Backend Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Connect your GitHub account (if not already connected)
4. Select repository: **`anatst/simon-game-app`**
5. Configure:
   - **Name:** `simon-game-backend`
   - **Region:** `Oregon` (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Starter` (free tier)
6. Click **"Advanced"** → Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `JWT_SECRET` = (click "Generate" or leave for Render to generate)
   - `FRONTEND_URL` = (leave empty for now, we'll set after frontend deploys)
7. Click **"Create Web Service"**

## Step 3: Create Frontend Static Site

1. Click **"New +"** (top right)
2. Select **"Static Site"**
3. Select repository: **`anatst/simon-game-app`**
4. Configure:
   - **Name:** `simon-game-frontend`
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Plan:** `Free` (static sites are free)
5. Click **"Advanced"** → Add Environment Variables:
   - `VITE_API_URL` = (leave empty for now)
   - `VITE_SOCKET_URL` = (leave empty for now)
6. Click **"Create Static Site"**

## Step 4: Wait for Initial Deployment

- Backend: 5-10 minutes (building TypeScript, installing deps)
- Frontend: 3-5 minutes (building React app)

## Step 5: Get Service URLs

After both services show "Live":

1. **Backend URL:**
   - Open `simon-game-backend` service
   - Copy the URL (e.g., `https://simon-game-backend-xxx.onrender.com`)

2. **Frontend URL:**
   - Open `simon-game-frontend` service
   - Copy the URL (e.g., `https://simon-game-frontend-xxx.onrender.com`)

## Step 6: Configure Environment Variables

### Backend Service:

1. Open `simon-game-backend` → **"Environment"** tab
2. Update `FRONTEND_URL` = (your frontend URL from Step 5)
3. Click **"Save Changes"**

### Frontend Service:

1. Open `simon-game-frontend` → **"Environment"** tab
2. Update `VITE_API_URL` = (your backend URL from Step 5)
3. Update `VITE_SOCKET_URL` = (your backend URL, but use `wss://` instead of `https://`)
   - Example: If backend is `https://simon-game-backend-xxx.onrender.com`
   - Use: `wss://simon-game-backend-xxx.onrender.com`
4. Click **"Save Changes"**

## Step 7: Wait for Redeploy

- Both services will automatically redeploy (2-3 minutes)
- Wait until both show "Live" again

## Step 8: Test Your App! 🎉

1. Open your frontend URL in a browser
2. Create a game
3. Share with friends!

---

## 🔍 Troubleshooting

**If backend build fails:**
- Check build logs in Render dashboard
- Verify `tsc-alias` is in `dependencies` (not `devDependencies`)
- Check that TypeScript compiles: `npm run build` locally

**If services don't connect:**
- Verify environment variables are set correctly
- Check URLs use `https://` (not `http://`)
- WebSocket must use `wss://` (not `https://`)

**Test backend health:**
- Visit: `https://your-backend-url.onrender.com/health`
- Should return: `{"status":"ok",...}`


