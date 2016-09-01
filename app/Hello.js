/// <reference path="../typings/index.d.ts" />
"use strict";
const React = require("react");
class Hello extends React.Component {
    render() {
        return React.createElement("div", null, "Hello, ", this.props.name);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Hello;
//# sourceMappingURL=Hello.js.map