import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';

type Props = {
  /** Gọi khi user đã vượt qua cổng (hoặc máy không hỗ trợ sinh trắc học). */
  onUnlock: () => void;
};

const BiometricGateScreen = ({ onUnlock }: Props) => {
  const [checking, setChecking] = useState(true);
  const [failed, setFailed] = useState(false);
  const [label, setLabel] = useState('sinh trắc học'); // Sẽ đổi thành "Face ID" / "vân tay"
  const logout = useAuthStore(state => state.logout);

  const authenticate = useCallback(async () => {
    setChecking(true);
    setFailed(false);

    try {
      // 1. Máy có cảm biến không?
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      // 2. User đã đăng ký vân tay/khuôn mặt trong Cài đặt máy chưa?
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      // Thiếu một trong hai -> KHÔNG chặn, cho vào luôn.
      if (!hasHardware || !isEnrolled) {
        onUnlock();
        return;
      }

      // 3. Lấy đúng tên loại sinh trắc học để câu chữ thân thiện
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (
        types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
      ) {
        setLabel('Face ID');
      } else if (
        types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
      ) {
        setLabel('vân tay');
      }

      // 4. Bung giao diện quét của HỆ ĐIỀU HÀNH
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Xác thực để mở ShopAI',
        cancelLabel: 'Huỷ',
        // false = vẫn cho nhập mã PIN của máy nếu quét hỏng.
        // ĐỪNG đặt true: user đeo khẩu trang sẽ bị khoá ngoài tài khoản của chính họ.
        disableDeviceFallback: false,
      });

      if (result.success) {
        onUnlock();
      } else {
        setFailed(true); // user_cancel, lockout, user_fallback...
      }
    } catch (e) {
      // Lỗi bất ngờ từ tầng Native -> vẫn chừa lối thoát, không treo app
      console.log('[biometric] Lỗi xác thực:', e);
      setFailed(true);
    } finally {
      setChecking(false);
    }
  }, [onUnlock]);

  // Tự bung pop-up quét ngay khi màn hình vừa hiện
  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.hint}>Đang xác thực...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.title}>ShopAI đang khoá</Text>
      <Text style={styles.hint}>
        {failed
          ? `Xác thực ${label} chưa thành công. Bạn có thể thử lại hoặc đăng nhập lại bằng mật khẩu.`
          : `Hãy xác thực bằng ${label} để tiếp tục.`}
      </Text>

      <ShopButton title="Thử lại" onPress={authenticate} style={styles.retryBtn} />

      {/* LỐI THOÁT BẮT BUỘC: luôn quay về được màn hình Login bằng mật khẩu */}
      <ShopButton
        title="Đăng nhập bằng mật khẩu"
        onPress={logout}
        style={styles.passwordBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.background,
  },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: SIZES.h2, fontWeight: 'bold', marginBottom: 8 },
  hint: {
    fontSize: SIZES.body2,
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 20,
  },
  retryBtn: { width: 220, marginBottom: 12 },
  passwordBtn: { width: 220, backgroundColor: COLORS.secondary },
});

export default BiometricGateScreen;
