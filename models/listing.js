const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema(
{
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,

    category: {
        type: String,
        enum: [
            "Beach",
            "Mountains",
            "Camping",
            "Arctic",
            "Desert",
            "Forest",
            "Castle",
            "Farm",
            "Iconic Cities"
        ],
        default: "Beach"
    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },bookedDates: [
  {
    start: Date,
    end: Date,
  },
],

},
{
    timestamps: true
}
);
listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing.reviews) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;