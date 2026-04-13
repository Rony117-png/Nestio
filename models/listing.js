const mongoose =  require("mongoose");
const schema = mongoose.Schema;

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
    }
});


// exporting the schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
