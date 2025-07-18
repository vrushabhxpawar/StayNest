if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const searchingRoute = require("./Routes/search.js");
const listingRoute = require("./Routes/listing.js");
const reviewRoute = require("./Routes/review.js");
const userRoute = require("./Routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./Models/user.js");


const app = express();
const port = 8080;

// const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionoptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use('/search', searchingRoute );
app.use("/listing", listingRoute);
app.use("/listing/:id/review", reviewRoute);
app.use("/", userRoute);

main()
  .then(() => {
    console.log("DB connected.");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

app.all("*", (req, res, next) => {
  throw new ExpressError(404, "Page not found !");
  next(err);
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Page not found" } = err;
  res.status(status).render("err.ejs", { err });
  // res.send('Something Went Wrong!');
});

app.listen(port, () => {
  console.log(`Server : http://localhost:${port}/listing`);
});
