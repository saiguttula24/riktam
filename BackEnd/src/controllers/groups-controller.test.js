const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../app');
const Groups = require('../models/group-model');
const jwt = require('jsonwebtoken');

describe('GroupsController Tests', () => {
    let mongoServer;
    let token;
    let userId;

    beforeAll(async () => {
        process.env.JWT_SECRET = 'T156asiuIs15f56aI8@67bca5#hak@';
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        userId = new mongoose.Types.ObjectId().toString();
        token = jwt.sign({User:{ _id: userId }}, process.env.JWT_SECRET);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    describe('POST /createGroup', () => {
        it('should create a group successfully', async () => {
            const reqBody = { name: 'Test Group', description: 'Test Description', members: [] };

            const response = await request(app)
                .post('/groups/createGroup')
                .set('Authorization', `Bearer ${token}`)
                .send(reqBody);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.groupId).toBeTruthy();

            const group = await Groups.findOne({ name: 'Test Group' });
            expect(group).not.toBeNull();
        });

        it('should return 400 for invalid group name', async () => {
            const reqBody = { name: '', description: 'Test Description', members: [] };

            const response = await request(app)
                .post('/groups/createGroup')
                .set('Authorization', `Bearer ${token}`)
                .send(reqBody);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('"name" is not allowed to be empty');
        });

        it('should return 401 if user is not authenticated', async () => {
            const reqBody = { name: 'Test Group', description: 'Test Description', members: [] };

            const response = await request(app)
                .post('/groups/createGroup')
                .send(reqBody);

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('No token provided');
        });

        it('should return 400 if description is too short', async () => {
            const reqBody = { name: 'Test Group', description: 'a', members: [] };

            const response = await request(app)
                .post('/groups/createGroup')
                .set('Authorization', `Bearer ${token}`)
                .send(reqBody);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('"description" length must be at least 5 characters long');
        });
    });
}); 
