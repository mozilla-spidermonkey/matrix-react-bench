import { } from "./shell-polyfill-hack.js";
import React from "react";
import * as ReactTestRenderer from "react-test-renderer";
import FooView from "./FooView.jsx";

let elem = React.createElement(FooView, true, true);
let rendered = ReactTestRenderer.create(elem);

console.log(JSON.stringify(rendered.toJSON()));
