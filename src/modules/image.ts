import { dlopen, suffix, ptr } from "bun:ffi";

const path = `${import.meta.dir}/compiled/libimage.${suffix}`;

export function rawImage(json: object[]) {
    const lib = dlopen(path, {
        GenerateRecentImage: {
            args: ["cstring"],
        },
    });

    const enc = new TextEncoder();
    const rawJson = enc.encode(JSON.stringify(json));
    const jsonPtr = ptr(rawJson);
    lib.symbols.GenerateRecentImage(jsonPtr); // cstring in args is equivalant to a pointer

    lib.close();
}