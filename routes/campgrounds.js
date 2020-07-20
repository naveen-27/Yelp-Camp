function addCampground(CampPost, user) {
    CampPost.owner = user.username;

    Campground.create(CampPost).then((ground) => {
        User.findById(user._id, (err, foundUser) => {
            foundUser.campgroundsAdded.push(ground._id);
            foundUser.save();
        });
    });
}

function formatAddress(address) {
    var ar = address.split(",");

    for (var i = 0; i < ar.length; i++) {
        ar[i] = ar[i].trim().replace(" ", "+");
    }
    address = ar.join();

    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyDyV8grOSb_vfPrEynVo44jW-yqGkqOKz0&q=${address}`;
}

function searchCamp(name, response) {
    name = name.search.toLowerCase();
    var foundCamps = [];
    Campground.find({}, (err, camps) => {
        if (err) {
            console.log(err);
            return [];
        } else {
            camps.forEach((camp) => {
                if (camp.name.toLowerCase().includes(name)) {
                    foundCamps.push(camp);
                }
            });

            if (foundCamps === []) {
                response.redirect("/campgrounds");
            } else {
                response.render("campground/campgrounds", {grounds: foundCamps});
            }
        }
    });
}


// Main Function
const express    = require("express"),
      router     = express.Router(),
      User       = require("../models/user"),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");


// =======
// Routes
// =======


// Landing/HomePage route
router.get("/", (request, response) => {
    response.render("generic/landing");
});

// Campgrounds list route
router.get("/campgrounds", (request, response) => {
    Campground.find({}, (err, allCamps) => {
        if (err || !allCamps) response.redirect("/");
        else response.render("campground/campgrounds", {grounds: allCamps, currentUser: request.user});
    });
});

// Camgground add form route
router.get("/campgrounds/new", middleware.isLoggedIn, (request, response) => {
    response.render("campground/campgroundNew", {currentUser: request.user});
});

// campground add post route
router.post("/campgrounds", middleware.isLoggedIn, (request, response) => {
    addCampground(request.body.campground, request.user);
    response.redirect("/campgrounds");
});

// Search campground route
router.get("/campgrounds/q", (request, response) => {
    foundCamps = searchCamp(request.query, response);
});

// Campground show route
router.get("/campgrounds/:id", (request, response) => {
    Campground.findById(request.params.id).populate("comments").exec((err, camp) => {
        if (err || !camp) {
            request.flash("error", "Requested Campground Not Found");
            response.redirect("/campgrounds");
        } else {
            let src = formatAddress(camp.location);
            response.render("campground/campgroundShow", {ground: camp, currentUser: request.user, link: src});
        }
    });
});

// Campground edit-get route
router.get("/campgrounds/:id/edit", middleware.isAuthorisedCamp, (request, response) => {
    Campground.findById(request.params.id, (err, foundCamp) => {
        response.render("campground/campgroundEdit", {ground: foundCamp});
    });
});

// Campground edit-put route
router.put("/campgrounds/:id", middleware.isAuthorisedCamp, (request, response) => {
    Campground.findByIdAndUpdate(request.params.id, request.body.campground, (err, foundCamp) => {
        if (err) response.redirect("/campgrounds");
        else {
            request.flash("success", "Campground Editted");
            response.redirect(`/campgrounds/${request.params.id}`);
        }
    });
});

// Campground delete route
router.delete("/campgrounds/:id", middleware.isAuthorisedCamp, (request, response) => {
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