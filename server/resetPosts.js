const mongoose = require('mongoose');
const Post = require('./models/Post');
require('dotenv').config();

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...");

        // 1. Completely drop the posts collection
        await mongoose.connection.db.dropCollection('posts');
        console.log("Posts collection deleted entirely.");

        // 2. Re-sync the model to recreate the collection and indexes
        await Post.init();
        console.log("Collection recreated with fresh indexes.");

        process.exit(0);
    } catch (error) {
        console.log("Collection was already empty or error occurred:", error.message);
        process.exit(1);
    }
};

reset();