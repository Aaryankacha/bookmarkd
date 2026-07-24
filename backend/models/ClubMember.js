import mongoose from 'mongoose';

const clubMemberSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookClub',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['member', 'moderator', 'admin'],
    default: 'member'
  }
}, { timestamps: true });

clubMemberSchema.index({ club: 1, user: 1 }, { unique: true });

const ClubMember = mongoose.model('ClubMember', clubMemberSchema);
export default ClubMember;
