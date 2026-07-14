const User = require("../models/user");

module.exports.addToWishlist = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    // Prevent duplicate entries
    if (!user.wishlist.includes(id)) {
        user.wishlist.push(id);
        await user.save();
        req.flash("success", "Added to wishlist!");
    } else {
        req.flash("success", "Already in wishlist!");
    }

    res.redirect(`/listings/${id}`);
};


module.exports.showWishlist = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("wishlist");

    res.render("users/wishlist.ejs", {
        listings: user.wishlist,
    });
};