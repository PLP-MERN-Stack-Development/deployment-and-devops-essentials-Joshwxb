const mongoose = require('mongoose');
const Post = require('./models/Post');
require('dotenv').config();

const cleanDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for cleanup...");

        // Find and delete posts where the user field is null or doesn't match an ID
        // This targets the "Anonymous" posts you see on the screen
        const result = await Post.deleteMany({
            $or: [
                { user: { $exists: false } },
                { user: null }
            ]
        });

        console.log(`Successfully deleted ${result.deletedCount} orphaned posts.`);
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
};

cleanDatabase();