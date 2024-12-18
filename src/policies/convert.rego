package convert

import rego.v1

# TODO(sr): this is just good enough, the actual API is TBD
partial_eval(inp, unknowns, query) := http.send({
	"method": "POST",
	"url": "http://127.0.0.1:8181/exp/compile",
	"body": {
		"query": query,
		"unknowns": unknowns,
		"input": inp,
	},
}).body

to_conditions(inp, unknowns, query) := conds(partial_eval(inp, unknowns, query))

conds(pe) := pe if pe.errors

conds(pe) := res if {
	not pe.errors
	not pe.result.support # "support modules" are not supported right now
	res := or_({query_to_condition(q) | some q in pe.result.queries})
}

query_to_condition(q) := and_({expr_to_condition(e) | some e in q})

expr_to_condition(e) := op_(op(e), field(e), value(e))

op(e) := r if {
	e.terms[0].type == "ref"
	e.terms[0].value[0].type == "var"
	o := e.terms[0].value[0].value
	r := is_valid(o)
}

is_valid(o) := u if {
	o in {"eq", "lt", "gt", "neq"}
	u := _replace(o)
}

_replace("neq") := "ne"

_replace(x) := x if x != "neq"

field(e) := f if {
	# find the operand with 'input.*'
	some t in array.slice(e.terms, 1, 3)
	is_input_ref(t)
	f := concat(".", [t.value[1].value, t.value[2].value])
}

value(e) := v if {
	# find the operand without 'input.*'
	some t in array.slice(e.terms, 1, 3)
	not is_input_ref(t)
	v := value_from_term(t)
}

value_from_term(t) := t.value if t.type != "null"

else := null

is_input_ref(t) if {
	t.type == "ref"
	t.value[0].value == "input"
}

# conditions helper functions
eq_(field, value) := op_("eq", field, value)

lt_(f, v) := op_("lt", f, v)

op_(o, f, v) := {"type": "field", "operator": o, "field": f, "value": v}

and_(values) := compound("and", values)

or_(values) := compound("or", values)

compound(op, values) := {"type": "compound", "operator": op, "value": values}
