module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-linear-gradient|lucide-react-native|react-native-svg|react-native-qrcode-svg)/)',
  ],
};
