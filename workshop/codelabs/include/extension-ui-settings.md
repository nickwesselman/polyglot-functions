You need to inform Shopify about the UI paths for configuring your function. These paths are already provided by the app template you used.

In `shopify.function.extension.toml`, replace the `[ui.paths]` section with the following:

```toml
[ui.paths]
create = "/discount/:functionId/new"
details = "/discount/:functionId/:id"
```