const mongoose = require("mongoose");

const VoteSchema = mongoose.Schema(
  {
    vote: {
      type: Number,
      required: true
    },
    symbol: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Votes = mongoose.model("Votes", VoteSchema);
module.exports = Votes;
