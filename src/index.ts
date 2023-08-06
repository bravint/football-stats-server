import 'dotenv/config'

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

const SERVER_MESSAGES = {
    HELLO: 'Hello World',
    STARTED: 'Server started on port',
};

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/:id/:endpoint', async (req, res) => {
    const { id, endpoint } = req.params;

    const url = `${process.env.API_EXT_URL!}/${id}/${endpoint}`;
    const key = process.env.API_EXT_TOKEN!;

    try {
        const response = await fetch(
            url,
            {
                headers: {
                    'X-Auth-Token': key,
                },
            },
        );
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.send(error);
    }
});

app.get('*', (req, res) => {
    res.send(SERVER_MESSAGES.HELLO);
});

app.listen(PORT, () => {
    console.log(`${SERVER_MESSAGES.STARTED} ${PORT}`);
});
