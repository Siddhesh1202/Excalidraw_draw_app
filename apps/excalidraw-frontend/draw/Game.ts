import { Shapes } from "@/component/Canvas";
import { getExistingShapes } from "./http";


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
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private socket: WebSocket;
    private clicked: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private selectedShape: Shapes = "rect";
    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.init();
        this.initHandlers();
        this.initMouseHanlders();
    }

    setShape(shape: "circle" | "rect" | "pencil" | "eraser" | "text" | "line") {
        this.selectedShape = shape;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    };


    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape.shape)
                this.clearCanvas();
            }
        }
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            }
            else if (shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        });
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }


    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;
            //@ts-ignore
            const selectShape = this.selectedShape;
            let shape: Shape | null = null;
            console.log("selectShape", selectShape);
            if (selectShape === "rect") {
                console.log("rect");
                shape = {
                    type: "rect",
                    x: this.startX,
                    y: this.startY,
                    width: e.clientX - this.startX,
                    height: e.clientY - this.startY
                };
            }else if (selectShape === "circle") {
                shape = {
                    type: "circle",
                    centerX: this.startX + (e.clientX - this.startX) / 2,
                    centerY: this.startY + (e.clientY - this.startY) / 2,
                    radius: Math.max(e.clientX - this.startX, e.clientY - this.startY) / 2
                };
            }
            else{
                shape = {
                    type: "line",
                    startX: this.startX,
                    startY: this.startY,
                    endX: e.clientX,
                    endY: e.clientY
                }
            }
            if (!shape) return;
            console.log("shape", shape);
            this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                roomId: this.roomId
            }))
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle = "white";
            const selectShape = this.selectedShape;
            if(selectShape === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            }
            else if(selectShape === "circle"){
                this.ctx.beginPath();
                this.ctx.arc(this.startX + width/ 2, this.startY + height/ 2, Math.max(width, height) / 2, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if(selectShape === "line"){
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(e.clientX, e.clientY);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }

    }

    initMouseHanlders(){
       
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    
    
    }

}