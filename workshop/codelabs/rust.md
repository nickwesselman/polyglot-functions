summary: How to create a function with Rust.
id: rust
status: Published
categories: group-one
feedback link: https://github.com/nickwesselman/polyglot-functions/issues

# Group 1: Rust

## Generate the function extension

The following command will create an order discount Function at `extensions/order-discount-rust`, using our Rust boilerplate.

```bash
npm run generate extension -- --type order_discounts --template rust --name order-discount-rust
```

## Define your input query

The [input query](https://shopify.dev/docs/apps/functions/input-output#input) defines the data that Shopify will provide via STDIN to your function.

Replace the contents of `extensions/order-discount-rust/input.graphql` with the following from GitHub:

### ➡️ [Get input query code](https://github.com/nickwesselman/polyglot-functions/blob/main/extensions/order-discount-rust/input.graphql)

## Update your extension UI settings

You need to inform Shopify about the UI paths for configuring your function. These paths are already provided by the app template you used.

In `extensions/order-discount-rust/shopify.function.extension.toml`, replace the `[ui.paths]` section with the following:

```toml
[ui.paths]
create = "/discount/:functionId/new"
details = "/discount/:functionId/:id"
```

## Add input query variable settings

You also need to inform Shopify about where to find GraphQL variable values that will be used when executing your input query.

Add the following to `extensions/order-discount-rust/shopify.function.extension.toml`:

```toml
[input.variables]
namespace = "$app:polyglot-functions"
key = "function-configuration"
```

## Write your function logic in Rust

In `extensions/order-discount-rust/src/main.rs`, implement the following function logic, outputting appropriate JSON for an [order discount function result](https://shopify.dev/docs/api/functions/reference/order-discounts/graphql/functionresult).

<<include/function-logic.md>>

_Hint_: You can find a completed example on GitHub:

### ➡️ [Get Rust function code](https://github.com/nickwesselman/polyglot-functions/blob/main/extensions/order-discount-rust/src/main.rs)

## Test your function locally

1. Navigate to your function folder:

    ```bash
    cd extensions/order-discount-rust
    ```

<<include/test-local.md>>

## Test your function on Shopify

Use the following steps, selecting the `order-discount-rust` discount type, and using `RUST` as your discount code.
(Google codelabs doesn't support parameterized includes 🙃)

<<include/test-shopify.md>>

## Awesome work!

You're a Rust champion. Onto another language?