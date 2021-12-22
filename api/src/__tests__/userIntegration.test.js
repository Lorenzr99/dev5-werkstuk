const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);
const {
    pg
} = require('../config/postgres');

describe('SignUp', () => {
    test('POST / endpoint SUCCESS', (done) => {
        request.post('/api/signup')
            .send({
                email: "lorenz@student.be",
                password: "lorenz123",
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(res.body.message).toEqual("User signed up successfully!");
            })
            .then(res => done());
    });

    test('POST / endpoint ERROR', (done) => {
        request.post('/api/signup')
            .send({
                email: "lorenz@student.be",
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body.error).toBeDefined();
            })
            .then(res => done());
    });
});