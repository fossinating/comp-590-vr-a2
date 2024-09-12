export class SceneNode {
    /*

    Internals that handle the scene tree graph

    */
    readyCallbacks = [];
    _ready() {
        for (let child of this.children) {
            child._ready();
        }
        this.ready();
        for (let callback of this.readyCallbacks) {
            callback();
        }
    }
    fixedUpdateCallbacks = [];
    _fixedUpdate(deltaTime) {
        for (let child of this.children) {
            child._fixedUpdate(deltaTime);
        }
        this.fixedUpdate(deltaTime);
        for (let callback of this.fixedUpdateCallbacks) {
            callback(deltaTime);
        }
    }
    updateCallbacks = [];
    _update(deltaTime) {
        for (let child of this.children) {
            child._update(deltaTime);
        }
        this.update(deltaTime);
        for (let callback of this.updateCallbacks) {
            callback(deltaTime);
        }
    }
    drawCallbacks = [];
    _draw(ctx, deltaTime) {
        this.draw(ctx, deltaTime);
        for (let callback of this.drawCallbacks) {
            callback(ctx, deltaTime);
        }
        for (let child of this.children) {
            ctx.save();
            child._draw(ctx, deltaTime);
            ctx.restore();
        }
    }
    /*

    Allow functions to be passed in for certain events

    */
    registerReady(callback) {
        this.readyCallbacks.push(callback);
    }
    registerFixedUpdate(callback) {
        this.fixedUpdateCallbacks.push(callback);
    }
    registerUpdate(callback) {
        this.updateCallbacks.push(callback);
    }
    registerDraw(callback) {
        this.drawCallbacks.push(callback);
    }
    /*

    Defining base functions that will often be overwritten by subclasses

    */
    ready() { }
    update(deltaTime) { }
    fixedUpdate(deltaTime) { }
    ;
    draw(ctx, deltaTime) {
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
    }
    ;
    /*

    Basic values

    */
    position = { x: 0, y: 0 };
    rotation = 0;
    /*

    Handling children

    */
    parent = null;
    children = [];
    addChild(node) {
        this.children.push(node);
        node.parent = this;
    }
    removeChild(node) {
        this.children.filter((_node) => _node != node);
        node.parent = null;
    }
    constructor(position = { x: 0, y: 0 }, rotation = 0) {
        this.position = position;
        this.rotation = rotation;
    }
}
