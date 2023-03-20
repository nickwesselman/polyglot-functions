zig build -Drelease-small=true
wasm-opt -Oz --zero-filled-memory --strip-producers --enable-bulk-memory -o zig-out/bin/order-discount-zig-optimized.wasm zig-out/bin/order-discount-zig.wasm