/// <reference path="../typings/index.d.ts" />
"use strict";
var React = require("react");
var TestUtils = require("react-addons-test-utils");
var Hello_1 = require("../app/Hello");
describe("Hello", function () {
    var renderer;
    beforeEach(function () {
        renderer = TestUtils.createRenderer();
        renderer.render(<Hello_1["default"] name="Willson"/>);
    });
    it("should render correctly", function () {
        var result = renderer.getRenderOutput();
        chai.assert.strictEqual(result.type, "div");
    });
    it("should have correct prop values", function () {
        var result = renderer.getRenderOutput();
        var propValues = result.props.children.join("");
        chai.assert.strictEqual(propValues, "Hello, Willson");
    });
});
