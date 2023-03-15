summary: How to create a function with TypeScript.
id: typescript
status: Published
categories: group-one
feedback link: https://github.com/nickwesselman/polyglot-functions/issues

# Group 1: TypeScript

## Generate the function extension

The following command will create an order discount Function at `extensions/order-discount-typescript`, using our TypeScript boilerplate.

```bash
npm run generate extension -- --type order_discounts --template typescript --name order-discount-typescript
```

## Define your input query

<<include/input-query-intro.md>>

Replace the contents of `extensions/order-discount-typescript/input.graphql` with the following from GitHub:

### ➡️ [Get input query code](https://github.com/nickwesselman/polyglot-functions/blob/main/extensions/order-discount-typescript/input.graphql)

## Generate types for the input query

For JavaScript and TypeScript, we provide tooling to generate types for working with your function input and output.

1. Navigate to your function extension folder:

    ```bash
    cd extensions/order-discount-typescript
    ```

1. Generate types using the following npm script:

    ```bash
    npm run typegen
    ```

1. (optional) Open `src/index.ts` in an IDE that supports TypeScript, such as Visual Studio Code. Note that you get language server features (such as autocomplete, hover info, etc.) on the `InputQuery` and `FunctionResult` types.

## Update your extension UI settings

<<include/extension-ui-settings.md>>

## Add input query variable settings

<<include/input-variable-settings.md>>

## Write your function logic in TypeScript

In `src/index.ts`, implement the following function logic, outputting appropriate JSON for an [order discount function result](https://shopify.dev/docs/api/functions/reference/order-discounts/graphql/functionresult).

<<include/function-logic.md>>

_Hint_: You can find a completed example on GitHub:

### ➡️ [Get TypeScript function code](https://github.com/nickwesselman/polyglot-functions/blob/main/extensions/order-discount-typescript/src/index.ts)

## Test your function locally

1. The following npm script will bundle your TypeScript and compile it using [Javy](https://github.com/Shopify/javy):

    ```bash
    npm run build
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

Use the following steps, selecting the `order-discount-typescript` discount type, and using `TYPESCRIPT` as your discount code.
(Google codelabs doesn't support parameterized includes 🙃)

<<include/test-shopify.md>>

## Awesome work!

You're a TypeScript maven. Onto another language?