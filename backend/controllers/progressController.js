import BookProgress from '../models/BookProgress.js';

// @desc    Get user's book progress
// @route   GET /api/progress
// @access  Private
export const getMyProgress = async (req, res) => {
  try {
    const progress = await BookProgress.find({ user: req.user._id });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or update book progress
// @route   POST /api/progress/:openLibraryId
// @access  Private
export const updateProgress = async (req, res) => {
  try {
    const { status, rating, title, author, coverId } = req.body;
    const { openLibraryId } = req.params;

    let progress = await BookProgress.findOne({ user: req.user._id, openLibraryId });

    if (progress) {
      progress.status = status || progress.status;
      progress.rating = rating !== undefined ? rating : progress.rating;
      if (status === 'Reading' && !progress.startedAt) progress.startedAt = new Date();
      if (status === 'Completed' && !progress.finishedAt) progress.finishedAt = new Date();
      
      const updatedProgress = await progress.save();
      return res.json(updatedProgress);
    } else {
      progress = await BookProgress.create({
        user: req.user._id,
        openLibraryId,
        title,
        author,
        coverId,
        status,
        rating,
        startedAt: status === 'Reading' || status === 'Completed' ? new Date() : null,
        finishedAt: status === 'Completed' ? new Date() : null
      });
      return res.status(201).json(progress);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
