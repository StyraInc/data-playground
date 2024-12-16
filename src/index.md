---
sql:
  orders: data/orders.db
---
# Data Playground

```js
import {RegoEditor} from "./components/RegoEditor.js";
import {JSONEditor} from "./components/JSONEditor.js";
import {evalPolicy, putPolicy} from "./components/helpers.js";
```


<div class="grid grid-cols-3">
<div class="card grid-colspan-2">
<h2>Data Policy</h2>

```js
const opa = "http://127.0.0.1:8181/";
const filtersRego = await FileAttachment("policies/filters.rego").text();
const regoInput = view(RegoEditor({id: "filters.rego", opa, value: filtersRego}));
```
</div>
<div class="card">
<h2>Input</h2>

```js
const input = {user: "Emma Clark", budget: "low"};
const evalInput = view(JSONEditor({value: JSON.stringify(input, null, 2)}));
```

```js
const evalInput0 = JSON.parse(evalInput);
```
</div>
</div>

```js
const convertRego = await FileAttachment("policies/convert.rego").text();
await putPolicy(opa, "convert.rego", convertRego);
const _ = regoInput; // depend on updates to data policy

const result = (await (await evalPolicy(opa, evalInput0)).json()).result;
const query = result.query;
```

<div class="card">
<h2>Lookup Results</h2>

```js
const stmt = `select u.name as user, p.name as product, p.price
from orders.orders o
inner join orders.users u on o.user_id = u.id
inner join orders.order_items i on o.order_id = i.order_id
inner join orders.products p on i.product_id = p.product_id
${query}`
//view(stmt);
```

```js
const result = await sql([stmt]);
view(Inputs.table(result));
```
</div>
