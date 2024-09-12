import { Ball } from "./SceneNodes/ball.js";
import { Rect } from "./SceneNodes/rect.js";
import { SceneNode } from "./SceneNodes/sceneNode.js";
import { YoYo } from "./SceneNodes/yoyo.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var rootNode;
var lastFrameLoop = new Date();
// Framerate-dependent main loop
const frameLoop = () => {
    var deltaTime = (lastFrameLoop.getTime() - new Date().getTime()) / 1_000;
    lastFrameLoop = new Date();
    update(deltaTime);
    draw(deltaTime);
    requestAnimationFrame(frameLoop);
};
var lastFixedLoop = new Date();
const fixedLoop = () => {
    var deltaTime = (lastFixedLoop.getTime() - new Date().getTime()) / 1_000;
    lastFixedLoop = new Date();
    updateInput(deltaTime);
    fixedUpdate(deltaTime);
};
const draw = (deltaTime) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    rootNode._draw(ctx, deltaTime);
    ctx.restore();
};
const updateInput = (deltaTime) => {
};
const update = (deltaTime) => {
    rootNode._update(deltaTime);
};
const fixedUpdate = (deltaTime) => {
    rootNode._fixedUpdate(deltaTime);
};
const setup = () => {
    rootNode = new SceneNode();
    rootNode.addChild(new Rect({ x: 0, y: 0 }, 0, canvas.width, canvas.height, "rgba(0, 0, 0)"));
    // Stars
    for (let i = 0; i < 200; i++) {
        rootNode.addChild(new Ball({ x: Math.random() * canvas.width, y: Math.random() * canvas.height }, 0, 2, "white"));
    }
    // Add planets
    rootNode.addChild(new Ball({ x: canvas.width / 2, y: canvas.height / 2 }, 0, 50, "orange"));
    // Add distance fog
    rootNode.addChild(new Rect({ x: 0, y: 0 }, 0, canvas.width, canvas.height, "rgba(0, 0, 0, 0.5)"));
    let firstYoYo = new YoYo({ x: canvas.width / 2, y: canvas.height / 2 }, 0, 200, 35, "green");
    rootNode.addChild(firstYoYo);
    let secondYoYo = new YoYo({ x: 0, y: 0 }, 0, 80, 15, "#aaa");
    secondYoYo.addChild(new Ball({ x: 5, y: -7 }, 0, 4, "#777"));
    secondYoYo.addChild(new Ball({ x: -1, y: 10 }, 0, 4, "#777"));
    firstYoYo.addChild(secondYoYo);
    rootNode.addChild(new YoYo({ x: canvas.width / 2, y: canvas.height / 2 }, Math.PI * .7, 150, 25, "blue"));
    rootNode._ready();
    setInterval(fixedLoop, 1 / 30);
    requestAnimationFrame(frameLoop);
};
setup();
