if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();

const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// MONGO_URL = it is used for storing the info of session in "local database" (memory store)
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const ExpressError = require("./utils/ExpressError.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// restructuring the listing
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
// const MongoStore = require('connect-mongo');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

// dburl = it is used for storing the info in Atlas database 
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

// if the error is found in mongo store
store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

// Sessions options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxage: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// // root route
// app.get("/", (req, res) => {
//     res.send("Hii, I am root");
// });

// For Using sessions
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});

// error handling
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
});

// starting the server
app.listen(8080, () => {
    console.log("server is listening on port: 8080")
});




