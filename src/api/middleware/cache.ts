import { Request, Response, NextFunction } from 'express';

import redisClient from '../../services/redis';
import { Leagues, Endpoints } from '../../enums/enums';

const cacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, endpoint } = req.params;

    const leagueId = Leagues[id as Leagues];
    const endpointId = Endpoints[endpoint as Endpoints];

    if (!leagueId || !endpointId) {
        return res.status(400).json('bad request');
    }

    const redisKey = `${leagueId}-${endpointId}`;
    const cachedData = await redisClient.get(redisKey);

    if (cachedData) {
        console.log('cache hit - returning data');
        return res.status(200).json(JSON.parse(cachedData));
    }

    next();
};

export default cacheMiddleware;
