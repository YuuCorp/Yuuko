import antfu from "@antfu/eslint-config";

export default antfu({
    stylistic: false,
    ignores: ["n/prefer-global/process"],
    perfectionist: false,
    typescript: {
        tsconfigPath: "tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        overrides: {
            "ts/no-floating-promises": "error",
            "ts/no-misused-promises": "error",
            "ts/await-thenable": "error",
            "ts/consistent-type-definitions": "off",
            "import/consistent-type-specifier-style": "off",
        },
    },
    rules: {
        "ts/strict-boolean-expressions": "off",
        "ts/no-non-null-asserted-optional-chain": "off",
        "antfu/no-top-level-await": "off",
    },
});
