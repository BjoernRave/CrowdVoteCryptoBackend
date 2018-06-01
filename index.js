require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const TagRoutes = require("./routes/tags");
const CryptoFetcher = require("./handlers/cryptoprice");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");
const db = require("./models");
const PORT = process.env.PORT || 8081;
const cryptoRoutes = require("./routes/cryptostats");
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use(
  "/api/users/:id/messages",
  loginRequired,
  ensureCorrectUser,
  messagesRoutes
);

app.get("/api/messages/:symbol", async function(req, res, next) {
  try {
    let messages = await db.Message.find({ coin: req.params.symbol });
    // .sort({ createdAt: "desc" })
    // .populate("user", {
    //   username: true,
    //   profileImageUrl: true
    // });
    return res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/messages/:id", async function(req, res, next) {
  try {
    console.log("deleting");
    let message = await db.Message.findByIdAndRemove(req.params.id);
    return res.status(200).json(message);
  } catch (err) {
    console.log("failed");
    return next(err);
  }
});

app.post("/api/messages/", async function(req, res, next) {
  try {
    let message = db.Message.create({
      text: req.body.text,
      user: req.body.user,
      coin: req.body.symbol
    });
    return res.status(200).json({ message: message.text });
  } catch (err) {
    return next(err);
  }
});

app.use("/api/crypto", cryptoRoutes);
app.use("/api/tags", TagRoutes);

app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, function() {
  console.log(`Server is starting on port ${PORT}`);
});
