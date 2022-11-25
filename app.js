const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')
const {urlencoded} = require('express');
const task = require('./model');
require("dotenv").config();

const app = express();

const database = () => {
    return mongoose.connect(process.env.MONGO_URI)
}

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(urlencoded({extended: false}));
app.use(express.json());


app.get("/task", async (req, res) => {
    const dataArray = [];
    const response = await task.find();
    for(let i = 0; i < response.length; i++){
        dataArray.push({"id":response[i].id, "task": response[i].taskdata});
    }
    res.status(200).json(dataArray);
})

app.post("/appendTask", async (req, res) => {
    await task.create(req.body);
    res.status(200).send("post request successfull");
})

app.delete("/delete/:id", async (req, res) => {
    const {id} = req.params;
    if(id){
        const resdata = await task.deleteOne({id});
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
        const resp = await task.updateOne({
            id
        },
        {
            $set: {
                 taskdata : data
            }
        })
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

const connectDatabase = async () => {
    try {
        await database()
        app.listen(port, () => {
          console.log(`server listening to port ${port}`);
        });

    } catch (error) {
        console.log(error);
    }
}

connectDatabase()


// app.listen(port, () => {
//     console.log(`server listening to port ${port}`);
// })