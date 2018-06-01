const db = require("../models");

let votes = {};

exports.handleVoting = async function(req, res, next) {
  try {
    if (typeof votes[req.body.symbol] === "undefined") {
      votes[req.body.symbol] = {
        voteScore: req.body.amount,
        voteCount: 1,
        voteResult: req.body.amount
      };
    } else {
      let score = votes[req.body.symbol].voteScore + req.body.amount;
      let count = votes[req.body.symbol].voteCount + 1;
      let result = score / count;

      result = +result.toFixed(2);
      votes[req.body.symbol] = {
        voteScore: score,
        voteCount: count,
        voteResult: result
      };
    }

    return res.status(200).json(votes);
  } catch (err) {
    return next(err);
  }
};
exports.getVotes = async function(req, res, next) {
  try {
    return res.status(200).json(votes);
  } catch (err) {
    return next(err);
  }
};
