import { Request, Response } from 'express';

import redisClient from '../../../services/redis';
import { Leagues } from '../../../enums/enums';

export const getLeagueData = async (req: Request, res: Response) => {
    const { leagueId } = req.params;
    const sanitisedLeagueId = Leagues[leagueId as Leagues];

    const redisKey = `${sanitisedLeagueId}`;

    const apiBaseUrl = process.env.API_EXT_URL!;
    const apiKey = process.env.API_EXT_TOKEN!;

    const endpoints = ['standings', 'matches', 'teams'];
    const headers = { 'X-Auth-Token': apiKey };

    const requests = endpoints.map((endpoint) => fetch(`${apiBaseUrl}/${sanitisedLeagueId}/${endpoint}`, { headers }));
    const responses = await Promise.all(requests);
    
    const [
        standings,
        matches,
        teams,
    ] = await Promise.all(responses.map((response) => response.json()));

    const mappedData = {
        area: standings.area,
        competition: standings.competition,
        season: standings.season,
        standings: standings.standings[0].table,
        matches: matches.matches,
        teams: teams.teams,
    };

    redisClient.setEx(redisKey, 120, JSON.stringify(mappedData))
        .catch((err) => console.log('Redis Client Error', err));

    res.status(200).json(mappedData);
};