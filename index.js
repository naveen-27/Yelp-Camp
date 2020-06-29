addCampground = campgroundInfo => {
    campgrounds.push(campgroundInfo);
}


// MAIN FUNCTION 

// Dependencies
const express = require("express");
const parser = require("body-parser")

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(parser.urlencoded({extended: true}));

var campgrounds = [
    {
        name: "Barcelona",
        image: "https://images.freeimages.com/images/large-previews/a25/empty-campground-1442093.jpg",
        cost: 10.99,
        rating: 3.25
    },

    {
        name: "Sevilla",
        image: "https://images.freeimages.com/images/small-previews/e4c/camping-tent-1058140.jpg",
        cost: 10.99,
        rating: 3.25
    },

    {
        name: "Svalbard",
        image: "https://images.freeimages.com/images/small-previews/190/tents-1429142.jpg",
        cost: 10.99,
        rating: 3.25
    },

    {
        name: "Flourina",
        image: "https://images.freeimages.com/images/small-previews/fc3/farmington-river-1346136.jpg",
        cost: 10.99,
        rating: 3.25
    }
]

// Landing/HomePage route
app.get("/", (request, response) => {
    response.render("home");
});

// Campgrounds route where all campgrounds are listed
app.get("/campgrounds", (request, response) => {
    response.render("campgrounds", {grounds: campgrounds});
});

// New campground info submit post route
app.post("/campgrounds", (request, response) => {
    addCampground(request.body);
    response.redirect("/campgrounds");
});

// Route to add new campground using form 
app.get("/campgrounds/new", (request, response) => {
    response.render("newCampground");
});

// The serving port & method listening
app.listen(3000, function() {
    console.log("Server Started");
});