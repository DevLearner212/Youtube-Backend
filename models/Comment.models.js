 
import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
  videoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Video',  // Reference to the Video model
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',   // Reference to the User model
    required: true 
  },
  username: {      // Store the username for quick display
    type: String,
    required: true
  },
  text: {           // Comment content
    type: String,
    required: true
  },
  likes: {          // Number of likes on the comment
    type: Number,
    default: 0
  },
  replies: [{       // Array of replies (nested comments)
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

 
export const  Comment = mongoose.model('Comment', commentSchema);
