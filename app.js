require('dotenv').config();

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// const axios = require('axios')
const matchesRouter = require('./routers/matches');
const standingsRouter = require('./routers/standings');
const teamsRouter = require('./routers/teams');

const app = express()
const port = process.env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/matches', matchesRouter);
app.use('/standings', standingsRouter);
app.use('/teams', teamsRouter);

app.get('*', (req, res) => {
    res.send('Server status: OK');
});

app.listen(port, () => console.log(`Server started on port ${port}`));