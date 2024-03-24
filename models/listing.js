const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

//creating the schema for the document / object.
const listingSchema = new Schema({

    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        type: String,
        set: (v) =>
            v === ""
                //if the image is undefinde then use these default link (image-url)
                ? "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                : v,
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


//creating the model Listing using listingSchema
const Listing = mongoose.model("Listing", listingSchema);

//exporting the model in app.js file (model=Listing)
module.exports = Listing;

