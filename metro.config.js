const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Chương 10: expo-updates import thẳng 'expo-modules-core', nhưng npm để gói này nằm trong
    // node_modules/expo/node_modules (vì lệch peer react-native-worklets) -> chỉ đường cho Metro.
    extraNodeModules: {
      'expo-modules-core': path.resolve(
        __dirname,
        'node_modules/expo/node_modules/expo-modules-core',
      ),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
