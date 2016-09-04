"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// ENUMS
var Dimension = exports.Dimension = undefined;
(function (Dimension) {
    Dimension[Dimension["width"] = 0] = "width";
    Dimension[Dimension["height"] = 1] = "height";
})(Dimension || (exports.Dimension = Dimension = {}));
var PlayerColor = exports.PlayerColor = undefined;
(function (PlayerColor) {
    PlayerColor[PlayerColor["Red"] = 0] = "Red";
    PlayerColor[PlayerColor["Blue"] = 1] = "Blue";
    PlayerColor[PlayerColor["Green"] = 2] = "Green";
})(PlayerColor || (exports.PlayerColor = PlayerColor = {}));
;
var Direction = exports.Direction = undefined;
(function (Direction) {
    Direction[Direction["Right"] = 1e-7] = "Right";
    Direction[Direction["DownRight"] = 45] = "DownRight";
    Direction[Direction["Down"] = 90] = "Down";
    Direction[Direction["DownLeft"] = 135] = "DownLeft";
    Direction[Direction["Left"] = 180] = "Left";
    Direction[Direction["UpLeft"] = 225] = "UpLeft";
    Direction[Direction["Up"] = 270] = "Up";
    Direction[Direction["UpRight"] = 315] = "UpRight";
})(Direction || (exports.Direction = Direction = {}));
;
var SpeedChange = exports.SpeedChange = undefined;
(function (SpeedChange) {
    SpeedChange[SpeedChange["Accelerate"] = 0] = "Accelerate";
    SpeedChange[SpeedChange["Decelerate"] = 1] = "Decelerate";
    SpeedChange[SpeedChange["Stop"] = 2] = "Stop";
})(SpeedChange || (exports.SpeedChange = SpeedChange = {}));
let controls = exports.controls = {
    ArrowUp: "RaiseSpeed",
    ArrowDown: "LowerSpeed",
    w: "Up",
    e: "UpRight",
    d: "Right",
    c: "DownRight",
    s: "Down",
    x: "Down",
    z: "DownLeft",
    a: "Left",
    q: "UpLeft",
    ' ': "Shoot"
};
var InputType = exports.InputType = undefined;
(function (InputType) {
    InputType[InputType["PlayerMove"] = 0] = "PlayerMove";
    InputType[InputType["PlayerSpeedChange"] = 1] = "PlayerSpeedChange";
    InputType[InputType["PlayerShoot"] = 2] = "PlayerShoot";
})(InputType || (exports.InputType = InputType = {}));
;
;