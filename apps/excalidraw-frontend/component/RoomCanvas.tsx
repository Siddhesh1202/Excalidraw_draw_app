"use client";

import {useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { WS_BACKEND_URL } from "@/config";

export default function RoomCanvas({roomId}: {roomId: string}) {
    
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0ZTI5NDg2YS01Y2UxLTQzMDYtYTNjYy0wNGRhNjkwNjdiNjMiLCJpYXQiOjE3NDQxMTk4NDJ9.mcseIMOCUallPmr87xSDGgwfa_-g3-DwQc_6UtwNQWA`);

        ws.onopen = () => {
            setSocket(ws);
            console.log("WebSocket connection established");
            console.log(roomId);
            ws.send(JSON.stringify({ type: "join_room", roomId }));
        };
    }, []);
    

    if(!socket) {
        return <div>
            <h1>Loading...</h1>
        </div>
    }
    return (
       < Canvas roomId={roomId} socket={socket}/>
    );
}