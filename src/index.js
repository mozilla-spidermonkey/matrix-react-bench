import { } from "./shell-polyfill-hack.js";
import { } from "./load-skin.js";
import DumpDOMTree from "./dump-tree.js";

import React from "react";
import ReactDOM from "react-dom";

import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import { setMissingEntryGenerator } from "matrix-react-sdk/src/languageHandler";

import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";
import RoomView from "matrix-react-sdk/src/components/structures/RoomView";
import ResizeNotifier from "matrix-react-sdk/src/utils/ResizeNotifier";
import defaultDispatcher from "matrix-react-sdk/src/dispatcher/dispatcher";
import DMRoomMap from "matrix-react-sdk/src/utils/DMRoomMap";

import FakeMatrixClient from "./FakeMatrixClient.js";
import { synthesize_room } from "./synthetic-room.js";

// Create the DOM render target and insert into document. This will be the
// ReactDOM root container node.
let target = document.createElement("div");
document.body.appendChild(target);

// We don't have translation data so override fallback hook to not show
// additional debug info for missing translations.
setMissingEntryGenerator(s => s.split("|").at(-1));

// Use a mock MatrixClient and set as the global singleton. This holds the event
// data that is rendered and lets us avoid needing a server.
let client = new FakeMatrixClient;
MatrixClientPeg.matrixClient = client;

// Global matrix-sdk initialization that must be manually run since we are not
// using the top-level entry point and instead focus on RoomView.
DMRoomMap.makeShared().start();

// Demo render of a room.
{
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
    ReactDOM.render(elem, target);
}

// In jsshell, drain the job/promise queue and render to console instead
if ("drainJobQueue" in globalThis) {
    drainJobQueue();
    DumpDOMTree(target);
}
