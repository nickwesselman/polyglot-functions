mkdir -p build
grain compile src/main.gr --no-gc --release --elide-type-info -o build/main-unoptimized.wasm
wasm-opt -Oz --zero-filled-memory --strip-producers --enable-bulk-memory --enable-multivalue -o build/main.wasm build/main-unoptimized.wasm