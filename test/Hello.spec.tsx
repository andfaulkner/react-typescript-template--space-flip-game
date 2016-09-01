/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Hello from "../app/Hello";

describe("Hello", function(){

    let renderer;

    beforeEach(function() {
        renderer = TestUtils.createRenderer();
        renderer.render(<Hello name="Willson" />);
    }.bind(this));

    it("should render correctly", function() {
        console.log('should render correctly ran!');
        const result = renderer.getRenderOutput();
        chai.assert.strictEqual(result.type, "div");
    }.bind(this));

    it("should have correct prop values", function() {
        console.log('should have correct prop values test ran!');
        const result = renderer.getRenderOutput();
        const propValues = result.props.children.join("");
        chai.assert.strictEqual(propValues, "Hello, Willson");
    }.bind(this));
}.bind(this));
