const mongoose = require("mongoose");

const taskUpdate = new mongoose.Schema({
    id: {type: String, required: true},
    taskdata: {type: String, required: true}
});

const model = mongoose.model("task", taskUpdate);

module.exports = model;