import BookClub from '../models/BookClub.js';
import ClubMember from '../models/ClubMember.js';
import Discussion from '../models/Discussion.js';
import DiscussionReply from '../models/DiscussionReply.js';
import Activity from '../models/Activity.js';
import { getIO } from '../socket/index.js';

export const createClub = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    
    const exists = await BookClub.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Club name already taken' });

    const club = await BookClub.create({
      name,
      description,
      visibility,
      owner: req.user._id
    });

    await ClubMember.create({
      club: club._id,
      user: req.user._id,
      role: 'admin'
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClubs = async (req, res) => {
  try {
    const clubs = await BookClub.find({ visibility: 'public' })
      .populate('owner', 'username avatar')
      .limit(20);
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClubById = async (req, res) => {
  try {
    const club = await BookClub.findById(req.params.id)
      .populate('owner', 'username avatar');
    
    if (!club) return res.status(404).json({ message: 'Club not found' });
    
    // Optional: Add member checking here if private
    
    const memberCount = await ClubMember.countDocuments({ club: club._id });
    const members = await ClubMember.find({ club: club._id })
      .populate('user', 'username avatar')
      .limit(10);
      
    res.json({ club, memberCount, recentMembers: members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinClub = async (req, res) => {
  try {
    const { id } = req.params;
    const club = await BookClub.findById(id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const existing = await ClubMember.findOne({ club: id, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already a member' });

    await ClubMember.create({ club: id, user: req.user._id, role: 'member' });

    // Activity
    await Activity.create({
      user: req.user._id,
      action: 'joined_club',
      targetId: id
    });

    res.json({ message: 'Joined club successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({ club: req.params.clubId })
      .populate('author', 'username avatar')
      .sort({ isPinned: -1, createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { title, content } = req.body;
    const discussion = await Discussion.create({
      club: req.params.clubId,
      author: req.user._id,
      title,
      content
    });
    
    const populated = await Discussion.findById(discussion._id).populate('author', 'username avatar');
    
    try {
      const io = getIO();
      io.to(`club_${req.params.clubId}`).emit('new_discussion', populated);
    } catch(e) {
      console.warn('Socket emit ignored:', e.message);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiscussionReplies = async (req, res) => {
  try {
    const replies = await DiscussionReply.find({ discussion: req.params.discussionId })
      .populate('author', 'username avatar')
      .sort({ createdAt: 1 });
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDiscussionReply = async (req, res) => {
  try {
    const { content, parentReply } = req.body;
    const { discussionId } = req.params;

    const reply = await DiscussionReply.create({
      discussion: discussionId,
      author: req.user._id,
      content,
      parentReply
    });
    
    const populated = await DiscussionReply.findById(reply._id).populate('author', 'username avatar');
    
    try {
      const io = getIO();
      const discussion = await Discussion.findById(discussionId);
      if (discussion) {
        io.to(`club_${discussion.club}`).emit('new_discussion_reply', { discussionId, reply: populated });
      }
    } catch(e) {
      console.warn('Socket emit ignored:', e.message);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
