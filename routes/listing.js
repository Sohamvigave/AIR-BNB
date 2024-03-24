const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const review = require("../models/review.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        // populate reviews is used for accessing the full data of that id.
        let listing = await Listing.findById(id).populate("reviews");
        if (!listing) {
            req.flash("error", "Listing you request for does not exist");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    })
);

//create route
router.post(
    "/",

    validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    })
);

//Edit route
router.get(
    "/:id/edit",

    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested(updated) for does not exist");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    })
);

//update route
router.put(
    "/:id",

    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    })
);

//DELETE ROUTE
router.delete(
    "/:id",

    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let delet = await Listing.findByIdAndDelete(id);
        console.log(delet);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    })
);

module.exports = router;