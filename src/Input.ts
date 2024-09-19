export enum Inputs {
    ACCELERATE,
    TURN_LEFT,
    TURN_RIGHT,
    BRAKE,
    SHOOT
}

class InputKey {
    keyCode: string;
    pressed: boolean;

    constructor(keyCode: string) {
        this.keyCode = keyCode;
        this.pressed = false;
    }

    keyDown(keyCode: string) {
        if (this.keyCode === keyCode) {
            this.pressed = true;
        }
    }

    keyUp(keyCode: string) {
        if (this.keyCode === keyCode) {
            this.pressed = false;
        }
    }

    isPressed(): boolean {
        return this.pressed;
    }
}

export class InputMap {
    keys: InputKey[];
    pressed: boolean;
    justPressed: boolean;
    justReleased: boolean;

    constructor(...keyCodes: string[]) {
        this.keys = [];

        for (let keyCode of keyCodes) {
            this.keys.push(new InputKey(keyCode));
        }
        this.pressed = false;
        this.justPressed = false;
        this.justReleased = false;
    }

    keyDown(keyCode: string) {
        for (let key of this.keys) {
            key.keyDown(keyCode);
        }
    }

    keyUp(keyCode: string) {
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
    
    isPressed(): boolean {
        //console.log(this.keys);
        return this.pressed;
    }

    isJustPressed(): boolean {
        return this.justPressed;
    }

    isJustReleased(): boolean {
        return this.justReleased;
    }
}

export class Input {
    static inputMaps: Map<Inputs, InputMap> = new Map;

    static update() {
        for (let map of Input.inputMaps.values()) {
            map.update();
        }
    }

    static keyDown(keyCode: string) {
        for (let map of Input.inputMaps.values()) {
            map.keyDown(keyCode);
        }
    }

    static keyUp(keyCode: string) {
        for (let map of Input.inputMaps.values()) {
            map.keyUp(keyCode);
        }
    }

    static isInputPressed(input: Inputs): boolean {
        if (Input.inputMaps.has(input)) {
            return Input.inputMaps.get(input).isPressed();
        } else {
            console.error(`Requested input with no mappings: ${input.toString()}`)
            return false;
        }
    }

    static isInputJustPressed(input: Inputs): boolean {
        if (Input.inputMaps.has(input)) {
            return Input.inputMaps.get(input).isJustPressed();
        } else {
            console.error(`Requested input with no mappings: ${input.toString()}`)
            return false;
        }
    }

    static isInputJustReleased(input: Inputs): boolean {
        if (Input.inputMaps.has(input)) {
            return Input.inputMaps.get(input).isJustReleased();
        } else {
            console.error(`Requested input with no mappings: ${input.toString()}`)
            return false;
        }
    }
}