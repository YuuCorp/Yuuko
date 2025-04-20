#!/bin/bash

set -e

GO_DIR="./src/modules"
SRC_FILE="image.go"
OUT_DIR="$GO_DIR/compiled"
OUT_FILE="libimage.so"

mkdir -p "$OUT_DIR"

echo "🛠️  Building $GO_DIR/$SRC_FILE → $OUT_DIR/$OUT_FILE"
go build -buildmode=c-shared -o "$OUT_DIR/$OUT_FILE" "$GO_DIR/$SRC_FILE"

echo "✅ Done: $OUT_DIR/$OUT_FILE"