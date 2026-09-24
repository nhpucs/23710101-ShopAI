import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native'; // Biết màn hình có đang hiển thị hay không
import ShopButton from '@components/ShopButton';
import { COLORS } from '@constants/theme';
import { hapticSuccess } from '@utils/haptics'; // Tiện ích rung vừa viết ở B4

// Ba trạng thái của "cánh cổng quyền" — thay cho biến boolean cụt ngủn.
// 'checking' = đang hỏi OS | 'granted' = được phép | 'denied' = bị chặn
type PermissionState = 'checking' | 'granted' | 'denied';

// Nhận tham số navigation từ React Navigation V7
const ScannerScreen = ({ navigation }: any) => {
  const [permission, setPermission] = useState<PermissionState>('checking');
  const device = useCameraDevice('back'); // Chọn ống kính mặt lưng
  const isFocused = useIsFocused(); // true nếu màn hình này đang ở trên cùng

  // "CÁI KHÓA" chống quét lặp — dùng useRef vì đổi giá trị không cần re-render lại UI
  const isScanning = useRef(false);

  // 1. Hàm xin/kiểm tra quyền
  const requestPermission = useCallback(async () => {
    // getCameraPermissionStatus() đọc trạng thái HIỆN TẠI mà không bung Pop-up.
    const current = Camera.getCameraPermissionStatus();
    if (current === 'granted') {
      setPermission('granted');
      return;
    }

    // Chưa có quyền -> gọi thẳng xuống Native OS để bung Pop-up
    const status = await Camera.requestCameraPermission();
    setPermission(status === 'granted' ? 'granted' : 'denied');
  }, []);

  // 2. Xin quyền ở Runtime khi màn hình vừa Mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // 3. Khi user rời app sang Settings bật quyền rồi quay lại -> dò lại quyền
  // Chỉ ĐỌC trạng thái, KHÔNG xin lại: trên Android chính Pop-up xin quyền
  //    làm AppState đổi background -> active, xin lại ở đây sẽ bung Pop-up lần 2.
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && Camera.getCameraPermissionStatus() === 'granted') {
        setPermission('granted');
      }
    });
    return () => sub.remove(); // Dọn listener khi rời màn hình, tránh rò rỉ bộ nhớ
  }, []);

  // 4. Mở thẳng trang Cài đặt của chính app ShopAI trong Settings hệ thống
  const openAppSettings = () => {
    Alert.alert(
      'Cần quyền Camera',
      'Bạn đã từ chối quyền Camera nên ShopAI không thể quét mã vạch. Hãy vào Cài đặt > ShopAI và bật lại quyền Camera nhé.',
      [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
      ],
    );
  };

  // 5. Logic Máy Quét — có khóa Debounce + rung phản hồi
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'], // QR, mã vạch siêu thị, mã vạch kho hàng
    onCodeScanned: codes => {
      // Nếu đã xử lý 1 lần rồi thì bỏ qua toàn bộ các lần quét dồn dập tiếp theo
      if (isScanning.current) return;
      if (codes.length === 0) return;

      const value = codes[0].value;
      if (!value) return; // Vision Camera có thể trả về mã rỗng khi ảnh mờ

      isScanning.current = true; // Đóng khóa lại NGAY LẬP TỨC
      console.log('Phát hiện mã:', value);

      // 📳 Rung NGAY SAU khi đóng khóa, TRƯỚC khi navigate — cảm giác tức thời nhất
      hapticSuccess();

      // RN Navigation 7: navigate() sẽ CHỒNG thêm 1 Home mới -> dùng popTo() để QUAY VỀ Home cũ
      navigation.popTo('Home', { scannedCode: value });
    },
  });

  // ---------- Các trạng thái giao diện ----------

  // A. Đang hỏi hệ điều hành
  if (permission === 'checking') {
    return (
      <View style={styles.center}>
        <Text style={styles.stateText}>Đang kiểm tra quyền Camera...</Text>
      </View>
    );
  }

  if (permission === 'denied') {
    return (
      <View style={styles.center}>
        <Text style={styles.deniedTitle}>Chưa có quyền Camera</Text>
        <Text style={styles.deniedDesc}>
          ShopAI cần Camera để quét mã vạch sản phẩm. Ảnh chỉ được xử lý ngay trên máy
          của bạn và không bao giờ được gửi đi đâu cả.
        </Text>
        <ShopButton
          title="Mở Cài đặt"
          onPress={openAppSettings}
          style={{ width: 200, marginBottom: 12 }}
        />
        <ShopButton
          title="Quay lại"
          onPress={() => navigation.goBack()}
          style={{ width: 200, backgroundColor: COLORS.secondary }}
        />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.stateText}>Thiết bị không có Camera sau!</Text>
        <Text style={styles.deniedDesc}>
          Bạn có đang chạy trên máy ảo không? Hãy bật Camera sau (VirtualScene) cho Emulator.
        </Text>
        <ShopButton title="Quay lại" onPress={() => navigation.goBack()} style={{ width: 200 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />

      <View style={styles.frameWrapper} pointerEvents="none">
        <View style={styles.frame} />
      </View>

      <View style={styles.overlay}>
        <Text style={styles.instruction}>Đưa mã vạch vào khung hình</Text>
        <ShopButton
          title="Hủy bỏ"
          onPress={() => navigation.goBack()}
          style={{ width: 150, backgroundColor: COLORS.error }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  stateText: { fontSize: 16, marginBottom: 12, textAlign: 'center' },
  deniedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: COLORS.error },
  deniedDesc: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  frameWrapper: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  instruction: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
});

export default ScannerScreen;
