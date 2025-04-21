#!/bin/bash

set -e

SRC_FILE="./src/lib.rs"
MODULE_DIR="./src/modules"
OUT_DIR="./compiled"
OUT_FILE="libmodules.so"

(
    cd "$MODULE_DIR"

    mkdir -p "$OUT_DIR"

    echo "🛠️  Building $SRC_FILE → $OUT_DIR/$OUT_FILE"
    cargo build --release --target-dir="$OUT_DIR"

    mv "$OUT_DIR/release/libmodules.so" "$OUT_DIR/$OUT_FILE"

    echo "✅ Done: $OUT_DIR/$OUT_FILE"
)