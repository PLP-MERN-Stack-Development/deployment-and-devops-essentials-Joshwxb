// models/Category.js
const mongoose = require('mongoose'); // CRITICAL FIX: Use require()

const categorySchema = new mongoose.Schema({
    // Category name is required and must be unique
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot be more than 50 characters']
    },
    // Optional: timestamp for when the category was created/updated
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    // Adds `createdAt` and `updatedAt` fields automatically
    timestamps: true 
});

const Category = mongoose.model('Category', categorySchema);

// ⬅️ CRITICAL FIX: Use CommonJS export
module.exports = Category;