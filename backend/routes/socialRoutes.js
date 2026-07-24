import express from 'express';
import { 
  getReviews, 
  getComments, 
  getActivityFeed, 
  getNotifications,
  followUser,
  unfollowUser,
  getFollowStats
} from '../controllers/socialController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/reviews/:openLibraryId', getReviews);
router.get('/comments/:reviewId', getComments);
router.get('/activity', optionalAuth, getActivityFeed);
router.get('/notifications', protect, getNotifications);

// Follow System
router.post('/follow/:targetUserId', protect, followUser);
router.delete('/unfollow/:targetUserId', protect, unfollowUser);
router.get('/follow-stats/:userId', getFollowStats);

// Friend System
import {
  sendFriendRequest,
  respondFriendRequest,
  getFriends,
  inviteBuddy,
  respondBuddy
} from '../controllers/socialController.js';

router.post('/friends/request/:targetUserId', protect, sendFriendRequest);
router.post('/friends/respond/:requestId', protect, respondFriendRequest);
router.get('/friends/:userId', getFriends);

// Buddy System
router.post('/buddy/invite', protect, inviteBuddy);
router.post('/buddy/respond/:inviteId', protect, respondBuddy);

export default router;
