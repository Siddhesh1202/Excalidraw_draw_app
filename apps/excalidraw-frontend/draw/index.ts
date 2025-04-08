import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config";
type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}


export default async function InitDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        const ctx = canvas.getContext("2d");
        let existingShapes: Shape[] = await getExistingShapes(roomId)
        if (!ctx) return;
        ctx.fillStyle = "white";
        clearCanvas(existingShapes, ctx, canvas);
        let clicked = false;
        let startX = 0;
        let startY = 0;
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                existingShapes.push(parsedShape.shape)
                clearCanvas(existingShapes, ctx, canvas);
            }
    }

        canvas.addEventListener("mousedown", (e) => {
            clicked = true;
            startX = e.clientX;
            startY = e.clientY;
            console.log("startX", startX);
        })

        canvas.addEventListener("mouseup", (e) => {
            clicked = false;
            //@ts-ignore
            const selectShape = window.shape;
            let shape: Shape | null = null;
            if (selectShape === "rect") {
                shape = {
                    type: "rect",
                    x: startX,
                    y: startY,
                    width: e.clientX - startX,
                    height: e.clientY - startY
                };
            }else if (selectShape === "circle") {
                shape = {
                    type: "circle",
                    centerX: startX + (e.clientX - startX) / 2,
                    centerY: startY + (e.clientY - startY) / 2,
                    radius: Math.max(e.clientX - startX, e.clientY - startY) / 2
                };
            }
            else{
                shape = {
                    type: "pencil",
                    startX,
                    startY,
                    endX: e.clientX,
                    endY: e.clientY
                }
            }
            if (!shape) return;
            existingShapes.push(shape);
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                roomId
            }))
        })

      
        canvas.addEventListener("mousemove", (e) => {
            if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, ctx, canvas);
            ctx.strokeStyle = "white";
            //@ts-ignore
            const selectShape = window.shape;
            console.log("selectShape", selectShape);
            if(selectShape === "rect") {
                ctx.strokeRect(startX, startY, width, height);
            }
            else if(selectShape === "circle"){
                ctx.beginPath();
                ctx.arc(startX + width/ 2, startY + height/ 2, Math.max(width, height) / 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
            }
            }
        })
}


function clearCanvas(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();                
        }
    });
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND_URL}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}