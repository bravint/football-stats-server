require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

const SERVER_MESSAGES = {
    HELLO: 'Hello World',
    STARTED: 'server started on port',
};

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/:id/:endpoint', async (req, res) => {
    const { id, endpoint } = req.params;

    const url = `${process.env.API_EXT_URL}/${id}/${endpoint}`;
    const key = process.env.API_EXT_TOKEN;

    try {
        let response = await fetch(
            url,
            {
                headers: {
                    'X-Auth-Token': key,
                }
            },
        );
        data = await response.json();
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
