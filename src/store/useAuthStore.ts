import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  isLoading: boolean; // Trạng thái đang kiểm tra ổ cứng
  isUnlocked: boolean; // Đã vượt cổng sinh trắc học chưa
  setIsUnlocked: (value: boolean) => void;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkLocalToken: () => Promise<void>; // Hàm chạy lúc mở app
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  isLoading: true, // Mặc định vừa vào app là Loading
  isUnlocked: false,
  setIsUnlocked: value => set({ isUnlocked: value }),

  // Lưu token vào RAM (Đám mây) VÀ lưu xuống Ổ cứng mã hóa (Keystore)
  login: async newToken => {
    await SecureStore.setItemAsync('SHOP_ACCESS_TOKEN', newToken);
    set({ token: newToken, isUnlocked: true });
  },

  // Hủy Token trên cả 2 nơi
  logout: async () => {
    await SecureStore.deleteItemAsync('SHOP_ACCESS_TOKEN');
    set({ token: null, isUnlocked: false });
  },

  // Móc dữ liệu từ Keystore lên khi người dùng vừa khởi động lại app
  checkLocalToken: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('SHOP_ACCESS_TOKEN');
      if (storedToken) {
        set({ token: storedToken }); // Tìm thấy Token -> Đăng nhập luôn!
      }
    } catch (e) {
      console.log('Lỗi Keystore');
    } finally {
      set({ isLoading: false }); // Kiểm tra xong, tắt vòng xoay Loading
    }
  },
}));
