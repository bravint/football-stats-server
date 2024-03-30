import { Request, Response, NextFunction } from "express";

import redisClient from "../../services/redis";
import { Leagues } from "../../enums/enums";

const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { leagueId } = req.params;
  const sanitisedLeagueId = Leagues[leagueId as Leagues];

  const redisKey = `${sanitisedLeagueId}`;
  const cachedData = await redisClient.get(redisKey);

  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  next();
};

export default cacheMiddleware;
