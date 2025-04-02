import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as JWT_SECRET from '@repo/backend-common/config';

const wss = new WebSocketServer({ port: 8080 });

function checkUser(token: string): boolean {
  const decoded = jwt.verify(token, JWT_SECRET.JWT_SECRET);
 if (typeof decoded === 'string') {
    return false;
  }
  if(!decoded || !decoded.userId){
    return false;
  }
  return true;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }
  const params = new URLSearchParams(url.split('?')[1]);
  const token = params.get('token') || "";
 

});