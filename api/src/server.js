const app = require('./index');

app.listen(process.env.PORT || 3000, () => {
    console.log(`Festivalwijzer API listening at http://localhost:${process.env.PORT || 3000}`);
});