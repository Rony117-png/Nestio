const mongoose =  require("mongoose");
const schema = mongoose.Schema;
const Review = require("./reviews.js");// importing the review model to delete the reviews associated with the listing when the listing is deleted

// setting the schema
const listingSchema = new schema({
    title :  {
        type :String,
        required : true,
    },
        description :  {
        type :String,
    },
        img: {
                url: String,
                 filename: String,
             },
             
     price :  {
        type :Number,
    },
        location:  {
        type :String,
    },
        country :  {
        type :String,
    },
    reviews : [
        {
            type : schema.Types.ObjectId,
            ref : "Review"
        }
    ]
});

// middleware to delete the reviews associated with the listing when the listing is deleted
listingSchema.post("findOneAndDelete", async function(listing){
    if(listing){
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

// exporting the schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
