const express =  require("express");
const app = express();
const mongoose =  require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");// review model
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");// Helps to create templates & layouts
const wrapAsync = require("./utils/wrapAsync.js");// to handle the error in async functions
const ExpressError = require("./utils/ExpressError.js");// custom error class to handle the error in a better way   
const { listingSchema , reviewSchema } = require("./schema.js");// joi schema for validation

// DataBase Setup connection
main()
.then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Nestio');

}

// setting the ejs view engine
app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

// Root Api
app.get("/",(req,res)=>{
    res.send("hellow");
});

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

const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
     let msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,msg);
    }else{
        next();
    }
};

// index route
app.get("/listings",async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});

// New Route - to create a new Listing
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
});

// Create Review route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    const review = new Review(req.body.review);

    listing.reviews.push(review);

    await review.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}));

// Delete Review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });// delete the review from the reviews array in the listing document
    await Review.findByIdAndDelete(reviewId);// delete the review from the reviews collection

    res.redirect(`/listings/${id}`);// go back to the listing page after deleting the review
}));

//Create route - posting the new created route to DB 
app.post("/listings", validateListing, wrapAsync(async(req,res)=>{
   let result = listingSchema.validate(req.body);
   if(result.error){
    let msg = result.error.details.map(el=>el.message).join(",");
    throw new ExpressError(400,msg);
   }
 const newListing = new  Listing(req.body.Listing);
 await newListing.save();
res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
     let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async(req,res)=>{
    if(!req.body.Listing) throw new ExpressError(400,"Invalid Listing Data");
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.Listing});
   res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// handling all the invalid routes
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode = 500} = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render("listings/error.ejs",{err,statusCode});
    //res.status(statusCode).send(err.message);
});

/* Testing the listing route by adding the sample
app.get("/testListing",async(req,res)=>{
    let sampleListing = new Listing({
        title : "Sagare Villa",
        description : "The luxury villa in affordable price",
        price : 12000,
        location : "Baga , Goa",
        country : "India"
    });
    await sampleListing.save();
    console.log("sample was saved" );
    res.send("sucessful testing!");
});*/

app.listen(1312,()=>{
    console.log("server is listening to port 1312");
});

// we all do initilization part in init folder