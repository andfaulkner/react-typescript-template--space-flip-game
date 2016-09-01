/// <reference path="../typings/index.d.ts" />

import * as React from "react";

class Hello extends React.Component<{ name: string }, { }> {
  render() {
    return <div>Hello, {this.props.name}</div>;
  }
}

export default Hello;