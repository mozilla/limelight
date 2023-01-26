module.exports = {
    root: true,
    env: {
        browser: true,
        es2022: true,
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
        "@typescript-eslint",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
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
    rules: {
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                "checksVoidReturn": false
            }
        ],
        "@typescript-eslint/no-unused-vars": "error",
        "no-console": [
            "error",
            {
                allow: ["warn", "error"]
            }
        ]
    },
    overrides: [
        {
            "files": ["*.test.ts", "*.test.tsx"],
            "plugins": ["testing-library"],
            "extends": ["plugin:testing-library/react"],
        }
    ],
};
