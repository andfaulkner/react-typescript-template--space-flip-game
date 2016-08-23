/// <reference path="../typings/globals/react/index.d.ts" />
/// <reference path="../typings/globals/react-dom/index.d.ts" />
/// <reference path="../typings/globals/react-bootstrap/index.d.ts" />
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Player } from './components/Player/Player';
import { ArenaBorder } from './components/ArenaBorder/ArenaBorder';
import { KeyController } from './components/KeyController/KeyController';
import { PlayerColor } from './enums/enums';
;
;
console.log('js loaded');
/**
 * Entry point for the whole application
 */
class App extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            input: {
                time: Date.now()
            }
        };
        this.componentWillMount = () => requestAnimationFrame(this.tick);
        /**
         * The game loop. Coordinates everything. Changes propagate down the tree every time it ticks
         */
        this.tick = () => {
            console.log('app.tsx:: game loop ticked!');
            let time = Date.now();
            // requestAnimationFrame(this.tick);
            this.setState({ input: { time } });
        };
    }
    render() {
        return (React.createElement("div", null, React.createElement(KeyController, {input: this.state.input}), React.createElement(Player, {input: this.state.input, color: PlayerColor.Red, width: this.props.spriteSize}), React.createElement(ArenaBorder, null)));
    }
    ;
}
;
document.addEventListener("DOMContentLoaded", function (event) {
    console.log('DOM loaded - mounting React');
    ReactDOM.render(React.createElement(App, {spriteSize: 20}), document.getElementById('content'));
});
