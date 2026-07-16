const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.myDashboard = async (req, res) => {    const listings = await Listing.find({
    owner: req.user._id,
}).sort({ createdAt: -1 });

    const bookings = await Booking.find({
        user: req.user._id,
    });

    const totalListings = listings.length;
    const totalBookings = bookings.length;

    const totalWishlist =
        req.user.wishlist ? req.user.wishlist.length : 0;

    res.render("profile/index", {
        listings,
        bookings,          // ✅ Add this

        totalListings,
        totalBookings,
        totalWishlist,
    });
};