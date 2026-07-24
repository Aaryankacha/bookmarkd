import express from 'express';
import {
  createClub,
  getClubs,
  getClubById,
  joinClub,
  getDiscussions,
  createDiscussion,
  getDiscussionReplies,
  createDiscussionReply
} from '../controllers/clubController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createClub);
router.get('/', optionalAuth, getClubs);
router.get('/:id', optionalAuth, getClubById);
router.post('/:id/join', protect, joinClub);

// Discussions
router.get('/:clubId/discussions', optionalAuth, getDiscussions);
router.post('/:clubId/discussions', protect, createDiscussion);

// Replies
router.get('/discussions/:discussionId/replies', optionalAuth, getDiscussionReplies);
router.post('/discussions/:discussionId/replies', protect, createDiscussionReply);

export default router;
