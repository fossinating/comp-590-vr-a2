export var Inputs;
(function (Inputs) {
    Inputs[Inputs["ACCELERATE"] = 0] = "ACCELERATE";
    Inputs[Inputs["TURN_LEFT"] = 1] = "TURN_LEFT";
    Inputs[Inputs["TURN_RIGHT"] = 2] = "TURN_RIGHT";
    Inputs[Inputs["BRAKE"] = 3] = "BRAKE";
    Inputs[Inputs["SHOOT"] = 4] = "SHOOT";
})(Inputs || (Inputs = {}));
class InputKey {
    keyCode;
    pressed;
    constructor(keyCode) {
        this.keyCode = keyCode;
        this.pressed = false;
    }
    keyDown(keyCode) {
        if (this.keyCode === keyCode) {
            this.pressed = true;
        }
    }
    keyUp(keyCode) {
        if (this.keyCode === keyCode) {
            this.pressed = false;
        }
    }
    isPressed() {
        return this.pressed;
    }
}
export class InputMap {
    keys;
    pressed;
    justPressed;
    justReleased;
    constructor(...keyCodes) {
        this.keys = [];
        for (let keyCode of keyCodes) {
            this.keys.push(new InputKey(keyCode));
        }
        this.pressed = false;
        this.justPressed = false;
        this.justReleased = false;
    }
    keyDown(keyCode) {
        for (let key of this.keys) {
            key.keyDown(keyCode);
        }
    }
    keyUp(keyCode) {
        for (let key of this.keys) {
            key.keyUp(keyCode);
        }
    }
    update() {
        let newPressed = false;
        for (let key of this.keys) {
            if (key.isPressed()) {
                newPressed = true;
                break;
            }
        }
        if (newPressed !== this.pressed) {
            this.justPressed = newPressed;
            this.justReleased = !newPressed;
        }
        this.pressed = newPressed;
    }
    isPressed() {
        //console.log(this.keys);
        return this.pressed;
    }
    isJustPressed() {
        return this.justPressed;
    }
    isJustReleased() {
        return this.justReleased;
    }
}
export class Input {
    static inputMaps = new Map;
    static update() {
        for (let map of Input.inputMaps.values()) {
            map.update();
        }
    }
    static keyDown(keyCode) {
        for (let map of Input.inputMaps.values()) {
            map.keyDown(keyCode);
        }
    }
    static keyUp(keyCode) {
        for (let map of Input.inputMaps.values()) {
            map.keyUp(keyCode);
        }
    }
    static isInputPressed(input) {
        if (Input.inputMaps.has(input)) {
            return Input.inputMaps.get(input).isPressed();
        }
        else {
            console.error(`Requested input with no mappings: ${input.toString()}`);
            return false;
        }
    }
    static isInputJustPressed(input) {
        if (Input.inputMaps.has(input)) {
            return Input.inputMaps.get(input).isJustPressed();
        }
        else {
            console.error(`Requested input with no mappings: ${input.toString()}`);
            return false;
        }
    }
    static isInputJustReleased(input) {
        if (Input.inputMaps.has(input)) {
            return Input.inputMaps.get(input).isJustReleased();
        }
        else {
            console.error(`Requested input with no mappings: ${input.toString()}`);
            return false;
        }
    }
}
