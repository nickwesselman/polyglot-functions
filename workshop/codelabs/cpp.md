summary: How to create a function with C++.
id: cpp
status: Published
categories: group-two
feedback link: https://github.com/nickwesselman/polyglot-functions/issues

# Group 2: C++

## Install C++ prerequisites

Download and unzip the [WASI SDK 19.0](https://github.com/WebAssembly/wasi-sdk/releases/tag/wasi-sdk-19).

Examples in upcoming steps will assume this is placed in `/usr/local/wasi-sdk-19.0`.

## Generate the function extension

The following command will create an order discount Function at `extensions/order-discount-cpp`, using our generic Wasm boilerplate.

```bash
npm run generate extension -- --type order_discounts --template wasm --name order-discount-cpp
```

## Define your input query

<<include/input-query-intro.md>>

Replace the contents of `extensions/order-discount-cpp/input.graphql` with the following from GitHub:

### ➡️ [Get input query code](https://github.com/nickwesselman/polyglot-functions/blob/main/app/extensions/order-discount-cpp/input.graphql)

## Update your extension UI settings

<<include/extension-ui-settings.md>>

## Add input query variable settings

<<include/input-variable-settings.md>>

## Add build command and path settings

You also need to inform the Shopify CLI about how to build your C++ wasm module, and where to expect the build output.

In `shopify.function.extension.toml`, replace the `[build]` section with the following:

```toml
[build]
command = "/usr/local/wasi-sdk-19.0/bin/clang++ -O3 -fno-exceptions -flto -std=c++20 --sysroot=/usr/local/wasi-sdk-19.0/share/wasi-sysroot src/main.cpp -o main.wasm"
path = "main.wasm"
```

Adjust the **command** as needed for your WASI SDK path. Note that it appears twice. You may also create a build script ([example](https://github.com/nickwesselman/polyglot-functions/blob/main/app/extensions/order-discount-cpp/build.sh)) and invoke that instead as your **command** ([example](https://github.com/nickwesselman/polyglot-functions/blob/main/app/extensions/order-discount-cpp/shopify.function.extension.toml#L6)).

## Write your function logic in C++

Create a `src/main.cpp` file and implement the following function logic, outputting appropriate JSON for an [order discount function result](https://shopify.dev/docs/api/functions/reference/order-discounts/graphql/functionresult).

<<include/function-logic.md>>

_Hint_: You can find a completed example on GitHub:

### ➡️ [Get C++ function code](https://github.com/nickwesselman/polyglot-functions/tree/main/app/extensions/order-discount-cpp/src)

This example uses the [json_struct](https://github.com/jorgen/json_struct) header library to parse and output JSON.

## Test your function locally

1. Navigate to your function folder:

    ```bash
    cd extensions/order-discount-cpp
    ```

<<include/test-local.md>>

## Test your function on Shopify

Use the following steps, selecting the `order-discount-cpp` discount type, and using `C++` as your discount code.

<<include/test-shopify.md>>

## Awesome work!

You put the "plus" in C++! Onto another language?

_Thanks to Elad Kishon for [paving the way](https://medium.com/@eladk/implementing-a-webassembly-shopify-function-using-c-fa9904e21d9) for this example._