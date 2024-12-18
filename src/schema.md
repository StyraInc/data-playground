---
sql:
  orders: data/orders.db
---
# Schemas

```js
const columns = ["column_name", "column_type"];
```

```sql id=productsSchema
describe orders.products
```
```sql id=usersSchema
describe orders.users
```
```sql id=ordersSchema
describe orders.orders
```
```sql id=orderItemsSchema
describe orders.order_items
```

<div class="grid grid-cols-2" style="grid-auto-rows: auto;">
<div class="card">

  `input.products`

   ${Inputs.table(productsSchema, { columns, select: false })}
</div>
<div class="card">

  `input.users`

  ${Inputs.table(usersSchema, { columns, select: false })}
</div>
<div class="card">
  
  `input.orders`
  
  ${Inputs.table(ordersSchema, { columns, select: false })}
</div>
<div class="card">
  
  `input.order_items`
  
  ${Inputs.table(orderItemsSchema, { columns, select: false })}
</div>
</div>

