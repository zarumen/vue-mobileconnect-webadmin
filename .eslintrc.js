module.exports = {
  root: true,
  excludedFiles: 'app.config.js',
  'parser': "vue-eslint-parser",
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    'prettier/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  globals: {
      mount: false,
      shallowMount: false,
      shallowMountView: false,
      createComponentMocks: false,
      createModuleStore: false,
  }
}
