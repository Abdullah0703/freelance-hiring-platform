const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true, // Let MongoDB handle generating ObjectId
  },
  user: {
    type: mongoose.Schema.Types.Number,
    ref: "User",
    required: true,
    unique: true, // Unique constraint for the user field
  },
  contacts: [
    {
      type: mongoose.Schema.Types.Number,
      ref: "User",
    },
  ],
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;

 
