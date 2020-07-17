// MAIN FUNCTION 
// Dependencies
const express               = require("express"),
      parser                = require("body-parser"),
      mongoose              = require("mongoose"),
      local                 = require("passport-local"),
      passport              = require("passport"),
      User                  = require("./models/user");
    //   seedDB                = require("./seedDB");

const app = express();

const campgroundRoutes = require("./routes/campgrounds"),
      authRoutes       = require("./routes/auth"),
      commentRoutes    = require("./routes/comments");

// seedDB();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(parser.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});


// =====================
// Passport Config
// =====================

app.use(require("express-session")({
    secret: "FCBarcelona is the best team in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(request, response, next){
    response.locals.currentUser = request.user;
    next();
});


// Routes
app.use(campgroundRoutes);
app.use(authRoutes);
app.use(commentRoutes);


// Server listen
app.listen(3000, function() {
    console.log("Server Started");
});