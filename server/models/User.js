const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        maxlength: [30, 'Username cannot be more than 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    // 🎯 NEW PROFILE FIELDS
    profilePicture: {
        type: String,
        default: '' // Will store the URL/Path to the image
    },
    bio: {
        type: String,
        maxlength: [200, 'Bio cannot be more than 200 characters'],
        default: ''
    },
    socials: {
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        tiktok: { type: String, default: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- Mongoose Middleware: Hash Password Before Saving ---
// 🛠️ FIX: Using async/await and passing 'next' for more reliable execution
UserSchema.pre('save', async function(next) { 
    if (!this.isModified('password')) {
        return next(); 
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// --- Method to compare passwords (for login) ---
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// 🎯 CRITICAL: This 'User' string MUST match the 'ref' in Post.js
module.exports = mongoose.model('User', UserSchema);