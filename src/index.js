import { } from "./shell-polyfill-hack.js";

import React from "react";
import * as ReactTestRenderer from "react-test-renderer";

import { } from "matrix-react-sdk/src/component-index";

import Spoiler from "matrix-react-sdk/src/components/views/elements/Spoiler";

let props = {
    reason: "",
    contentHtml: "",
};

let elem = React.createElement(Spoiler, props, null);
let rendered = ReactTestRenderer.create(elem);

console.log(JSON.stringify(rendered.toJSON()));
