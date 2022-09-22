# Rust Order Discount

A Rust-based discount for VIP customers.

## Notes

* Requires Rust and [cargo-wasi](https://bytecodealliance.github.io/cargo-wasi/index.html)
  * `cargo install cargo-wasi`
* I am generating input/output types for the Discount API using [graphql_client](https://github.com/graphql-rust/graphql-client).
  * This allows complete removal of the `api.rs` structs.
  * To support the `oneOf` directive in the schema, I needed to build from the latest on `main`, as a [required PR](https://github.com/graphql-rust/graphql-client/pull/431) has recently been merged.
  * To codegen output types, a 'dummy' mutation is needed, found in `output.graphql`.