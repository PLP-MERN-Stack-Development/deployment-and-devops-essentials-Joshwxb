const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');
require('dotenv').config();

const fix = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Find your main user account
    const mainUser = await User.findOne({}); 
    
    if (!mainUser) {
        console.log("No user found in database. Please register an account first.");
        process.exit();
    }

    // 2. Attach all existing posts to this user
    const result = await Post.updateMany(
        {}, 
        { $set: { user: mainUser._id } }
    );

    console.log(`Updated ${result.modifiedCount} posts to belong to: ${mainUser.username}`);
    process.exit();
};

fix();