const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoute");

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config(); // Load environment variables
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Verify it's loaded

// Mount the user routes
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});