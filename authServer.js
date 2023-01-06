require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {sign, verify} = require('jsonwebtoken');
const {hash, compare} = require('bcryptjs');
const userDB = require('./models/authModel.js');

const database = () => {
    return mongoose.connect(process.env.MONGO_URI)
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

let refreshTokens = [];


app.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try{
        if(!username || !password) throw new Error ('please provide both credentials');
        console.log('in s');
        const users = await userDB.find();
        console.log(users);
        if(users.find(user => user.username === username)) throw new Error ('User already exists');
        const hashedPassword = await hash(password, 10);
        const user = {
            username,
            password : hashedPassword
        };
        await userDB.create(user);
        res.send({message : 'registered successfully'});
    } catch(err) {
        res.send({error : `${err.message}`}).status(401);
    }


})


app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try{
        if(!username || !password) throw new Error ('ensure both credentials');
        const users = await userDB.find();
        const user = users.find(user => user.username === username);
        if(! user) throw new Error ('username not found');
        const valid = await compare(password, user.password);
        if(! valid) throw new Error ('wrong password');
        const userName = {name: username};
        const accessToken = generateAccessToken(userName);
        res.cookie('accessToken', accessToken);
        res.send({message: 'login successful'});
    } catch(err){
        res.send({error: `${err.message}`}).status(401);
    }
});

function generateAccessToken(user){
    return sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
};

app.delete('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.send({
        message : "logout successful",
    });
});

app.post('/token', (req, res) => {
    const token = req.body.token;
    if(token == null)return res.sendStatus(401);
    if(!refreshTokens.includes(token)) return res.sendStatus(403);

    verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.send('not verfiy').status(401);

        const accessToken = generateAccessToken({name: user.name});
        res.json({accessToken});
    });
});

const port = process.env.PORT || 4000 ;

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