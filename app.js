const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const {urlencoded} = require('express');
require("dotenv").config();
const {verify} = require('jsonwebtoken');

const taskroute = require('./routes/taskRoutes');

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


app.use(authorization);

app.use('/task', taskroute);

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
