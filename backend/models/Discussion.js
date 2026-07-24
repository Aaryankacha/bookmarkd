import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookClub',
    required: true,
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  likesCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;
