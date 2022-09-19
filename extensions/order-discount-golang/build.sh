#/bin/bash
PATH="~/go/bin/:$PATH"

# generate types for our graphql query
go run github.com/Khan/genqlient

# generate json marshal/unmarshal code for our types
if ! command -v easyjson &> /dev/null
then
    echo "Installing easyjson..."
    go install github.com/mailru/easyjson/...@latest
fi
easyjson -all api/configuration.go
easyjson -all api/generated_graphql.go

mkdir -p build
tinygo build -target wasi -scheduler=none -gc=leaking -opt z -no-debug -o build/order-discount-golang-unopt.wasm ./main
wasm-opt -Oz --zero-filled-memory --strip-producers -o build/order-discount-golang.wasm build/order-discount-golang-unopt.wasm