import express from 'express';
import jwt from 'jsonwebtoken';
import * as JWT_SECRET from '@repo/backend-common/config';
import { authMiddleware } from './middleware';
import {CreateUserSchema, SignInSchema, CreateRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
// import prismaClient from "@repo/db"; // Adjust the import based on your actual db package
app.post("/signup", async (req, res) => {
    const userData = CreateUserSchema.safeParse(req.body);
    if (!userData.success) {
        res.json({
            message: "Invalid data"
        })
        return;
    }
    try{
        await prismaClient.user.create({
            data: {
                email: userData.data.username,
                password: userData.data?.password,
                name: userData.data?.name
            }
        });
        res.json({
            message: "User created"
        });
    }catch(e){
        res.status(411).json({
            message: "User already exists"
        });
    }
});

app.post("/signin", async (req, res) => {
    const userData = SignInSchema.safeParse(req.body);
    if (!userData.success) {
        res.json({
            message: "Invalid data"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: userData.data.username,
            password: userData.data.password
        }
    });

    if (!user){
        res.status(401).json({
            message: "Invalid credentials"
        });
        return;
    }
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET.JWT_SECRET)

    res.json({
        token
    });
});


app.post("/room", authMiddleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    // @ts-ignore: TODO: Fix this
    const userId = req.userId;

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch(e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})


app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})


app.listen(3001);

