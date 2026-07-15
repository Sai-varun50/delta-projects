

require("dotenv").config(); 


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
// console.log(MongoStore);
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Booking = require("./models/booking");




const bookingRoutes = require("./routes/booking");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");
const wishlistRouter = require("./routes/wishlist");

const dbUrl = process.env.ATLAS_URL;

main().then(() => {
    console.log("connected to db");
})
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(dbUrl)
}
app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in the mongo session store", err);
});

const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// app.get("/", (req, res) => {
//     res.send("hi, i am root");
// })



app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.userWishlist = req.user ? req.user.wishlist : [];

        res.locals.search = req.query.search || "";


    next();
});


app.get("/demouser", async (req, res) => {
    let fakeuser = new User({ 
        email: "demo@example.com",
        username: "demo"
    });
    let newuser = await User.register(fakeuser, "demopassword");
    res.send(newuser);
});

app.use("/listings", listingRoutes);

app.use("/listings/:id/reviews", reviewRoutes);
app.use("/users", userRoutes);
app.use("/wishlist", wishlistRouter);
app.use("/bookings", bookingRoutes);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});
app.listen(8080, () => {
    console.log("server is listenting to port 8080");

});