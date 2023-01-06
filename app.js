const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const {urlencoded} = require('express');
const task = require('./models/model');
require("dotenv").config();
const {verify, sign} = require('jsonwebtoken');

const app = express();

const database = () => {
    return mongoose.connect(process.env.MONGO_URI)
}

app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(urlencoded({extended: false}));
app.use(express.json());


function authorization(req, res, next){
    try{
        const authHead = req.cookies.accessToken;
        if(! authHead) return res.send({error : "no auth token please login again"}).status(401);

        verify(authHead, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) throw new Error(err.message);

            req.user = user;
            next();
        })
    } catch(err) {
        res.send(`error : ${err.message}`);
    }

}


app.get("/task", authorization, async (req, res) => {
    try{
        const dataArray = [];
        let response = await task.find();
        response = response.filter(user => user.username === req.user.name);
        for(let i = 0; i < response.length; i++){
            dataArray.push({"id":response[i].id, "task": response[i].task});
        }
        res.status(200).json(dataArray);
    } catch(err) {
        res.send({error : `${err.message}`}).status(401);
    }
})

app.post("/appendTask", authorization, async (req, res) => {
    const user = req.user.name;
    const data = {
        username: user,
        task: req.body.taskdata,
        id: req.body.id,
    }
    await task.create(data);
    res.status(200).send("post request successfull");
})

app.delete("/delete/:id", authorization, async (req, res) => {
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

app.patch("/modifyTask", authorization, async (req, res)=>{
    const{ id, data} = req.body;
    if(id){
        const resp = await task.updateOne({
            id
        },
        {
            $set: {
                 task : data
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
