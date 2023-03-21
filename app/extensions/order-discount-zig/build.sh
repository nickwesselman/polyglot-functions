zig build -Drelease-fast=true
# There is an invalid DWARF header in the binary which makes wasm-opt fail. Stripping removes all DWARF stuff.
wasm-strip zig-out/bin/order-discount-zig.wasm
wasm-opt -O3 --zero-filled-memory --enable-bulk-memory -o zig-out/bin/order-discount-zig-optimized.wasm zig-out/bin/order-discount-zig.wasm