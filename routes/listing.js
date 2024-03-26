const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const review = require("../models/review.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        // populate reviews is used for accessing the full data of that id.
        const listing = await Listing.findById(id)
            .populate("reviews")
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing you request for does not exist");
            res.redirect("/listings");
        }
        // console.log(listing);
        res.render("listings/show.ejs", { listing });
    })
);

//create route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        console.log(req.user);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    })
);

//Edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
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
    isLoggedIn,
    isOwner,
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
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let delet = await Listing.findByIdAndDelete(id);
        console.log(delet);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    })
);

module.exports = router;