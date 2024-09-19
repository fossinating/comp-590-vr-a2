import { Ball } from "./ball.js";
import { SceneNode } from "./sceneNode.js";
export class YoYo extends SceneNode {
    ball;
    addChild(node) {
        this.ball.addChild(node);
    }
    constructor(position, rotation, length, ballSize, ballColor) {
        super(position, rotation);
        //let string = new Line({x: 0, y: 0}, 0, {x: 0, y: length}, "green");
        //super.addChild(string);
        this.ball = new Ball({ x: 0, y: length }, 0, ballSize, ballColor);
        super.addChild(this.ball);
    }
    fixedUpdate(deltaTime) {
        this.rotation += deltaTime * Math.PI * 0.01;
    }
}
