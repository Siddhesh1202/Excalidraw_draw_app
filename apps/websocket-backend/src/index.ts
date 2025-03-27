import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {JWT_SECRET} from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }
  const params = new URLSearchParams(url.split('?')[1]);
  const token = params.get('token') || "";
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded || !(decoded as JwtPayload).userId) {
    ws.close();
    return;
  }


  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('Pong');
  });

});