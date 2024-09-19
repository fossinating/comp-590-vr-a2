import { Input, InputMap, Inputs } from "./Input";
import { PhysicsBody, PhysicsServer } from "./PhysicsServer";
import { Asteroid } from "./SceneNodes/asteroid";
import { Ball } from "./SceneNodes/ball";
import { Rect } from "./SceneNodes/rect";
import { SceneNode } from "./SceneNodes/sceneNode";
import { YoYo } from "./SceneNodes/yoyo";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

const ctx = canvas.getContext("2d");

var rootNode: SceneNode;

var lastFrameLoop = new Date()
// Framerate-dependent main loop
const frameLoop = () => {
    var deltaTime = (new Date().getTime() - lastFrameLoop.getTime()) / 1_000;
    lastFrameLoop = new Date();

    update(deltaTime);
    draw(deltaTime);

    requestAnimationFrame(frameLoop);
}

var lastFixedLoop = new Date();
const fixedLoop = () => {
    var deltaTime = (new Date().getTime() - lastFixedLoop.getTime()) / 1_000;
    lastFixedLoop = new Date();

    updateInput(deltaTime);
    fixedUpdate(deltaTime);
}

const draw = (deltaTime: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    rootNode._draw(ctx, deltaTime);
    ctx.restore();
    if ((document as (typeof document & {debug: boolean})).debug === true) {
        PhysicsServer.draw(ctx);
    }
}

const updateInput = (deltaTime: number) => {
    Input.update();
}

const update = (deltaTime: number) => {
    rootNode._update(deltaTime);
}

const fixedUpdate = (deltaTime: number) => {
    document.getElementById("gameInfoDisplay").innerHTML = "Time Survived: " + getTimeSurvived()
    PhysicsServer.update();
    rootNode._fixedUpdate(deltaTime);
}

let gameLoop;
let gamePlaying = false;
let startTime: Date;

const getTimeSurvived = () => {
    let ms = new Date().getTime() - startTime.getTime();
    return (
        (ms/1000 > 60*60 ? Math.floor(ms/1000 / (60*60)) + ":" : "") + // Hours
        (ms/1000 > 60 ? ((ms/1000 / 60) % 60 < 10 ? "0" : "") + Math.floor((ms/1000 / 60) % 60) + ":" + ((ms/1000) % 60 < 10 ? "0" : "") : "") + // Minutes
        (ms % 60_000)/1000 // Seconds & milliseconds
    )
}

