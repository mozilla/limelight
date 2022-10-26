module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true // TODO: Change to es2022 and remove ecmaVersion
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
    ],
    plugins: [
        "@typescript-eslint"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2022,
        tsconfigRootDir: __dirname,
        project: [
            "./tsconfig.json",
        ],
    },
    settings: {
        react: {
            version: "18.2",
        },
    },
};
