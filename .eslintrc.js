// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
      "arrowFunctions": true,
      "classes": true,
      "modules": true,
      "defaultParams": true
    },
    sourceType: 'module'
  },
  env: {
    "browser": true,
    "es6": true,
    "node": true,
    "commonjs": true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'eslint:recommended',
  // required to lint *.vue files
  plugins: [
    'react'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "space-before-function-paren": 0,
    "indent": 0,
    "linebreak-style": 0,
    "quotes": 0,
    "no-extra-semi": 0,
    "no-unused-expressions": 0,
    "no-unused-vars": 0,
    "no-console": 0,
    "no-mixed-spaces-and-tabs": 0,
    "no-cond-assign": 0
  }
}
