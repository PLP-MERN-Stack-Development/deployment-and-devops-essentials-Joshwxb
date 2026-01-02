# 🚀 Deployment Guide: Weblog MERN Stack

This document outlines the production setup for the **mern blog** application. The project is architecture-optimized using a decoupled deployment strategy: **Vercel** for the frontend and **Render** for the backend.

## 🌐 Live URL
**Production Site:** [https://weblogn.vercel.app/](https://weblogn.vercel.app/)

---

## 🛠️ Backend Deployment (Render)

The backend is a Node.js/Express API connected to MongoDB Atlas.

### 1. Configuration
- **Service Type:** Web Service
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `node server.js` (or `npm start`)

### 2. Environment Variables
Add these in the **Environment** tab on Render:
| Variable | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MONGO_URI` | 
| `JWT_SECRET` | 
| `PORT` | `5000` |



---

## 💻 Frontend Deployment (Vercel)

The frontend is a React application built with Vite.

### 1. Configuration
- **Framework Preset:** `Vite`
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 2. Environment Variables
Add these in **Project Settings > Environment Variables** on Vercel:
| Variable | Value |
| :--- | :--- |
| `VITE_BACKEND_URL` | 



---

## 🔗 Cross-Origin Resource Sharing (CORS)

For the frontend at `weblogn.vercel.app` to communicate with the Render API, the backend must allow the origin. Ensure your `server/server.js` contains:

```javascript
const cors = require('cors');
app.use(cors({
  origin: '[https://weblogn.vercel.app](https://weblogn.vercel.app)',
  credentials: true
}));
