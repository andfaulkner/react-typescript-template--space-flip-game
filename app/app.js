/// <reference path="../typings/globals/react/index.d.ts" />
/// <reference path="../typings/globals/react-dom/index.d.ts" />
/// <reference path="../typings/globals/react-bootstrap/index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
// import { Header } from './components/Header';
var Player_1 = require('./components/Player/Player');
var ArenaBorder_1 = require('./components/ArenaBorder/ArenaBorder');
var KeyController_1 = require('./components/KeyController/KeyController');
var enums_1 = require('./enums/enums');
;
;
console.log('js loaded');
/**
 * Entry point for the whole application
 */
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = this;
        _super.apply(this, arguments);
        this.state = {
            input: {
                time: Date.now()
            }
        };
        this.componentWillMount = function () { return requestAnimationFrame(_this.tick); };
        /**
         * The game loop. Coordinates everything. Changes propagate down the tree every time it ticks
         */
        this.tick = function () {
            console.log('app.tsx:: game loop ticked!');
            var time = Date.now();
            // requestAnimationFrame(this.tick);
            _this.setState({ input: { time: time } });
        };
    }
    App.prototype.render = function () {
        return (<div>
        <KeyController_1.KeyController input={this.state.input}/>
        <Player_1.Player input={this.state.input} color={enums_1.PlayerColor.Red} width={this.props.spriteSize}/>
        <ArenaBorder_1.ArenaBorder />
      </div>);
    };
    ;
    return App;
}(React.Component));
;
document.addEventListener("DOMContentLoaded", function (event) {
    console.log('DOM loaded - mounting React');
    ReactDOM.render(<App spriteSize={20}/>, document.getElementById('content'));
});
