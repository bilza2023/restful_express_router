const mongoose = require('mongoose');

// I am keeping this Schema for Demo purpose only
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
  });

  module.exports = UserSchema;