#!/bin/bash

set -e

SRC_FILE="./src/lib.rs"
MODULE_DIR="./src/modules"
OUT_DIR="./compiled"
OUT_FILE="libmodules"

# Determine platform to get library suffix
case "$(uname -s)" in
    Darwin*)  # macOS
        OUT_FILE="$OUT_FILE.dylib"
        ;;
    Linux*)   # Linux
        OUT_FILE="$OUT_FILE.so"
        ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*) # Windows (MinGW or Cygwin)
        OUT_FILE="$OUT_FILE.dll"
        ;;
    *) echo "Unknown platform"; exit 1 ;;
esac

(
    cd "$MODULE_DIR"

    mkdir -p "$OUT_DIR"

    echo "🛠️  Building $SRC_FILE → $OUT_DIR/$OUT_FILE"
    cargo build --release

    mv "./target/release/libmodules.so" "$OUT_DIR/$OUT_FILE"

    echo "✅ Done: $OUT_DIR/$OUT_FILE"
)