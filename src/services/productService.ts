import axios from 'axios';
import axiosClient from '@api/axiosClient';
import { PAGE_SIZE } from '@constants/api';
import { Product, ProductListSchema, ProductSchema } from '../types/product.schema';

/**
 * Hai lớp lỗi riêng biệt để màn hình phân biệt được "lỗi mạng" và "dữ liệu bẩn".
 * Hai bệnh khác nhau -> hai cách chữa khác nhau:
 *   - NetworkError        -> bảo người dùng kéo xuống thử lại
 *   - ZodValidationError  -> thử lại vô ích, phải báo kỹ thuật viên
 */
export class NetworkError extends Error {}
export class ZodValidationError extends Error {}

/** Một "trang" sản phẩm đã được nắn về đúng khuôn của ShopAI. */
export interface ProductPage {
  items: Product[];
  nextPage: number | null;
}

/** Chương 9: lấy TOÀN BỘ danh sách từ Server NestJS — GET /api/products (Bước 4). */
export const fetchAllProducts = async (): Promise<Product[]> => {
  let raw: unknown;
  try {
    const res = await axiosClient.get('/api/products');
    raw = res.data; // Dữ liệu thô — chưa được tin, dù đến từ Server "nhà mình"
  } catch (e) {
    // Server tắt, sai địa chỉ, quá thời gian chờ... -> quy về MỘT loại lỗi cho UI
    console.error('📡 Lỗi mạng khi gọi Server NestJS:', e);
    throw new NetworkError('Không kết nối được tới Server ShopAI!');
  }

  // TRẠM KIỂM SOÁT ZOD (giữ từ Chương 2/6): không vì Server là hàng nhà mình mà bỏ qua
  const result = ProductListSchema.safeParse(raw);
  if (!result.success) {
    console.error('❌ Zod chặn dữ liệu bẩn từ Server:', result.error.format());
    throw new ZodValidationError('Dữ liệu sản phẩm không hợp lệ!');
  }
  return result.data;
};

/**
 * Trả về MỘT trang cho useInfiniteQuery của HomeScreen (Chương 6) — chữ ký hàm giữ nguyên
 * nên HomeScreen không phải sửa. Server trả cả danh sách, app tự cắt thành từng trang.
 * `pageParam` đếm từ 1 -> vị trí bắt đầu cắt: `skip = (pageParam-1)*PAGE_SIZE`.
 */
export const fetchProductsPage = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<ProductPage> => {
  const all = await fetchAllProducts();
  const skip = (pageParam - 1) * PAGE_SIZE;
  const hasMore = skip + PAGE_SIZE < all.length;
  return { items: all.slice(skip, skip + PAGE_SIZE), nextPage: hasMore ? pageParam + 1 : null };
};

/** Sản phẩm không có trên Server (Server trả 404 ở Bước 7c) — khác hẳn lỗi mạng. */
export class ProductNotFoundError extends Error {}

/**
 * Chương 9 — Bước 9b: lấy ĐÚNG MỘT sản phẩm theo id, GET /api/products/:id.
 * Dùng cho ProductDetailScreen, kể cả khi mở thẳng bằng Deep Link mà Trang chủ chưa tải.
 */
export const fetchProductById = async (id: string): Promise<Product> => {
  let raw: unknown;
  try {
    const res = await axiosClient.get(`/api/products/${encodeURIComponent(id)}`);
    raw = res.data;
  } catch (e) {
    // Bắt đúng mã 404 mà NestJS ném ra (NotFoundException) — hai đầu ăn khớp nhau
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      throw new ProductNotFoundError('Sản phẩm này không còn tồn tại trên hệ thống');
    }
    console.error('📡 Lỗi mạng khi tải chi tiết sản phẩm:', e);
    throw new NetworkError('Lỗi mạng khi tải chi tiết sản phẩm');
  }

  const result = ProductSchema.safeParse(raw); // Vẫn giữ trạm kiểm soát Zod
  if (!result.success) {
    console.error('❌ Zod chặn dữ liệu chi tiết sản phẩm:', result.error.format());
    throw new ZodValidationError('Dữ liệu chi tiết sản phẩm không hợp lệ');
  }
  return result.data;
};
