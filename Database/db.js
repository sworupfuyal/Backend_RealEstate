// database/db.js
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER || "postgres", // Replace with your PostgreSQL username
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "elite_residences", // Replace with your database name
    password: process.env.DB_PASSWORD || "admin123", // Replace with your PostgreSQL password
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

// Check Database Connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL Database!"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = pool;
