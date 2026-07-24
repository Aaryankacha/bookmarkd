import mongoose from 'mongoose';

const customListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  books: [{
    openLibraryId: String,
    title: String,
    author: String,
    coverId: String
  }]
}, {
  timestamps: true
});

const CustomList = mongoose.model('CustomList', customListSchema);
export default CustomList;
