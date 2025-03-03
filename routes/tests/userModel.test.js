const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('../model/user'); // Correct path to your user.js file
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword123'),
  compare: jest.fn().mockResolvedValue(true),
}));
const sequelize = new Sequelize('sqlite::memory:', { logging: false });
describe('User Model', () => {
  beforeAll(async () => {
    User.init(sequelize);

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  afterEach(async () => {
    // Clear the User table after each test
    await User.destroy({ truncate: true });
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    // Mock data
    const userData = {
      name: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('hashedpassword123'); // Password should be hashed
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10); // Ensure bcrypt.hash was called
  });

  it('should compare passwords correctly', async () => {
    const userData = {
      name: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123',
    };

    const user = await User.create(userData);

    const isMatch = await user.comparePassword('password123');

    expect(isMatch).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123'); // Ensure bcrypt.compare was called
  });

  it('should not hash the password if it is not modified', async () => {
    const userData = {
      name: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };
    const user = await User.create(userData);
    user.name = 'updateduser';
    await user.save();
    expect(bcrypt.hash).toHaveBeenCalledTimes(1); // bcrypt.hash should only be called once (during creation)
  });
});