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

// --- CORS Configuration ---
const allowedOrigins = [
    // This URL is for your Vercel frontend.
    process.env.CLIENT_URL, // Use the variable from .env
    'http://localhost:5173', 
    // Allow all render domains for flexibility
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow whitelisted origins OR any origin ending with .onrender.com
        if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.onrender.com'))) {
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

// --- API Routes ---
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/comments', commentRoutes); 

// --- MongoDB Connection ---
const connectDB = async () => {
    try {
        // FIXED: Using the standard MONGO_URI variable now.
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('✅ MongoDB connected successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// --- Define Test Route (Used for health checks or API testing) ---
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'MERN Blog API is running!' });
});

// --- Error Handling Middleware (MUST BE LAST MIDDLEWARE BEFORE START SERVER) ---
app.use(errorHandler); 

// --- Start Server ---
const startServer = async () => {
    // Check for MONGO_URI before attempting connection
    if (!process.env.MONGO_URI) {
        console.error("❌ Fatal Error: MONGO_URI environment variable is missing.");
        console.error("Please ensure your .env file is in the root directory and MONGO_URI is defined.");
        process.exit(1);
    }
    
    // 1. Connect to the Database
    await connectDB();

    // 2. Start the Express server, binding explicitly to 0.0.0.0
    const HOST = '0.0.0.0'; 
    app.listen(PORT, HOST, () => {
        console.log(`📡 Server listening on http://${HOST}:${PORT}`);
        console.log(`Node Environment: ${process.env.NODE_ENV}`);
    });
};

startServer();