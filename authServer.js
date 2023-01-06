require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const authRouter = require('./routes/authRoutes')

const database = () => {
    return mongoose.connect(process.env.MONGO_URI)
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/auth', authRouter);

// app.post('/token', (req, res) => {
//     const token = req.body.token;
//     if(token == null)return res.sendStatus(401);
//     if(!refreshTokens.includes(token)) return res.sendStatus(403);

//     verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//         if(err) return res.send('not verfiy').status(401);

//         const accessToken = generateAccessToken({name: user.name});
//         res.json({accessToken});
//     });
// });

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