const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);

describe('SignUp', () => {
    test('POST / endpoint', (done) => {
        request.post('/api/signup')
            .send({
                username: "Lorenz Reweghs",
                email: "lorenz@student.be",
                password: "Lorenz123",
                date_birth: "1999-03-02",
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(res.body[0]).toEqual("lorenz@student.be");
            })
            .then(res => done());
    });
});