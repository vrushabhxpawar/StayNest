const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/user.js");

router.get("/logout", userControllers.logout);

router
  .route("/login")
  .get(userControllers.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControllers.login
  );

router
  .route("/signup")
  .get(userControllers.renderSignupForm)
  .post(userControllers.signup);

module.exports = router;
