module.exports = {
  root: true,
  plugins: ["jest"],
  extends: ["airbnb-base", "eslint:recommended", "plugin:jest/recommended"],
  env: {
    node: true,
    es6: true,
    mocha: true,
    jest: true,
  },
  rules: {
    "one-var": 0,
    "one-var-declaration-per-line": 0,
    "new-cap": 0,
    "consistent-return": 0,
    "no-param-reassign": 0,
    "comma-dangle": 0,
    "no-unused-vars": "off",
    "global-require": "off",
    semi: "off",
    quotes: 0,
    "operator-linebreak": "off",
    "implicit-arrow-linebreak": "off",
    "import/no-dynamic-require": "off",
    curly: ["error", "multi-line"],
    "import/no-unresolved": [2, { commonjs: true }],
    "no-shadow": ["error", { allow: ["req", "res", "err"] }],
    "valid-jsdoc": [
      "error",
      {
        requireReturn: true,
        requireReturnType: true,
        requireParamDescription: false,
        requireReturnDescription: true,
      },
    ],
    "require-jsdoc": [
      "error",
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
      },
    ],
  },
}
