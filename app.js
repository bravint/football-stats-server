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

    console.log(id)
    
    const url = `https://api.football-data.org/v2/competitions/${id}/${endpoint}`;
    const key = process.env.API_EXT_TOKEN;

    console.log(url, key)

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
 res.send('Server UP')
})

app.listen(port, () => console.log(`Server started on port ${port}`));