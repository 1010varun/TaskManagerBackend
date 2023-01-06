const userDB = require('../models/authModel.js');
const {sign, verify} = require('jsonwebtoken');
const {hash, compare} = require('bcryptjs');

function generateAccessToken(user){
    return sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
};

const register = async (req, res) => {
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
};


const login = async (req, res) => {
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
};


const logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.send({
        message : "logout successful",
    });
};


module.exports = {
    register,
    login,
    logout,
}