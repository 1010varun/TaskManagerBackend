const mongoose = require("mongoose");

const taskUpdate = new mongoose.Schema({
    id: {type: String, required: true},
    username: {type: String, required: true},
    task : {type: String, required: true},
});

const model = mongoose.model("task", taskUpdate);

module.exports = model;