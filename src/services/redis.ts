import 'dotenv/config'

import { createClient } from 'redis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';

const redisClient = createClient({
    url,
});

redisClient.on('error', (err: unknown) => console.log('Redis Client Error', err));


export default redisClient;