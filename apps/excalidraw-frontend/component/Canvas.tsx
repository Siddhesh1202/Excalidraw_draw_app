"use client";
import { useRef, useEffect } from "react";
import InitDraw from "@/draw";

export default function Canvas({roomId}: {roomId: string}) {
    const canvasRef = useRef(null);
    useEffect(() => {
            const canvas = canvasRef.current;
            if (canvas) {
            InitDraw(canvas, roomId);
        }
    }, []);

    return (
        <div>
        <canvas
            ref={canvasRef}
            width={2000}
            height={2000}
            style={{ border: "1px solid white", backgroundColor: "black" }}
        />
        </div>
    );
}