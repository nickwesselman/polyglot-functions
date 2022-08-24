# cargo install function-runner --git https://github.com/Shopify/function-runner.git --locked

cargo wasi build --release
function-runner -f target/wasm32-wasi/release/order-discount-rust.wasm input.json