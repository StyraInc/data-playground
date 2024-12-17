# Rego Data Filtering Playground

This is a simple dashboard to demonstrate the data filtering capabilities
we're working on in the Enterprise OPA Platform.


## Getting started

1. Clone the repo
2. `docker compose up --build` (expects an EOPA_LICENSE_KEY env var)
3. Go to http://localhost:3000


When the Rego code in the "Data Policy" pane is edited, it is automatically sent to
EOPA.
That PUT request for the Policy API could fail -- if so, it's because of syntax errors
which are then displayed in **red**.
If the PUT succeeds, a request for evaluating the data policy is sent to EOPA, which
either yields _partial eval_ post-analysis errors, or a SQL query.
Post-analysis errors are annotated in **yellow**.
If a query is returned, it's used to subset the (hidden) SQL query collecting ordered
products by user.


## Notes

* Error locations provided by the EOPA API only contain starting points (row/col),
  and the editor component would really appreciate spans (start, end). To work around
  this, we're extending all the starting points to the end of the line. It's close
  enough in most cases.
* To do local development,
  1. start EOPA on 127.0.0.1:8181 (no config or files needed)
  2. run `npm run dev` (`npm install` if you haven't before)
  3. go to http://127.0.0.1:3000 (localhost yields CORS errors when reaching EOPA)
* Open Dev Tools network tab for insights if something goes wrong: not all errors
  are currently surfaced in a usable way.
