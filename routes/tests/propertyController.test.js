// tests/unit/controllers/propertyController.test.js
const propertyController = require('../../../controllers/propertyController');
const Property = require('../../../model/Property');

// Mock Property model
jest.mock('../../../model/Property');

describe('Property Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addProperty', () => {
    it('should add a property', async () => {
      // Mock request data
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        contactInfo: '123-456-7890',
        propertyType: 'sell',
        location: 'New York',
        price: 500000,
        images: 'image-data'
      };

      // Mock Property.create
      Property.create.mockResolvedValue({
        id: 1,
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Call the controller method
      await propertyController.addProperty(req, res);

      // Assertions
      expect(Property.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        firstName: 'John',
        lastName: 'Doe'
      }));
    });

    it('should handle errors when adding a property', async () => {
      // Mock request data
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        contactInfo: '123-456-7890',
        propertyType: 'sell',
        location: 'New York',
        price: 500000,
        images: 'image-data'
      };

      // Mock Property.create to throw an error
      Property.create.mockRejectedValue(new Error('Database error'));

      // Call the controller method
      await propertyController.addProperty(req, res);

      // Assertions
      expect(Property.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Server error'
      }));
    });
  });

  describe('getProperties', () => {
    it('should get all properties for sale', async () => {
      // Mock properties data
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

      // Mock Property.findAll
      Property.findAll.mockResolvedValue(mockProperties);

      // Call the controller method
      await propertyController.getProperties(req, res);

      // Assertions
      expect(Property.findAll).toHaveBeenCalledWith({
        where: {
          propertyType: 'sell'
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProperties);
    });

    it('should handle no properties found', async () => {
      // Mock Property.findAll to return empty array
      Property.findAll.mockResolvedValue([]);

      // Call the controller method
      await propertyController.getProperties(req, res);

      // Assertions
      expect(Property.findAll).toHaveBeenCalledWith({
        where: {
          propertyType: 'sell'
        }
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'No properties available for sale.'
      }));
    });

    it('should handle errors when getting properties', async () => {
      // Mock Property.findAll to throw an error
      Property.findAll.mockRejectedValue(new Error('Database error'));

      // Call the controller method
      await propertyController.getProperties(req, res);

      // Assertions
      expect(Property.findAll).toHaveBeenCalledWith({
        where: {
          propertyType: 'sell'
        }
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Server error'
      }));
    });
  });
});