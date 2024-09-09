const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

const ctx = canvas.getContext("2d");


var lastFrameLoop = new Date()
// Framerate-dependent main loop
const frameLoop = () => {
    var deltaTime = (lastFrameLoop.getTime() - new Date().getTime()) / 1_000;
    lastFrameLoop = new Date();
    draw(deltaTime);

    requestAnimationFrame(frameLoop);
}

var lastFixedLoop = new Date();
const fixedLoop = () => {
    var deltaTime = (lastFixedLoop.getTime() - new Date().getTime()) / 1_000;
    lastFixedLoop = new Date();

    updateInput(deltaTime);
    update(deltaTime);
}

setInterval(fixedLoop, 1/30)

const draw = (deltaTime: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const updateInput = (deltaTime: number) => {

}

const update = (deltaTime: number) => {

}