// server.js
// NOTE: dotenv/config must be run first
require('dotenv/config'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Route Imports ---
const categoryRoutes = require('./routes/categoryRoutes'); 
const postRoutes = require('./routes/postRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const commentRoutes = require('./routes/commentRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes'); 
const userRoutes = require('./routes/userRoutes'); // 🎯 User/Profile routes
const errorHandler = require('./middleware/errorHandler'); 

// --- Application Setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration ---
const allowedStaticOrigins = [
    'https://weblogn.vercel.app', 
    'http://localhost:5173', 
    'https://weblog-6vnn.onrender.com'
];

const corsOptions = {
    origin: function (origin, callback) {
        const isUndefined = !origin;
        const isStaticAllowed = allowedStaticOrigins.includes(origin);
        const isDynamicAllowed = origin && (
             origin.endsWith('.vercel.app') || 
             origin.endsWith('.onrender.com')
        );

        const isAllowed = isUndefined || isStaticAllowed || isDynamicAllowed;

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS rejected origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
};

// --- Middleware ---
app.use(cors(corsOptions)); 
app.use(express.json()); 
// If you ever need to handle standard form-data (non-file), this is helpful:
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/comments', commentRoutes); 
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes); // 🎯 User/Profile routes registered

// --- MongoDB Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('✅ MongoDB connected successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// --- Define Test Route ---
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'MERN Blog API is running!' });
});

// --- Error Handling Middleware (MUST BE LAST) ---
app.use(errorHandler); 

// --- Start Server ---
const startServer = async () => {
    if (!process.env.MONGO_URI) {
        console.error("❌ Fatal Error: MONGO_URI environment variable is missing.");
        process.exit(1);
    }
    
    await connectDB();

    const HOST = '0.0.0.0'; 
    app.listen(PORT, HOST, () => {
        console.log(`📡 Server listening on http://${HOST}:${PORT}`);
    });
};

startServer();