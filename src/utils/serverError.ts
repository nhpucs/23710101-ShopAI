import axios from 'axios';

/**
 * Chương 9: đọc câu báo lỗi mà Server NestJS trả về để hiện cho người dùng.
 * NestJS trả { message: "..." } (HttpException) hoặc { message: ["...", "..."] } (ValidationPipe).
 */
export const getServerErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }
  if (!error.response) {
    // Không có phản hồi nào: Server tắt, sai API_BASE_URL, hoặc mất mạng
    return 'Không kết nối được tới máy chủ ShopAI. Bạn kiểm tra mạng rồi thử lại nhé.';
  }
  const message = (error.response.data as { message?: string | string[] } | undefined)?.message;
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  if (message === 'Unauthorized') {
    // JwtAuthGuard từ chối vé (thiếu / sai / hết hạn) — axiosClient đã tự đăng xuất (Chương 6)
    return 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.';
  }
  return message || fallback;
};
