const mongoose = require("mongoose");
// mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/CryptoRateProject",
  {
    keepAlive: true
  }
);

module.exports.User = require("./user");
module.exports.Message = require("./message");
module.exports.CryptoPrice = require("./CryptoPrice");
module.exports.Tags = require("./tags");
