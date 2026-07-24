import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: [
      'reviewed', 'commented', 'liked', 
      'started_reading', 'finished_reading', 'rated',
      'followed', 'became_friends', 'joined_club', 
      'created_discussion', 'started_session'
    ],
    required: true
  },
  openLibraryId: {
    type: String,
    required: false, // Not required for all activities (e.g. followed user)
    index: true 
  },
  bookTitle: {
    type: String,
    required: false
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    // Can point to Review or Comment depending on the action
    required: false
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {} // e.g. { rating: 5 } or { text: 'Great book!' }
  }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
