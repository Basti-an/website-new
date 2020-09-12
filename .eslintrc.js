module.exports = {
  extends: ["airbnb", "airbnb/hooks"],
  rules: {
    // param reassign is no issue in pure functions
    "no-param-reassign": 0,
    "react/prop-types": ["off"],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
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
    camelcase: 1,
    quotes: 0,
  },
  globals: {
    cy: true,
    context: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  env: {
    jest: true,
    browser: true,
  },
  parser: "babel-eslint",
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2019,
  },
};
