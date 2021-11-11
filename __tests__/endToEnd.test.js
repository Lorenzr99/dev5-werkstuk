const pg = require('../config/postgres');
const supertest = require('supertest');
const app = require('../api/server.js');
const request = supertest(app);