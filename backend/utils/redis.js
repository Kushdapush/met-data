import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', err => console.log('Redis Client Error', err));

export async function initializeRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
}

export const getCache = async (client, key) => {
    try {
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error('Redis get error:', err);
        return null;
    }
};

export const setCache = async (client, key, value, expiration = 3600) => {
    try {
        await client.set(key, JSON.stringify(value), { EX: expiration });
    } catch (err) {
        console.error('Redis set error:', err);
    }
};

export { client as redisClient };
