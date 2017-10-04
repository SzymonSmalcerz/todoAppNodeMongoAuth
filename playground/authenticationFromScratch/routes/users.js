const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../passport/passport");

const {validateSignUp, schemaSignUp} = require("../validation/validation");
const bodyParser = require("body-parser");


var UserController = require("../controllers/users");
router.route("/signin")
  .post(passport.authenticate('local', {session : false}),UserController.signIn);

router.route("/signup")
  .post(validateSignUp(schemaSignUp),UserController.signUp);

router.route("/secret")
  .get(passport.authenticate('jwt',{ session : false }),UserController.secret);

module.exports = {
  router
};
