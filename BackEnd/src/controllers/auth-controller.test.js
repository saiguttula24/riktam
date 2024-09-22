const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const Users = require('../models/user-model');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    process.env.JWT_SECRET = 'T156asiuIs15f56aI8@67bca5#hak@';
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('AuthController Tests', () => {

    let user;

    beforeEach(async () => {
        user = new Users({
            username: 'testuser',
            email: 'testuser@example.com',
            password: await bcrypt.hash('password123', 10),
            isAdmin: true,
            isVerified: true
        });
        await user.save();
    });

    afterEach(async () => {
        await Users.deleteMany({});
    });

    describe('POST /login', () => {
        it('should log in successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeTruthy();
            expect(response.body.user.email).toBe('testuser@example.com');
        });

        it('should return 404 if user is not found', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'nonexistent@example.com', password: 'password123' });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Users not found');
        });

        it('should return 401 if password is incorrect', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'testuser@example.com', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Incorrect password');
        });
    });

    describe('POST /signup', () => {
        it('should successfully verify and update the user', async () => {
            const newUser = new Users({
                username: 'newuser',
                email: 'newuser@example.com',
                password: await bcrypt.hash('temp123', 10),
                isVerified: false
            });
            await newUser.save();

            const response = await request(app)
                .post('/auth/signup')
                .send({ username: 'newuser',email: 'newuser@example.com', password: 'newpassword123' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User verified successfully');
            
            const updatedUser = await Users.findOne({ username: 'newuser' });
            const passwordMatch = await bcrypt.compare('newpassword123', updatedUser.password);
            expect(passwordMatch).toBe(true);
            expect(updatedUser.isVerified).toBe(true);
        });

        it('should return 400 if user does not exist', async () => {
            const response = await request(app)
                .post('/auth/signup')
                .send({ username: 'nonexistent', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('\"email\" is required');
        });
    });

    describe('POST /createUser', () => {
        it('should create a new user if the requester is an admin', async () => {
            const token = jwt.sign({ User: user }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '8h' });

            const response = await request(app)
                .post('/auth/createUser')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'newuser', email: 'newuser@example.com', password: 'password123' });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User created successfully');

            const newUser = await Users.findOne({ username: 'newuser' });
            expect(newUser).toBeTruthy();
            expect(newUser.email).toBe('newuser@example.com');
        });

        it('should return 401 if the requester is not an admin', async () => {
            user.isAdmin = false;
            await user.save();
            const token = jwt.sign({ User: user }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '8h' });

            const response = await request(app)
                .post('/auth/createUser')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'newuser', email: 'newuser@example.com', password: 'password123' });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Unauthorised');
        });
    });
});
