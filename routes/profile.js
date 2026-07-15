const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

router.get("/", isLoggedIn, async (req, res) => {
    const listings = await Listing.find({
        owner: req.user._id,
    });

    const bookings = await Booking.find({
        user: req.user._id,
    }).populate("listing");

    res.render("profile/index", {
    listings,
    bookings,
    totalListings: listings.length,
    totalBookings: bookings.length,
});
});

module.exports = router;