const express = require("express");
const mongoose = require("mongoose");
const {
  getCryptoPrices,
  getHistoricalData
} = require("../handlers/cryptoprice");
const { handleVoting, getVotes } = require("../handlers/voting");

const router = express.Router({ mergeParams: true });

router.route("/price").get(getCryptoPrices);
router.route("/rating/edit").post(handleVoting);
router.route("/rating").get(getVotes);
router.route("/histdata/:coin/:days").get(getHistoricalData);

module.exports = router;
