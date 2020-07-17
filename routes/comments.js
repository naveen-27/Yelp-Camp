function addComment(newComment, campId, user) {

    newComment.author = user._id;
    newComment.username = user.username;

    Comment.create(newComment).then((comment) => {
        Campground.findById(campId, (err, foundCamp) => {

            if (err) console.log(err);
            else {
                foundCamp.comments.push(comment._id);
                foundCamp.save().catch((err) => {
                    console.log(err);
                })
            }
        });
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
      Comment    = require("../models/comment"),
      Campground = require("../models/campground");


// =======
// Routes
// =======


// New Comment post route
router.post("/campgrounds/:id/comment/new", isLoggedIn, (request, response) => {
    addComment(request.body, request.params.id, request.user);
    response.redirect(`/campgrounds/${request.params.id}`);
});


// ==========
// End Routes
// ==========

module.exports = router;