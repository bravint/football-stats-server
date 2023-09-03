import 'dotenv/config'

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit'

import redisClient from './services/redis';
import { Leagues, Endpoints } from './enums/enums';

const app = express();
const PORT = process.env.PORT || 4000;

const SERVER_MESSAGES = {
    PING: 'football-stats-server',
    STARTED: 'Server started on port',
    API_ERROR: 'Error fetching data from API',
    BAD_REQUEST: 'Invalid id or endpoint',
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!, 10) ?? 100, // Limit each IP to 100 requests per `window`
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

redisClient.connect();

app.get('/:id/:endpoint', async (req, res) => {
    const { id, endpoint } = req.params;

    const leagueId = Leagues[id as Leagues];
    const endpointId = Endpoints[endpoint as Endpoints];

    if (!leagueId || !endpointId) {
        return res.status(400).json(SERVER_MESSAGES.BAD_REQUEST);
    }

    const url = `${process.env.API_EXT_URL!}/${leagueId}/${endpointId}`;
    const key = process.env.API_EXT_TOKEN!;

    const redisKey = `${id}-${endpoint}`;

    try {
        const cachedData = await redisClient.get(redisKey);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const response = await fetch(
            url,
            {
                headers: {
                    'X-Auth-Token': key,
                },
            },
        );
        const data = await response.json();

        await redisClient.setEx(redisKey, 120, JSON.stringify(data));

        res.status(200).json(data);
    } catch (error) {
         res.status(500).json(SERVER_MESSAGES.API_ERROR);
    }
});

app.get('*', (req, res) => {
    res.send(SERVER_MESSAGES.PING);
});

app.listen(PORT, () => {
    console.log(`${SERVER_MESSAGES.STARTED} ${PORT}`);
});
