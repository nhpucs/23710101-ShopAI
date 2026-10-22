/* eslint-env jest */
// Chương 11 (Phần 11.6 mục 4): Jest chạy trên Node, không có Android/iOS
// -> mọi thư viện Native phải được "đóng thế" ở đây, không thì test đỏ ngay dòng import.

// Firebase Crashlytics (Chương 10) — bản 27 dùng API modular: getCrashlytics() + các hàm rời
jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(() => ({})),
  log: jest.fn(),
  recordError: jest.fn(),
  setUserId: jest.fn(() => Promise.resolve(null)),
  setAttributes: jest.fn(() => Promise.resolve(null)),
  crash: jest.fn(),
}));

// expo-updates (Chương 10)
jest.mock('expo-updates', () => ({
  isEnabled: false,
  checkForUpdateAsync: jest.fn(() => Promise.resolve({ isAvailable: false })),
  fetchUpdateAsync: jest.fn(),
  reloadAsync: jest.fn(),
}));

// expo-secure-store + expo-local-authentication (Chương 8)
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(false)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(false)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
}));

// AsyncStorage (Chương 6 — persist của giỏ hàng). Bản 3.x để mock ở đường dẫn "/jest"
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

// Reanimated 4 (Chương 4). File mock có sẵn 'react-native-reanimated/mock' của bản 4.6 vẫn nạp
// phần native (lỗi setCSSEventHandler) -> tự mock đúng mấy hàm ProductCard dùng: animation chạy tức thì.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    useSharedValue: initial => ({ value: initial }),
    useAnimatedStyle: factory => factory(),
    withTiming: toValue => toValue,
  };
});

// SafeAreaProvider chờ native báo kích thước "tai thỏ" mới vẽ con -> dùng mock có sẵn của thư viện
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

// Vision Camera (Chương 7)
jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: jest.fn(() => ({ id: 'back' })),
  useCameraPermission: jest.fn(() => ({ hasPermission: true, requestPermission: jest.fn() })),
  useCodeScanner: jest.fn(),
}));

// GPS (Chương 7)
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  requestAuthorization: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}));
