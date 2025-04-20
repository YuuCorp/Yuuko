import { dlopen, FFIType, suffix } from "bun:ffi";

const path = `./compiled/libimage.${suffix}`;

const lib = dlopen(path, {
    GenerateRecentImage: {},
});

lib.symbols.GenerateRecentImage();