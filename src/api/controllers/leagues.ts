import { Request, Response } from 'express';

import redisClient from '../../services/redis';
import { Leagues, Endpoints } from '../../enums/enums';

const getLeagueData = async (req: Request, res: Response) => {
    const { id, endpoint } = req.params;

    const leagueId = Leagues[id as Leagues];
    const endpointId = Endpoints[endpoint as Endpoints];
    const redisKey = `${id}-${endpoint}`;

    const url = `${process.env.API_EXT_URL!}/${leagueId}/${endpointId}`;
    const key = process.env.API_EXT_TOKEN!;

    try {
        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': key,
            },
        });
        const data = await response.json();

        await redisClient.setEx(redisKey, 120, JSON.stringify(data));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json('Error fetching data from API');
    }
};

export default getLeagueData;
