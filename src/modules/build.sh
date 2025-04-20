#!/bin/bash

set -e

SRC_FILE="image.go"
OUT_DIR="./compiled"
OUT_FILE="libimage.so"

mkdir -p "$OUT_DIR"

echo "🛠️  Building $SRC_FILE into $OUT_FILE..."
go build -buildmode=c-shared -o "$OUT_DIR/$OUT_FILE" "$SRC_FILE"

echo "✅ Build complete. Output in $OUT_DIR/"