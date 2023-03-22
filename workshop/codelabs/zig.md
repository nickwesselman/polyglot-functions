summary: How to create a function with Zig.
id: zig
status: Published
categories: group-three
feedback link: https://github.com/nickwesselman/polyglot-functions/issues

# Group 3: Zig

## Install Zig prerequisites

[Download or install](https://ziglang.org/download/) the Zig toolchain.

Installing from a [package manager](https://github.com/ziglang/zig/wiki/Install-Zig-from-a-Package-Manager) is likely your easiest path.

## Generate the function extension

The following command will create an order discount Function at `extensions/order-discount-zig`, using our generic Wasm boilerplate.

```bash
npm run generate extension -- --type order_discounts --template wasm --name order-discount-zig
```

## Initialize a new Zig project

1. Navigate to the extension folder for your Zig function:

    ```bash
    cd extensions/order-discount-zig
    ```

1. Initialize the Zig project:

    ```bash
    zig init-exe
    ```

1. In the created `build.zig`, update the `const target` to default to WASI:

    ```zig
    const target = .{ .cpu_arch = .wasm32, .os_tag = .wasi };
    ```

## Define your input query

<<include/input-query-intro.md>>

Replace the contents of `extensions/order-discount-zig/input.graphql` with the following from GitHub:

### ➡️ [Get input query code](https://github.com/nickwesselman/polyglot-functions/blob/main/app/extensions/order-discount-zig/input.graphql)

## Update your extension UI settings

<<include/extension-ui-settings.md>>

## Add input query variable settings

<<include/input-variable-settings.md>>

## Add build command and path settings

You also need to inform the Shopify CLI about how to build your Zig wasm module, and where to expect the build output.

In `shopify.function.extension.toml`, replace the `[build]` section with the following:

```toml
[build]
command = "zig build -Drelease-fast=true"
path = "zig-out/bin/order-discount-zig.wasm"
```

## Write your function logic in Zig

Update `src/main.zig` and implement the following function logic, outputting appropriate JSON for an [order discount function result](https://shopify.dev/docs/api/functions/reference/order-discounts/graphql/functionresult).

<<include/function-logic.md>>

_Hint_: You can find a completed example on GitHub:

### ➡️ [Get Zig function code](https://github.com/nickwesselman/polyglot-functions/tree/main/app/extensions/order-discount-zig/src)

## Test your function locally

<<include/test-local.md>>

Note: Even with a successful output, Zig outputs an error message which I've been unable to resolve. It does not seem to affect execution:

```plaintext
error while executing at wasm backtrace:
    0:  0x202 - <unknown>!<wasm function 3>
```

## Test your function on Shopify

Use the following steps, selecting the `order-discount-zig` discount type, and using `ZIG` as your discount code.

<<include/test-shopify.md>>

## Compare performance and binary size

<<include/compare-performance.md>>

## Awesome work!

All our base are belong to YOU!!! Onto another language?