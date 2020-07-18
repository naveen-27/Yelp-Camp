function addCampground(CampPost, user) {
    new Campground({
        name: CampPost.name,
        image: CampPost.image,
        cost: CampPost.cost,
        rating: CampPost.rating,
        owner: user.username
    }).save().then((ground) => {
        User.findById(user._id, (err, foundUser) => {
            foundUser.campgroundsAdded.push(ground._id);
            foundUser.save();
        })
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
      User       = require("../models/user"),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment");


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
        else response.render("campground/campgrounds", {grounds: allCamps, currentUser: request.user});
    });
});

// New campground info submit post route
router.post("/campgrounds", (request, response) => {
    addCampground(request.body, request.user);
    response.redirect("/campgrounds");
});

// Route to add new campground using form 
router.get("/campgrounds/new", isLoggedIn, (request, response) => {
    response.render("campground/campgroundNew", {currentUser: request.user});
});

// Campground show route
router.get("/campgrounds/:id", (request, response) => {
    Campground.findById(request.params.id).populate("comments").exec((err, camp) => {
        if (err) console.log(err);
        else {
            response.render("campground/campgroundShow", {ground: camp, currentUser: request.user});
        }
    });
});

// Campground edit-get route
router.get("/campgrounds/:id/edit", (request, response) => {
    Campground.findById(request.params.id, (err, foundCamp) => {
        if (err) response.redirect("/campgrounds");
        else {
            response.render("campground/campgroundEdit", {ground: foundCamp});
        }
    });
});

// Campground edit-put route
router.put("/campgrounds/:id", (request, response) => {
    Campground.findByIdAndUpdate(request.params.id, request.body.campground, (err, foundCamp) => {
        if (err) response.redirect("/campgrounds");
        else response.redirect(`/campgrounds/${request.params.id}`);
    });
});

// Campground delete route
router.delete("/campgrounds/:id", (request, response) => {
    Campground.findById(request.params.id, (err, foundCamp) => {
        for (var comment of foundCamp.comments) {
            Comment.findByIdAndDelete(comment);
        }

        User.findOne({username: request.user.username}, (err, foundUser) => {
            if (err) response,redirect("/campgrounds");
            else {
                let index = foundUser.campgroundsAdded.indexOf(foundCamp._id);
                if (index > -1) {
                    foundUser.campgroundsAdded.splice(index);
                    foundUser.save();
                }
            }
        });
    });

    Campground.findByIdAndDelete(request.params.id, (err) => {
        response.redirect("/campgrounds");
    });
});

// ==========
// End Routes
// ==========

module.exports = router;