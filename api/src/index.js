const express = require('express');
const app = express();
const cors = require('cors');
const {
    festivalRouter,
    requestRouter,
    signUpRouter,
    loginRouter,
} = require('./routes');

app.use(express.json());
app.use(cors());
app.use('/api', festivalRouter);
app.use('/api', requestRouter);
app.use('/api', signUpRouter);
app.use('/api', loginRouter);

module.exports = app;