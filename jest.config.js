const path = require('path')

const resolvePath = (partial) => path.resolve(__dirname, partial)

module.exports = {
  setupFilesAfterEnv: ['jest-dom/extend-expect', '@testing-library/react/cleanup-after-each'],
  testMatch: ['**/*.spec.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  moduleDirectories: [resolvePath('node_modules'), resolvePath('./')],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: ['*/src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: ['/node_modules/', '**/*.spec.{js,ts}'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}