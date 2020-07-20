const { request, response } = require("express");

function addComment(newComment, campId, user) {

    newComment.author = user._id;
    newComment.username = user.username;

    Comment.create(newComment).then((comment) => {
        Campground.findById(campId, (err, foundCamp) => {

            if (err || !foundCamp) {
                request.flash("error", "Comment not found");
                response.redirect("back");
            }
            else {
                foundCamp.comments.push(comment._id);
                foundCamp.rating += parseInt(comment.rating);
                
                foundCamp.save().catch((err) => {
                    request.flash("error", "Comment not found");
                });
            }
        });
    });
}


// Main Function
const express    = require("express"),
      router     = express.Router(),
      Comment    = require("../models/comment"),
      Campground = require("../models/campground"),
      middleware = require("../middleware");


// =======
// Routes
// =======


// New Comment post route
router.post("/campgrounds/:id/comment/new", middleware.isLoggedIn, (request, response) => {
    addComment(request.body, request.params.id, request.user);
    response.redirect(`/campgrounds/${request.params.id}`);
});

// Comment edit route
router.put("/campgrounds/:id/comment/:cmtId", middleware.isAuthorisedCmt, (request, response) => {
    Comment.findByIdAndUpdate(request.params.cmtId, request.body, (err) => {
        if (err) {
            request.flash("error", "Comment Not Found");
            response.redirect("back");
        }
        else response.redirect("back");
    });
});

// Comment delete route
router.delete("/campgrounds/:id/comment/:cmtId/delete", middleware.isAuthorisedCmt, (request, response) => {
    Campground.findById(request.params.id, (err, foundCamp) => {

        if (err || !foundCamp) response.redirect("back");
        else {
            Comment.findById(request.params.cmtId, (err, foundCmt) => {

                if (err || !foundCmt) response.redirect("back");
                else {
                    foundCamp.rating -= foundCmt.rating;

                    let index = foundCamp.comments.indexOf(foundCmt._id);
                    if (index > -1) {
                        foundCamp.comments.splice(index);
                    }

                    foundCamp.save().then(() => {
                        foundCmt.deleteOne();
                        request.flash("success", "Comment Deleted");
                        response.redirect(`/campgrounds/${request.params.id}/`)
                    })
                }
            })
        }
    })
});

// ==========
// End Routes
// ==========

module.exports = router;