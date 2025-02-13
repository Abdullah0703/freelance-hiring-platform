const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.Number,
    auto: false, // Let MongoDB handle generating ObjectId
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

