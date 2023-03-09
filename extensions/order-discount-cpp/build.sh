export WASI_VERSION_FULL=19.0
export WASI_SDK_PATH=/usr/local/wasi-sdk-${WASI_VERSION_FULL}
CC="${WASI_SDK_PATH}/bin/clang++ -Oz -fno-exceptions -std=c++17 --sysroot=${WASI_SDK_PATH}/share/wasi-sysroot"

mkdir -p build
$CC src/main.cpp -o build/main-unoptimized.wasm
wasm-opt -Oz --zero-filled-memory --strip-producers --enable-bulk-memory --enable-multivalue -o build/main.wasm build/main-unoptimized.wasm