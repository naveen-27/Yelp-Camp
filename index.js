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

function addComment(newComment, campId) {
    
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

// MAIN FUNCTION 
// Dependencies
const express     = require("express"),
      parser      = require("body-parser"),
      mongoose    = require("mongoose"),
      Campground  = require("./models/campgrounds"),
      Comment     = require("./models/comments"),
      User        = require("./models/users"),
      seedDB      = require("./seedDB");

const app = express();

// seedDB();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(parser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});
    
// Landing/HomePage route
app.get("/", (request, response) => {
    response.render("home");
});


// Campgrounds route where all campgrounds are listed
app.get("/campgrounds", (request, response) => {
    Campground.find({}, (err, allCamps) => {
        if (err) console.log("DataBase Retrival Error");
        else response.render("campgrounds", {grounds: allCamps});
    });
    
});


// New campground info submit post route
app.post("/campgrounds", (request, response) => {
    addCampground(request.body);
    response.redirect("/campgrounds");
});


app.post("/campgrounds/:id/comment/new", (request, response) => {
    addComment(request.body, request.params.id);
    response.redirect(`/campgrounds/${request.params.id}`);
});


// Route to add new campground using form 
app.get("/campgrounds/new", (request, response) => {
    response.render("newCampground");
});


app.get("/campgrounds/:id", (request, response) => {
    Campground.findById(request.params.id).populate("comments").exec((err, camp) => {
        if (err) console.log(err);
        else {
            response.render("campground-show", {ground: camp});
        }
    });

});


// The serving port & method listening
app.listen(3000, function() {
    console.log("Server Started");
});