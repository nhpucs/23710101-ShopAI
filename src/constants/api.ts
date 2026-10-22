// Chương 10: địa chỉ Server giờ suy ra theo môi trường trong env.ts — ở đây chỉ tái xuất,
// nên mọi file đang import API_BASE_URL từ '@constants/api' không phải sửa dòng nào.
export { API_BASE_URL } from './env';

/** Số sản phẩm mỗi trang — dùng chung cho cả lời gọi API lẫn logic phân trang. */
export const PAGE_SIZE = 10;

/** Thời gian chờ tối đa cho một lời gọi mạng (ms). Quá hạn -> coi như lỗi mạng. */
export const API_TIMEOUT_MS = 10000;

/**
 * DummyJSON trả giá bằng USD. ShopAI hiển thị VND nên quy đổi một lần duy nhất
 * ngay tại tầng dữ liệu, để mọi màn hình phía sau chỉ còn làm việc với VND.
 */
export const USD_TO_VND = 25000;
