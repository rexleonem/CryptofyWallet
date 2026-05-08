const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Enable package exports resolution but force CJS ('require'/'default')
    // conditions so Hermes never receives raw ESM (import/export) syntax.
    unstable_enablePackageExports: true,
    unstable_conditionNames: ['require', 'default'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
