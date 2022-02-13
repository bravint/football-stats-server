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


app.get('*', async (req, res) => {
    const endpoint = Object.values(req.params)[0]
    console.log(endpoint)
    const url = `${process.env.API_EXT_URL}${endpoint}`;
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

app.listen(port, () => console.log(`Server started on port ${port}`));