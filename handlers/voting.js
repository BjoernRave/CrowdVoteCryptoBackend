const db = require("../models");

// async function getVotesfromDB() {
//   let votes2 = await db.Votes.find()
//     .sort({ _id: -1 })
//     .limit(1);

//   votes = votes2[0].votes;
// }
// getVotesfromDB();

// exports.handleVoting2 = async function(req, res, next) {
//   try {
//     if (typeof votes[req.body.symbol] === "undefined") {
//       votes[req.body.symbol] = {
//         voteScore: req.body.amount,
//         voteCount: 1,
//         voteResult: req.body.amount
//       };
//     } else {
//       let score = votes[req.body.symbol].voteScore + req.body.amount;
//       let count = votes[req.body.symbol].voteCount + 1;
//       let result = score / count;

//       result = +result.toFixed(2);
//       votes[req.body.symbol] = {
//         voteScore: score,
//         voteCount: count,
//         voteResult: result
//       };
//     }
//     db.Votes.create({
//       votes: votes
//     });
//     return res.status(200).json(votes);
//   } catch (err) {
//     return next(err);
//   }
// };
exports.getVotes = async function(req, res, next) {
  try {
    let votes = {};
    let dbVotes = await db.Votes.find();
    dbVotes.filter(vote => {
      return vote.timestamp > new Date() - 24 * 60 * 60 * 1000;
    });
    await dbVotes.forEach(voteObj => {
      if (votes[voteObj.symbol] === undefined) {
        votes[voteObj.symbol] = {
          voteScore: voteObj.vote,
          voteCount: 1,
          voteResult: voteObj.vote
        };
      } else {
        votes[voteObj.symbol].voteScore += voteObj.vote;
        votes[voteObj.symbol].voteCount += 1;
        votes[voteObj.symbol].voteResult = (
          votes[voteObj.symbol].voteScore / votes[voteObj.symbol].voteCount
        ).toFixed(2);
      }
    });

    return res.status(200).json(votes);
  } catch (err) {
    return next(err);
  }
};

exports.handleVoting = async function(req, res, next) {
  try {
    let newVote = db.Votes.create({
      vote: req.body.amount,
      symbol: req.body.symbol
    });
    return res.status(200).json(newVote);
  } catch (err) {
    return next(err);
  }
};

exports.handleVoting2 = async function(req, res, next) {
  try {
    let lastvote = await db.Votes.findById(req.body.user);
    if (lastvote < new Date() - 12 * 60 * 60 * 1000) {
      let newVote = db.Votes.create({
        vote: req.body.amount,
        symbol: req.body.symbol
      });
      db.User.findByIdAndUpdate(req.body.user, {
        voted: { [req.body.symbol]: new Date() }
      });
      console.log("Vote succeeded");
      return res.status(200).json(newVote);
    } else {
      console.log("Vote failed");

      return res.status(201).json("You already voted in the last 12 hours");
    }
  } catch (err) {
    return next(err);
  }
};
