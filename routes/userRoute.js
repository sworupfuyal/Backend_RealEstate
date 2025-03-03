const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userController = require("../controllers/userController");
router.post(
  "/signup",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  userController.signup
);
router.post(
    '/login',
    [
      body('email', 'Please include a valid email').isEmail(),
      body('password', 'Password is required').exists(),
    ],
    async (req, res) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }
          const payload = {
          user: {
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
          token,
          user: {
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
          },
        });
      } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Server error' });
      }
    }
  );

module.exports = router;