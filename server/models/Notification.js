const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // The user who will receive the notification (e.g., the Post Owner)
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    // The user who triggered the notification (e.g., the person who commented)
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },    
    // The specific post that was interacted with
    post: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    },
    // Type of interaction (comment, like, etc.)
    type: { 
        type: String, 
        default: 'comment' 
    },
    // Tracking if the notification has been seen
    isRead: { 
        type: Boolean, 
        default: false 
    },
    // Timestamp for sorting
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Notification', notificationSchema);