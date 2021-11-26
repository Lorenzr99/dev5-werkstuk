const express = require('express');
const app = express();
const cors = require('cors');
const {
    festivalRouter,
    requestRouter
} = require('./routes');

app.use(express.json());
app.use(cors());
app.use('/api', festivalRouter);
app.use('/api', requestRouter);

module.exports = app;