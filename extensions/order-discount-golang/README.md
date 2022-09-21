# Golang Order Discount

## Notes

* Built with [TinyGo](https://tinygo.org/)
  * To reduce binary size / improve performance, I used leaking garbage collection. Functions are not long lived so this should be acceptable.
* Requires [Binaryen](https://github.com/WebAssembly/binaryen) in your `PATH`, e.g. `brew install binaryen`.
* Because of TinyGo's [limited support for reflection](https://github.com/tinygo-org/tinygo/issues/447), I used [easyjson](https://github.com/mailru/easyjson), which uses codegen instead.
* I am generating input/output types for the Discount API using [genqlient](https://github.com/Khan/genqlient).
* There's an [issue](https://github.com/Khan/genqlient/issues/224) with genqlient and the Discount API schema's duplication of the `ID` scalar. To workaround this, I had to comment out the scalar in `schema.graphql`.