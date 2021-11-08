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
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import RoomView from "matrix-react-sdk/src/components/structures/RoomView";
import ResizeNotifier from "matrix-react-sdk/src/utils/ResizeNotifier";
import defaultDispatcher from "matrix-react-sdk/src/dispatcher/dispatcher";
import DMRoomMap from "matrix-react-sdk/src/utils/DMRoomMap";
import FakeMatrixClient from "./FakeMatrixClient.js";

const ROOM_VERSION = 6;

let client = new FakeMatrixClient;
MatrixClientPeg.matrixClient = client;

DMRoomMap.makeShared().start();

let user_id = "@user:example.org";
let room_id = "!AAAAAAAAAAAA:example.org";
let room_opts = {
    pendingEventOrdering: PendingEventOrdering.Detached,
    unstableClientRelationAggregation: true,
};
client.room = new Room(room_id, client, user_id, room_opts);
client.room.addLiveEvents([
    new MatrixEvent({
        event_id: "$100:localhost",
        type: EventType.RoomCreate,
        content: {
            creator: user_id,
            room_version: ROOM_VERSION,
        },
        sender: user_id,
        room_id,
        origin_server_ts: 1,
        unsigned: {},
        state_key: "",
    }),
    new MatrixEvent({
        event_id: "$101:localhost",
        type: EventType.RoomMember,
        content: {
            displayname: "username",
            membership: "join",
        },
        sender: user_id,
        room_id,
        origin_server_ts: 1,
        unsigned: {},
        state_key: user_id
    }),
    new MatrixEvent({
        event_id: "$102:localhost",
        type: EventType.RoomHistoryVisibility,
        content: {
            history_visibility: "world_readable",
        },
        sender: user_id,
        room_id,
        origin_server_ts: 1,
        unsigned: {},
        state_key: "",
    }),
    new MatrixEvent({
        event_id: "$200:localhost",
        type: EventType.RoomMessage,
        content: ContentHelpers.makeTextMessage("Room test message"),
        sender: user_id,
        room_id,
        origin_server_ts: 1,
        unsigned: {},
    }),
]);

defaultDispatcher.dispatch({
    action: "view_room",
    room_id,
});

let resizeNotifier = new ResizeNotifier;
let props = {
    mxClient: client,
    threepidInvite: null,
    resizeNotifier,
};

let elem = React.createElement(RoomView, props, null);
elem = React.createElement(RoomContext.Provider, { value: {} }, elem);
elem = React.createElement(MatrixClientContext.Provider, { value: client }, elem);

let target = document.createElement("div");
document.body.appendChild(target);
ReactDOM.render(elem, target);

drainJobQueue();
DumpDOMTree(target);
