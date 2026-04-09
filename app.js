const express =  require("express");
const app = express();
const mongoose =  require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

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

// Root Api
app.get("/",(req,res)=>{
    res.send("hellow");
});

// index route
app.get("/listings",async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});

// show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
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