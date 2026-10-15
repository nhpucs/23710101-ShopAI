/**
 * Chương 9: System Prompt, bảng giá, chính sách ship/bảo hành và cấu hình Gemini đã chuyển
 * xuống Server (shopai-backend/src/ai/ai.prompt.ts). App chỉ còn giữ phần HIỂN THỊ dưới đây.
 */

/** Câu chào mở màn, hiển thị ngay khi vào màn hình Chat. */
export const AI_GREETING =
  'Chào bạn! Mình là trợ lý AI của ShopAI. Bạn muốn hỏi giá hay tư vấn sản phẩm nào ạ?';

/** Gợi ý câu hỏi nhanh cho trạng thái rỗng (Phần 8.10). */
export const AI_SUGGESTIONS = [
  'iPhone 15 Pro Max giá bao nhiêu?',
  'MacBook Air M3 bao nhiêu tiền?',
  'Tai nghe Sony WH-1000XM5 giá sao?',
  'Chính sách bảo hành và ship hàng?',
];
