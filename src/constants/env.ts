// src/constants/env.ts
export type AppEnv = 'development' | 'staging' | 'production';

// __DEV__ là biến toàn cục của React Native: true khi chạy qua Metro, false ở bản build Release.
// Nhờ nó, chỉ một dòng này đã tự phân biệt được máy dev với máy người dùng thật.
export const APP_ENV: AppEnv = __DEV__ ? 'development' : 'production';

// Bảng địa chỉ Server cho từng môi trường — thay cho việc hardcode một địa chỉ duy nhất ở Chương 9.
//   - development: 10.0.2.2 là "cửa sổ" Android Emulator nhìn về máy tính đang chạy NestJS.
//     Dùng điện thoại thật thì đổi thành IP LAN của máy tính (ipconfig), cùng mạng Wi-Fi.
//   - staging / production: server đã deploy, có domain + HTTPS.
const API_URLS: Record<AppEnv, string> = {
development: 'http://10.0.2.2:3000',
staging: 'https://staging-api.shopai.com',
production: 'https://api.shopai.com',
};

export const API_BASE_URL = API_URLS[APP_ENV];

// Cờ bật/tắt tính năng theo môi trường — tránh làm nhiễu dữ liệu thật bằng log lúc đang code
export const ENABLE_CRASHLYTICS = APP_ENV !== 'development';
export const ENABLE_OTA_UPDATE = APP_ENV !== 'development';

// Phải khớp versionName trong android/app/build.gradle (Phần 10.10)
export const APP_VERSION = '1.0.0';
