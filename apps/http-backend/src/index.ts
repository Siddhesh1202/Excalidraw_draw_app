import express from 'express';
import jwt from 'jsonwebtoken';
import * as JWT_SECRET from '@repo/backend-common/config';
import { authMiddleware } from './middleware';
import {CreateUserSchema, SignInSchema, CreateRoomSchema} from "@repo/common/types"

const app = express();

// import prismaClient from "@repo/db"; // Adjust the import based on your actual db package
app.post("/signup", (req, res) => {
    const userData = CreateUserSchema.safeParse(req.body);
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
    const userData = SignInSchema.safeParse(req.body);
    if (!userData.success) {
        res.json({
            message: "Invalid data"
        })
        return;
    }
    const userId = req.body.userId;
    const token = jwt.sign({
        userId
    }, JWT_SECRET.JWT_SECRET)

    res.json({
        token
    });
});


app.post("room", authMiddleware, (req, res) => {
    const userData = CreateRoomSchema.safeParse(req.body);
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

