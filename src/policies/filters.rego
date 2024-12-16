package filters

import rego.v1

user := input.user

include if {
	input.users.name == user
	input.budget != "low"
}

include if {
	input.budget == "low"
	input.products.price < 500
	input.users.name == user
}

conditions := data.convert.to_conditions(input, ["input.products", "input.users"], "data.filters.include")

query := ucast.as_sql(conditions, "postgres", {"users": {"$self": "u"}, "products": {"$self": "p"}})
