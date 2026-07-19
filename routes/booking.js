const express = require("express");
const router = express.Router();

const booking = require("../models/booking");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controller/bookings.js");

// My Bookings

router.get("/", isLoggedIn, bookingController.myBookings);
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
        listing.bookedDates.push({
    start: booking.checkIn,
    end: booking.checkOut,
});
const overlap = listing.bookedDates.some((date) => {
    return (
        booking.checkIn <= date.end &&
        booking.checkOut >= date.start
    );
});

if (overlap) {
    req.flash("error", "These dates are already booked.");
    return res.redirect(`/listings/${listing._id}`);
}
await listing.save();

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
   const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
        req.flash("error", "Booking not found.");
        return res.redirect("/bookings");
    }

    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You are not authorized.");
        return res.redirect("/bookings");
    }

const listing = await Listing.findById(booking.listing);

if (listing) {
    listing.bookedDates = listing.bookedDates.filter(date => {
        return !(
            new Date(date.start).getTime() === booking.checkIn.getTime() &&
            new Date(date.end).getTime() === booking.checkOut.getTime()
        );
    });

    await listing.save();
}

booking.status = "Cancelled";
await booking.save();
    req.flash("success", "Booking cancelled successfully.");
    res.redirect("/bookings");
});

module.exports = router;