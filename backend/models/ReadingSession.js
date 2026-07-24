import mongoose from 'mongoose';

const readingSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  openLibraryId: {
    type: String,
    required: true,
    index: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'Reading', 'Paused', 'Finished'],
    default: 'active'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  durationInSeconds: {
    type: Number,
    default: 0
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  chat: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const ReadingSession = mongoose.model('ReadingSession', readingSessionSchema);
export default ReadingSession;
