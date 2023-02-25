# cargo install function-runner --git https://github.com/Shopify/function-runner.git --locked

WASM=target/wasm32-wasi/release/order-discount-rust.wasm

cat input.json | function-runner -f $WASM --json | npm run validate-function-output ./schema.graphql
if [ $? -eq 0 ]; then
    cat input.json | function-runner -f $WASM
fi