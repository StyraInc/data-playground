import {javascript} from "npm:@codemirror/lang-javascript"; // TODO
import {EditorView, keymap} from "npm:@codemirror/view";
import {button} from "npm:@observablehq/inputs";
import {basicSetup} from "npm:codemirror";
import {putPolicy} from "./helpers.js";

export function RegoEditor({
  value = "",
  style = "font-size: 14px;",
  opa = "http://127.0.0.1:8181/",
  id = ""
} = {}) {
  const parent = document.createElement("div");
  parent.style = style;
  parent.value = value;

  const run = () => {
    parent.value = String(editor.state.doc);
    parent.dispatchEvent(new InputEvent("input", {bubbles: true}));
  };

  const editor = new EditorView({
    parent,
    doc: value,
    extensions: [
      basicSetup,
      javascript(),
      keymap.of([
        {key: "Shift-Enter", preventDefault: true, run},
        {key: "Mod-s", preventDefault: true, run}
      ]),
      EditorView.updateListener.of(async update => {
        if (update.docChanged) {
          try {
            const resp = await putPolicy(opa, id, String(editor.state.doc));
            // If the server accepts it, it's valid, let's emit an event
            parent.value = String(editor.state.doc);
            parent.dispatchEvent(new InputEvent("input", {bubbles: true}));
          } catch (e) { // not JSON yet, ignore
          }
        }
      }),
    ]
  });

  parent.addEventListener("input", (event) => event.isTrusted && event.stopImmediatePropagation());
  parent.appendChild(button([["Update", run]]));

  return parent;
}
