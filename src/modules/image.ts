import { YuukoError } from "#utils/types";
import { dlopen, suffix, ptr, toArrayBuffer } from "bun:ffi";

const path = `${import.meta.dir}/compiled/libimage.${suffix}`;

export function rawImage(json: object[]) {
    const lib = dlopen(path, {
        GenerateRecentImage: {
            args: ["cstring"],
            returns: "pointer",
        },
    });

    const enc = new TextEncoder();
    const rawJson = enc.encode(JSON.stringify(json));
    const jsonPtr = ptr(rawJson);
    const imgPtr = lib.symbols.GenerateRecentImage(jsonPtr); // cstring in args is equivalant to a pointer
    if (!imgPtr) {
        throw new YuukoError(`Go did not return a proper image pointer, returned: ${imgPtr}`)
    }

    // hacky solution to get the size of the image array
    const imgSizeBytes = toArrayBuffer(imgPtr, 0, 4);
    if (!imgSizeBytes) {
        throw new YuukoError("Failed to retrieve image size from Go pointer");
    }

    const imgSizeArray = new Uint8Array(imgSizeBytes);
    const imgSize = (imgSizeArray[0]! << 24) | (imgSizeArray[1]! << 16) | (imgSizeArray[2]! << 8) | imgSizeArray[3]!;
    const imgBuffer = toArrayBuffer(imgPtr, 4, imgSize);

    return Buffer.from(imgBuffer);
}