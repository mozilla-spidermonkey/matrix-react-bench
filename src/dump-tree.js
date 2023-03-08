/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export default function DumpDOMTree(target, indent = "") {
    if (target instanceof Text) {
        console.log(indent, "<TEXT>", target.data, "</TEXT>");
        return;
    }

    const ignored_props = [
        "childNodes",
        "parentNode",
        "parentElement",
        "dataset",
        "nodeName",
        "tagName",
        "textContent",
        "contentEditable",
    ];
    const filteredProps = Object.getOwnPropertyNames(target)
        .filter(p => ignored_props.indexOf(p) < 0);
    console.log(indent, "<", target.tagName, filteredProps);

    if ("textContent" in target) {
        console.log(indent, "<TEXTCONTENT>", target.textContent, "</TEXTCONTENT>");
    }
    for (let x of target.childNodes) {
        DumpDOMTree(x, indent + "  ");
    }

    console.log(indent, "/>");
}
