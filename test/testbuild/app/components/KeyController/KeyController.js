/// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/react/index.d.ts" />
/// <reference path="../../../typings/globals/react-dom/index.d.ts" />
/// <reference path="../../../typings/globals/lodash/index.d.ts" />
import * as React from 'react';
require('./KeyController.css');
;
;
export class KeyController extends React.Component {
    constructor(...args) {
        super(...args);
        this.events = {
            keyPressed: (e) => {
                console.log('KeyController.tsx:: key pressed: e.key: ', e.key);
            }
        };
    }
    render() {
        return (React.createElement("div", null, "Yo"));
    }
}
;
