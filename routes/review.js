const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");// to handle the error in async functions
const ExpressError = require("../utils/ExpressError.js");// custom error class to handle the error in a better way   
const { listingSchema , reviewSchema } = require("../schema.js");// joi schema for validation
const Review = require("../models/reviews.js");// review model
const Listing = require("../models/listing.js");

// JOI validation middleware
const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
     let msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,msg);
    }else{
        next();
    }
};

// Create Review route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const review = new Review(req.body.review);

    listing.reviews.push(review);

    await review.save();
    await listing.save();
    req.flash("success", "Review added successfully!");

    res.redirect(`/listings/${id}`);
}));

// Delete Review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });// delete the review from the reviews array in the listing document
    await Review.findByIdAndDelete(reviewId);// delete the review from the reviews collection
    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);// go back to the listing page after deleting the review
}));

module.exports = router;