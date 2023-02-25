#/bin/bash
PATH="~/go/bin/:$PATH"

mkdir -p build
tinygo build -target wasi -scheduler=none -gc=leaking -opt=z -no-debug -o build/order-discount-golang-unopt.wasm ./main
wasm-opt -Oz -o build/order-discount-golang.wasm build/order-discount-golang-unopt.wasm