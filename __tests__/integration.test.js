const app = require('../api/index.js');
const supertest = require('supertest');
const request = supertest(app);

describe('festivalRouter', () => {
    test('GET / endpoint', async (done) => {
        const res = await request.get('/api/festivals');
        expect(res.status).toBe(200);
        return done();
    })
})