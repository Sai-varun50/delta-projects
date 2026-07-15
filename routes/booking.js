const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");


// My Bookings
router.get("/", isLoggedIn, async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("listing");

    res.render("bookings/index", { bookings });
});

// Create Booking
router.post("/:id", isLoggedIn, async (req, res) => {
    try {
        const { checkIn, checkOut, guests } = req.body;

        const listing = await Listing.findById(req.params.id);
        if (listing.owner.equals(req.user._id)) {
    req.flash("error", "You cannot book your own listing.");
    return res.redirect(`/listings/${listing._id}`);
}
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (end <= start) {
            req.flash("error", "Check-out date must be after check-in.");
            return res.redirect(`/listings/${listing._id}`);
        }

        const days = Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        );

        const totalPrice = days * listing.price;

        const booking = new Booking({
            listing: listing._id,
            user: req.user._id,
            checkIn,
            checkOut,
            guests,
            totalPrice,
        });

        await booking.save();

        req.flash("success", "Booking created successfully!");
        res.redirect("/bookings");
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings");
    }
});

// Cancel Booking
router.delete("/:id", isLoggedIn, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);

        req.flash("success", "Booking cancelled successfully!");
        res.redirect("/bookings");
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to cancel booking.");
        res.redirect("/bookings");
    }
});

module.exports = router;