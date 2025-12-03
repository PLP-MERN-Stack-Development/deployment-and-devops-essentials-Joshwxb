import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import commentRoutes from './routes/commentRoutes.js'; 
import errorHandler from './middleware/errorHandler.js'; 

// --- Application Setup ---
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- CORS Configuration (The essential fix) ---
const allowedOrigins = [
    // 1. VERCEL FRONTEND DOMAIN 
    'https://weblogx.vercel.app', 
    // 2. The Render URL
    'https://weblog-yas1.onrender.com', 
    // 3. Localhost for development
    'http://localhost:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
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
app.use(cors(corsOptions)); // <-- USING EXPLICIT OPTIONS HERE
app.use(express.json()); // Allows the server to accept JSON data in the request body

// --- API Routes ---
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/comments', commentRoutes); 

// --- MongoDB Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {});
        console.log('✅ MongoDB connected successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// --- Define Test Route ---
app.get('/', (req, res) => {
    res.status(200).json({ message: 'MERN Blog API is running!' });
});

// --- Error Handling Middleware (MUST BE LAST MIDDLEWARE BEFORE START SERVER) ---
app.use(errorHandler); 

// --- Start Server ---
const startServer = async () => {
    // 1. Connect to the Database
    await connectDB();

    // 2. Start the Express server
    app.listen(PORT, () => {
        console.log(`📡 Server listening on http://localhost:${PORT}`);
    });
};

startServer();
