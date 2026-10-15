/**
 * Nơi DUY NHẤT khai báo địa chỉ máy chủ NestJS (Chương 9).
 * Đổi môi trường chạy app thì chỉ sửa đúng dòng API_BASE_URL bên dưới:
 *   - Android Emulator:  'http://10.0.2.2:3000'  (cửa sổ đặc biệt nhìn về máy tính)
 *   - Điện thoại thật:   'http://<IP LAN máy tính>:3000'  (xem bằng ipconfig, cùng Wi-Fi)
 *   - iOS Simulator:     'http://localhost:3000'
 * KHÔNG dùng localhost trên Android: localhost lúc đó là CHÍNH điện thoại (Phần 9.4).
 */
export const API_BASE_URL = 'http://10.0.2.2:3000';

/** Số sản phẩm mỗi trang — dùng chung cho cả lời gọi API lẫn logic phân trang. */
export const PAGE_SIZE = 10;

/** Thời gian chờ tối đa cho một lời gọi mạng (ms). Quá hạn -> coi như lỗi mạng. */
export const API_TIMEOUT_MS = 10000;

/**
 * DummyJSON trả giá bằng USD. ShopAI hiển thị VND nên quy đổi một lần duy nhất
 * ngay tại tầng dữ liệu, để mọi màn hình phía sau chỉ còn làm việc với VND.
 */
export const USD_TO_VND = 25000;
