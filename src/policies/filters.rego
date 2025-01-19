package filters

user := input.user

# METADATA
# scope: document
# custom:
#   unknowns:
#     - input.users
#     - input.products
#     - input.orders
include if {
	input.users.name == user
	input.budget != "low"
}

include if {
	input.budget == "low"
	input.products.price < 500
	input.users.name == user
}

_use_metadata := rego.metadata.rule()
