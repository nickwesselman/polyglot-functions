summary: How to create a function with Grain.
id: grain
status: Published
categories: group-three
feedback link: https://github.com/nickwesselman/polyglot-functions/issues

# Group 3: Grain

## Install Grain prerequisites

[Get Grain](https://grain-lang.org/docs/getting_grain)

## Generate the function extension

The following command will create an order discount Function at `extensions/order-discount-grain`, using our generic Wasm boilerplate.

```bash
npm run generate extension -- --type order_discounts --template wasm --name order-discount-grain
```

## Define your input query

<<include/input-query-intro.md>>

Replace the contents of `extensions/order-discount-grain/input.graphql` with the following from GitHub:

### ➡️ [Get input query code](https://github.com/nickwesselman/polyglot-functions/blob/main/app/extensions/order-discount-grain/input.graphql)

## Update your extension UI settings

<<include/extension-ui-settings.md>>

## Add input query variable settings

<<include/input-variable-settings.md>>

## Add build command and path settings

You also need to inform the Shopify CLI about how to build your Grain wasm module, and where to expect the build output.

In `shopify.function.extension.toml`, replace the `[build]` section with the following:

```toml
[build]
command = "grain compile src/main.gr --no-gc --release --elide-type-info -o main.wasm"
path = "main.wasm"
```

## Write your function logic in Grain

Create `src/main.gr` and implement the following function logic, outputting appropriate JSON for an [order discount function result](https://shopify.dev/docs/api/functions/reference/order-discounts/graphql/functionresult).

<<include/function-logic.md>>

_Hint_: You can find a completed example on GitHub:

### ➡️ [Get Grain function code](https://github.com/nickwesselman/polyglot-functions/tree/main/extensions/order-discount-grain/src)

Since Grain doesn't yet have built-in JSON support, this example uses code copied from an [open Grain pull request](https://github.com/grain-lang/grain/pull/1133).

## Test your function locally

1. Navigate to your function folder:

    ```bash
    cd extensions/order-discount-grain
    ```

<<include/test-local.md>>

## Test your function on Shopify

Use the following steps, selecting the `order-discount-grain` discount type, and using `GRAIN` as your discount code.

<<include/test-shopify.md>>

## Awesome work!

You tamed the Grain! Onto another language?

_Thanks to Grain's [Oscar Spencer](https://github.com/ospencer) and [Blaine Bublitz](https://github.com/phated) for their help with this example!_