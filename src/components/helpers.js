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
  const resp = await fetch(`${opa}v1/compile`, {
    method: "POST",
    body: JSON.stringify({
      input,
      query,
      options: {
        targetSQLTableMappings: {
          postgresql: mappings,
        },
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/vnd.styra.sql.postgresql+json"
    },
  });
  return resp;
}
