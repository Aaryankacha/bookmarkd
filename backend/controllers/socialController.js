import Review from '../models/Review.js';
import Comment from '../models/Comment.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket/index.js';

// @desc    Get reviews for a book
// @route   GET /api/social/reviews/:openLibraryId
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ openLibraryId: req.params.openLibraryId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a review
// @route   GET /api/social/comments/:reviewId
// @access  Public
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ review: req.params.reviewId })
      .populate('user', 'username avatar')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get global or personalized activity feed
// @route   GET /api/social/activity
// @access  Public (Optional Auth)
export const getActivityFeed = async (req, res) => {
  try {
    const { filter, sort } = req.query; // filter: 'friends' | 'following' | 'all'
    let query = {};

    if (req.user) {
      const { default: Follow } = await import('../models/Follow.js');
      const { default: Friend } = await import('../models/Friend.js');
      
      const followings = await Follow.find({ follower: req.user._id }).select('following');
      const followingIds = followings.map(f => f.following);

      const friendships = await Friend.find({
        $or: [{ user1: req.user._id }, { user2: req.user._id }]
      });
      const friendIds = friendships.map(f => f.user1.toString() === req.user._id.toString() ? f.user2 : f.user1);

      if (filter === 'friends') {
        query.user = { $in: friendIds };
      } else if (filter === 'following') {
        query.user = { $in: followingIds };
      } else {
        // Default personalized: me + friends + following
        const allRelevantIds = [...new Set([...followingIds.map(id => id.toString()), ...friendIds.map(id => id.toString()), req.user._id.toString()])];
        query.user = { $in: allRelevantIds };
      }
    }

    let sortObj = { createdAt: -1 }; // Latest
    // Note: Most popular would require sorting by a 'likesCount' or similar on Activity which we don't have yet, 
    // so we'll just stick to Latest for now.

    const activities = await Activity.find(query)
      .populate('user', 'username avatar')
      .populate('targetId', 'username avatar') // If target is a user
      .sort(sortObj)
      .limit(50);
      
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notifications for user
// @route   GET /api/social/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// FOLLOW SYSTEM
// ========================

export const followUser = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const { default: Follow } = await import('../models/Follow.js');
    const { default: User } = await import('../models/User.js');
    
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Check if already following
    const existingFollow = await Follow.findOne({ follower: currentUserId, following: targetUserId });
    if (existingFollow) return res.status(400).json({ message: "Already following this user" });

    await Follow.create({ follower: currentUserId, following: targetUserId });

    // Create Activity
    const activity = await Activity.create({
      user: currentUserId,
      action: 'followed',
      targetId: targetUserId
    });

    // Create Notification
    const notif = await Notification.create({
      recipient: targetUserId,
      sender: currentUserId,
      type: 'follow'
    });

    // We can emit this via Socket.IO
    try {
      const io = getIO();
      const populatedActivity = await Activity.findById(activity._id).populate('user', 'username avatar');
      io.to(`user_${targetUserId}`).emit('new_notification', notif);
      io.emit('new_activity', populatedActivity);
    } catch (e) {
      console.log('Socket not ready');
    }

    res.status(200).json({ message: "Successfully followed user", activity, notif });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user._id;

    const { default: Follow } = await import('../models/Follow.js');
    await Follow.findOneAndDelete({ follower: currentUserId, following: targetUserId });

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFollowStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { default: Follow } = await import('../models/Follow.js');
    
    const followersCount = await Follow.countDocuments({ following: userId });
    const followingCount = await Follow.countDocuments({ follower: userId });

    let isFollowing = false;
    if (req.user) {
      const follow = await Follow.findOne({ follower: req.user._id, following: userId });
      if (follow) isFollowing = true;
    }

    res.json({ followersCount, followingCount, isFollowing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// FRIEND SYSTEM
// ========================

export const sendFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot friend yourself" });
    }

    const { default: FriendRequest } = await import('../models/FriendRequest.js');
    const { default: Friend } = await import('../models/Friend.js');
    
    // Check if already friends
    const isFriend = await Friend.findOne({
      $or: [
        { user1: currentUserId, user2: targetUserId },
        { user1: targetUserId, user2: currentUserId }
      ]
    });
    if (isFriend) return res.status(400).json({ message: "Already friends" });

    // Check existing request
    const existingReq = await FriendRequest.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId }
      ]
    });

    if (existingReq) {
      if (existingReq.status === 'pending') {
        return res.status(400).json({ message: "Friend request already pending" });
      }
      // If declined, allow resending by deleting the old one
      await FriendRequest.findByIdAndDelete(existingReq._id);
    }

    const newRequest = await FriendRequest.create({ sender: currentUserId, recipient: targetUserId });

    const notif = await Notification.create({
      recipient: targetUserId,
      sender: currentUserId,
      type: 'friend_request'
    });

    try {
      const io = getIO();
      const populatedNotif = await Notification.findById(notif._id).populate('sender', 'username avatar');
      io.to(`user_${targetUserId}`).emit('new_notification', populatedNotif);
    } catch (e) {
      console.warn('Socket notification error:', e.message);
    }

    res.status(200).json({ message: "Friend request sent", request: newRequest, notif });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const respondFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'accept' or 'decline'
    const currentUserId = req.user._id;

    const { default: FriendRequest } = await import('../models/FriendRequest.js');
    const request = await FriendRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.recipient.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (action === 'accept') {
      request.status = 'accepted';
      await request.save();

      const { default: Friend } = await import('../models/Friend.js');
      await Friend.create({ user1: request.sender, user2: request.recipient });

      const activity = await Activity.create({
        user: currentUserId,
        action: 'became_friends',
        targetId: request.sender
      });

      const notif = await Notification.create({
        recipient: request.sender,
        sender: currentUserId,
        type: 'friend_accept'
      });

      try {
        const io = getIO();
        const populatedActivity = await Activity.findById(activity._id).populate('user', 'username avatar');
        const populatedNotif = await Notification.findById(notif._id).populate('sender', 'username avatar');
        io.to(`user_${request.sender}`).emit('new_notification', populatedNotif);
        io.emit('new_activity', populatedActivity);
      } catch (e) {
        console.warn('Socket notification error:', e.message);
      }

      return res.status(200).json({ message: "Friend request accepted", activity, notif });
    } else if (action === 'decline') {
      request.status = 'declined';
      await request.save();
      return res.status(200).json({ message: "Friend request declined" });
    }

    res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const { default: Friend } = await import('../models/Friend.js');
    const { default: User } = await import('../models/User.js');

    const friendships = await Friend.find({
      $or: [{ user1: userId }, { user2: userId }]
    });

    const friendIds = friendships.map(f => f.user1.toString() === userId ? f.user2 : f.user1);
    
    const friends = await User.find({ _id: { $in: friendIds } }).select('-password');
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// READING BUDDY & SESSIONS
// ========================

