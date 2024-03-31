import express from 'express';

import cacheMiddleware from '../middleware/cache';
import getLeagueData from '../controllers/leagues';

const router = express.Router();

router.get('/:id/:endpoint', cacheMiddleware, getLeagueData);

export default router;
