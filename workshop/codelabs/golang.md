summary: How to create a function with Go.
id: golang
status: Published
categories: group-two
feedback link: https://github.com/nickwesselman/polyglot-functions/issues

# Group 2: Go

## Install TinyGo prerequisites

1. [Install Go](https://go.dev/doc/install) (TinyGo requires 1.18+)
1. [Install TinyGo](https://tinygo.org/getting-started/install/)

## Generate the function extension

The following command will create an order discount Function at `extensions/order-discount-golang`, using our generic Wasm boilerplate.

```bash
npm run generate extension -- --type order_discounts --template wasm --name order-discount-golang
```

## Initialize a new Go module

1. Navigate to the extension folder for your Go function:

    ```bash
    cd extensions/order-discount-golang
    ```

1. Initialize the Go module:

    ```bash
    go mod init main
    ```

This will create a `go.mod` file.

## Define your input query

<<include/input-query-intro.md>>

Replace the contents of `extensions/order-discount-golang/input.graphql` with the following from GitHub:

### ➡️ [Get input query code](https://github.com/nickwesselman/polyglot-functions/blob/main/app/extensions/order-discount-golang/input.graphql)

## Update your extension UI settings

<<include/extension-ui-settings.md>>

## Add input query variable settings

<<include/input-variable-settings.md>>

## Add build command and path settings

You also need to inform the Shopify CLI about how to build your Go wasm module, and where to expect the build output.

In `shopify.function.extension.toml`, replace the `[build]` section with the following:

```toml
[build]
command = "tinygo build -target wasi -scheduler=none -gc=leaking -opt=z -no-debug -o order-discount-golang.wasm"
path = "order-discount-golang.wasm"
```

The TinyGo build settings here minimize the module size. Shopify Functions executions are short lived and single threaded, so no scheduler or garbage collection is needed.

## Write your function logic in Go

1. Create a new file, `main.go`.
1. Implement the following function logic, outputting appropriate JSON for an [order discount function result](https://shopify.dev/docs/api/functions/reference/order-discounts/graphql/functionresult).

<<include/function-logic.md>>

_Hint_: You can find a completed example on GitHub:

### ➡️ [Get Go function code](https://github.com/nickwesselman/polyglot-functions/blob/main/app/extensions/order-discount-golang/main/main.go)

This example requires adding gjson to your Go module:

```bash
go get -u github.com/tidwall/gjson
```

## Test your function locally

<<include/test-local.md>>

## Test your function on Shopify

Use the following steps, selecting the `order-discount-golang` discount type, and using `GO` as your discount code.

<<include/test-shopify.md>>

## Awesome work!

You're a real Go-getter! Onto another language?