const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Prefer React Native/browser package exports while still selecting CJS
    // entries when packages provide them for Hermes.
    unstable_enablePackageExports: true,
    unstable_conditionNames: ['react-native', 'browser', 'require', 'default'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
