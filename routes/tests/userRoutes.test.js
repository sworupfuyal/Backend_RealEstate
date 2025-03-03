// tests/integration/routes/userRoutes.test.js
const request = require('supertest');
const express = require('express');
const userRoutes = require('../../../routes/userRoute');
const userController = require('../../../controllers/userController');

// Mock userController
jest.mock('../../../controllers/userController');

// Create express app for testing
const app = express();
app.use(express.json());
app.use('/api', userRoutes);

describe('User API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      // Mock implementation for register
      userController.register.mockImplementation((req, res) => {
        res.status(201).json({ message: 'User registered successfully' });
      });

      // Test data
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      // Make request
      const response = await request(app)
        .post('/api/register')
        .send(userData);

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User registered successfully' });
      expect(userController.register).toHaveBeenCalled();
    });
  });

  describe('POST /api/login', () => {
    it('should login a user and return a token', async () => {
      // Mock implementation for login
      userController.login.mockImplementation((req, res) => {
        res.json({ token: 'mockedtoken123', user: { id: 1, username: 'testuser' } });
      });

      // Test data
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Make request
      const response = await request(app)
        .post('/api/login')
        .send(loginData);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mockedtoken123');
      expect(userController.login).toHaveBeenCalled();
    });
  });
});