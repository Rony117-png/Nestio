const express =  require("express");
const app = express();
const mongoose =  require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");// Helps to create templates & layouts
const ExpressError = require("./utils/ExpressError.js");// custom error class to handle the error in a better way   

const listings = require("./routes/listing.js");// listing route
const reviews = require("./routes/review.js");// review route

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


app.use("/listings",listings);// listing route
app.use("/listings/:id/reviews",reviews);// review route

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



app.listen(1312,()=>{
    console.log("server is listening to port 1312");
});

// we all do initilization part in init folder