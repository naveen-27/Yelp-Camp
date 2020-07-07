const mongoose = require("mongoose");

const campSchema = mongoose.Schema({
    name: String,
    image: String,
    cost: Number,
    rating: Number,
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } ],
});

module.exports = mongoose.model("Campground", campSchema);