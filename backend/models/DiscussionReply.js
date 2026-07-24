import mongoose from 'mongoose';

const discussionReplySchema = new mongoose.Schema({
  discussion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
    required: true,
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  parentReply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscussionReply',
    default: null
  },
  likesCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const DiscussionReply = mongoose.model('DiscussionReply', discussionReplySchema);
export default DiscussionReply;
