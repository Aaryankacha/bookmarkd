import express from 'express';
import { getMyProgress, updateProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getMyProgress);
router.route('/:openLibraryId').post(protect, updateProgress).put(protect, updateProgress);

export default router;
