import { SceneNode } from "./sceneNode.js";
export class Ball extends SceneNode {
    radius;
    style;
    fill;
    draw(ctx, deltaTime) {
        super.draw(ctx, deltaTime);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        if (this.fill) {
            ctx.fillStyle = this.style;
            ctx.fill();
        }
        else {
            ctx.strokeStyle = this.style;
            ctx.stroke();
        }
    }
    constructor(position = { x: 0, y: 0 }, rotation = 0, radius, style = "black", fill = true) {
        super(position, rotation);
        this.radius = radius;
        this.style = style;
        this.fill = fill;
    }
}
