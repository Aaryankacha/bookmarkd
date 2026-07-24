import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'like', 'reply', 'comment', 'follow', 
      'friend_request', 'friend_accept', 
      'buddy_invite', 'club_invite', 'club_mention'
    ],
    required: true
  },
  openLibraryId: {
    type: String // To allow navigation to the book page
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId, // Can be Review or Comment
    required: false
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
