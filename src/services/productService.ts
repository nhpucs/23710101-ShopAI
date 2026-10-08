import { PAGE_SIZE } from '@constants/api';
import { TECH_PRODUCTS } from '@data/techProducts';
import { Product, ProductListSchema } from '../types/product.schema';

/**
 * Hai lớp lỗi riêng biệt để màn hình phân biệt được "lỗi mạng" và "dữ liệu bẩn".
 * Hai bệnh khác nhau -> hai cách chữa khác nhau:
 *   - NetworkError        -> bảo người dùng kéo xuống thử lại
 *   - ZodValidationError  -> thử lại vô ích, phải báo kỹ thuật viên
 * (NetworkError hiện chưa được ném vì dữ liệu đang là cục bộ — giữ sẵn cho Chương 9.)
 */
export class NetworkError extends Error {}
export class ZodValidationError extends Error {}

/** Một "trang" sản phẩm đã được nắn về đúng khuôn của ShopAI. */
export interface ProductPage {
  items: Product[];
  nextPage: number | null;
}

/**
 * Trả về MỘT trang sản phẩm từ danh mục đồ công nghệ cục bộ (`@data/techProducts`).
 *
 * Chữ ký hàm giữ NGUYÊN như lúc còn gọi API thật, nên HomeScreen, useInfiniteQuery,
 * ProductDetail (đọc cache) không phải sửa dòng nào. Chương 9: thay phần thân hàm
 * bằng lời gọi `axiosClient` tới NestJS; khuôn `RemoteProductPageSchema` vẫn để sẵn
 * trong product.schema.ts cho việc đó.
 *
 * `pageParam` đếm từ 1 (do `initialPageParam: 1` của useInfiniteQuery) nên phải
 * quy đổi sang vị trí bắt đầu cắt: `skip = (pageParam-1)*PAGE_SIZE`.
 */
export const fetchProductsPage = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<ProductPage> => {
  const skip = (pageParam - 1) * PAGE_SIZE;
  const raw: unknown = TECH_PRODUCTS.slice(skip, skip + PAGE_SIZE);

  // TRẠM KIỂM SOÁT ZOD: dữ liệu viết tay vẫn có thể gõ sai (giá âm, thiếu ảnh...)
  // nên vẫn soi TỪNG TRANG trước khi cho vào app.
  const result = ProductListSchema.safeParse(raw);
  if (!result.success) {
    console.error('❌ Zod chặn dữ liệu sản phẩm bẩn:', result.error.format());
    throw new ZodValidationError('Dữ liệu sản phẩm không hợp lệ!');
  }

  // Còn trang sau hay không — dựa vào tổng số hàng thật, không đoán mò
  const hasMore = skip + PAGE_SIZE < TECH_PRODUCTS.length;

  return { items: result.data, nextPage: hasMore ? pageParam + 1 : null };
};
