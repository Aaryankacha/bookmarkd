import express from 'express';
import { getUserProfile, searchUsers } from '../controllers/userController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/:username', optionalAuth, getUserProfile);

export default router;
