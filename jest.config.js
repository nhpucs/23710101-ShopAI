module.exports = {
  preset: '@react-native/jest-preset',
  // Chương 11 (Phần 11.6 + 11.8): mock Native Module, biên dịch các thư viện phát hành ES Module,
  // đo độ phủ và đặt ngưỡng tối thiểu
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@react-native-firebase|@react-native-async-storage|expo(nent)?|@expo(nent)?/.*|expo-.*|react-native-.*|@shopify/flash-list|zustand|react-redux|@reduxjs/toolkit|immer|@tanstack)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/android/', '<rootDir>/.maestro/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/types/**',
    '!src/constants/**',
  ],
  // global = phần còn lại SAU KHI trừ 2 file có ngưỡng riêng, đo lúc làm Ch.11 được ~18%
  // (hơn 20 màn hình UI chưa có test) -> đặt sát mức đó. formatCurrency / useCartStore là logic
  // TIỀN nên siết chặt hơn. Con số chỉ được tăng dần khi viết thêm test, không hạ.
  coverageThreshold: {
    global: { statements: 15, branches: 3, functions: 5, lines: 15 },
    './src/utils/formatCurrency.ts': { statements: 90, branches: 80, functions: 90, lines: 90 },
    './src/store/useCartStore.ts': { statements: 70, branches: 60, functions: 70, lines: 70 },
  },
};
