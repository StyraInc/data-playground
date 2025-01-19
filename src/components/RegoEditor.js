import {EditorView} from "npm:@codemirror/view";
import {lintGutter, linter} from "npm:@codemirror/lint";
import {basicSetup} from "npm:codemirror";
import {putPolicy, compilePolicy} from "./helpers.js";

export function RegoEditor({
  rego = "",
  value,
  style = "font-size: 14px;",
  opa = "http://127.0.0.1:8181/",
  id = "",
  evalInput = {}, // initial input, updates are set by `<instance>.input = ...`
  initialMappings = {},
} = {}) {
  const parent = document.createElement("div");
  parent.style = style;
  parent.value = value;

  let input = evalInput;
  let mappings = initialMappings;

  const peLinter = linter(async view => {
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
    // If we make it this far, the policy is on the server, so let's compile it:
    const { result, errors } = await (await compilePolicy(opa, input, mappings)).json();
    const query = result;
    if (errors) {
      parent.value = String(""); // this means "no query produced"
      parent.dispatchEvent(new InputEvent("input", {bubbles: true}));

      return errors.map(({location: {row, col}, message, details}) => {
        const dets = details?.details; // TODO(sr): API response shouldn't nest this like that
        const msg = dets ? `${message} (${dets})` : message;
        return {
          from: doc.line(row).from + col - 1,
          to: doc.line(row+1).from, // next line, i.e., end of line used in "from"
          severity: "warning",
          message: msg,
        };
      });
    }

    parent.value = String(result); // TODO(sr) check this
    parent.dispatchEvent(new InputEvent("input", {bubbles: true}));
    return [];
  }, {
    delay: 200,
  });

  const [_config, lintPlugin, _exts] = peLinter;

  const editor = new EditorView({
    parent,
    doc: rego,
    extensions: [
      basicSetup,
      lintGutter(),
      peLinter,
    ]
  });

  parent.addEventListener("input", (event) => event.isTrusted && event.stopImmediatePropagation());
  return  {
    view: parent,
    set input(i) {
      input = i;
      forceLinting(editor, lintPlugin);
    },
    set mappings(i) {
      mappings = i;
      forceLinting(editor, lintPlugin);
    },
  };
}

// based on discussion here:
// https://discuss.codemirror.net/t/can-we-manually-force-linting-even-if-the-document-hasnt-changed/3570
function forceLinting(view, lintPlugin) {
  const plugin = view.plugin(lintPlugin);
  if (plugin) {
    plugin.set = true;
    plugin.force();
  }
}
