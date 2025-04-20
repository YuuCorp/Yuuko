import { YuukoError } from "#utils/types";
import { dlopen, suffix, ptr, toArrayBuffer, read } from "bun:ffi";

const path = `${import.meta.dir}/compiled/libimage.${suffix}`;

export function rawImage(json: object[]) {
    const lib = dlopen(path, {
        GenerateRecentImage: {
            args: ["cstring", "i32"],
            returns: "pointer",
        },
    });

    const enc = new TextEncoder();
    const rawJson = enc.encode(JSON.stringify(json));
    const jsonPtr = ptr(rawJson);

    const fixedSize = 2048 * 1024;
    const imgPtr = lib.symbols.GenerateRecentImage(jsonPtr, fixedSize); // cstring in args is equivalant to a pointer
    if (!imgPtr) {
        throw new YuukoError(`Go did not return a proper image pointer, returned: ${imgPtr}`)
    }

    // hacky solution to get the size of the image array
    const imgBuffer = toArrayBuffer(imgPtr, 0, fixedSize);

    return Buffer.from(imgBuffer);
}