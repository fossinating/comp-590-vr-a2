import { SceneNode } from "./SceneNodes/sceneNode.js";
export class PhysicsServer {
    static bodies = [];
    static registerBody(body) {
        this.bodies.push(body);
    }
    static unregisterBody(body) {
        this.bodies = this.bodies.filter((_body) => _body !== body);
    }
    static update() {
        for (let i = 0; i < this.bodies.length; i++) {
            let bodyIGlobalPosition = this.bodies[i].getGlobalPosition();
            for (let j = i + 1; j < this.bodies.length; j++) {
                let bodyJGlobalPosition = this.bodies[j].getGlobalPosition();
                if ((Math.pow(bodyIGlobalPosition.x - bodyJGlobalPosition.x, 2) +
                    Math.pow(bodyIGlobalPosition.y - bodyJGlobalPosition.y, 2)) <
                    Math.pow(this.bodies[i].radius + this.bodies[j].radius, 2)) {
                    this.bodies[i].onCollision(this.bodies[j]);
                    this.bodies[j].onCollision(this.bodies[i]);
                }
            }
        }
    }
    static draw(ctx) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        for (let body of this.bodies) {
            ctx.beginPath();
            let globalPosition = body.getGlobalPosition();
            ctx.arc(globalPosition.x, globalPosition.y, body.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}
export class PhysicsBody extends SceneNode {
    radius;
    collisionCallbacks = [];
    constructor(position, radius) {
        super(position);
        this.radius = radius;
        PhysicsServer.registerBody(this);
    }
    onCollision(body) {
        for (let callback of this.collisionCallbacks) {
            callback(body);
        }
    }
    registerCollisionCallback(callback) {
        this.collisionCallbacks.push(callback);
    }
    _unload() {
        super._unload();
        PhysicsServer.unregisterBody(this);
    }
}
