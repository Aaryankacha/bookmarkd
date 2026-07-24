import mongoose from 'mongoose';

const readingBuddySchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bookId: {
    type: String, // Open Library Key
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// Prevent duplicate pending requests for the same users and book
readingBuddySchema.index({ sender: 1, recipient: 1, bookId: 1 }, { unique: true });

const ReadingBuddy = mongoose.model('ReadingBuddy', readingBuddySchema);
export default ReadingBuddy;
