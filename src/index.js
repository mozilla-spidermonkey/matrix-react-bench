import { } from "./shell-polyfill-hack.js";

import React from "react";
import * as ReactTestRenderer from "react-test-renderer";

//import MessagePanel from "matrix-react-sdk/src/components/structures/MessagePanel";
//import TextualBody from "matrix-react-sdk/src/components/views/messages/TextualBody";
import Spoiler from "matrix-react-sdk/src/components/views/elements/Spoiler";

let props = {
    reason: "",
    contentHtml: "",
};

let elem = React.createElement(Spoiler, props, null);
let rendered = ReactTestRenderer.create(elem);

console.log(JSON.stringify(rendered.toJSON()));
