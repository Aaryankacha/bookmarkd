import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import connectDB from './backend/config/db.js';

import authRoutes from './backend/routes/authRoutes.js';
import userRoutes from './backend/routes/userRoutes.js';
import progressRoutes from './backend/routes/progressRoutes.js';
import listRoutes from './backend/routes/listRoutes.js';
import socialRoutes from './backend/routes/socialRoutes.js';
import clubRoutes from './backend/routes/clubRoutes.js';

import initSocket from './backend/socket/index.js';

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/clubs', clubRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Database Error Handling Middleware
app.use((err, req, res, next) => {
  if (err && (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || (err.message && err.message.includes('buffering timed out')))) {
    console.warn('[AI Studio] Database offline — returning fallback response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ error: 'Database temporarily unavailable' });
  }
  next(err);
});

// Serve Vite in development / static assets in production
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve('dist');
  app.use(express.static(distPath));
  app.get('/:splat(*)', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

console.log('✓ Starting Express Server...');
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Bookmarkd server running on http://0.0.0.0:${PORT}`);
});

