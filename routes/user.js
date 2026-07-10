const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapasync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/users/login", failureFlash: true }), wrapasync(userController.login));
// const router = express.Router({ mergeParams: true });
// router.get("/signup", userController.renderSignupForm);
// router.get("/signup", (req, res) => {
//     res.send("Signup route is working");
// });


// router.post("/signup", wrapasync(userController.signup));

// router.get("/login", userController.renderLoginForm);
// router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/users/login", failureFlash: true }), wrapasync(userController.login));


router.get("/logout", userController.logout);

module.exports = router;