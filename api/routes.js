const express = require('express');
const festivalRouter = express.Router();
const requestRouter = express.Router();

const dotenv = require('dotenv').config()
const dotenvExpand = require('dotenv-expand');
dotenvExpand(dotenv);

const pg = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
});

const getAllFestivalsHandler = (req,res) => {
    // TEST: check if PostgreSQL is connected
    pg.select().from('festivals').then(() => {
        console.log("PostgreSQL connected");
    })
    .catch((e) => {
        console.log("PostgreSQL not connected");
        console.error(e);
    });
    res.send('FESTIVALS');    
}

const getAllRequestsHandler = (req,res) => {
    // TEST: check if PostgreSQL is connected
    pg.select().from('requests').then(() => {
        console.log("PostgreSQL connected");
    })
    .catch((e) => {
        console.log("PostgreSQL not connected");
        console.error(e);
    });
    res.send('REQUESTS');    
}

festivalRouter.route('/festivals')
    .get(getAllFestivalsHandler);

requestRouter.route('/requests')
    .get(getAllRequestsHandler);

module.exports = { festivalRouter, requestRouter, getAllFestivalsHandler, getAllRequestsHandler };