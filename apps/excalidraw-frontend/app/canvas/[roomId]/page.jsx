"use client";
import { useRef, useEffect } from "react";

export default function Canvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let clicked = false;
        let startX = 0;
        let startY = 0;

        canvas.addEventListener("mousedown", (e) => {
            clicked = true;
            startX = e.clientX;
            startY = e.clientY;
        })

        canvas.addEventListener("mouseup", (e) => {
            clicked = false;
        })

      
        canvas.addEventListener("mousemove", (e) => {
            if (clicked) {
            console.log(e.clientX, e.clientY);
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.strokeRect(startX, startY, width, height);
            }
        })
      
    }
  }, []);

  return (
    <div
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     height: "100vh"
    //   }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid white", backgroundColor: "white" }}
      />
    </div>
  );
}
