const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
// Passport plugin adds on:
//  - field for username and password, makes sure usernames are unique, gives some additional methods we can use
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
