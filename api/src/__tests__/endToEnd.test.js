const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);
const {
    pg
} = require('../config/postgres');

// Override: parse date column to date()
const types = require('pg').types;
types.setTypeParser(1082, date => date);

beforeAll(async () => {
    try {
        await pg('requests').insert({
            id: 1,
            name: "Graspop",
            date_begin: "2022-06-16",
            date_end: "2022-06-19",
        });
        await pg('festivals').insert({
            id: 3,
            name: "Rock Werchter",
            date_begin: "2022-06-30",
            date_end: "2022-07-03",
        });

        console.log("endToEnd test rows inserted");
    } catch (e) {
        console.log(e);
    }

});

describe('complete postgres api test', () => {
    test('full circle', async () => {
        try {
            await request.post('/api/signup')
                .send({
                    username: "Lorenz Reweghs",
                    email: "lorenz@email.be",
                    password: "Lorenz123",
                    date_birth: "1999-03-02",
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body[0]).toEqual("lorenz@email.be");
                })
            await request.post('/api/login')
                .send({
                    email: "lorenz@email.be",
                    password: "Lorenz123",
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body.email).toEqual("lorenz@email.be");
                })
            await request.get('/api/requests')
                .expect(200);
            await request.get('/api/festivals')
                .expect(200);
            await request.post('/api/requests')
                .send({
                    id: 2,
                    name: "Lokerse Feesten",
                    date_begin: "2022-08-05",
                    date_end: "2022-08-14",
                    description: "",
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body[0].name).toEqual("Lokerse Feesten");
                    expect(res.body[0].date_begin).toEqual("2022-08-05");
                    expect(res.body[0].date_end).toEqual("2022-08-14");
                })
            await request.post('/api/festivals')
                .send({
                    id: 4,
                    name: "Reggae Geel",
                    date_begin: "2022-08-04",
                    date_end: "2022-08-06",
                    description: "",
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body[0].name).toEqual("Reggae Geel");
                    expect(res.body[0].date_begin).toEqual("2022-08-04");
                    expect(res.body[0].date_end).toEqual("2022-08-06");
                })
            await request.put('/api/requests')
                .send({
                    id: 1,
                    name: "Graspop",
                    date_begin: "2023-06-12",
                    date_end: "2023-06-15",
                    description: "Graspop Metal Meeting is een jaarlijks meerdaags metalfestival in Dessel.",
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body[0].date_begin).toEqual("2023-06-12");
                    expect(res.body[0].date_end).toEqual("2023-06-15");
                    expect(res.body[0].description).toEqual("Graspop Metal Meeting is een jaarlijks meerdaags metalfestival in Dessel.");
                });
            await request.put('/api/festivals')
                .send({
                    id: 3,
                    name: "Rock Werchter",
                    date_begin: "2022-07-15",
                    date_end: "2022-07-18",
                    description: "Rock Werchter is een pop- en rockfestival dat elk jaar plaatsvindt in het dorpje Werchter.",
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body[0].date_begin).toEqual("2022-07-15");
                    expect(res.body[0].date_end).toEqual("2022-07-18");
                    expect(res.body[0].description).toEqual("Rock Werchter is een pop- en rockfestival dat elk jaar plaatsvindt in het dorpje Werchter.");
                });
            await request.del('/api/requests')
                .send({id: 2})
                .expect(200)
                .then(res => {
                    expect(res.body[0]).toEqual(2);
                });
            await request.del('/api/festivals')
                .send({id: 4})
                .expect(200)
                .then(res => {
                    expect(res.body[0]).toEqual(4);
                })
        } catch (e) {
            throw e;
        }
    });
});

afterAll(async () => {
    try {
        await pg('requests').where('name', 'Graspop').del();
        await pg('requests').where('name', 'Lokerse Feesten').del();
        await pg('festivals').where('name', 'Rock Werchter').del();
        await pg('festivals').where('name', 'Reggae Geel').del();
        await pg('users').where('email', 'lorenz@email.be').del();
        await pg('users').where('email', 'lorenz@student.be').del();
        await pg.destroy();
    } catch (e) {
        console.log(e);
    }
});