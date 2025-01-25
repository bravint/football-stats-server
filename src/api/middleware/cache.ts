import type { NextFunction, Request, Response } from 'express'

import { Endpoints, Leagues } from '../../enums/enums'
import redisClient from '../../services/redis'

const cacheMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id, endpoint } = req.params

	const leagueId = Leagues[id as Leagues]
	const endpointId = Endpoints[endpoint as Endpoints]

	if (!leagueId || !endpointId) {
		return res.status(400).json('bad request')
	}

	const redisKey = `${leagueId}-${endpointId}`
	const cachedData = await redisClient.get(redisKey)

	if (cachedData) {
		return res.status(200).json(JSON.parse(cachedData))
	}

	next()
}

export default cacheMiddleware
