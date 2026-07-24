import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, { timestamps: true });

// Ensure user1 < user2 to prevent duplicate A-B and B-A entries
friendSchema.pre('save', function(next) {
  if (this.user1.toString() > this.user2.toString()) {
    const temp = this.user1;
    this.user1 = this.user2;
    this.user2 = temp;
  }
  next();
});

friendSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Friend = mongoose.model('Friend', friendSchema);
export default Friend;
