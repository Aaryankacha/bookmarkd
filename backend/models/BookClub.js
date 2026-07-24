import mongoose from 'mongoose';

const bookClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  rules: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const BookClub = mongoose.model('BookClub', bookClubSchema);
export default BookClub;
