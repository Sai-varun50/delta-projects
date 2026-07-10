const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req, res) => {
    console.log(req.body);

    let { id } = req.params;
    // const listing = await Listing.findById(id);
    // console.log(req.params.id);
const listing = await Listing.findById(req.params.id);
// console.log("Listing:", listing);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(listing);
    listing.reviews.push(newReview);

    await newReview.save();

    await listing.save();
        req.flash("success", "Successfully made a new review");


    res.redirect(`/listings/${id}`);
}



module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Successfully deleted the review");
    
    res.redirect(`/listings/${id}`);
}