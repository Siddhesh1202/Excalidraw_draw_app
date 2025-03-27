import express from 'express';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '@repo/backend-common/config';
import { authMiddleware } from './middleware';
import {createUserSchema, signInUserSchema, createRoomSchema} from '@repo/common/types';
const app = express();

app.post("/signup", (req, res) => {
    const userData = createUserSchema.safeParse(req.body);
    if (!userData.success) {
        res.json({
            message: "Invalid data"
        })
        return;
    }
    res.json({
        message: "User created"
    });
});

app.post("/signin", (req, res) => {
    const userData = signInUserSchema.safeParse(req.body);
    if (!userData.success) {
        res.json({
            message: "Invalid data"
        })
        return;
    }
    const userId = req.body.userId;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        token
    });
});


app.post("room", authMiddleware, (req, res) => {
    const userData = createRoomSchema.safeParse(req.body);
    if (!userData.success) {
        res.json({
            message: "Invalid data"
        })
        return;
    }


    res.json({
        message: "Room created"
    });
});


app.listen(3000);

