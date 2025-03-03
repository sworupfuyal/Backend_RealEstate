const userController = require('../../../controllers/userController');
const pool = require('../../../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../../database/db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should register a new user', async () => {
      // Mock request data
      req.body = {
        name: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock pool.query to return no existing user
      pool.query.mockResolvedValueOnce({ rows: [] });

      // Mock bcrypt.hash
      bcrypt.hash.mockResolvedValue('hashedpassword123');

      // Mock pool.query to return the new user
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword123',
          },
        ],
      });

      // Call the controller method
      await userController.signup(req, res);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        ['testuser', 'test@example.com', 'hashedpassword123']
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: 'testuser',
          email: 'test@example.com',
          password: 'hashedpassword123',
        })
      );
    });

    it('should return 400 if user already exists', async () => {
      // Mock request data
      req.body = {
        name: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock pool.query to return an existing user
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            email: 'test@example.com',
          },
        ],
      });

      // Call the controller method
      await userController.signup(req, res);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      // Mock request data
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock pool.query to return a user
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword123',
          },
        ],
      });

      // Mock bcrypt.compare to return true
      bcrypt.compare.mockResolvedValue(true);

      // Mock jwt.sign to return a token
      jwt.sign.mockReturnValue('mockedtoken123');

      // Call the controller method
      await userController.login(req, res);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ token: 'mockedtoken123' });
    });

    it('should return 400 if user not found', async () => {
      // Mock request data
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock pool.query to return no user
      pool.query.mockResolvedValueOnce({ rows: [] });

      // Call the controller method
      await userController.login(req, res);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});