module.exports = {
  root: true,
  ignorePatterns: ["node_modules/", "firebase.json", "firebase.json", "index.js"],
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "comma-dangle": ["error", "never"],
    "quotes": ["error", "single"],
    "quote-props": ["error", "consistent"],
    "object-curly-spacing": ["error", "never"],
    "spaced-comment": ["error", "always"],
    "indent": ["error", 2],
    "semi": ["error", "always"],
    "no-trailing-spaces": "error",
    "no-unused-vars": "error",
    "no-multiple-empty-lines": ["error", { "max": 2 }],
    "eol-last": "error"
  },
};
