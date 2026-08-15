module.exports = {
  preset: 'react-native',
  testMatch: ['**/src/**/*.test.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|viem|abitype)/)',
  ],
};
