const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    if (!alllistings) {
        req.flash("error", "No listings found");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { alllistings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}


module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({path: "reviews", populate: { path: "author" }})
        .populate("owner")
        ;
        // console.log(listing.owner);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}


module.exports.createListing = async (req, res) => {
    // console.log(req.file);
// console.log(req.body);
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
    };

    await newListing.save();

    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        let originalImageUrl =  listing.image.url;
        originalImageUrl.replace("/upload","/upload/h_300,w_250")
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (err) {
        next(err);
    }

}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if (typeof req.file !== "undefined") {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await listing.save();
        req.flash("success", "Successfully updated the listing");

     res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
        req.flash("success", "Successfully deleted the listing");

    res.redirect("/listings");
}