const mongoose = require("mongoose");

const PriceSchema = mongoose.Schema(
  {
    currency: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const CryptoPrice = mongoose.model("CryptoPrice", PriceSchema);
module.exports = CryptoPrice;
