module.exports = {
  extends: ['daren', 'daren/jest'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/naming-convention': 'off',
  },
}
