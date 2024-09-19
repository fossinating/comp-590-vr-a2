export class SceneNode {
    /*

    Internals that handle the scene tree graph

    */
    readyCallbacks: Array<() => void> = [];
    _ready(): void {
        for (let child of this.children) {
            child._ready();
        }

        this.ready();
        for (let callback of this.readyCallbacks) {
            callback();
        }
    }
    fixedUpdateCallbacks: Array<(deltaTime: number) => void> = [];
    _fixedUpdate(deltaTime: number): void {
        for (let child of this.children) {
            child._fixedUpdate(deltaTime);
        }

        this.fixedUpdate(deltaTime);
        for (let callback of this.fixedUpdateCallbacks) {
            callback(deltaTime);
        }
    }
    updateCallbacks: Array<(deltaTime: number) => void> = [];
    _update(deltaTime: number): void {
        for (let child of this.children) {
            child._update(deltaTime);
        }

        this.update(deltaTime);
        for (let callback of this.updateCallbacks) {
            callback(deltaTime);
        }
    }
    drawCallbacks: Array<(ctx: CanvasRenderingContext2D, deltaTime: number) => void> = [];
    _draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
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

    unloadCallbacks: Array<() => void> = [];
    unloaded = false;
    _unload() {
        if (this.unloaded) {
            return;
        }
        for (let child of this.children) {
            child._unload()
        }

        for (let callback of this.unloadCallbacks) {
            callback();
        }

        console.log("unloading");
        this.parent.removeChild(this);
        this.unloaded = true;
    }

    /*

    Allow functions to be passed in for certain events

    */

    registerReady(callback: () => void) {
        this.readyCallbacks.push(callback);
    }
    registerFixedUpdate(callback: (deltaTime: number) => void) {
        this.fixedUpdateCallbacks.push(callback);
    }
    registerUpdate(callback: (deltaTime: number) => void) {
        this.updateCallbacks.push(callback);
    }
    registerDraw(callback: (ctx: CanvasRenderingContext2D, deltaTime: number) => void) {
        this.drawCallbacks.push(callback);
    }

    /*

    Defining base functions that will often be overwritten by subclasses

    */

    ready(): void {}
    update(deltaTime: number): void {}
    fixedUpdate(deltaTime: number): void {};
    draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
    };

    /*

    Basic values

    */

    position: {x: number, y: number} = {x: 0, y: 0};
    rotation: number = 0;

    getGlobalPosition(): {x: number, y: number} {
        let _parent = this.parent;
        let global_position = {x: 0, y: 0};

        while (_parent !== null) {
            let old_global = {x: global_position.x, y: global_position.y};
            global_position.x = _parent.position.x + Math.cos(_parent.rotation) * old_global.x + Math.sin(_parent.rotation) * old_global.y;
            global_position.y = _parent.position.y + Math.cos(_parent.rotation) * old_global.y + Math.sin(_parent.rotation) * old_global.x;
            _parent = _parent.parent;
        }

        return global_position;
    }

    /*

    Handling children

    */
    parent: SceneNode = null;
    children: Array<SceneNode> = [];
    
    addChild(node: SceneNode) {
        this.children.push(node);
        node.parent = this;
    }

    removeChild(node: SceneNode) {
        this.children.filter((_node: SceneNode) => _node != node);
        node.parent = null;
    }

    constructor(position: {x: number, y: number} = {x: 0, y: 0}, rotation: number = 0) {
        this.position = position;
        this.rotation = rotation;
    }
}