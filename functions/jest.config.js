module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
      '\\.(css|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    },
  };
  