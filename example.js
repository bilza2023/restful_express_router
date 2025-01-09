require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const RestfulExpressRouter = require('./index.js'); 

const app = express();
app.use(express.json());

// Define a simple Mongoose model
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

let restfulExpressRouter = new RestfulExpressRouter(User);

app.use('/users', restfulExpressRouter.getRouter());



app.get('/', (req, res) => res.status(200).json({ message: "Welcome to ExpressRestRouter 0.0.1" }));




// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

