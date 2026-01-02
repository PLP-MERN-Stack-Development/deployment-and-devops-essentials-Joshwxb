# 🚀 Digital MERN Blog Platform

A high-performance, full-stack content sharing platform. Users can create accounts, publish articles, engage with content through comments, and manage their professional profiles.

## 🌐 Live Application
**Frontend URL:** [https://weblogn.vercel.app/](https://weblogn.vercel.app/)

---

## ✨ Features
- **User Authentication:** Secure Login and Registration using JWT.
- **Content Management:** Full CRUD for blog posts.
- **Interactive Engagement:** Real-time commenting system.
- **User Profiles:** Customizable settings and public profile views.
- **Analytics & Ads:** Meta Pixel (ID: 1549070872910843) and Google AdSense integrated.

---

## 🌐 Deployment Architecture

The application is split into two specialized hosting environments to maximize performance and cost-efficiency:

### 🎨 Frontend (Client)
- **Hosted on:** [Vercel](https://vercel.com)
- **Live URL:** `https://weblogn.vercel.app/`
- **Technology:** React.js + Vite
- **Environment Variables:** `VITE_BACKEND_URL` (points to the Render API).

### ⚙️ Backend (API)
- **Hosted on:** [Render](https://render.com)
- **Technology:** Node.js + Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Environment Variables:** `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`.



---

## 🚀 Setup & Installation

### Backend (Render)
1. Connect GitHub repo to Render.
2. Build Command: `npm install`
3. Start Command: `node server.js`

### Frontend (Vercel)
1. Connect GitHub repo to Vercel.
2. Select the `client` folder as the Root Directory.
3. Build Command: `npm run build`
4. Output Directory: `dist`

---

## 📊 Analytics Tracking
This project uses a hybrid tracking approach:
1. **Base Code:** In `index.html` for initial script loading.
2. **Route Tracking:** A `useEffect` hook in `App.jsx` listens to `useLocation()` to fire `PageView` events on every SPA navigation change.

---

## 🔧 Local Development Troubleshooting
- **CORS Errors:** Ensure `https://weblogn.vercel.app` is allowed in your backend `server.js` CORS configuration.

---

&copy; 2026 Digital Content Platform. All Rights Reserved.
