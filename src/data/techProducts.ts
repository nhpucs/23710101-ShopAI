import type { Product } from '../types/product.schema';

// Ảnh mượn từ kho ảnh công khai của DummyJSON (ảnh minh hoạ gần đúng dòng máy).
const IMG = 'https://cdn.dummyjson.com/product-images';

/**
 * Danh mục đồ công nghệ của ShopAI — nguồn sự thật DUY NHẤT về tên và giá.
 * Cả Trang chủ (qua productService) lẫn trợ lý AI (qua aiPrompt) đều đọc từ đây,
 * nên giá bot báo luôn khớp với giá đang hiện trên Trang chủ.
 *
 * Chương 9: danh sách này chuyển xuống Backend NestJS, Mobile chỉ còn gọi API.
 */
export const TECH_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên',
    price: 29490000,
    image: `${IMG}/smartphones/iphone-13-pro/thumbnail.webp`,
  },
  {
    id: '2',
    name: 'MacBook Air 13.6 inch M3 (16GB / 512GB)',
    price: 27890000,
    image: `${IMG}/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp`,
  },
  {
    id: '3',
    name: 'Tai nghe Chống ồn Sony WH-1000XM5',
    price: 6990000,
    image: `${IMG}/mobile-accessories/apple-airpods-max-silver/thumbnail.webp`,
  },
  {
    id: '4',
    name: 'Đồng hồ Apple Watch Series 9 GPS 41mm',
    price: 9490000,
    image: `${IMG}/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp`,
  },
  {
    id: '5',
    name: 'iPad Mini 6 Wi-Fi 64GB Starlight',
    price: 11990000,
    image: `${IMG}/tablets/ipad-mini-2021-starlight/thumbnail.webp`,
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24 Ultra 256GB',
    price: 26990000,
    image: `${IMG}/smartphones/samsung-galaxy-s10/thumbnail.webp`,
  },
  {
    id: '7',
    name: 'Laptop Dell XPS 13 9340 (16GB / 512GB)',
    price: 32990000,
    image: `${IMG}/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp`,
  },
  {
    id: '8',
    name: 'Tai nghe Apple AirPods Pro 2 USB-C',
    price: 5490000,
    image: `${IMG}/mobile-accessories/apple-airpods/thumbnail.webp`,
  },
  {
    id: '9',
    name: 'Samsung Galaxy Tab S9 Plus 256GB',
    price: 19990000,
    image: `${IMG}/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp`,
  },
  {
    id: '10',
    name: 'Loa thông minh Apple HomePod Mini',
    price: 2490000,
    image: `${IMG}/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp`,
  },
  {
    id: '11',
    name: 'Laptop Asus Zenbook Pro Duo 14 OLED',
    price: 38990000,
    image: `${IMG}/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp`,
  },
  {
    id: '12',
    name: 'Sạc dự phòng Apple MagSafe Battery Pack',
    price: 2190000,
    image: `${IMG}/mobile-accessories/apple-magsafe-battery-pack/thumbnail.webp`,
  },
  {
    id: '13',
    name: 'OPPO Reno11 F 5G 256GB',
    price: 8490000,
    image: `${IMG}/smartphones/oppo-f19-pro-plus/thumbnail.webp`,
  },
  {
    id: '14',
    name: 'Laptop Lenovo Yoga Slim 7 (16GB / 512GB)',
    price: 21990000,
    image: `${IMG}/laptops/lenovo-yoga-920/thumbnail.webp`,
  },
];
