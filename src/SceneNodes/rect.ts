import { SceneNode } from "./sceneNode";

export class Rect extends SceneNode {
    width: number;
    height: number;
    style: string;
    fill: boolean;

    draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
        super.draw(ctx, deltaTime);
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        if (this.fill) {
            ctx.fillStyle = this.style;
            ctx.fill();
        } else {
            ctx.strokeStyle = this.style;
            ctx.stroke();
        }
    }

    constructor(position: {x: number, y: number} = {x: 0, y: 0}, rotation: number = 0, width: number, height: number, style: string = "black", fill: boolean = true) {
        super(position, rotation);
        this.width = width;
        this.height = height;
        this.style = style;
        this.fill = fill;
    }
}