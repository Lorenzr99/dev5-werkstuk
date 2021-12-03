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
        
        await pg('requests').insert({
            id: 1,
            name: "Graspop",
            date_begin: "2022-06-16",
            date_end: "2022-06-19",
        });
        await pg('requests').insert({
            id: 2,
            name: "Lokerse Feesten",
            date_begin: "2022-08-05",
            date_end: "2022-08-14",
        });

        console.log("Test rows inserted");        
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

describe('requestRouter', () => {
    test('GET / endpoint', (done) => {
        request.get('/api/requests')
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
        request.put('/api/requests')
            .send({
                id: 1,
                name: "Graspop",
                date_begin: "2023-06-12",
                date_end: "2023-06-15",
                description: "Graspop Metal Meeting is een jaarlijks meerdaags metalfestival in Dessel.",
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(res.body[0].name).toEqual("Graspop");
                expect(res.body[0].date_begin).toEqual("2023-06-12");
                expect(res.body[0].date_end).toEqual("2023-06-15");
                expect(res.body[0].description).toEqual("Graspop Metal Meeting is een jaarlijks meerdaags metalfestival in Dessel.");
            })
            .then(res => done());
    });

    test('DELETE / endpoint', (done) => {
        request.del('/api/requests')
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
        await pg('requests').where('name', 'Graspop').del();
        await pg('requests').where('name', 'Lokerse Feesten').del();
        await pg.destroy();        
    } catch (e) {
        console.log(e);
    }
});