


const Booking = require("../models/booking");

module.exports.myBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id,
        })
            .populate("listing")
            .sort({ bookedAt: -1 });

        const totalBookings = bookings.length;

        const cancelled = bookings.filter(
            booking => booking.status === "Cancelled"
        ).length;

        const completed = bookings.filter(
            booking => booking.status === "Completed"
        ).length;

        const upcoming = bookings.filter(
            booking => booking.status === "Confirmed"
        ).length;

        res.render("bookings/index", {
            bookings,
            totalBookings,
            cancelled,
            completed,
            upcoming,
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to load bookings.");
        res.redirect("/");
    }
};