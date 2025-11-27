import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 

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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- Mongoose Middleware: Hash Password Before Saving ---
// FINAL FIX: Return the promise chain. Mongoose handles the success/error flow automatically.
UserSchema.pre('save', function() { 
    // If password hasn't changed, skip hashing and return a resolved promise.
    if (!this.isModified('password')) {
        return Promise.resolve(); 
    }
    
    // Hash the password using the promise chain and RETURN it.
    return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(this.password, salt))
        .then(hash => {
            this.password = hash;
        });
    // Note: No explicit 'next()' is needed. Mongoose takes the returned promise
    // and calls 'next' when it resolves, or 'next(err)' when it rejects.
});

// --- Method to compare passwords (for login) ---
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);