const express = require("express");
const mongoose = require("mongoose");
const { getTags, createTag, removeTag, voteTag } = require("../handlers/tags");

const router = express.Router({ mergeParams: true });

router.route("/").get(getTags);

router.route("/:symbol").post(createTag);

router
  .route("/:id")
  .put(voteTag)
  .delete(removeTag);

module.exports = router;
