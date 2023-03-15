You also need to inform Shopify about where to find GraphQL variable values that will be used when executing your input query.

Add the following to `shopify.function.extension.toml`:

```toml
[input.variables]
namespace = "$app:polyglot-functions"
key = "function-configuration"
```