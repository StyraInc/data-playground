const OPA_HOST = "http://127.0.0.1:8181/";
export async function putPolicy(id, code) {
  const resp = await fetch(`${OPA_HOST}v1/policies/${id}`, {
    method: "PUT",
    body: code,
    headers: {
      "Content-Type": "text/plain",
    },
  });
  if (!resp.ok) throw new Error(`eval policy: ${resp.status}`);
  return resp;
}

export  async function evalPolicy(input, path = "data/filters") {
  const resp = await fetch(`${OPA_HOST}v1/${path}`, {
    method: "POST",
    body: JSON.stringify({input}),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) throw new Error(`eval policy: ${resp.status}`);
  return resp;
}