const setup = () => {
    // Set up inputs

    Input.inputMaps.set(Inputs.ACCELERATE, new InputMap("KeyW", "ArrowUp"));
    Input.inputMaps.set(Inputs.BRAKE, new InputMap("KeyS", "ArrowDown"));
    Input.inputMaps.set(Inputs.TURN_LEFT, new InputMap("KeyA", "ArrowLeft"));
    Input.inputMaps.set(Inputs.TURN_RIGHT, new InputMap("KeyD", "ArrowRight"));
    Input.inputMaps.set(Inputs.SHOOT, new InputMap("Space"));

    addEventListener("keydown", (event: KeyboardEvent) => {
        Input.keyDown(event.code);
    })

    addEventListener("keyup", (event: KeyboardEvent) => {
        Input.keyUp(event.code);
    })

    rootNode = new SceneNode();
    rootNode.addChild(new Rect({x: 0, y: 0}, 0, canvas.width, canvas.height, "rgba(0, 0, 0)"));

    // Stars

    for (let i = 0; i < 200; i++) {
        rootNode.addChild(new Ball({x: Math.random()*canvas.width, y: Math.random()*canvas.height}, 0, 2, "white"));
    }


    // Add planets
    rootNode.addChild(new Ball({x: canvas.width/2, y: canvas.height/2}, 0, 50, "orange"));
    // Add distance fog
    rootNode.addChild(new Rect({x: 0, y: 0}, 0, canvas.width, canvas.height, "rgba(0, 0, 0, 0.5)"));
    let firstYoYo = new YoYo({x: canvas.width/2, y: canvas.height/2}, 0, 200, 35, "green");
    rootNode.addChild(firstYoYo);
    let secondYoYo = new YoYo({x: 0, y: 0}, 0, 80, 15, "#aaa");
    secondYoYo.addChild(new Ball({x: 5, y: -7}, 0, 4, "#777"));
    secondYoYo.addChild(new Ball({x: -1, y: 10}, 0, 4, "#777"));
    firstYoYo.addChild(secondYoYo);

    rootNode.addChild(new YoYo({x: canvas.width/2, y: canvas.height/2}, Math.PI*.7, 150, 25, "blue"))

    // Add distance fog
    rootNode.addChild(new Rect({x: 0, y: 0}, 0, canvas.width, canvas.height, "rgba(0, 0, 0, 0.2)"));

    // Draw ship


    let shipColor = "#595959";
    let shipOutlineColor = "#b0b0b0";
    let ship = new SceneNode({x: canvas.width/2, y: canvas.height/2});

    let registerShipMovement = (ship: SceneNode) => {
        let velocity = {x: 0, y: 0};
        const MAX_SPEED = 80;
        const ACCEL = 120;

        ship.registerFixedUpdate((deltaTime: number) => {
            let accel = 0;
            if (Input.isInputPressed(Inputs.ACCELERATE)) {
                accel += ACCEL;
            }
            if (Input.isInputPressed(Inputs.BRAKE)) {
                accel -= ACCEL;
            }

            if (Input.isInputPressed(Inputs.TURN_LEFT)) {
                ship.rotation -= Math.PI*.5*deltaTime;
            }
            if (Input.isInputPressed(Inputs.TURN_RIGHT)) {
                ship.rotation += Math.PI*.5*deltaTime;
            }

            velocity.x += Math.sin(ship.rotation)*accel*deltaTime;
            velocity.y -= Math.cos(ship.rotation)*accel*deltaTime;

            let speed = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2))
            if (speed > MAX_SPEED) {
                velocity.x *= MAX_SPEED / speed;
                velocity.y *= MAX_SPEED / speed;
            }

            ship.position.x += velocity.x*deltaTime;
            ship.position.y += velocity.y*deltaTime;

            const SAFE_BORDER = 40;

            if (ship.position.x > canvas.width - SAFE_BORDER) {
                ship.position.x = canvas.width - SAFE_BORDER;
            } else if (ship.position.x < SAFE_BORDER) {
                ship.position.x = SAFE_BORDER;
            }

            if (ship.position.y > canvas.height - SAFE_BORDER) {
                ship.position.y = canvas.height - SAFE_BORDER;
            } else if (ship.position.y < SAFE_BORDER) {
                ship.position.y = SAFE_BORDER;
            }
        })
    }

    registerShipMovement(ship);

    // Add collision for ship

    let shipCollision = new PhysicsBody({x: 0, y: 0}, 25);
    ship.addChild(shipCollision)
    shipCollision.registerCollisionCallback((body: PhysicsBody) => {
        clearInterval(gameLoop);
        gamePlaying = false;
        //document.getElementById("gameStart").setAttribute("style", "display: inherit");
        document.getElementById("gameInfoDisplay").innerHTML = "Game Over!<br>Time Survived: " + getTimeSurvived() + "</br>Reload the page to play again"
    })

    rootNode.addChild(ship);

    // Asteroid spawner

    let asteroidSpawner = new SceneNode();

    let asteroidSpawnerScript = (node: SceneNode) => {
        let waitTime = 2;
        let timeRemaining = 0;

        node.registerFixedUpdate((deltaTime: number) => {
            timeRemaining -= deltaTime;

            if (timeRemaining < 0) {
                node.addChild(new Asteroid());
                timeRemaining = waitTime;
            }
        })
    }

    asteroidSpawnerScript(asteroidSpawner);

    rootNode.addChild(asteroidSpawner);
    
    // Main box
    let shipOutlineDraw = new SceneNode({x:25+2, y:12.5+2}, Math.PI);
    ship.addChild(shipOutlineDraw);
    shipOutlineDraw.addChild(new Rect({x: 0, y: 0}, 0, 50+4, 25+4, shipOutlineColor, true));
    shipOutlineDraw.addChild(new Rect({x: 0, y: 0}, -Math.PI/4, 20, 20, shipOutlineColor));
    shipOutlineDraw.addChild(new Rect({x: 25, y: 0}, -Math.PI/4, 20, 20, shipOutlineColor));
    shipOutlineDraw.addChild(new Ball({x: 27, y: 27}, 0, 25+2, shipOutlineColor, true));
    shipOutlineDraw.addChild(new Rect({x: 27 - 10, y: 45}, 0, 20, 10, shipOutlineColor));

    let shipDraw = new SceneNode({x: 25, y: 12.5}, Math.PI);
    ship.addChild(shipDraw);
    shipDraw.addChild(new Rect({x: 0, y: 0}, 0, 50, 25, shipColor, true));
    shipDraw.addChild(new Rect({x: 0, y: 0}, -Math.PI/4, 18, 18, shipColor));
    shipDraw.addChild(new Rect({x: 25, y: 0}, -Math.PI/4, 18, 18, shipColor));
    shipDraw.addChild(new Ball({x: 25, y: 25}, 0, 25, shipColor, true));
    shipOutlineDraw.addChild(new Rect({x: 27 - 8, y: 43}, 0, 16, 10, shipColor));

    rootNode._ready();
    gameLoop = setInterval(fixedLoop, 1/30);
    requestAnimationFrame(frameLoop);
}

(document as (typeof document & {startGame: () => void})).startGame = () => {
    document.getElementById("gameStart").setAttribute("style", "display: none");
    startTime = new Date();
    setup();
};