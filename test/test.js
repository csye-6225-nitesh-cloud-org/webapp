const request = require('supertest');
const app = require('../app');
//https://www.freecodecamp.org/news/how-to-test-in-express-and-mongoose-apps/

describe('API TEST', () => {
    it('GET /Healthz Server Health Check ', async () => {
        const res = await request(app).get("/healthz");
        expect(res.statusCode).toBe(200);
    });

    it('should return 404 for non-existent routes', async () => {
        const res = await request(app).get('/non-existent');
        expect(res.statusCode).toEqual(404);
    });
})