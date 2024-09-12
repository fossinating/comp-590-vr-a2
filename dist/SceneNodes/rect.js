import { SceneNode } from "./sceneNode.js";
export class Rect extends SceneNode {
    width;
    height;
    style;
    fill;
    draw(ctx, deltaTime) {
        super.draw(ctx, deltaTime);
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        if (this.fill) {
            ctx.fillStyle = this.style;
            ctx.fill();
        }
        else {
            ctx.strokeStyle = this.style;
            ctx.stroke();
        }
    }
    constructor(position = { x: 0, y: 0 }, rotation = 0, width, height, style = "black", fill = true) {
        super(position, rotation);
        this.width = width;
        this.height = height;
        this.style = style;
        this.fill = fill;
    }
}
