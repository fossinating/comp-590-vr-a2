import { SceneNode } from "./sceneNode.js";
export class Line extends SceneNode {
    endPoint;
    style;
    draw(ctx, deltaTime) {
        super.draw(ctx, deltaTime);
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.style;
        ctx.moveTo(0, 0);
        ctx.lineTo(this.endPoint.x, this.endPoint.y);
        ctx.stroke();
    }
    constructor(position = { x: 0, y: 0 }, rotation = 0, endPoint, style = "black") {
        super(position, rotation);
        this.endPoint = endPoint;
        this.style = style;
    }
}
