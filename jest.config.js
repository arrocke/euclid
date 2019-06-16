const path = require('path')

const resolvePath = (partial) => path.resolve(__dirname, partial)

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/tests/**/*.spec.{js,jsx,ts,tsx}'],
  moduleDirectories: [resolvePath('node_modules'), resolvePath('./')],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: ['*/src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}
