const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./routes');

app.use(express.json());
app.use('/api', router.festivalRouter);
app.use('/api', router.requestRouter);

app.listen(port, () => {
    console.log(`Festivalwijzer API listening at http://localhost:${port}`);
});