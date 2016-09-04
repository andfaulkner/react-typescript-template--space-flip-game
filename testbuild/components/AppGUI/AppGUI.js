'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppGUI = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /// <reference path="../../../typings/index.d.ts" />


var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Player = require('../Player/Player.js');

var _Bullet = require('../Bullet/Bullet.tsx');

var _BoxUIEntity = require('../BoxUIEntity/BoxUIEntity.tsx');

var _EnemyCrawler = require('../EnemyCrawler/EnemyCrawler');

var _HUD = require('../HUD/HUD');

var _NavHeader = require('../NavHeader/NavHeader.tsx');

var _types = require('../../types/types.tsx');

var _resolvePlayerMovement = require('../../logic/resolvePlayerMovement.tsx');

var _npcFactories = require('../../logic/npcFactories.tsx');

var _createBullet = require('../../logic/createBullet.tsx');

var _resolveBulletMovement = require('../../logic/resolveBulletMovement.tsx');

var _collisionHandler = require('../../logic/collisionHandler.tsx');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

console.log('app base js loaded');
;
console.log('app base css loaded');
let inputQueue = [];
let lastRender = Date.now();
// INTERFACES
const uiBoxWidth = 25;
const crawlerWidth = 28;
const bulletWidth = 7;
const defaultState = {
    time: Date.now(),
    player: {
        xLeft: 0,
        yTop: 0,
        angle: 270,
        speed: 3,
        width: 20,
        height: 20
    },
    bullets: [],
    uiBoxes: [],
    enemies: {
        crawlers: []
    },
    score: Math.floor(0.001) // help prevent coersion to boolean
};
/**
 * Entry point for the whole application (excepting the redux wrapper)
 */
class AppGUI extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = defaultState;
        this.componentWillMount = () => requestAnimationFrame(this.tick);
        this.componentDidMount = () => document.onkeydown = this.events.keypress;
        this.events = {
            /**
            * Respond to any key press, but only if it's a registered type of key
            */
            keypress: e => {
                const keyName = _.get(_types.controls, e.key).toString();
                const addKeypressToQueue = inputType => {
                    inputQueue.push({ type: inputType, data: keyName });
                };
                if (_.includes(keyName, 'Shoot')) {
                    addKeypressToQueue(_types.InputType.PlayerShoot);
                } else if (_.includes(keyName, 'Speed')) {
                    addKeypressToQueue(_types.InputType.PlayerSpeedChange);
                } else {
                    addKeypressToQueue(_types.InputType.PlayerMove);
                }
            }
        };
        /**
         * calculate new positions of all the things
         */
        this.handleInputQueue = (curState, inputQueue) => {
            console.log('resolveMove#handleInputQueue: inputQueue', inputQueue);
            _.each(inputQueue, inputEvent => {
                let inputType = _types.InputType[inputEvent.type];
                if (inputType === _types.InputType[_types.InputType.PlayerMove]) {
                    curState.player = (0, _resolvePlayerMovement.resolvePosition)(curState.player, inputEvent.data);
                } else if (inputType === _types.InputType[_types.InputType.PlayerSpeedChange]) {
                    curState.player.speed = (0, _resolvePlayerMovement.resolveSpeed)(curState.player.speed, inputEvent.data);
                } else if (inputType === _types.InputType[_types.InputType.PlayerShoot]) {
                    curState.bullets = (0, _createBullet.createBullet)(curState.player, curState.bullets);
                }
            });
            return curState;
        };
        /**
         * Handle UI changes that occur as a direct result of user input (e.g. player movement, shooting)
         */
        this.handleInput = (time, newPositions) => {
            if (inputQueue.length > 0) {
                newPositions = this.handleInputQueue(newPositions, inputQueue);
                inputQueue = [];
            }
            return newPositions;
        };
        /**
         * Randomly generate NPCs (self-directed UI elements such as enemies)
         */
        this.generateNPCs = (curState, odds = 40) => {
            // create NPC at random - approximately once / 40 ticks (every 4s). Don't create more than 10.
            if (curState.uiBoxes.length <= 10 && _.random(0, 20) === 20) {
                switch (_.sample(['uiBox', 'enemy.crawler'])) {
                    case 'uiBox':
                        curState.uiBoxes = (0, _npcFactories.createUIBox)(curState);
                        break;
                    case 'enemy.crawler':
                        curState.enemies = (0, _npcFactories.createEnemy)(curState, curState.enemies, 'crawler');
                        break;
                }
            }
            return curState;
        };
        /**
         * Generate random movements from enemies
         * ** ONGOING **
         */
        this.moveNpcs = curState => {
            curState.enemies.crawlers = _.map(curState.enemies.crawlers, crawler => {
                crawler.xLeft -= 1;
                if (crawler.xLeft - crawler.width < -300) {
                    crawler.xLeft = -300 + crawler.width;
                    crawler.reachedEnd = true;
                }
                return crawler;
            });
            return curState;
        };
        /**
         * Handle UI changes that occur without input from the user (e.g. bullet and uiBox movement)
         */
        this.handleUpdates = (curState, time) => {
            curState.time = time;
            curState.bullets = (0, _resolveBulletMovement.updateBulletPositions)(curState.bullets);
            curState = this.moveNpcs(curState);
            curState = this.generateNPCs(curState);
            curState = (0, _collisionHandler.bulletToUIEntityCollisions)(curState);
            return curState;
        };
        /**
         * The game loop. Coordinates everything. Changes propagate down the tree every time it ticks.
         * On each tick: 1) get input (from inputQueue);
         *               2) Calc new app state (resolve position of items), then update stored app state
         *               3) re-render views
         *               4) Clear inputQueue
         */
        this.tick = () => {
            let time = Date.now();
            if (time - lastRender > 100) {
                lastRender = time;
                let newPositions = this.handleInput(time, this.state);
                newPositions = this.handleUpdates(newPositions, time);
                this.setState(_.assign(this.state, newPositions, { time }));
            }
            requestAnimationFrame(this.tick);
        };
    }
    render() {
        const renderEntity = (entityCollection, EntityComponent, extraProps) => {
            return _.map(entityCollection, (entity, index) => React.createElement(EntityComponent, _extends({ key: index }, extraProps, entity)));
        };
        return React.createElement(
            'div',
            { onKeyDown: this.events.keypress.bind(this) },
            React.createElement(
                'div',
                { className: 'layout-transparent mdl-layout mdl-js-layout' },
                React.createElement(_NavHeader.NavHeader, null),
                React.createElement(
                    'main',
                    { className: 'mdl-layout__content' },
                    React.createElement(_Player.Player, _extends({ color: _types.PlayerColor.Red, width: this.props.spriteSize }, this.state.player)),
                    renderEntity(this.state.bullets, _Bullet.Bullet, {}),
                    renderEntity(this.state.enemies.crawlers, _EnemyCrawler.EnemyCrawler, { reachedEnd: false }),
                    renderEntity(this.state.uiBoxes, _BoxUIEntity.BoxUIEntity, {}),
                    React.createElement(_HUD.HUD, { score: this.state.score, time: this.state.time })
                )
            )
        );
    }
}
exports.AppGUI = AppGUI;
;