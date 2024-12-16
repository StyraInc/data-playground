---
sql:
  orders: data/orders.db
---
# Data Playground

```js
import {RegoEditor} from "./components/RegoEditor.js";
import {JSONEditor} from "./components/JSONEditor.js";
import {evalPolicy, putPolicy} from "./components/helpers.js";

// constants and prep work
const opa = "http://127.0.0.1:8181/";
const filtersRego = await FileAttachment("policies/filters.rego").text();
const input = {user: "Emma Clark", budget: "low"};
const convertRego = await FileAttachment("policies/convert.rego").text();
const errors = Mutable([]);
await putPolicy(opa, "convert.rego", convertRego);
await putPolicy(opa, "filters.rego", filtersRego);
```


<div class="grid grid-cols-3">
<div class="card grid-colspan-2">
<h2>Data Policy</h2>

```js
import {linter} from "npm:@codemirror/lint";
const linter0 = linter(view => {
  const doc = view.state.doc;
  return errors.value.map(({location: {row, col}, message}) => ({
    from: doc.line(row).from + col - 1,
    to: doc.line(row+1).from,
    severity: "warning",
    message,
  }));
});
const regoInput = view(RegoEditor({id: "filters.rego", opa, linter: linter0, value: filtersRego}));
```
</div>
<div class="card">
<h2>Input</h2>

```js
const evalInput = view(JSONEditor({value: JSON.stringify(input, null, 2)}));
```

```js
const evalInput0 = JSON.parse(evalInput);
```
</div>
</div>

```js
await putPolicy(opa, "convert.rego", convertRego);
const _ = regoInput; // depend on updates to data policy

const result = (await (await evalPolicy(opa, evalInput0)).json()).result;
const query = result.query;
errors.value = result.conditions?.errors || [];
view(errors);
```

<div class="grid grid-cols-3">
<div class="card grid-colspan-2">
<h2>Lookup Results</h2>

```js
const stmt = `select u.name as user, p.name as product, p.price::FLOAT as price
from orders.orders o
inner join orders.users u on o.user_id = u.id
inner join orders.order_items i on o.order_id = i.order_id
inner join orders.products p on i.product_id = p.product_id
${query || ''}`
//view(stmt);
```
<!-- TODO(sr): give some feedback when there is no query produced -->

```js
const lookup = await sql([stmt]);
view(Inputs.table(lookup));
```
</div>
<div class="card">

```js
result
```
</div>
</div>
