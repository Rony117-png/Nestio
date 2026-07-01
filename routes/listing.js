const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");// to handle the error in async functions
const ExpressError = require("../utils/ExpressError.js");// custom error class to handle the error in a better way   
const { listingSchema } = require("../schema.js");// joi schema for validation
const Listing = require("../models/listing.js");


// JOI validation middleware
const validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if(error){
     let msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,msg);
    }else{
        next();
    }
};


// index route
router.get("/",async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});

// New Route - to create a new Listing
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested does not exist or was deleted.");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//Create route - posting the new created route to DB 
router.post("/", validateListing, wrapAsync(async(req,res)=>{
   let result = listingSchema.validate(req.body);
   if(result.error){
    let msg = result.error.details.map(el=>el.message).join(",");
    throw new ExpressError(400,msg);
   }
 const newListing = new  Listing(req.body.Listing);
 await newListing.save();
 req.flash("success","Successfully made a new listing!");
res.redirect("/listings");
}));

// Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
     let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested does not exist or was deleted.");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id", validateListing, wrapAsync(async(req,res)=>{
    if(!req.body.Listing) throw new ExpressError(400,"Invalid Listing Data");
    let {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(!updatedListing){
     req.flash("error", "Listing you requested does not exist or was deleted.");
     return res.redirect("/listings");
    }
    req.flash("success", "Listing updated successfully!");
   res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if(!deletedListing){
        req.flash("error", "Listing was already deleted or does not exist.");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));


module.exports = router;