import mongoose from 'mongoose';

const bookProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  openLibraryId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String
  },
  coverId: {
    type: String
  },
  status: {
    type: String,
    enum: ['Want to Read', 'Reading', 'Completed', 'Dropped'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  startedAt: {
    type: Date
  },
  finishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const BookProgress = mongoose.model('BookProgress', bookProgressSchema);
export default BookProgress;
