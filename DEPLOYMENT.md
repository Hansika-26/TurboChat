# Deployment Guide

Since this is a Real-Time Chat Application using **Socket.IO** (WebSockets), it requires a specialized deployment setup. Standard serverless hosting (like Vercel API Routes) does not support persistent WebSocket connections efficiently.

## Recommended Strategy: Split Deployment

- **Frontend**: Deploy to **Vercel** (Excellent for React static sites).
- **Backend**: Deploy to **Render.com** (Excellent support for Node.js services + WebSockets).

---

## Part 1: Deploy Backend (Render)

1.  Push your latest code to GitHub.
2.  Go to [Render.com](https://render.com) and sign up/login.
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  Configure the service:
    - **Root Directory**: `backend` (Important!)
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
6.  **Environment Variables** (Add these in the "Environment" tab):
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A secret key for authentication.
    - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary name.
    - `CLOUDINARY_API_KEY`: Your Cloudinary key.
    - `CLOUDINARY_API_SECRET`: Your Cloudinary secret.
    - `NODE_ENV`: `production`
    - `PORT`: `5001` (Render will override this, but good to have default).

7.  Click **Create Web Service**.
8.  **Wait for deployment**. Once live, Copy the **Service URL** (e.g., `https://turbochat-backend.onrender.com`).

---

## Part 2: Deploy Frontend (Vercel)

1.  Go to [Vercel.com](https://vercel.com) and login.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Important Project Settings**:
    - **Root Directory**: `frontend` (Click Edit and select the `frontend` folder).
    - **Framework Preset**: Vercel should auto-detect "Vite".
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
5.  **Environment Variables**:
    - `VITE_BASE_URL`: Paste your **Render Backend URL** here (e.g., `https://turbochat-backend.onrender.com`).
    - **Note**: Do NOT add `/api` at the end; the code appends it automatically where needed.

6.  Click **Deploy**.

---

## Part 3: CORS Fix (Important!)

Once your Frontend is deployed on Vercel, it will have a URL like `https://turbochat-frontend.vercel.app`.

1.  Go back to **Render** (Backend).
2.  Add/Update the `CORS_ORIGIN` environment variable if your code supports it, OR manually update `backend/src/index.js` to allow the Vercel URL.

```javascript
// backend/src/index.js
app.use(cors({
    origin: ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
    credentials: true
}));
```
