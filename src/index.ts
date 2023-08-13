import 'dotenv/config'

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import redisClient from './services/redis';

const app = express();
const PORT = process.env.PORT || 4000;

const SERVER_MESSAGES = {
    HELLO: 'Hello World',
    STARTED: 'Server started on port',
    API_ERROR: 'Error fetching data from API',
};

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/:id/:endpoint', async (req, res) => {
    const { id, endpoint } = req.params;

    const url = `${process.env.API_EXT_URL!}/${id}/${endpoint}`;
    const key = process.env.API_EXT_TOKEN!;

    const redisKey = `${id}-${endpoint}`;

    try {
        await redisClient.connect();

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
    } finally {
        await redisClient.quit();
    }
});

app.get('*', (req, res) => {
    res.send(SERVER_MESSAGES.HELLO);
});

app.listen(PORT, () => {
    console.log(`${SERVER_MESSAGES.STARTED} ${PORT}`);
});
