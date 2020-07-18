function isLoggedIn(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect("/login");
}


// Main Function
const express  = require("express"),
      router   = express.Router(),
      passport = require("passport"),
      User     = require("../models/user");

// =======
// Routes
// =======


// SignIn-SignUp form routes
router.get("/login", (request, response) => {
    response.render("user/authForms", {currentuser: request.user});
});

// SignUp post route
router.post("/signup", (request, response) => {
    User.register(new User(
    {
        name: request.body.name,
        email: request.body.email,
        phone: request.body.phone,
        username: request.body.username 

    }),request.body.password, (err, createdUser) => {

        if (err) {
            console.log(err);
            return response.redirect("/");
        }
        passport.authenticate("local")(request, response, () => {
            response.redirect("/campgrounds");
        });
    });
});

// Login post route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", failureRedirect: "/login"
    }),
    (request, response) => {});

// Logout route
router.get("/logout", (request, response) => {
    request.logout();
    response.redirect("/");
});

// User show route
router.get("/:user", (request, response) => {
    User.findOne({username: request.params.user}).populate("campgroundsAdded").exec((err, foundUser) => {
        response.render("user/userShow", {user: foundUser, currentUser: request.user});
    });
    
});


// ==========
// End Routes
// ==========

module.exports = router;