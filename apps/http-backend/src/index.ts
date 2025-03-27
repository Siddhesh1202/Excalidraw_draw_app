import express from 'express';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from './config';
import { authMiddleware } from './middleware';

const app = express();

app.post("/signup", (req, res) => {
});

app.post("/signin", (req, res) => {
    const userId = req.body.userId;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        token
    });
});


app.post("room", authMiddleware, (req, res) => {
    res.json({
        message: "Room created"
    });
});


app.listen(3000);

