// backend/seedCategories.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// IMPORTANT: Adjust the path below to your actual Category model file
import Category from './models/Category.js'; 

dotenv.config();

const categories = [
  { name: 'Blog' }, // 🌟 Moved to first position
  { name: 'Business' },
  { name: 'Tech' },
  { name: 'Education' },
  { name: 'Opportunities' },
  { name: 'Lifestyle' }
];

const seedDB = async () => {
  try {
    // Uses MONGO_URI from your .env file
    const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_database_name';
    
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB for seeding...");

    console.log("Seeding categories...");

    // We use findOneAndUpdate with 'upsert: true' so it creates the category if it doesn't exist
    // and updates it if it does (preventing duplicates).
    for (const cat of categories) {
        await Category.findOneAndUpdate(
            { name: cat.name }, 
            cat, 
            { upsert: true, new: true }
        );
    }

    console.log("✅ Categories seeded successfully!");
    console.log("List: Blog, Business, Tech, Education, Opportunities, Lifestyle");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();