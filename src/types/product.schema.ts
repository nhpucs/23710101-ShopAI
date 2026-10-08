import { z } from 'zod';
import { USD_TO_VND } from '@constants/api';

// Khuôn mẫu 1 sản phẩm hợp lệ
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  price: z.number().positive('Giá sản phẩm phải lớn hơn 0'),
  image: z.string().url('Đường dẫn ảnh phải là URL hợp lệ'),
});

// Khuôn mẫu cho cả một Danh sách (Mảng) sản phẩm trả về từ API
export const ProductListSchema = z.array(ProductSchema);

// Tự động suy ra Type TypeScript từ Schema Zod — Không cần viết interface 2 lần!
export type Product = z.infer<typeof ProductSchema>;

// ───────────────────────────────────────────────────────────────────────────
// KHUÔN DỮ LIỆU THÔ TỪ SERVER (DummyJSON) — tên trường KHÁC HẲN app ta dùng:
//   server:  { id: 1 (số),  title: "...", price: 9.99 (USD),  thumbnail: "..." }
//   ShopAI:  { id: "1",     name:  "...", price: 249750 (VND), image:    "..." }
//
// `.transform()` là trạm NẮN dữ liệu: soi xong thì đổi luôn sang khuôn của app.
// Nhờ vậy mọi màn hình phía sau (ProductCard, Cart, Checkout...) KHÔNG cần biết
// server đặt tên trường là gì — đổi nhà cung cấp API chỉ phải sửa đúng file này.
// ───────────────────────────────────────────────────────────────────────────
export const RemoteProductSchema = z
  .object({
    id: z.number(),
    title: z.string().min(1, 'Tên sản phẩm không được để trống'),
    price: z.number().positive('Giá sản phẩm phải lớn hơn 0'),
    thumbnail: z.string().url('Đường dẫn ảnh phải là URL hợp lệ'),
  })
  .transform((raw): Product => ({
    id: String(raw.id), // số -> chuỗi, vì keyExtractor và Route Params đều dùng chuỗi
    name: raw.title,
    price: Math.round(raw.price * USD_TO_VND), // USD -> VND, làm tròn cho đẹp
    image: raw.thumbnail,
  }));

/** Khuôn cho nguyên một "trang" DummyJSON trả về, kèm tổng số hàng để biết khi nào hết. */
export const RemoteProductPageSchema = z.object({
  products: z.array(RemoteProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});
