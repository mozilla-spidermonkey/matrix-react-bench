globalThis.window = globalThis;

let lastTimeoutId = 0;
globalThis.setTimeout = function (callback, delay) {
    lastTimeoutId++;
    return lastTimeoutId;
}

globalThis.clearTimeout = () => null;
globalThis.dispatchEvent = () => null;
globalThis.addEventListener = () => null;
globalThis.removeEventListener = () => null;

globalThis.XMLHttpRequest = function () { return { open: () => null, send: () => null }; }
globalThis.Worker = function () { };

globalThis.EventTarget = class {
    dispatchEvent() { }
    addEventListener() { }
    removeEventListener() { }
};
globalThis.Node = class extends globalThis.EventTarget { };
globalThis.Element = class extends globalThis.Node {
    setAttribute() { }
    get classList() {
        return {
            add: () => null,
        };
    }
    get style() {
        return {};
    }
};
globalThis.HTMLElement = class extends globalThis.Element { };
globalThis.HTMLAnchorElement = class extends globalThis.HTMLElement { };

globalThis.Event = class {
    initCustomEvent() { }
    initEvent() { }
};
globalThis.UIEvent = class extends globalThis.Event { };

globalThis.fetch = function () {
    return new Promise(function () { });
}

globalThis.navigator = {
    platform: "shell",
    userAgent: "shell",
};

globalThis.localStorage = {
    getItem: () => null,
    setItem: () => null,
};

globalThis.location = {
    host: "example.com",
    pathname: "/",
};

globalThis.document = {
    __proto__: globalThis.Node.prototype,
    body: new globalThis.Element,
    documentElement: new globalThis.Element,
    cookie: "",
    compatMode: "CSS1Compat",
    host: "example.com",
    readyState: "complete",
    nodeType: 9, // Node.DOCUMENT_NODE
    createEvent: () => new globalThis.Event,
    createElement: () => new globalThis.Element,
};

console.error = console.log;
console.warn = console.log;

// Replacement for matrix-react-sdk/src/Skinner.ts logic
globalThis.mxSkinner = {
    getComponent(name) { return null; }
};
