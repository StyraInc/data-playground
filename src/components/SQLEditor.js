import {sql} from "npm:@codemirror/lang-sql";
import {linter} from "npm:@codemirror/lint";
import {EditorView, keymap} from "npm:@codemirror/view";
import {basicSetup} from "npm:codemirror";

export function SQLEditor({
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
      sql(),
      linter(async view => {
        parent.value = String(editor.state.doc);
        parent.dispatchEvent(new InputEvent("input", {bubbles: true}));
      }),
    ]
  });

  parent.addEventListener("input", (event) => event.isTrusted && event.stopImmediatePropagation());
  return parent;
}
