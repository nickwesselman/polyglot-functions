2. Build your function code based on the command in `shopify.function.extension.toml`:

    ```bash
    npm run function:build
    ```

2. Validate your function's output against the `FunctionResult` GraphQL type:

    ```bash
    npm run function:validate
    ```

2. Preview your function's JSON output and performance profile:

    ```bash
    npm run function:preview
    ```