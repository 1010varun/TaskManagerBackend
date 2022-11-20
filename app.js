const express = require("express");
const mongoose = require('mongoose');
const {urlencoded} = require('express');
const taskManager = require('./model');

const app = express();

const url =
  "mongodb+srv://varun:varunMongoDB@testtask.r6ybeyx.mongodb.net/tasks?retryWrites=true&w=majority";

mongoose.connect(url).then(() => {
    console.log("connected to database ...");
}).catch((err) => {
    console.log("error = ",err);
})
app.use(urlencoded({extended: false}));
app.use(express.json());


app.get("/task", async (req, res) => {
    const dataArray = [];
    const response = await taskManager.find();
    for(let i = 0; i < response.length; i++){
        // console.log({"id":response[i].id, "task": response[i].taskdata});
        dataArray.push({"id":response[i].id, "task": response[i].taskdata});
    }
    // console.log(dataArray);
    res.status(200).json(dataArray);
})

app.post("/appendTask", async (req, res) => {
    // console.log("body = ", req.body);
    await taskManager.create(req.body);
    res.status(200).send("post request successfull");
})

app.delete("/delete/:id", async (req, res) => {
    const {id} = req.params;
    // console.log(id);
    if(id){
        const resdata = await taskManager.deleteOne({id});
        // console.log(resdata);
        if (resdata.deletedCount === 1){ 
            res.status(200).json({"message" : "deleted successfully"});
        }
        else{
            res.status(404).json({"message": "unable to delete"});
        }
    }
    else{
        res.send(404).json({"message": "not a valid id"});
    }

})

app.patch("/modifyTask", async (req, res)=>{
    const{ id, data} = req.body;
    if(id){
        const resp = await taskManager.updateOne({
            id
        },
        {
            $set: {
                 taskdata : data
            }
        })
        // console.log(resp.modifiedCount);
        if(resp.modifiedCount){
            res.status(200).json({"message" : "updated"});
        } else{
            res.status(404).json({"message": "unable to update"});
        }
    }
    else{
        res.status(404).json({"message" : "unable to update"});
    }
})

const port = process.env.PORT || 5000 ;
app.listen(port, () => {
    console.log(`server listening to port ${port}`);
})