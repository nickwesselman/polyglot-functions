summary: How to create a function with AssemblyScript.
id: assemblyscript
status: Published
categories: group-two
feedback link: https://github.com/nickwesselman/polyglot-functions/issues

# Group 2: AssemblyScript

## Generate the function extension

The following command will create an order discount Function at `extensions/order-discount-assemblyscript`, using our generic Wasm boilerplate.

```bash
npm run generate extension -- --type order_discounts --template wasm --name order-discount-assemblyscript
```

## Initialize a new AssemblyScript project

1. Navigate to the extension folder for your AssemblyScript function:

    ```bash
    cd extensions/order-discount-assemblyscript
    ```

1. Initialize a new npm module:

    ```bash
    npm init --yes
    ```

1. Install the AssemblyScript compiler:

    ```bash
    npm install --save-dev assemblyscript
    ```

1. Scaffold an AssemblyScript project:

    ```bash
    npx asinit .
    ```

1. Add the AssemblyScript wasi-shim, needed for targeting WASI:

    ```bash
    npm install --save-dev @assemblyscript/wasi-shim
    ```

1. Also for wasi-shim, add the following to the `asconfig.json`:

    ```json
    {
        "extends": "./node_modules/@assemblyscript/wasi-shim/asconfig.json",
        // ...
    }
    ```

1. Since the WASI shim only provides a [low-level API for reading STDIN](https://github.com/AssemblyScript/wasi-shim/blob/main/assembly/wasi_process.ts#L131), you should add as-wasi as well ([`Console.readAll`](https://github.com/jedisct1/as-wasi/blob/master/REFERENCE_API_DOCS.md#readall)). Compatibility with wasi-shim is not in a published npm module yet, so you need to reference the GitHub repo.

    ```bash
    npm install --save https://github.com/jedisct1/as-wasi
    ```

## Define your input query

<<include/input-query-intro.md>>

Replace the contents of `extensions/order-discount-assemblyscript/input.graphql` with the following from GitHub:

### ➡️ [Get input query code](https://github.com/nickwesselman/polyglot-functions/blob/main/app/extensions/order-discount-assemblyscript/input.graphql)

## Update your extension UI settings

<<include/extension-ui-settings.md>>

## Add input query variable settings

<<include/input-variable-settings.md>>

## Add build command and path settings

You also need to inform the Shopify CLI about how to build your AssemblyScript wasm module, and where to expect the build output.

In `shopify.function.extension.toml`, replace the `[build]` section with the following:

```toml
[build]
command = "npm run asbuild:release"
path = "build/release.wasm"
```

## Write your function logic in AssemblyScript

In `assembly/index.ts`, implement the following function logic, outputting appropriate JSON for an [order discount function result](https://shopify.dev/docs/api/functions/reference/order-discounts/graphql/functionresult).

<<include/function-logic.md>>

_Hint_: You can find a completed example on GitHub:

### ➡️ [Get AssemblyScript function code](https://github.com/nickwesselman/polyglot-functions/tree/main/app/extensions/order-discount-assemblyscript/assembly)

This example requires adding json-as to your AssemblyScript project, and creating API classes for JSON parse/stringify:

```bash
npm install --save json-as
npm install visitor-as --save-dev --force
```

json-as also requires adding the following `transform` configuration to the `options` in your `asconfig.json`:

```json
{
  "options": {
    "bindings": "esm",
    "transform": ["json-as/transform"]
  }
}
```

## Test your function locally

1. Build your function code based on the command in `shopify.function.extension.toml`:

    ```bash
    npm run function:build --prefix ../..
    ```

1. Validate your function's output against the `FunctionResult` GraphQL type:

    ```bash
    npm run function:validate --prefix ../..
    ```

1. Preview your function's JSON output and performance profile:

    ```bash
    npm run function:preview --prefix ../..
    ```

## Test your function on Shopify

Use the following steps, selecting the `order-discount-assemblyscript` discount type, and using `ASSEMBLYSCRIPT` as your discount code.

<<include/test-shopify.md>>

## Awesome work!

You're a master assembler. Onto another language?