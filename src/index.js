import { } from "./shell-polyfill-hack.js";
import { } from "./load-skin.js";
import DumpDOMTree from "./dump-tree.js";

import { EventEmitter } from "events";

import React from "react";
import ReactDOM from "react-dom";

import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import { Room } from "matrix-js-sdk/src/models/room";
import { MatrixEvent } from "matrix-js-sdk/src/models/event";
import { EventType } from "matrix-js-sdk/src/@types/event";
import { EventTimelineSet } from "matrix-js-sdk/src/models/event-timeline-set";
import * as ContentHelpers from 'matrix-js-sdk/src/content-helpers';

import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import TimelinePanel from "matrix-react-sdk/src/components/structures/TimelinePanel";


class FakeMatrixClient extends EventEmitter {
    room = null;

    isGuest() { return true; }
    isUserIgnored() { return false; }
    getUserId() { return "@user:example.org"; }
    getSyncState() { return null; }
    credentials() { return { userId: this.getUserId() }; }
    decryptEventIfNeeded() { return Promise.resolve(); }
    getPushActionsForEvent() { return { notify: false, tweaks: {} }; }
    isRoomEncrypted() { return false; }
    getRoom() { return this.room; }
}

let client = new FakeMatrixClient;
MatrixClientPeg.matrixClient = client;

let user_id = "@user:example.org";
let room_id = "!AAAAAAAAAAAA:example.org";
client.room = new Room(room_id, client, user_id);

let timelineSet = new EventTimelineSet(null, {});

let event_id = "$11111111111:localhost";
timelineSet.addLiveEvent(new MatrixEvent({
    event_id,
    type: EventType.RoomMessage,
    content: ContentHelpers.makeTextMessage("Room test message"),
    sender: user_id,
    room_id,
    origin_server_ts: 1,
    unsigned: {},
}));

let props = {
    timelineSet,
    eventId: event_id,
};

let elem = React.createElement(TimelinePanel, props, null);
elem = React.createElement(RoomContext.Provider, { value: {} }, elem);
elem = React.createElement(MatrixClientContext.Provider, { value: client }, elem);

let target = document.createElement("div");
document.body.appendChild(target);
ReactDOM.render(elem, target);

DumpDOMTree(target);
