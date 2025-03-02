const pool = require('../database/db');

class Property {
  // Create a new property
  static async create(propertyData) {
    const {
      firstName,
      lastName,
      email,
      contactInfo,
      propertyType,
      location,
      price,
      images,
    } = propertyData;

    const query = `
      INSERT INTO properties (firstName, lastName, email, contactInfo, propertyType, location, price, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [firstName, lastName, email, contactInfo, propertyType, location, price, images];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the newly inserted property
    } catch (err) {
      console.error('Error adding property:', err.message);
      throw new Error('Error adding property to the database');
    }
  }

  // Get all properties
  static async findAll() {
    const query = 'SELECT * FROM properties;';
    try {
      const result = await pool.query(query);
      return result.rows;  // Return the list of all properties
    } catch (err) {
      console.error('Error fetching properties:', err.message);
      throw new Error('Error fetching properties from the database');
    }
  }
}

module.exports = Property;
