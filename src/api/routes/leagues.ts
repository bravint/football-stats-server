import express from 'express';

import cacheMiddleware from '../middleware/cache';
import getLeagueData from '../controllers/leagues';

const router = express.Router();

router.use(cacheMiddleware);

router.get('/:id/:endpoint', getLeagueData);

export default router;