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
        await pg('festivals').insert({
            id: 1,
            name: "Rock Werchter",
            date_begin: "2022-06-30",
            date_end: "2022-07-03",
        });
        await pg('festivals').insert({
            id: 2,
            name: "Reggae Geel",
            date_begin: "2022-08-04",
            date_end: "2022-08-06",
        });

        console.log("Festival test rows inserted");        
    } catch (e) {
        console.log(e);
    }

});

describe('festivalRouter', () => {
    test('GET / endpoint', (done) => {
        request.get('/api/festivals')
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(res.body).not.toBeNull();
                expect(res.body.length).toBeGreaterThan(0);
            })
            .then(res => done());
    });

    test('PUT / endpoint', (done) => {
        request.put('/api/festivals')
            .send({
                id: 1,
                name: "Rock Werchter",
                date_begin: "2022-07-15",
                date_end: "2022-07-18",
                description: "Rock Werchter is een pop- en rockfestival dat elk jaar plaatsvindt in het dorpje Werchter.",
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(res.body[0].name).toEqual("Rock Werchter");
                expect(res.body[0].date_begin).toEqual("2022-07-15");
                expect(res.body[0].date_end).toEqual("2022-07-18");
                expect(res.body[0].description).toEqual("Rock Werchter is een pop- en rockfestival dat elk jaar plaatsvindt in het dorpje Werchter.");
            })
            .then(res => done());
    });

    test('DELETE / endpoint', (done) => {
        request.del('/api/festivals')
            .send({id: 2})
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(res.body[0]).toEqual(2);
            })
            .then(res => done());
    });
})

afterAll(async () => {
    try {
        await pg('festivals').where('name', 'Rock Werchter').del();
        await pg('festivals').where('name', 'Reggae Geel').del();
        await pg.destroy();        
    } catch (e) {
        console.log(e);
    }
});