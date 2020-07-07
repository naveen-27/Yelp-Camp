const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: String,
    pwd: String,
    name: String,
});

module.exports = mongoose.model("User", userSchema);