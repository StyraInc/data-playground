import { OPAClient } from "npm:@styra/opa";

export async function putPolicy(opa, id, code, raise = true) {
  const resp = await fetch(`${opa}v1/policies/${id}`, {
    method: "PUT",
    body: code,
    headers: {
      "Content-Type": "text/plain",
    },
  });
  if (raise && !resp.ok) throw new Error(`eval policy: ${resp.status}`);
  return resp;
}

export  async function compilePolicy(opa, input, mappings = {}, path = "filters/include") {
  const href = window.location.toString();
  const u = new URL(href); // TODO(sr): better way?!
  u.pathname = "";
  u.search = "";
  const client = new OPAClient(u.toString());
  const resp = await client.getFilters(path, input,
    {
      target: "postgresql",
      tableMappings: {
        postgresql: mappings,
      },
    })
  return resp.query;
}
