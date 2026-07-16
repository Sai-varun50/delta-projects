const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const profileController = require("../controller/profile");

router.get("/", isLoggedIn, profileController.myDashboard);



module.exports = router;