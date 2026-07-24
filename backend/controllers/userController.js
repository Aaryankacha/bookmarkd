import User from '../models/User.js';
import Follow from '../models/Follow.js';
import Friend from '../models/Friend.js';

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find user by username
    const user = await User.findOne({ username }).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch stats
    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });
    const friendsCount = await Friend.countDocuments({
      $or: [{ user1: user._id }, { user2: user._id }]
    });

    let friendStatus = 'none';
    let pendingRequestId = null;
    if (req.user && req.user._id.toString() !== user._id.toString()) {
      const isFriend = await Friend.findOne({
        $or: [
          { user1: req.user._id, user2: user._id },
          { user1: user._id, user2: req.user._id }
        ]
      });
      if (isFriend) {
        friendStatus = 'friends';
      } else {
        const { default: FriendRequest } = await import('../models/FriendRequest.js');
        const pendingReq = await FriendRequest.findOne({
          $or: [
            { sender: req.user._id, recipient: user._id },
            { sender: user._id, recipient: req.user._id }
          ],
          status: 'pending'
        });
        if (pendingReq) {
          friendStatus = pendingReq.sender.toString() === req.user._id.toString() ? 'pending_sent' : 'pending_received';
          if (friendStatus === 'pending_received') {
            pendingRequestId = pendingReq._id;
          }
        }
      }
    }

    res.json({
      user,
      stats: {
        followers: followersCount,
        following: followingCount,
        friends: friendsCount
      },
      friendStatus,
      pendingRequestId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      username: { $regex: q, $options: 'i' }
    })
    .select('username avatar bio presence isPrivate')
    .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
