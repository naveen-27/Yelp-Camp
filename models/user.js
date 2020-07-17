const mongoose              = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    username: String,
    joined: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);