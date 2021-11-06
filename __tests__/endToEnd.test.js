const supertest = require('supertest');
const app = require('../api/server.js');
const request = supertest(app);
const pg = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
});