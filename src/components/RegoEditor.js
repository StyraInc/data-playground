import {EditorView} from "npm:@codemirror/view";
import {lintGutter, linter} from "npm:@codemirror/lint";
import {basicSetup} from "npm:codemirror";
import {putPolicy, evalPolicy} from "./helpers.js";

export function RegoEditor({
  rego = "",
  value,
  style = "font-size: 14px;",
  opa = "http://127.0.0.1:8181/",
  id = "",
  evalInput = {},
} = {}) {
  const parent = document.createElement("div");
  parent.style = style;
  parent.value = value;

  const editor = new EditorView({
    parent,
    doc: rego,
    extensions: [
      basicSetup,
      lintGutter(),
      linter(async view => {
        const doc = view.state.doc;
        const resp = await putPolicy(opa, id, String(editor.state.doc), false)
        const payload = await resp.json();
        if (payload.code) { // bad rego
          parent.value = String(""); // this means "no query produced"
          parent.dispatchEvent(new InputEvent("input", {bubbles: true}));

          return payload.errors.map(({code, message, location: {row, col}}) => ({
            from: doc.line(row).from + col - 1,
            to: doc.line(row+1).from, // next line, i.e., end of line used in "from"
            severity: "error",
            message: `${code}: ${message}`,
          }));
        }
        // If we make it this far, the policy is on the server, so let's eval it:
        const result = (await (await evalPolicy(opa, evalInput)).json()).result;
        const query = result.query;
        const errors = result.conditions?.errors;
        if (errors) {
          parent.value = String(""); // this means "no query produced"
          parent.dispatchEvent(new InputEvent("input", {bubbles: true}));

          return errors.map(({location: {row, col}, message}) => ({
            from: doc.line(row).from + col - 1,
            to: doc.line(row+1).from, // next line, i.e., end of line used in "from"
            severity: "warning",
            message,
          }));
        }

        parent.value = String(result.query);
        parent.dispatchEvent(new InputEvent("input", {bubbles: true}));
        return [];
      }, {
        delay: 200,
      }),
    ]
  });

  parent.addEventListener("input", (event) => event.isTrusted && event.stopImmediatePropagation());
  return parent;
}
