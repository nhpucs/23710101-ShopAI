import axiosClient from '@api/axiosClient';
import type { CartItem } from '@store/useCartStore';

/**
 * Chương 9 — Orders API trên Server NestJS (Bước 7f). Mọi lời gọi đi qua axiosClient nên
 * tự có header "Authorization: Bearer <token>" — không cần gắn tay (Interceptor Chương 6).
 */

/** Một đơn hàng như Server trả về (OrderRecord ở order.repository.ts). */
export interface ServerOrder {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'PAID';
  createdAt: string;
  items: { productId: string; quantity: number; price: number }[];
}

/** POST /api/orders — tạo đơn PENDING. Chỉ gửi productId + quantity, KHÔNG gửi giá:
 *  Server tự tra giá trong kho và đối chiếu với `total` (Phần 9.12). */
export const createOrder = async (items: CartItem[], total: number): Promise<ServerOrder> => {
  const { data } = await axiosClient.post<ServerOrder>('/api/orders', {
    items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
    total,
  });
  return data;
};

/** GET /api/orders — lịch sử đơn CỦA user đang đăng nhập (Server lọc theo JWT), mới nhất trước. */
export const getMyOrders = async (): Promise<ServerOrder[]> => {
  const { data } = await axiosClient.get<ServerOrder[]>('/api/orders');
  return data;
};

/** GET /api/orders/:id — chi tiết 1 đơn (đơn của người khác -> 404). */
export const getOrderById = async (orderId: string): Promise<ServerOrder> => {
  const { data } = await axiosClient.get<ServerOrder>(`/api/orders/${encodeURIComponent(orderId)}`);
  return data;
};

/** POST /api/orders/:id/pay — giả lập cổng thanh toán, PENDING -> PAID. */
export const payOrder = async (orderId: string): Promise<ServerOrder> => {
  const { data } = await axiosClient.post<ServerOrder>(
    `/api/orders/${encodeURIComponent(orderId)}/pay`,
  );
  return data;
};
