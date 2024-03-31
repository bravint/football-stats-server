import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import leagues from './api/routes/leagues';

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
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!, 10) || 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use('/', leagues);

app.get('*', (req: Request, res: Response) => {
    res.send(SERVER_MESSAGES.PING);
});

app.listen(PORT, () => {
    console.log(`${SERVER_MESSAGES.STARTED} ${PORT}`);
});
