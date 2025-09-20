import { dlopen, suffix, type FFIFunction, type Library } from "bun:ffi";
import { join } from "path";
import fs from "fs";

function defineModules<T extends Record<string, Record<string, FFIFunction>>>(defs: T) {
    return defs;
}

export const moduleSymbols = defineModules({
    modules: {
        GenerateRecentImage: {
            args: ["cstring"],
            returns: "pointer",
        },
        GetImage: {
            args: ["cstring"],
            returns: "pointer",
        },
        PixelateImage: {
            args: ["pointer", "uint8_t", "pointer"],
            returns: "pointer",
        },
        FreeRgbaImage: {
            args: ["pointer"],
            returns: "void",
        },
        FreeImageBuffer: {
            args: ["pointer", "uint32_t"],
            returns: "void",
        },
    },
});

type ModuleSymbols = typeof moduleSymbols;

export class Modules {
    private static modules: {
        [K in keyof ModuleSymbols]?: Library<ModuleSymbols[K]>
    } = {};

    constructor() { }

    private loadModule<M extends keyof ModuleSymbols>(name: M) {
        const path = join(import.meta.dir, "../modules", `compiled/lib${name}.${suffix}`);
        const symbols = moduleSymbols[name];

        if (!fs.existsSync(path)) {
            throw new Error(`[FFI] Module file not found at: ${path}`);
        }

        const lib = dlopen(path, symbols);

        Modules.modules[name] = lib;

        return lib;
    }

    getModule<M extends keyof ModuleSymbols>(name: M) {
        const module = Modules.modules[name];
        if (!module) return this.loadModule(name);

        return module;
    }

    closeModule<M extends keyof ModuleSymbols>(name: M) {
        Modules.modules[name]?.close();

        delete Modules.modules[name];
    }

    closeAllModules() {
        for (const module of Object.keys(Modules.modules) as (keyof ModuleSymbols)[]) {
            this.closeModule(module);
        }
    }
}

