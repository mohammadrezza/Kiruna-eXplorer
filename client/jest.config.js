module.exports = {
  preset: 'ts-jest', // Use ts-jest to compile TypeScript files
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'], // Scan everywhere for tests
  collectCoverage: true,
  testEnvironment: 'jsdom',
  resetMocks: true,
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
    '.+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-leaflet|@react-leaflet/core)/)',
    '/node_modules/(?!(react-bootstrap)/)',
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
  },
};
