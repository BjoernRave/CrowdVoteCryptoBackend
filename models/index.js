const mongoose = require("mongoose");
// mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect(
  "mongodb: //zarazas:fridolin96@ds245170.mlab.com:45170/crowdvotecrypto",

  {
    keepAlive: true
  }
);

module.exports.User = require("./user");
module.exports.Message = require("./message");
module.exports.CryptoPrice = require("./CryptoPrice");
module.exports.Tags = require("./tags");

// process.env.MONGODB_URI || "mongodb://localhost/CryptoRateProject",
