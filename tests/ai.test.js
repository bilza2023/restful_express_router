const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const RestfulExpressRouter = require('../index.js');
const login = require('../src/login.js');

// Mock dependencies
jest.mock('mongoose');
jest.mock('jsonwebtoken');
jest.mock('../src/login.js');

// Mock User model
const mockUser = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
};

const mockUserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

mongoose.model.mockReturnValue(mockUser);

// Setup express app and router for testing
const app = express();
app.use(express.json());
const router = new RestfulExpressRouter(mockUser);
app.use('/users', router.getRouter());

// Utility function to generate a valid JWT token
const generateValidToken = () => {
  return jwt.sign({ id: 'testuser' }, process.env.JWT_SECRET);
};

describe('RestfulExpressRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const mockUsers = [{ id: '1', name: 'User 1' }, { id: '2', name: 'User 2' }];
      mockUser.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue(mockUsers),
      });
      mockUser.countDocuments.mockResolvedValue(2);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it('should handle errors', async () => {
      mockUser.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: '1', name: 'User 1' };
      mockUser.findById.mockResolvedValue(mockUser);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if user not found', async () => {
      mockUser.findById.mockResolvedValue(null);

      const response = await request(app).get('/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'New User', email: 'new@example.com' };
      const savedUser = { id: '3', ...newUser };
      mockUser.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(savedUser),
      }));

      const response = await request(app)
        .post('/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(savedUser);
    });

    it('should handle validation errors', async () => {
      mockUser.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Validation error')),
      }));

      const response = await request(app)
        .post('/users')
        .send({ invalid: 'data' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Validation error' });
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      const updatedUser = { id: '1', name: 'Updated User' };
      mockUser.findByIdAndUpdate.mockResolvedValue(updatedUser);
      const token = generateValidToken();

      const response = await request(app)
        .put('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated User' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });

    it('should return 404 if user not found', async () => {
      mockUser.findByIdAndUpdate.mockResolvedValue(null);
      const token = generateValidToken();

      const response = await request(app)
        .put('/users/999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated User' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    it('should return 403 if no token provided', async () => {
      const response = await request(app)
        .put('/users/1')
        .send({ name: 'Updated User' });

      expect(response.status).toBe(403);
    });

    it('should return 403 if invalid token provided', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      const response = await request(app)
        .put('/users/1')
        .set('Authorization', 'Bearer invalid_token')
        .send({ name: 'Updated User' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const deletedUser = { id: '1', name: 'Deleted User' };
      mockUser.findByIdAndDelete.mockResolvedValue(deletedUser);

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Item deleted successfully' });
    });

    it('should return 404 if user not found', async () => {
      mockUser.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete('/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });
  });

  describe('POST /users/login', () => {
    it('should log in a user', async () => {
      const loginResponse = { token: 'valid_token' };
      login.mockResolvedValue(loginResponse);

      const response = await request(app)
        .post('/users/login')
        .send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(loginResponse);
    });

    it('should handle login errors', async () => {
      login.mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/users/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).toBe(404);
    //   expect(response.body).toEqual({ error: 'Invalid credentials' });
    });
  });
});