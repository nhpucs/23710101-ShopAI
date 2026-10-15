import axios from 'axios';
import axiosClient from '@api/axiosClient';

/**
 * Chương 9 — App KHÔNG còn gọi Google Gemini, cũng không còn giữ API Key.
 * Mọi câu hỏi gửi lên "Vệ sĩ AI" của Server NestJS (POST /api/ai/chat). Server cầm key
 * trong .env, tự trả lời nhanh câu quen thuộc, câu còn lại mới hỏi Gemini.
 * AIChatScreen chỉ gọi askShopAI() nên không phải biết đầu bên kia là ai.
 */

/** Một lượt hội thoại — giữ đúng khuôn Chương 8 để AIChatScreen không phải sửa. */
export type ChatTurn = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

/** Gemini phía Server chờ tối đa 15 giây -> app chờ lâu hơn một chút để nhận được lỗi thật. */
const AI_REQUEST_TIMEOUT_MS = 20000;

export const askShopAI = async (question: string, history: ChatTurn[] = []): Promise<string> => {
  const { data } = await axiosClient.post<{ reply: string }>(
    '/api/ai/chat',
    {
      message: question,
      // Server nhận khuôn gọn { role, text } (ChatHistoryItem ở ai.service.ts)
      history: history.map(h => ({ role: h.role, text: h.parts[0]?.text ?? '' })),
    },
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );

  if (!data?.reply?.trim()) {
    throw new Error('Trợ lý không trả lời được câu này.');
  }
  return data.reply.trim();
};

/** Chuyển lỗi kỹ thuật thành câu chữ mà người dùng đọc hiểu được. */
export const toFriendlyError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'Trợ lý trả lời hơi lâu. Bạn bấm Thử lại giúp mình nhé.';
    }
    if (!error.response) {
      // Không có phản hồi nào: Server tắt, sai API_BASE_URL, hoặc mất mạng
      return 'Không kết nối được tới máy chủ ShopAI. Bạn kiểm tra mạng rồi thử lại nhé.';
    }
    if (error.response.status === 429) {
      return 'Trợ lý đang bận (quá nhiều yêu cầu). Bạn đợi vài giây rồi thử lại nhé.';
    }
    return 'Trợ lý gặp sự cố tạm thời. Bạn thử lại giúp mình nhé.';
  }
  return error instanceof Error
    ? error.message
    : 'Trợ lý gặp sự cố tạm thời. Bạn thử lại giúp mình nhé.';
};
