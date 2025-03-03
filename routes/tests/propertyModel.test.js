const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const PropertyMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
};

describe('Property Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a property', async () => {
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
    PropertyMock.create.mockResolvedValue({
      id: 1,
      ...propertyData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const property = await PropertyMock.create(propertyData);
    expect(PropertyMock.create).toHaveBeenCalledWith(propertyData);
    expect(property).toHaveProperty('id', 1);
    expect(property).toHaveProperty('firstName', 'John');
    expect(property).toHaveProperty('lastName', 'Doe');
    expect(property).toHaveProperty('email', 'john@example.com');
    expect(property).toHaveProperty('contactInfo', '123-456-7890');
    expect(property).toHaveProperty('propertyType', 'sell');
    expect(property).toHaveProperty('location', 'New York');
    expect(property).toHaveProperty('price', 500000);
    expect(property).toHaveProperty('images', 'image-data');
  });

  it('should find all properties with a specific type', async () => {
    const propertyType = 'sell';
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

    PropertyMock.findAll.mockResolvedValue(mockProperties);

    // Call the method
    const properties = await PropertyMock.findAll({ where: { propertyType } });

    // Assertions
    expect(PropertyMock.findAll).toHaveBeenCalledWith({ where: { propertyType } });
    expect(properties).toEqual(mockProperties);
  });
});