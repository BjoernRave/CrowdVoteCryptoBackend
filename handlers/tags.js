const db = require("../models");

exports.getTags = async function(req, res, next) {
  try {
    const tags = await db.Tags.find();
    return res.status(200).json(tags);
  } catch (err) {
    return next(err);
  }
};

exports.createTag = async function(req, res, next) {
  try {
    console.log("create a tag");
    const tag = await db.Tags.create({
      text: req.body.text,
      symbol: req.params.symbol,
      user: req.body.user,
      votes: 0
    });
    return res.status(200).json(tag);
  } catch (err) {
    return next(err);
  }
};

exports.removeTag = async function(req, res, next) {
  try {
    console.log("tag removing");
    const removedTag = await db.Tags.findByIdAndRemove(req.params.id);
    return res.status(200).json(removedTag);
  } catch (err) {
    return next(err);
  }
};

exports.voteTag = async function(req, res, next) {
  try {
    const tag = await db.Tags.findByIdAndUpdate(req.params.id, {
      votes: req.body.vote
    });
    console.log(req.body.vote);
    return res.status(200).json(tag);
  } catch (err) {
    return next(err);
  }
};
