const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signin = async function(req, res, next) {
  // finding a user
  try {
    let user = await db.User.findOne({
      email: req.body.email
    });
    let { id, username, IPs } = user;

    let isMatch = await user.comparePassword(req.body.password);

    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          username
        },
        process.env.SECRET_KEY
      );
      if (!IPs.includes(req.clientIp)) {
        await db.User.findByIdAndUpdate(id, {
          IPs: [...user.IPs, req.clientIp]
        });
      }
      return res.status(200).json({
        id,
        username,
        token
      });
    } else {
      return next({
        status: 400,
        message: "Invalid Email/Password."
      });
    }
  } catch (e) {
    console.log(e);
    return next({ status: 400, message: "Invalid Email/Password." });
  }
};

exports.signup = async function(req, res, next) {
  try {
    let user = await db.User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      IPs: [req.clientIp],
      voted: { BTC: 0 }
    });
    let { id, username } = user;
    let token = jwt.sign(
      {
        id,
        username
      },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      username,
      token
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry, that username and/or email is taken";
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};
