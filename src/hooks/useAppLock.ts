import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from '@store/useAuthStore';

/** Sau bao lâu ở nền thì bắt khoá lại — 2 phút cho App thương mại điện tử. */
const APP_LOCK_TIMEOUT_MS = 2 * 60 * 1000;

type Params = {
  isUnlocked: boolean;
  setIsUnlocked: (value: boolean) => void;
};

/**
 * Khoá lại App nếu bị đưa vào nền quá lâu. Lớp phòng thủ BỔ SUNG cho
 * BiometricGateScreen — cổng kia chỉ kiểm lúc App KHỞI ĐỘNG LẠI.
 */
export const useAppLock = ({ setIsUnlocked }: Params) => {
  const token = useAuthStore(state => state.token);
  // Mốc thời gian lúc App rời sang nền — useRef vì đổi giá trị không cần vẽ lại
  const backgroundedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (token == null) return; // Chưa đăng nhập thì chưa có gì để khoá

    const handleChange = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        backgroundedAtRef.current = Date.now();
        return;
      }

      if (nextState === 'active' && backgroundedAtRef.current != null) {
        const elapsedMs = Date.now() - backgroundedAtRef.current;
        if (elapsedMs > APP_LOCK_TIMEOUT_MS) {
          setIsUnlocked(false); // Quá hạn -> bắt quét lại từ đầu
        }
        backgroundedAtRef.current = null;
      }
    };

    const sub = AppState.addEventListener('change', handleChange);
    return () => sub.remove(); // Dọn listener — thiếu là rò rỉ bộ nhớ
  }, [token, setIsUnlocked]);
};
