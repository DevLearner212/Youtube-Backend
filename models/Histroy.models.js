 
import mongoose from 'mongoose';
const historySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    watchedAt: { type: Date, default: Date.now }
});

export const History = mongoose.model('History', historySchema);
