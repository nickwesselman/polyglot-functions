WASM=zig-out/bin/order-discount-zig.wasm

cat input.json | function-runner -f $WASM --json | npm run validate-function-output ./schema.graphql
if [ $? -eq 0 ]; then
    cat input.json | function-runner -f $WASM
fi