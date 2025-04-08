import InitDraw from "@/draw";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, Pencil, PencilIcon, RectangleHorizontalIcon } from "lucide-react";
import { type } from "os";

type Shape = "rect" | "circle" | "line" | "pencil" | "eraser" | "text";

export function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [shape, setShape] = useState<Shape>("rect");

    useEffect(() => {  
        //@ts-ignore
        window.shape = shape;
    } , [shape]);

    // Handle window resizing
    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        // Attach event listener for window resize
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        // Ensure the canvasRef is not null before calling InitDraw
        if (canvasRef.current) {
            InitDraw(canvasRef.current, roomId, socket);
        }
    }, [canvasRef]); // Make sure this re-runs if roomId or socket changes

    return (
        <div style={
            {
                height : "100vh",
                overflow: "hidden",
            }
        }>
            <canvas
                ref={canvasRef} // Ensure the canvasRef is attached to the canvas element
                width={dimensions.width}
                height={dimensions.height}
                style={{ border: "1px solid white", backgroundColor: "black" }}
            />
            <TopBar setShape={setShape} shape={shape} roomId={roomId}></TopBar>
        </div>
    );
}

export function TopBar({roomId, shape, setShape}: {roomId: string, setShape: (shape: Shape) => void, shape: Shape}) {
    return (
        <div className="items-center justify-between p-4 bg-gray-800 text-white"
        style={{
            position: "fixed",
            top: 10,
            left: 10,
        }}>
            <h1 className="text-lg font-bold">Room: {roomId}</h1>
            <div className="flex space-x-4">
                <IconButton activated={shape === "circle"} icon={<Circle/>} onClick={() => {setShape("circle")}} />
                <IconButton activated={shape === "rect"} icon={<RectangleHorizontalIcon/>} onClick={() => {setShape("rect")}} />
                <IconButton activated={shape === "pencil"} icon={<Pencil/>} onClick={() => {setShape("pencil")}} />
            </div>
        </div>
    );
}
