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
        img :  {
        type :String,
        default : "https://share.google/sssJV755xN4b05gb3",
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
