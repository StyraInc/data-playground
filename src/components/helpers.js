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

export  async function compilePolicy(opa, input, mappings = {}, query = "data.filters.include") {
  const resp = await fetch(`${opa}exp/compile`, {
    method: "POST",
    body: JSON.stringify({
      input,
      query,
      options: {
        dialect: "postgres",
        targetSQLTableMappings: mappings,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/vnd.styra.sql+json"
    },
  });
  return resp;
}
