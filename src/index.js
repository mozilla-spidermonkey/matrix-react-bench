import { } from "./shell-polyfill-hack.js";
import { } from "./load-skin.js";
import DumpDOMTree from "./dump-tree.js";

import React from "react";
import ReactDOM from "react-dom";

import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import { Room } from "matrix-js-sdk/src/models/room";
import { MatrixEvent } from "matrix-js-sdk/src/models/event";
import { EventType } from "matrix-js-sdk/src/@types/event";
import { PendingEventOrdering } from "matrix-js-sdk";
import * as ContentHelpers from 'matrix-js-sdk/src/content-helpers';

import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";
import RoomView from "matrix-react-sdk/src/components/structures/RoomView";
import ResizeNotifier from "matrix-react-sdk/src/utils/ResizeNotifier";
import defaultDispatcher from "matrix-react-sdk/src/dispatcher/dispatcher";
import DMRoomMap from "matrix-react-sdk/src/utils/DMRoomMap";
import FakeMatrixClient from "./FakeMatrixClient.js";

import { setMissingEntryGenerator } from "matrix-react-sdk/src/languageHandler";

setMissingEntryGenerator(s => s.split("|").at(-1));

const ROOM_VERSION = 6;

let client = new FakeMatrixClient;
MatrixClientPeg.matrixClient = client;

DMRoomMap.makeShared().start();

let event_ts = Date.now();
let event_idx = 1000;

let next_event_id = () => `\$${event_idx++}:localhost`;

let user1_id = "@user:example.org";
let user2_id = "@other:example.org";

function synthesize_room(room_id) {
    let room_opts = {
        pendingEventOrdering: PendingEventOrdering.Detached,
        unstableClientRelationAggregation: true,
    };

    let room = new Room(room_id, client, user1_id, room_opts);

    room.addLiveEvents([
        new MatrixEvent({
            event_id: next_event_id(),
            type: EventType.RoomCreate,
            content: {
                creator: user1_id,
                room_version: ROOM_VERSION,
            },
            sender: user1_id,
            room_id,
            origin_server_ts: event_ts,
            unsigned: {},
            state_key: "",
        }),
        new MatrixEvent({
            event_id: next_event_id(),
            type: EventType.RoomMember,
            content: {
                displayname: "username",
                membership: "join",
            },
            sender: user1_id,
            room_id,
            origin_server_ts: event_ts,
            unsigned: {},
            state_key: user1_id,
        }),
        new MatrixEvent({
            event_id: next_event_id(),
            type: EventType.RoomMember,
            content: {
                displayname: "other",
                membership: "join",
            },
            sender: user2_id,
            room_id,
            origin_server_ts: event_ts,
            unsigned: {},
            state_key: user2_id,
        }),
        new MatrixEvent({
            event_id: next_event_id(),
            type: EventType.RoomMessage,
            content: ContentHelpers.makeTextMessage("Room test message"),
            sender: user1_id,
            room_id,
            origin_server_ts: event_ts,
            unsigned: {},
        }),
        new MatrixEvent({
            event_id: next_event_id(),
            type: EventType.RoomMessage,
            content: ContentHelpers.makeTextMessage("Reply test message"),
            sender: user2_id,
            room_id,
            origin_server_ts: event_ts,
            unsigned: {},
        }),
    ]);

    room.updateMyMembership("join");

    return room;
}

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
