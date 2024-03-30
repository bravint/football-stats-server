import { createClient } from 'redis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';

const redisClient = createClient({ url });

redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('error', (err: unknown) => console.log('Redis Client Error', err));

redisClient.connect();

export default redisClient;