export const inviteBuddy = async (req, res) => {
  try {
    const { targetUserId, bookId } = req.body;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "Cannot invite yourself" });
    }

    const { default: ReadingBuddy } = await import('../models/ReadingBuddy.js');
    
    const existing = await ReadingBuddy.findOne({
      sender: currentUserId,
      recipient: targetUserId,
      bookId,
      status: 'pending'
    });
    if (existing) return res.status(400).json({ message: "Invite already pending" });

    const invite = await ReadingBuddy.create({
      sender: currentUserId,
      recipient: targetUserId,
      bookId
    });

    const notif = await Notification.create({
      recipient: targetUserId,
      sender: currentUserId,
      type: 'buddy_invite',
      openLibraryId: bookId
    });

    try {
      const io = getIO();
      const populatedNotif = await Notification.findById(notif._id).populate('sender', 'username avatar');
      io.to(`user_${targetUserId}`).emit('new_notification', populatedNotif);
    } catch(e) {
      console.warn('Socket notification error:', e.message);
    }

    res.json({ message: "Buddy invite sent", invite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const respondBuddy = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    
    const { default: ReadingBuddy } = await import('../models/ReadingBuddy.js');
    const invite = await ReadingBuddy.findById(inviteId);

    if (!invite) return res.status(404).json({ message: "Invite not found" });
    if (invite.recipient.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    if (action === 'accept') {
      invite.status = 'accepted';
      await invite.save();

      // Create a shared reading session
      const { default: ReadingSession } = await import('../models/ReadingSession.js');
      const session = await ReadingSession.create({
        user: invite.sender, // original user field logic
        host: invite.sender,
        participants: [invite.sender, invite.recipient],
        openLibraryId: invite.bookId,
        pagesRead: 0,
        status: 'active'
      });

      // Emit to sender that invite was accepted and session created
      try {
        const io = getIO();
        io.to(`user_${invite.sender}`).emit('buddy_accepted', { session, invite });
      } catch(e) {
        console.warn('Socket notification error:', e.message);
      }

      res.json({ message: "Invite accepted", session });
    } else {
      invite.status = 'rejected';
      await invite.save();
      res.json({ message: "Invite rejected" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
