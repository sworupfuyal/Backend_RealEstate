const request = require('supertest');
const express = require('express');
const propertyRoutes = require('../../../routes/propertyRoute');
const propertyController = require('../../../controllers/propertyController');

jest.mock('../../../controllers/propertyController');

const app = express();
app.use(express.json());
app.use('/api/properties', propertyRoutes);

describe('Property API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/properties/sell', () => {
    it('should add a property', async () => {
      propertyController.addProperty.mockImplementation((req, res) => {
        res.status(201).json({
          id: 1,
          ...req.body
        });
      });

      // Test data
      const propertyData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        contactInfo: '123-456-7890',
        propertyType: 'sell',
        location: 'New York',
        price: 500000,
        images: 'image-data'
      };

      // Make request
      const response = await request(app)
        .post('/api/properties/sell')
        .send(propertyData);

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('firstName', 'John');
      expect(propertyController.addProperty).toHaveBeenCalled();
    });
  });

  describe('GET /api/properties/sell', () => {
    it('should get all properties for sale', async () => {
      // Mock data
      const mockProperties = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          contactInfo: '123-456-7890',
          propertyType: 'sell',
          location: 'New York',
          price: 500000,
          images: 'image-data'
        }
      ];

      // Mock implementation for getProperties
      propertyController.getProperties.mockImplementation((req, res) => {
        res.status(200).json(mockProperties);
      });

      // Make request
      const response = await request(app)
        .get('/api/properties/sell');

      // Assertions
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(propertyController.getProperties).toHaveBeenCalled();
    });

    it('should handle no properties found', async () => {
      // Mock implementation for getProperties (no properties)
      propertyController.getProperties.mockImplementation((req, res) => {
        res.status(404).json({ message: 'No properties available for sale.' });
      });

      // Make request
      const response = await request(app)
        .get('/api/properties/sell');

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No properties available for sale.');
      expect(propertyController.getProperties).toHaveBeenCalled();
    });
  });
});