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

function DumpMissingPropertiesBase() { }
DumpMissingPropertiesBase.prototype = new Proxy({}, {
    get(target, prop, receiver) {
        console.log("PROP", prop.toString());
        return target[prop];
    }
});

function _GetElementConstructor(tagName) {
    switch (tagName.toLowerCase()) {
        case "html":
            return globalThis.HTMLHtmlElement;
        case "body":
            return globalThis.HTMLBodyElement;
        case "div":
            return globalThis.HTMLDivElement;
        case "hr":
            return globalThis.HTMLHRElement;
        case "h1":
        case "h2":
            return globalThis.HTMLHeadingElement;
        case "li":
            return globalThis.HTMLLIElement;
        case "ol":
            return globalThis.HTMLOListElement;
        case "span":
            return globalThis.HTMLSpanElement;
        case "a":
            return globalThis.HTMLAnchorElement;
        case "script":
            return globalThis.HTMLScriptElement;
        case "iframe":
            return globalThis.HTMLIFrameElement;
        case "react":
            return globalThis.HTMLUnknownElement;
    }
    console.log("UNKNOWN-HTMLELEMENT", tagName);
    return globalThis.HTMLElement;
}

globalThis.EventTarget = class {
    dispatchEvent() { }
    addEventListener() { }
    removeEventListener() { }
};
globalThis.Node = class extends globalThis.EventTarget {
    static ELEMENT_NODE = 1;
    static DOCUMENT_NODE = 9;
    static DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
    compareDocumentPosition(otherNode) {
        return globalThis.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    childNodes = [];
    parentNode = null;
    parentElement = null;
    appendChild(childNode) {
        this.childNodes.push(childNode);
        if (childNode instanceof globalThis.Node) {
            childNode.parentNode = this;
            if (this instanceof globalThis.Element) {
                childNode.parentElement = this;
            } else {
                childNode.parentElement = null;
            }
        }
    }
    removeChild(child) {
        this.childNodes = this.childNodes.filter(node => node !== child);
    }
    get firstChild() {
        const nodes = this.childNodes;
        if (nodes.length === 0) {
            return null;
        }
        return elements[0];
    }
    get lastChild() {
        const nodes = this.childNodes;
        if (nodes.length === 0) {
            return null;
        }
        return nodes[nodes.length - 1];
    }
    get nextSibling() {
        const nodes = this.parentNode.childNodes;
        const index = nodes.indexOf(this);
        if (index < 0) {
            return null;
        }
        if (index + 1 >= nodes.length) {
            return null;
        }
        return nodes[index + 1];
    }
    get ownerDocument() {
        return globalThis.document;
    }
};
globalThis.Element = class extends globalThis.Node {
    constructor(tagName) {
        super();

        this.tagName = tagName.toUpperCase();
        this[Symbol.toStringTag] = _GetElementConstructor(tagName).name;
    }
    get nodeType() { return Node.ELEMENT_NODE; };
    get namespaceURI() { return "http://www.w3.org/1999/xhtml"; }
    getAttribute() { return null; }
    setAttribute() { }
    get classList() {
        return {
            add: () => null,
        };
    }
    get children() {
        return this.childNodes.filter(n => n instanceof globalThis.Element);
    }
    get firstElementChild() {
        const elements = this.children;
        if (elements.length === 0) {
            return null;
        }
        return elements[0];
    }
    get lastElementChild() {
        const elements = this.children;
        if (elements.length === 0) {
            return null;
        }
        return elements[elements.length - 1];
    }
    get style() {
        return {};
    }
    dataset = {};
};
globalThis.HTMLElement = class extends globalThis.Element { };
globalThis.HTMLHtmlElement = class extends globalThis.HTMLElement { };
globalThis.HTMLAnchorElement = class extends globalThis.HTMLElement { };
globalThis.HTMLDivElement = class extends globalThis.HTMLElement { };
globalThis.HTMLHRElement = class extends globalThis.HTMLElement { };
globalThis.HTMLHeadingElement = class extends globalThis.HTMLElement { };
globalThis.HTMLBodyElement = class extends globalThis.HTMLElement { };
globalThis.HTMLIFrameElement = class extends globalThis.HTMLElement { };
globalThis.HTMLScriptElement = class extends globalThis.HTMLElement { };
globalThis.HTMLUnknownElement = class extends globalThis.HTMLElement { };
globalThis.HTMLLIElement = class extends globalThis.HTMLElement { };
globalThis.HTMLOListElement = class extends globalThis.HTMLElement { };
globalThis.HTMLSpanElement = class extends globalThis.HTMLElement { };
globalThis.CharacterData = class extends globalThis.Node { };
globalThis.Text = class extends globalThis.CharacterData { };

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
    body: new globalThis.HTMLBodyElement("body"),
    documentElement: new globalThis.HTMLHtmlElement("html"),
    childNodes: [],
    cookie: "",
    compatMode: "CSS1Compat",
    host: "example.com",
    readyState: "complete",
    nodeType: globalThis.Node.DOCUMENT_NODE,
    createEvent: () => new globalThis.Event,
    createTextNode: (data) => {
        let node = new globalThis.Text;
        node.data = data;
        return node;
    },
    createElement: (tagName) => {
        let constructor = _GetElementConstructor(tagName);
        return new (constructor)(tagName);
    },
};

globalThis.document.appendChild(globalThis.document.documentElement);
globalThis.document.documentElement.appendChild(globalThis.document.body);

console.error = console.log;
console.warn = console.log;
