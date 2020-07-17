function addCampground(CampPost) {
    new Campground({
        name: CampPost.name,
        image: CampPost.image,
        cost: CampPost.cost,
        rating: CampPost.rating
    }).save().then(() => {
        console.log("New Campground Added.");
    });
}

function isLoggedIn(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect("/login");
}


// Main Function
const express    = require("express"),
      router     = express.Router(),
      Campground = require("../models/campground");


// =======
// Routes
// =======


// Landing/HomePage route
router.get("/", (request, response) => {
    response.render("generic/landing");
});

// Campgrounds route where all campgrounds are listed
router.get("/campgrounds", (request, response) => {
    Campground.find({}, (err, allCamps) => {
        if (err) console.log("DataBase Retrival Error");
        else response.render("campground/campgrounds", {grounds: allCamps, user: request.user});
    });
});

// New campground info submit post route
router.post("/campgrounds", (request, response) => {
    addCampground(request.body);
    response.redirect("/campgrounds");
});

// Route to add new campground using form 
router.get("/campgrounds/new", isLoggedIn, (request, response) => {
    response.render("campground/campgroundNew", {user: request.user});
});

// Campground show route
router.get("/campgrounds/:id", (request, response) => {
    Campground.findById(request.params.id).populate("comments").exec((err, camp) => {
        if (err) console.log(err);
        else {
            response.render("campground/campgroundShow", {ground: camp, user: request.user});
        }
    });
});


// ==========
// End Routes
// ==========

module.exports = router;