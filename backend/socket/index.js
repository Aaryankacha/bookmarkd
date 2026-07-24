import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { handleRoomEvents } from './rooms.js';
import { handleSocialEvents } from './events.js';

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For development. Update for production.
      methods: ['GET', 'POST']
    }
  });

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    // Handle room joining/leaving for books
    handleRoomEvents(io, socket);

    // Handle reviews, comments, likes, ratings, reading sessions
    handleSocialEvents(io, socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export default initSocket;
