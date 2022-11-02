# README

## Adjusting the default Rust template to use `shopify_function`

1. `cargo add shopify_function`
1. `cargo add graphql_client --git https://github.com/graphql-rust/graphql-client`
    1. For now it's necessary to build from git, as we depend on an unreleased PR
1. Delete `src/api.rs`
1. In `main.rs`
    1. Add imports for `shopify_function`

        ```rust
        use shopify_function::prelude::*;
        use shopify_function::Result;
        ```

    1. Remove references to `mod api`
    1. Add type generation, right under your imports

        ```rust
        generate_types!(query_path = "./input.graphql", schema_path = "./schema.graphql");
        ```

    1. Remove the `main` function entirely
    1. Attribute the `function` function with the `shopify_function` macro and change its return type

        ```rust
        #[shopify_function]
        fn function(input: input::ResponseData) -> Result<output::FunctionResult> {
        ```

    1. Update the types and fields utilized in the function to the new, auto-generated structs. For example:
        | Old | New |
        | --- | --- |
        | `input::Input` | `input::ResponseData` |
        | `input::Metafield` | `input::InputDiscountNodeMetafield` |
        | `input::DiscountNode` | `input::InputDiscountNode` |
        | `FunctionResult` | `output::FunctionResult` |
        | `DiscountApplicationStrategy::First` | `output::DiscountApplicationStrategy::FIRST` |

1. Add `.output.graphql` to your `.gitignore`.

## To use the `run_function_with_input` test utility

1. Add import for `run_function_with_input`

    ```
    use shopify_function::{run_function_with_input};
    ```

1. Adjust your tests to use the utility. ([examples](https://github.com/Shopify/shopify-function-rust/blob/main/example/src/tests.rs))
