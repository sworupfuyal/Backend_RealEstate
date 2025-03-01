const { validationResult } = require("express-validator"); // Add this line
const pool = require("../database/db");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    console.log("Received signup request:", req.body); // Log the request body
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array()); // Log validation errors
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            console.log("User already exists:", email); // Log duplicate user
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );

        console.log("New user created:", newUser.rows[0]); // Log the new user
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error("Signup error:", err.message); // Log the error
        res.status(500).json({ message: "Server error" });
    }
};