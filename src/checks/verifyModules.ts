import fs from 'fs'
import path from 'path'
import { Check } from '#structures/index'
import { suffix } from "bun:ffi";

const getLibPath = (name: string) => path.join(import.meta.dir, "../modules", `compiled/lib${name}.${suffix}`);

const defaultModule = new Check({
    name: 'FFI default module check',
    description: 'Ensure that the FFI module exists',
    optional: false,
    run: () => {
        if (!fs.existsSync(getLibPath("modules")))
            throw new Error("Default module is not compiled, please run `bun run module:build`")
    },
})

export default [defaultModule]