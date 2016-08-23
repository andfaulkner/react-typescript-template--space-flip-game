/// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/react/index.d.ts" />
/// <reference path="../../../typings/globals/react-dom/index.d.ts" />
/// <reference path="../../../typings/globals/lodash/index.d.ts" />
import * as _ from 'lodash';
import * as React from 'react';
import { Dimension, Direction } from '../../enums/enums';
require('./Player.css');
// enum Action { Up, UpRight, Right, DownRight, Down, DownLeft, Left, UpLeft, RaiseSpeed, LowerSpeed }
let actions = {
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
    q: "UpLeft"
};
export class Player extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            xPos: 0,
            yPos: 0,
            angle: 225,
            speed: 3
        };
        this.componentDidMount = () => {
            document.onkeydown = this.events.keypress;
        };
        /**
         * Ensure player sprite is in bounds on the given dimension
         */
        this.checkInBounds_1D = (position, dimen, state) => {
            if (position >= 300) {
                return 300;
            }
            if (position - this.props[Dimension[dimen].toString()] <= -300) {
                return -300 + this.props[Dimension[dimen].toString()];
            }
            return position;
        };
        /**
         * Ensure player sprite remains in bounds on all dimensions
         */
        this.keepInBounds = (xPos, yPos) => ({
            xPos: this.checkInBounds_1D(xPos, Dimension.width, this.state),
            yPos: this.checkInBounds_1D(yPos, Dimension.width, this.state)
        });
        /**
         * Reduce or increase player sprite speed (i.e. in response to keypresses)
         */
        this.adjustSpeed = (action, speed) => speed + (action === "RaiseSpeed" ? 1 :
            (action === "LowerSpeed" ? -1 : 0));
        /**
         * Respond to keyboard to change player sprite's position
         */
        this.move = ({ xPos, yPos, speed }, key, action = "") => {
            console.log(`${key} pressed`);
            let yPosNew = yPos + (action.match(/Up/g) ? speed :
                (action.match(/Down/g) ? -1 * speed : 0));
            let xPosNew = xPos + (action.match(/Left/g) ? speed :
                (action.match(/Right/g) ? -1 * speed : 0));
            console.log('Player.tsx:: move: xPosNew: ', xPosNew, '; yPosNew: ', yPosNew);
            this.setState(Object.assign({}, this.state, this.keepInBounds(xPosNew, yPosNew), { speed: this.adjustSpeed(action, speed),
                angle: this.rotate(action) }));
        };
        this.rotate = (keyName) => {
            console.log('Player#rotate: keyName', keyName);
            let currentDirection = Direction[keyName];
            console.log('Player.jsx: rotate: currentDirection', currentDirection);
            /*downR:0 |down:45 |downL:90 |L:135 |upL:180 |up:225 |upR:270 |R:315*/
            return currentDirection || this.state.angle;
        };
        this.events = {
            keypress: (e) => {
                console.log('e:', e);
                let keyName = _.get(actions, e.key);
                if (_.isString(keyName)) {
                    this.move(this.state, e.key, keyName);
                    this.rotate(keyName);
                }
            }
        };
        this.calcOffset = () => ({
            marginTop: (-1 * this.state.yPos) + 'px',
            marginLeft: (-1 * this.state.xPos) + 'px'
        });
    }
    render() {
        console.log('Player.tsx:: RE-RENDERED!');
        return (React.createElement("div", null, React.createElement("div", {className: "centered", id: "player", style: Object.assign({}, this.calcOffset(), { transform: `rotate(${this.state.angle}deg)` })})));
    }
}
;
// Perhaps add against later, inside div.centered#player: <Cannon />
