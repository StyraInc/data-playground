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

export  async function evalPolicy(opa, input, path = "data/filters") {
  const resp = await fetch(`${opa}v1/${path}`, {
    method: "POST",
    body: JSON.stringify({input}),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) throw new Error(`eval policy: ${resp.status}`);
  return resp;
}
