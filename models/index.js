const mongoose = require("mongoose");
// mongoose.set("debug", true);
mongoose.Promise = Promise;
var options = {
  // server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  // replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

var mongodbUri =
  "mongodb://zarazas:fridolin96@ds245170.mlab.com:45170/crowdvotecrypto";

mongoose.connect(mongodbUri, options);
var conn = mongoose.connection;

conn.on("error", console.error.bind(console, "connection error:"));

module.exports.User = require("./user");
module.exports.Message = require("./message");
module.exports.CryptoPrice = require("./CryptoPrice");
module.exports.Tags = require("./tags");
module.exports.Votes = require("./votes");

// process.env.MONGODB_URI || "mongodb://localhost/CryptoRateProject",
