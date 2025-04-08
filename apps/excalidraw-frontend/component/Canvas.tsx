import InitDraw from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Ensure the canvasRef is not null before calling InitDraw
        if (canvasRef.current) {
            console.log("I am here");
            InitDraw(canvasRef.current, roomId, socket);
        }
    }, [canvasRef]); // Make sure this re-runs if roomId or socket changes

    return (
        <div>
            <canvas
                ref={canvasRef} // Ensure the canvasRef is attached to the canvas element
                width={2000}
                height={2000}
                style={{ border: "1px solid white", backgroundColor: "black" }}
            />
        </div>
    );
}
