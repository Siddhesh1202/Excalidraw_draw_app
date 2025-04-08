import { WebSocketServer, WebSocket } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as JWT_SECRET from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client';
const wss = new WebSocketServer({ port: 8080 });

interface User {
  userId: string;
  rooms: string[];
  ws:WebSocket;
} 

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET.JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close()
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    try {
      const parsedData = JSON.parse(data.toString()); // Ensure it's a string before parsing
      if (parsedData.type === "join_room") {
        const user = users.find(user => user.ws === ws);
        user?.rooms.push(parsedData.roomId);
        console.log("user", user);
      }
  
      if (parsedData.type === "leave_room") {
        const user = users.find(user => user.userId === userId);
        if (!user) return;
        user.rooms = user.rooms.filter(x => x !== parsedData.room);
      }
      // console.log("user rooms", users);
      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            userId,
            message
          }
        })

        users.forEach(user => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({ type: "chat", message, roomId }));
          }
        });
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });  
});