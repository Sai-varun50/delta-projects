const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Listing = require("../models/listing");
const Review = require("../models/review");
const Booking = require("../models/booking");

const { isLoggedIn, isAdmin } = require("../middleware");

router.get("/", isLoggedIn, isAdmin, async (req, res) => {

    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const latestUsers = await User.find({})
        .sort({ createdAt: -1 })
        .limit(5);

    const latestListings = await Listing.find({})
        .populate("owner")
        .sort({ createdAt: -1 })
        .limit(5);

    res.render("admin/index", {
        totalUsers,
        totalListings,
        totalReviews,
        totalBookings,
        latestUsers,
        latestListings,
    });
});
router.get("/listings", isLoggedIn, isAdmin, async (req, res) => {
    const listings = await Listing.find({}).populate("owner");
    res.render("admin/listings", { listings });
});
router.get("/users", isLoggedIn, isAdmin, async (req, res) => {
    const users = await User.find({})
        .populate("wishlist")
        .sort({ createdAt: -1 });

    res.render("admin/users", { users });
});



module.exports = router;