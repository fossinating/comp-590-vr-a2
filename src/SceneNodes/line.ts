import { SceneNode } from "./sceneNode";

export class Line extends SceneNode {
    endPoint: {x: number, y: number};
    style: string;

    draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
        super.draw(ctx, deltaTime);
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.style;
        ctx.moveTo(0, 0);
        ctx.lineTo(this.endPoint.x, this.endPoint.y)
        ctx.stroke();
    }

    constructor(position: {x: number, y: number} = {x: 0, y: 0}, rotation: number = 0, endPoint: {x: number, y: number}, style: string = "black") {
        super(position, rotation);
        this.endPoint = endPoint;
        this.style = style;
    }
}