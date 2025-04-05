"use client"
import { useEffect, useState } from "react";
import {useSocket} from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}:{
    messages: {message: string}[],
    id: string;
}){
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");
    const {socket, loading} = useSocket();

    socket?.send(JSON.stringify({
        type: "join_room",
        roomId: id
    }));

    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "chat") return;
            setChats((prev) => [...prev, {message: data.message}]);
        }
    }, [socket, loading, id]);

    return <div>
    {chats.map(m => <div>{m.message}</div>)}

    <input type="text" value={currentMessage} onChange={e => {
        setCurrentMessage(e.target.value);
    }}></input>
    <button onClick={() => {
        socket?.send(JSON.stringify({
            type: "chat",
            roomId: id,
            message: currentMessage
        }))

        setCurrentMessage("");
    }}>Send message</button>
</div>
        
}