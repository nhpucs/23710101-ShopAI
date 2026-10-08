module.exports = {
  // Chương 8: install-expo-modules đổi thành 'babel-preset-expo', nhưng preset đó
  // chưa parse được cú pháp Flow `readonly` của RN 0.87 -> trả lại preset gốc của RN.
  // expo-secure-store / expo-local-authentication là native module thuần, không cần preset Expo.
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@store': './src/store',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@data': './src/data',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@types': './src/types',
          '@contexts': './src/contexts',
          '@api': './src/api',
        },
      },
    ],
    // Chương 6: Zod v4 dùng cú pháp `export * as X from ...` — Metro cần plugin này để hiểu
    '@babel/plugin-transform-export-namespace-from',
    // Reanimated 4: plugin nằm trong react-native-worklets, LUÔN đứng cuối cùng
    'react-native-worklets/plugin',
  ],
};
