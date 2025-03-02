const express = require("express");
const propertyController = require("../controllers/propertyController");

const router = express.Router();

// POST route to add a property
router.post("/sell", propertyController.addProperty);

// GET route to fetch properties that are for sale
router.get("/sell", propertyController.getProperties); // Fixed the route path to '/sell'

module.exports = router;
