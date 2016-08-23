/// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/react/index.d.ts" />
/// <reference path="../../../typings/globals/react-dom/index.d.ts" />
/// <reference path="../../../typings/globals/lodash/index.d.ts" />
import * as React from 'react';
require('./Cannon.css');
;
;
export class Cannon extends React.Component {
    constructor(...args) {
        super(...args);
        this.events = {
            spacePressed: (e) => {
                console.log('e:', e);
            }
        };
    }
    render() {
        return (React.createElement("div", {id: "weapon"}, React.createElement("div", {id: "cannon"})));
    }
}
;
// under a div
// <div className={"random-tinkering"} />
// <div className={"random-tinkering-triangle"} />
// <div className={"hollow-triangle"} />
