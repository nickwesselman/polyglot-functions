export WASI_VERSION_FULL=19.0
export WASI_SDK_PATH=${WASI_SDK_PATH:-/usr/local/wasi-sdk-${WASI_VERSION_FULL}}
CC="${WASI_SDK_PATH}/bin/clang++ -O3 -fno-exceptions -flto -std=c++20 --sysroot=${WASI_SDK_PATH}/share/wasi-sysroot"

mkdir -p build
$CC src/main.cpp -o build/main-unoptimized.wasm
wasm-strip build/main-unoptimized.wasm
wasm-opt -Oz --zero-filled-memory --enable-bulk-memory --enable-multivalue -o build/main.wasm build/main-unoptimized.wasm