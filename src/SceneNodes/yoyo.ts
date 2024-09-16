import { Ball } from "./ball";
import { Line } from "./line";
import { SceneNode } from "./sceneNode";

export class YoYo extends SceneNode {
    ball: Ball;

    addChild(node: SceneNode) {
        this.ball.addChild(node);
    }

    constructor(position: {x: number, y: number}, rotation: number, length: number, ballSize: number, ballColor: string) {
        super(position, rotation);

        //let string = new Line({x: 0, y: 0}, 0, {x: 0, y: length}, "green");
        //super.addChild(string);
        this.ball = new Ball({x: 0, y: length}, 0, ballSize, ballColor);
        super.addChild(this.ball);
    }

    fixedUpdate(deltaTime: number): void {
        this.rotation += deltaTime * Math.PI * 0.01;
    }
}