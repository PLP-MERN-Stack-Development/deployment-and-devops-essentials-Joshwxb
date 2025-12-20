const mongoose = require('mongoose');
const Post = require('./models/Post');
require('dotenv').config();

const nuke = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Wiping all posts...");
    await Post.deleteMany({}); // This clears EVERYTHING in the posts collection
    console.log("Database cleared. Now create a new post via the website.");
    process.exit();
};
nuke();