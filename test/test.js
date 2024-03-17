const request = require('supertest');
const app = require('../app');
const User = require("../models/user.model");
const db = require("../models");
//https://www.freecodecamp.org/news/how-to-test-in-express-and-mongoose-apps/
const suffix = Date.now().toString();

describe('Integration Test', () => {
    const userData = {
        first_name: "nitesh",
        last_name: "more",
        password: "nitesh123",
        username: `nitesh_${suffix}@email.com`
    };
    const encodeValue = Buffer.from(`${userData.username}:${userData.password}`).toString('base64');
    const authHeader = `Basic ${encodeValue}`;
   
    beforeAll(async () => {
        await db.sequelize.sync()
            .catch(error => console.error("Database Error :", error));
    });


    it('TEST 1 - Create user and validate using GET call ', async () => {
        const res = await request(app)
            .post("/v1/user")
            .send(userData);
        expect(res.statusCode).toBe(201);


        const validate = await request(app)
            .get("/v1/user/self")
            .set("Authorization", authHeader)
        expect(validate.statusCode).toBe(200);
        expect(validate.body.username).toBe(userData.username);
    });
    it('TEST 2 - Update user and validate using GET call ', async () => {
        const newUserData = {
            first_name: "nitesh123",
            last_name: "more",
            username: `${userData.username}`,
            password: "Newpass123"
        };
        const updatedPassword = Buffer.from(`${newUserData.username}:${newUserData.password}`).toString('base64');
        const newAuthHeader = `Basic ${updatedPassword}`;

        const updateUser = await request(app)
            .put("/v1/user/self")
            .set("Authorization", authHeader)
            .send(newUserData);
        expect(updateUser.statusCode).toBe(204);


        const validateChanges = await request(app)
            .get("/v1/user/self")
            .set("Authorization", newAuthHeader)
        expect(validateChanges.statusCode).toBe(200);
        expect(validateChanges.body.first_name).toBe(newUserData.first_name);
    });
    afterAll(async () => {
        await User.destroy(
            {
                where: {
                    username: userData.username
                }
            }
        ).catch(error => console.error("Cleanup failed:", error));
    });
})
