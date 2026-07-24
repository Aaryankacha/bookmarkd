import Review from '../models/Review.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';

export const handleSocialEvents = (io, socket) => {
  const user = socket.user;

  // REVIEWS
  socket.on('submit_review', async (data, callback) => {
    try {
      const { openLibraryId, rating, text, bookTitle } = data;
      
      const newReview = await Review.create({
        user: user._id,
        openLibraryId,
        rating,
        text
      });

      const populatedReview = await Review.findById(newReview._id).populate('user', 'username avatar');

      // Create Activity
      const activity = await Activity.create({
        user: user._id,
        action: 'reviewed',
        openLibraryId,
        bookTitle,
        targetId: newReview._id,
        meta: { rating, text }
      });
      const populatedActivity = await Activity.findById(activity._id).populate('user', 'username avatar');

      // Broadcast to room
      io.to(`book_${openLibraryId}`).emit('new_review', populatedReview);
      
      // Broadcast globally for feed
      io.emit('new_activity', populatedActivity);

      if (callback) callback({ status: 'ok', review: populatedReview });
    } catch (error) {
      console.error(error);
      if (callback) callback({ status: 'error', message: error.message });
    }
  });

  // COMMENTS
  socket.on('submit_comment', async (data, callback) => {
    try {
      const { reviewId, text, parentCommentId, openLibraryId, bookTitle } = data;

      const review = await Review.findById(reviewId);
      if (!review) throw new Error('Review not found');

      const newComment = await Comment.create({
        user: user._id,
        review: reviewId,
        text,
        parentComment: parentCommentId || null
      });

      // Increment review comments count
      review.commentsCount += 1;
      await review.save();

      const populatedComment = await Comment.findById(newComment._id).populate('user', 'username avatar');

      // Create Activity
      const activity = await Activity.create({
        user: user._id,
        action: 'commented',
        openLibraryId,
        bookTitle,
        targetId: newComment._id,
        meta: { text }
      });
      const populatedActivity = await Activity.findById(activity._id).populate('user', 'username avatar');

      // Notification
      if (review.user.toString() !== user._id.toString()) {
        const notif = await Notification.create({
          recipient: review.user,
          sender: user._id,
          type: parentCommentId ? 'reply' : 'comment',
          openLibraryId,
          targetId: reviewId
        });
        io.to(`user_${review.user.toString()}`).emit('new_notification', notif);
      }

      // Broadcast
      io.to(`book_${openLibraryId}`).emit('new_comment', { reviewId, comment: populatedComment });
      io.emit('new_activity', populatedActivity);

      if (callback) callback({ status: 'ok', comment: populatedComment });
    } catch (error) {
      if (callback) callback({ status: 'error', message: error.message });
    }
  });

  // LIKES
  socket.on('toggle_like', async (data, callback) => {
    try {
      const { targetId, targetType, openLibraryId, bookTitle } = data; // targetType: 'Review' or 'Comment'
      
      const existingLike = await Like.findOne({ user: user._id, targetId, targetType });
      
      let Model = targetType === 'Review' ? Review : Comment;
      let target = await Model.findById(targetId);

      if (!target) throw new Error(`${targetType} not found`);

      if (existingLike) {
        // Unlike
        await Like.findByIdAndDelete(existingLike._id);
        target.likesCount = Math.max(0, target.likesCount - 1);
        await target.save();
      } else {
        // Like
        await Like.create({ user: user._id, targetId, targetType });
        target.likesCount += 1;
        await target.save();

        // Activity
        const activity = await Activity.create({
          user: user._id,
          action: 'liked',
          openLibraryId,
          bookTitle,
          targetId,
          meta: { targetType }
        });
        const populatedActivity = await Activity.findById(activity._id).populate('user', 'username avatar');
        io.emit('new_activity', populatedActivity);

        // Notification
        if (target.user.toString() !== user._id.toString()) {
          const notif = await Notification.create({
            recipient: target.user,
            sender: user._id,
            type: 'like',
            openLibraryId,
            targetId
          });
          io.to(`user_${target.user.toString()}`).emit('new_notification', notif);
        }
      }

      // Broadcast update
      io.to(`book_${openLibraryId}`).emit('like_updated', {
        targetId,
        targetType,
        likesCount: target.likesCount
      });

      if (callback) callback({ status: 'ok', likesCount: target.likesCount, liked: !existingLike });
    } catch (error) {
      if (callback) callback({ status: 'error', message: error.message });
    }
  });

  // JOIN USER ROOM (For notifications)
  socket.on('join_user_room', () => {
    socket.join(`user_${user._id.toString()}`);
  });

  // ========================
  // LIVE READING SESSIONS
  // ========================

  socket.on('join_session', (sessionId) => {
    socket.join(`session_${sessionId}`);
    // Update presence
    io.emit('presence_update', { userId: user._id, status: 'reading_together', sessionId });
  });

  socket.on('leave_session', (sessionId) => {
    socket.leave(`session_${sessionId}`);
    io.emit('presence_update', { userId: user._id, status: 'online' });
  });

  socket.on('session_update_page', (data) => {
    const { sessionId, page } = data;
    io.to(`session_${sessionId}`).emit('session_page_updated', { userId: user._id, page });
  });

  socket.on('session_send_emoji', (data) => {
    const { sessionId, emoji } = data; // '🔥', '👏', etc.
    io.to(`session_${sessionId}`).emit('session_emoji_received', { userId: user._id, emoji });
  });

  socket.on('session_chat_message', async (data) => {
    const { sessionId, message } = data;
    try {
      const { default: ReadingSession } = await import('../models/ReadingSession.js');
      const session = await ReadingSession.findById(sessionId);
      if (session) {
        session.chat.push({ user: user._id, message, timestamp: new Date() });
        await session.save();
        io.to(`session_${sessionId}`).emit('session_chat_received', {
          user: { _id: user._id, username: user.username, avatar: user.avatar },
          message,
          timestamp: new Date()
        });
      }
    } catch(e) {
      console.warn('Session chat error:', e.message);
    }
  });

};
