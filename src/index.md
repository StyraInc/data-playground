---
sql:
  orders: data/orders.db
---
# Data Playground

```js
import {RegoEditor} from "./components/RegoEditor.js";
import {JSONEditor} from "./components/JSONEditor.js";
import {SQLEditor} from "./components/SQLEditor.js";
import {putPolicy} from "./components/helpers.js";

// constants and prep work
const opa = "/"; // proxied
const filtersRego = await FileAttachment("policies/filters.rego").text();
const convertRego = await FileAttachment("policies/convert.rego").text();
const input = {user: "Emma Clark", budget: "low"};
await putPolicy(opa, "convert.rego", convertRego);
await putPolicy(opa, "filters.rego", filtersRego);
```


<div class="grid grid-cols-3">
<div class="card grid-colspan-2">
<h2>Data Policy</h2>

```js
const regoInput = view(RegoEditor({id: "filters.rego", opa, evalInput, rego: filtersRego}));
```
</div>
<div class="card">
<h2>Input</h2>

```js
const evalInput0 = view(JSONEditor({value: JSON.stringify(input, null, 2)}));
```

```js
const evalInput = JSON.parse(evalInput0);
```
</div>
</div>

<div class="card">
<h2>Results</h2>

```js
const lookup = await sql([stmt]);
view(query === "" ? html`<div class="warning" label="No query produced">Check errors in editor</div>` : Inputs.table(lookup, {select: false}));
```
</div>

<div class="card">
<h2>Query</h2>
<h3>extra conditions:</h3>
${query}

```js
const defaultQuery = `select u.name as user, p.name as product, p.price::FLOAT as price
from orders.orders o
inner join orders.users u on o.user_id = u.id
inner join orders.order_items i on o.order_id = i.order_id
inner join orders.products p on i.product_id = p.product_id`;
const dbQuery = view(SQLEditor({value: defaultQuery}));
````

```js
const query = regoInput;
const stmt = `${dbQuery}
${query || ''}`;
```
</div>
