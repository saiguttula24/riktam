const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../app');
const Users = require('../models/user-model');
const jwt = require('jsonwebtoken');

describe('UserController Tests', () => {
    let mongoServer;
    let token;
    let userId;

    beforeAll(async () => {
        process.env.JWT_SECRET = 'T156asiuIs15f56aI8@67bca5#hak@';
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        userId = new mongoose.Types.ObjectId().toString();
        token = jwt.sign({ User: { _id: userId } }, process.env.JWT_SECRET);

        await Users.create([
            { _id: new mongoose.Types.ObjectId(), email: 'user1@example.com', username: 'user1', password: 'password123', isVerified: true, isAdmin: false },
            { _id: new mongoose.Types.ObjectId(), email: 'user2@example.com', username: 'user2', password: 'password123', isVerified: true, isAdmin: false },
            { _id: new mongoose.Types.ObjectId(), email: 'user3@example.com', username: 'user3', password: 'password123', isVerified: false, isAdmin: false },
            { _id: new mongoose.Types.ObjectId(), email: 'admin@example.com', username: 'admin', password: 'password123', isVerified: true, isAdmin: true },
        ]);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    describe('GET /users', () => {
        it('should return all verified non-admin users', async () => {
            const response = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.users).toHaveLength(2); 
        });

        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .get('/users');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('No token provided');
        });

        it('should return 500 for server errors', async () => {
            jest.spyOn(Users, 'find').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const response = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Internal server error');
        });
    });
});
