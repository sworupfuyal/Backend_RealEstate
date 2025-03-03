const express = require("express");
const propertyController = require("../controllers/propertyController");

const router = express.Router();

// POST route to add a property
router.post("/sell", propertyController.addProperty);

// GET route to fetch properties that are for sale
router.get("/sell", propertyController.getProperties);

module.exports = router;

// =================== PROPERTY MODEL ===================
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
      INSERT INTO properties (first_name, last_name, email, contact_info, property_type, location, price, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [firstName, lastName, email, contactInfo, propertyType, location, price, images];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error adding property:', err.message);
      throw new Error('Error adding property to the database');
    }
  }

  // Get all properties with where clause implementation
  static async findAll(options = {}) {
    let query = 'SELECT * FROM properties';
    const values = [];
    
    // Handle the where clause if provided
    if (options.where) {
      const conditions = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(options.where)) {
        // Convert camelCase to snake_case for database column names
        const columnName = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        conditions.push(`${columnName} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
    }
    
    query += ';';
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (err) {
      console.error('Error fetching properties:', err.message);
      throw new Error('Error fetching properties from the database');
    }
  }
}