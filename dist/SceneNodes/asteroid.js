import { PhysicsBody } from "../PhysicsServer.js";
import { SceneNode } from "./sceneNode.js";
import { Ball } from "./ball.js";
export class Asteroid extends SceneNode {
    static canvas = document.getElementById("canvas");
    radius;
    decoration;
    constructor(radius = Math.random() * 20 + 15) {
        let position;
        let rotation;
        let rand = Math.random() * 4;
        if (rand < 1) {
            position = { x: -50, y: -50 + Math.random() * (Asteroid.canvas.height + 100) };
            if (position.y > Asteroid.canvas.height / 2) {
                rotation = Math.random() * Math.PI * .5 + Math.PI * 1.5;
            }
            else {
                rotation = Math.random() * Math.PI * .5 + Math.PI * 0;
            }
        }
        else if (rand < 2) {
            position = { x: Asteroid.canvas.width + 50, y: -50 + Math.random() * (Asteroid.canvas.height + 100) };
            if (position.y > Asteroid.canvas.height / 2) {
                rotation = Math.random() * Math.PI * .5 + Math.PI * .5;
            }
            else {
                rotation = Math.random() * Math.PI * .5 + Math.PI * 1;
            }
        }
        else if (rand < 3) {
            position = { x: -50 + Math.random() * (Asteroid.canvas.width + 100), y: -50 };
            if (position.x > Asteroid.canvas.height / 2) {
                rotation = Math.random() * Math.PI * .5 + Math.PI * 1;
            }
            else {
                rotation = Math.random() * Math.PI * .5 + Math.PI * 1.5;
            }
        }
        else {
            position = { x: -50 + Math.random() * (Asteroid.canvas.width + 100), y: 50 + Asteroid.canvas.height };
            if (position.x > Asteroid.canvas.height / 2) {
                rotation = Math.random() * Math.PI * .5 + Math.PI * .5;
            }
            else {
                rotation = Math.random() * Math.PI * .5 + Math.PI * 0;
            }
        }
        super(position, rotation);
        this.radius = radius;
        this.addChild(new PhysicsBody({ x: 0, y: 0 }, radius));
        let craterCount = Math.floor(Math.random() * 3) + 1;
        this.decoration = new SceneNode();
        for (let i = 0; i < craterCount; i++) {
            let ang = Math.random() * 2 * Math.PI;
            let size = Math.random() * (this.radius / 2) + 2;
            let dist = Math.random() * (this.radius - size - 2);
            this.decoration.addChild(new Ball({ x: dist * Math.cos(ang), y: dist * Math.sin(ang) }, 0, size, "#636262"));
        }
    }
    SPEED = 40;
    fixedUpdate(deltaTime) {
        this.position.x += Math.cos(this.rotation) * this.SPEED * deltaTime;
        this.position.y += Math.sin(this.rotation) * this.SPEED * deltaTime;
        if (this.position.x < -100 || this.position.x > Asteroid.canvas.width + 100 ||
            this.position.y < -100 || this.position.y > Asteroid.canvas.height + 100) {
            this._unload();
        }
    }
    update(deltaTime) {
        this.decoration.rotation += Math.PI * .1 * deltaTime;
    }
    draw(ctx, deltaTime) {
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#8a8a8a";
        ctx.closePath();
        ctx.fill();
    }
}
