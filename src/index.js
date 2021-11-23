import { } from "./shell-polyfill-hack.js";
import { } from "./load-skin.js";
import DumpDOMTree from "./dump-tree.js";

import React from "react";
import ReactDOM from "react-dom";

import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";

import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";
import RoomView from "matrix-react-sdk/src/components/structures/RoomView";
import ResizeNotifier from "matrix-react-sdk/src/utils/ResizeNotifier";
import defaultDispatcher from "matrix-react-sdk/src/dispatcher/dispatcher";
import DMRoomMap from "matrix-react-sdk/src/utils/DMRoomMap";
import FakeMatrixClient from "./FakeMatrixClient.js";

import { synthesize_room } from "./synthetic-room.js";

import { setMissingEntryGenerator } from "matrix-react-sdk/src/languageHandler";

setMissingEntryGenerator(s => s.split("|").at(-1));

let client = new FakeMatrixClient;
MatrixClientPeg.matrixClient = client;

DMRoomMap.makeShared().start();

let room_id = "!AAAAAAAAAAAA:example.org";
client.room = synthesize_room(room_id);

defaultDispatcher.dispatch({
    action: "view_room",
    room_id,
}, true);

let resizeNotifier = new ResizeNotifier;
let props = {
    mxClient: client,
    threepidInvite: null,
    resizeNotifier,
};

let elem = React.createElement(RoomView, props, null);
elem = React.createElement(MatrixClientContext.Provider, { value: client }, elem);

let target = document.createElement("div");
document.body.appendChild(target);
ReactDOM.render(elem, target);

// In jsshell, drain the job/promise queue and render to console instead
if ("drainJobQueue" in globalThis) {
    drainJobQueue();
    DumpDOMTree(target);
}
