import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookClub',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['books_read', 'pages_read', 'specific_book'],
    required: true
  },
  targetValue: {
    type: Number, // e.g., 5 books, 500 pages
    default: 1
  },
  targetBookId: {
    type: String, // Open Library ID if targetType is specific_book
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    completedAt: { type: Date, default: null }
  }]
}, { timestamps: true });

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
