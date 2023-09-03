import express from 'express';

import { cacheMiddleware } from '../../middleware/cache';
import { getLeagueData } from '../controllers/league';

const router = express.Router();

router.get('/:leagueId', cacheMiddleware, getLeagueData);

export default router;