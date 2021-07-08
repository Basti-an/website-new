module.exports = {
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "@typescript-eslint", "jest"],
  rules: {
    "import/extensions": "off",
    "linebreak-style": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    // param reassign is no issue in pure functions
    "no-param-reassign": 0,
    "react/prop-types": ["off"],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx", ".tsx"] }],
    "react/self-closing-comp": 1,
    "react/no-array-index-key": 1,
    "operator-linebreak": 0,
    "react/jsx-props-no-spreading": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "react/jsx-one-expression-per-line": 0,
    "import/prefer-default-export": 0,
    "react/require-default-props": 0,
    "react/jsx-wrap-multilines": 0,
    "react/jsx-closing-tag-location": 0,
    "no-unused-vars": 1,
    "no-nested-ternary": 0,
    "import/no-mutable-exports": 0,
    "no-console": 0,
    camelcase: 1,
    quotes: 0,
    "no-undef": 0,
    "no-trailing-spaces": 0,
    "import/no-extraneous-dependencies": 0,
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
};
