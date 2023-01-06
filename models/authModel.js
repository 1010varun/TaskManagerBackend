const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const userDB = mongoose.model("user", user);

module.exports = userDB;