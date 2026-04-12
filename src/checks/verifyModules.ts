import fs from 'fs'
import { Check } from '#structures/index'
import { suffix } from "bun:ffi";
import { srcPath } from '#utils/paths'

const getLibPath = (name: string) => srcPath("modules", "compiled", `lib${name}.${suffix}`);

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