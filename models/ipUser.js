const mongoose = require("mongoose");

const ipUserSchema = mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  voted: {
    type: Object,
    required: true
  },
  tagvoted: {
    type: Object
  }
});

const ipUser = mongoose.model("IPUser", ipUserSchema);
module.exports = ipUser;
