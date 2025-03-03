// model/user.js
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Initialize Sequelize with your PostgreSQL connection string
const sequelize = new Sequelize('postgres://user:password@localhost:5432/dbname', {
  dialect: 'postgres',
  logging: false, // Disable logging for cleaner output
});

// Define the User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hash password before saving
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

// Method to compare passwords
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;