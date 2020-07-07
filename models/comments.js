const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    author: String,
    content: String
});

module.exports = mongoose.model("Comment", commentSchema);