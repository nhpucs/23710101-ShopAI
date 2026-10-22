import { useCartStore } from '../useCartStore';

// Dữ liệu mẫu — khai báo một chỗ, dùng lại ở mọi test (giá giống sản phẩm thật trên server)
const iphone = {
  id: 'p1',
  name: 'iPhone 18 Pro Max 256GB',
  price: 41999000,
  image: 'https://x.com/a.jpg',
};
const airpods = { id: 'p2', name: 'AirPods Pro 3', price: 6000000, image: 'https://x.com/b.jpg' };

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset giỏ giữa các test, không thì giỏ của test trước "chảy" sang test sau
    useCartStore.setState({ items: [] });
  });

  // ===== NHÓM 1: ĐƯỜNG HẠNH PHÚC =====
  describe('addItem', () => {
    it('thêm một sản phẩm mới vào giỏ hàng trống', () => {
      useCartStore.getState().addItem(iphone);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('p1');
      expect(items[0].quantity).toBe(1);
    });

    it('thêm hai sản phẩm KHÁC NHAU tạo ra hai dòng riêng biệt', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods);

      expect(useCartStore.getState().items).toHaveLength(2);
    });

    // ===== NHÓM 2: TRƯỜNG HỢP BIÊN =====
    it('thêm CÙNG một sản phẩm 2 lần thì gộp số lượng, KHÔNG tạo dòng mới', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(iphone);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it('gộp số lượng không làm thay đổi sản phẩm khác trong giỏ', () => {
      useCartStore.getState().addItem(airpods);
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(iphone);

      const airpodsLine = useCartStore.getState().items.find(i => i.id === 'p2');
      expect(airpodsLine?.quantity).toBe(1);
    });
  });

  describe('totalPrice', () => {
    it('trả về 0 khi giỏ hàng trống', () => {
      expect(useCartStore.getState().totalPrice()).toBe(0);
    });

    it('tính đúng tổng tiền của một sản phẩm', () => {
      useCartStore.getState().addItem(iphone);
      expect(useCartStore.getState().totalPrice()).toBe(41999000);
    });

    it('tính đúng tổng tiền khi có nhiều sản phẩm và nhiều số lượng', () => {
      useCartStore.getState().addItem(iphone); // 41.999.000 x 2
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods); //  6.000.000 x 1

      expect(useCartStore.getState().totalPrice()).toBe(41999000 * 2 + 6000000);
    });
  });

  describe('totalQuantity', () => {
    it('đếm TỔNG SỐ MÓN, không phải số dòng trong giỏ', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods);

      expect(useCartStore.getState().items).toHaveLength(2); // 2 dòng
      expect(useCartStore.getState().totalQuantity()).toBe(3); // nhưng 3 món
    });
  });

  describe('removeItem', () => {
    it('xóa đúng sản phẩm được chỉ định', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods);

      useCartStore.getState().removeItem('p1');

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('p2');
    });

    // ===== NHÓM 3: ĐƯỜNG LỖI =====
    it('không làm sập App khi xóa một id không tồn tại', () => {
      useCartStore.getState().addItem(iphone);

      expect(() => useCartStore.getState().removeItem('id_khong_ton_tai')).not.toThrow();
      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  // ===== NHÓM 4: TRẠNG THÁI RỖNG =====
  describe('clearCart', () => {
    it('xóa sạch giỏ hàng sau khi đặt hàng thành công (Chương 9, Bước 9c)', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods);

      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toHaveLength(0);
      expect(useCartStore.getState().totalPrice()).toBe(0);
      expect(useCartStore.getState().totalQuantity()).toBe(0);
    });
  });
});
