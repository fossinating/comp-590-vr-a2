import { SceneNode } from "./sceneNode";

export class Ball extends SceneNode {
    radius: number;
    style: string;
    fill: boolean;

    draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
        super.draw(ctx, deltaTime);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
        ctx.closePath();
        if (this.fill) {
            ctx.fillStyle = this.style;
            ctx.fill();
        } else {
            ctx.strokeStyle = this.style;
            ctx.stroke();
        }
    }

    constructor(position: {x: number, y: number} = {x: 0, y: 0}, rotation: number = 0, radius: number, style: string = "black", fill: boolean = true) {
        super(position, rotation);
        this.radius = radius;
        this.style = style;
        this.fill = fill;
    }
}