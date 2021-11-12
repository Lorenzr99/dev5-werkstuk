const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);

describe('festivalRouter', () => {
    test('GET / endpoint', (done) => {
        request.get('/api/festivals')
        .then(res => expect(res.status).toBe(200))
        .then(res => done());
    })
})