const Campground  = require("./models/campgrounds"),
      Comment     = require("./models/comments");


var data = [
{
    name: "Cloud's Rest", 
    image: "https://r-cf.bstatic.com/images/hotel/max1024x768/173/173596950.jpg",
    rating: 3.25,
    cost: 20
},
{
    name: "Desert Mesa", 
    image: "https://media-cdn.tripadvisor.com/media/photo-s/01/1c/fd/a6/we-spread-our-tents-across.jpg",
    rating: 3.25,
    cost: 20
},
{
    name: "Canyon Floor", 
    image: "https://media-cdn.tripadvisor.com/media/photo-s/01/1c/fd/a7/the-foliage-was-nice.jpg",
    rating: 3.25,
    cost: 20
}]


async function seedDB() {
    // let comment;

    // await Comment.findById("5f11bd7ffe990b2af46d3954", (err, foundComment) => {
    //     if (err) console.log(err);
    //     else {
    //         comment = foundComment;
    //         console.log("Comment Found");
    //     }
    // });

    await Campground.deleteMany({}, (err) => {
        if (err) console.log(err);
        else console.log("Campground Removed");
    });

    for (let camp of data) {
        Campground.create(camp).then((ground) => {
            console.log("Campground Created");
        });
    }
}

module.exports = seedDB;