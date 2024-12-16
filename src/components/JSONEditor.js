import {json} from "npm:@codemirror/lang-json";
import {EditorView, keymap} from "npm:@codemirror/view";
import {basicSetup} from "npm:codemirror";

export function JSONEditor({
  value = "",
  style = "font-size: 14px;"
} = {}) {
  const parent = document.createElement("div");
  parent.style = style;
  parent.value = value;

  const editor = new EditorView({
    parent,
    doc: value,
    extensions: [
      basicSetup,
      json(),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          try {
            JSON.parse(String(editor.state.doc));
            parent.value = String(editor.state.doc);
            parent.dispatchEvent(new InputEvent("input", {bubbles: true}));
          } catch (e) { // not JSON yet, ignore
          }
        }
      }),
    ]
  });

  parent.addEventListener("input", (event) => event.isTrusted && event.stopImmediatePropagation());
  return parent;
}
