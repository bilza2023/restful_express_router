require('dotenv').config();
const db = require("./mongo.js");
const express = require('express');
const mongoose = require('mongoose');
const createRestfulRouter = require('./routers/createRestfulRouter.js');  // Import the function

const app = express();
app.use(express.json());

// Define a simple Mongoose model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Use the generated router for the User model
app.use('/users', createRestfulRouter(User));
app.get('/', (req, res) => res.status(200).json({ message: "Welcome to Taleem API version 0.0.1" }));




// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

