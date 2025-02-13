const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true, // Let MongoDB handle generating ObjectId
  },
  sender: {
    type: mongoose.Schema.Types.Number,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.Number,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
  },
  fileType: {
    type: String,
  },
  filePath: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

