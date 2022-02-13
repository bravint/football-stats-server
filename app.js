require('dotenv').config();

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const axios = require('axios');

const app = express()
const port = process.env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/:id/:endpoint', async (req, res) => {
    const {id, endpoint } = req.params

    const url = `${process.env.API_EXT_URL}/${id}/${endpoint}`;
    const key = process.env.API_EXT_TOKEN;

    try {
        const response = await axios({
            url,
            headers: {
                'X-Auth-Token': key,
            },
        });
        res.send(response.data)
      } catch (error) {
        res.send(error);
      }
});

app.get('*', (req, res) => {
 res.send('Server OK')
})

app.listen(port, () => console.log(`Server started on port ${port}`));