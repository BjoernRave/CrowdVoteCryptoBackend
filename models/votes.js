const mongoose = require("mongoose");

const VoteSchema = mongoose.Schema(
  {
    votes: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Votes = mongoose.model("Votes", VoteSchema);
module.exports = Votes;
