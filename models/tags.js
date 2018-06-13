const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  votes: {
    type: Array,
    required: true
  }
});

const Tags = mongoose.model("Tags", TagSchema);
module.exports = Tags;
