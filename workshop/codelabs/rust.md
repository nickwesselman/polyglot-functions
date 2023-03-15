summary: How to create a function with Rust.
id: rust
status: Published
categories: group-one
feedback link: https://github.com/nickwesselman/polyglot-functions/issues

# Group 1: Rust

## TODO: Install Rust prerequisites

## Generate the function extension

The following command will create an order discount Function at `extensions/order-discount-rust`, using our Rust boilerplate.

```bash
npm run generate extension -- --type order_discounts --template rust --name order-discount-rust
```

## Define your input query

<<include/input-query-intro.md>>

Replace the contents of `extensions/order-discount-rust/input.graphql` with the following from GitHub:

### ➡️ [Get input query code](https://github.com/nickwesselman/polyglot-functions/blob/main/extensions/order-discount-rust/input.graphql)

## Update your extension UI settings

<<include/extension-ui-settings.md>>

## Add input query variable settings

<<include/input-variable-settings.md>>

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