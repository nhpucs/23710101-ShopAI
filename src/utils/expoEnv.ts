import { Platform } from 'react-native';

// Dự án không cài @types/node -> khai báo đúng phần process.env cần dùng (Metro có sẵn object này)
declare const process: { env: Record<string, string | undefined> };

// Chương 11: babel.config dùng preset của RN (không dùng babel-preset-expo, xem ghi chú Ch.8) nên
// không ai "điền sẵn" process.env.EXPO_OS -> expo-modules-core cảnh báo ở mọi lần mở app bản dev,
// và khung cảnh báo LogBox đè lên thanh tab / nút Thanh toán làm Maestro bấm trượt.
// File này phải được import ĐẦU TIÊN trong index.js, trước khi gói expo nào được nạp.
if (typeof process.env.EXPO_OS === 'undefined') {
  process.env.EXPO_OS = Platform.OS;
}
