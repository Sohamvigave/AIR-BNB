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
        url: String,
        filename: String,
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
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
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

