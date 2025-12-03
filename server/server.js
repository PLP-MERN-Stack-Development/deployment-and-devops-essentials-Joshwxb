import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js'; // CORRECT: Simple import works after fixing export
import commentRoutes from './routes/commentRoutes.js'; // <-- NEW: Import Comment Routes
import errorHandler from './middleware/errorHandler.js'; 

// --- Application Setup ---
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Allows the server to accept JSON data in the request body

// --- API Routes ---
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/auth', authRoutes); // Use Auth Routes
app.use('/api/comments', commentRoutes); // <-- NEW: Register Comment Routes

// --- MongoDB Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            // Options like useNewUrlParser and useUnifiedTopology are deprecated and no longer needed
        });
        console.log('✅ MongoDB connected successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        // Exit process with failure
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