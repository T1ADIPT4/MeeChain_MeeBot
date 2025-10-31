import voteRouter from './routes/vote';
// ...existing code...

import { Express } from 'express';

export function registerVoteRoutes(app: Express) {
  app.use('/api/vote', voteRouter);
}
