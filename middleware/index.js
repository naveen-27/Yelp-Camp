const Comment    = require("../models/comment"),
      Campground = require("../models/campground"); 

const middleware = {

    // Logged in check
    isLoggedIn: function(request, response, next) {

        if (request.isAuthenticated()) {
            return next();
        }
        request.flash("error", "You have to be logged in to do that");
        response.redirect("/login");
    },

    // Comment ownership check
    isAuthorisedCmt: function(request, response, next) {

        if (request.isAuthenticated()) {
            Comment.findById(request.params.cmtId, (err, foundCmt) => {

                if (err || !foundCmt) response.send("Comment Not Found");
                else {
                    if (foundCmt.author.equals(request.user._id)) next();
                    else {
                        request.flash("error", "You do not have required permissions");
                        response.redirect("back");
                    }
                }
            });
        }
    },

    // Campground ownership check
    isAuthorisedCamp: function(request, response, next) {

        if (request.isAuthenticated()) {
            Campground.findById(request.params.id, (err, foundCamp) => {
    
                if (err || !foundCamp) response.redirect("back");
                else if (foundCamp.owner === request.user.username) next();
                else {
                    request.flash("error", "You do not have required permissions");
                    response.redirect(`/campgrounds/${request.params.id}`);
                }
            });
        } else {
            request.flash("error", "You have to be logged in to do that");
            response.redirect(`/campgrounds/${request.params.id}`);
        }
    }
}

module.exports = middleware;