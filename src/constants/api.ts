/**
 * Nơi DUY NHẤT khai báo địa chỉ máy chủ.
 *
 * Hiện tại danh sách sản phẩm là dữ liệu cục bộ (`@data/techProducts`) nên địa chỉ
 * này CHƯA được gọi tới; trước đó app dùng DummyJSON — một Public API miễn phí có
 * sẵn phân trang `limit`/`skip`, khớp thẳng với `useInfiniteQuery` (Chương 6).
 *
 * Chương 9: khi đã dựng xong NestJS, chỉ sửa ĐÚNG FILE NÀY sang IP máy chủ của mình
 * (ví dụ 'http://192.168.1.10:3000/api'); không màn hình nào phải sửa theo.
 */
export const PRODUCT_API_BASE_URL = 'https://dummyjson.com';

/** Số sản phẩm mỗi trang — dùng chung cho cả lời gọi API lẫn logic phân trang. */
export const PAGE_SIZE = 10;

/** Thời gian chờ tối đa cho một lời gọi mạng (ms). Quá hạn -> coi như lỗi mạng. */
export const API_TIMEOUT_MS = 10000;

/**
 * DummyJSON trả giá bằng USD. ShopAI hiển thị VND nên quy đổi một lần duy nhất
 * ngay tại tầng dữ liệu, để mọi màn hình phía sau chỉ còn làm việc với VND.
 */
export const USD_TO_VND = 25000;
