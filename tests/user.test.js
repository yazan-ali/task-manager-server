const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const app = require('../app');

// Mocks
jest.mock('../models/User');
jest.mock('bcryptjs');

describe('User Controllers', () => {
    // Mock data for tests
    const mockUser = {
        username: 'mockuser',
        password: 'mockpassword'
    };

    describe('signup', () => {
        it('should create a new user', async () => {
            User.findOne.mockResolvedValueOnce(null); // User does not exist
            User.prototype.save.mockResolvedValueOnce(mockUser); // Save mock user

            const res = await request(app)
                .post('/users/signup')
                .send(mockUser);
            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(jwt.verify(res.body.token, process.env.JWT_SECRET)).toBeTruthy();
        });

        it('should return 400 if user already exists and return the right error meesage', async () => {
            User.findOne.mockResolvedValueOnce(mockUser); // User already exists

            const res = await request(app)
                .post('/users/signup')
                .send({ username: 'mockuser', password: 'mockpassword' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('User already exist');
        });

        describe('empty values', () => {
            it('should should return 400 if the username is empty and return the right error meesage', async () => {
                const res = await request(app)
                    .post('/users/signup')
                    .send({ username: '', password: 'testpassword' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('Username can not be empty');
            });

            it('should should return 400 if the password is empty and return the right error meesage', async () => {
                const res = await request(app)
                    .post('/users/signup')
                    .send({ username: 'testuser', password: '' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('Password can not be empty');
            });
        });

    });

    describe('login', () => {
        it('should log in if the user is already exist', async () => {
            User.findOne.mockResolvedValueOnce(mockUser); // User exists

            bcrypt.compare.mockResolvedValueOnce(true); // Mock password comparison

            const res = await request(app)
                .post('/users/login')
                .send({ username: 'mockuser', password: 'mockpassword' });

            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(jwt.verify(res.body.token, process.env.JWT_SECRET)).toBeTruthy();
        });

        it('should return 400 if the password is invalid', async () => {
            User.findOne.mockResolvedValueOnce(mockUser); // User exists

            bcrypt.compare.mockResolvedValueOnce(false); // Mock password comparison

            const res = await request(app)
                .post('/users/login')
                .send({ username: 'mockuser', password: 'wrongmockpassword' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid credentials');
        });

        it('should return 404 if user not found', async () => {
            User.findOne.mockResolvedValueOnce(null); // User does not exist

            const res = await request(app)
                .post('/users/login')
                .send({ username: 'nonexistentuser', password: 'testpassword' });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('User not found');
        });
    });
});
