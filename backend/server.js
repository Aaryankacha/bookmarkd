import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import listRoutes from './routes/listRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import clubRoutes from './routes/clubRoutes.js';

import initSocket from './socket/index.js';

console.log('✓ Loading environment variables');
dotenv.config();

console.log('✓ Connecting to MongoDB...');
await connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
initSocket(httpServer);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/clubs', clubRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Bookmarkd API is running...');
});

const PORT = process.env.PORT || 5000;

console.log('✓ Starting Express Server...');
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
