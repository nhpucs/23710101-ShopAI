import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type Coords = { latitude: number; longitude: number };

type LocationState = {
  coords: Coords | null;
  loading: boolean;
  error: string | null;
};

/**
 * Xin quyền vị trí.
 * - Android: phải tự gọi PermissionsAndroid (thư viện này không tự xin).
 * - iOS: thư viện tự bung Pop-up dựa trên Info.plist, nên ta chỉ cần trả về true.
 */
const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization(); // Đọc NSLocationWhenInUseUsageDescription trong Info.plist
    return true;
  }

  //  Hỏi CẢ FINE lẫn COARSE: Android 12+ cho user chọn "Gần đúng" -> chỉ cấp COARSE.
  //    Chỉ hỏi FINE (như giáo trình) thì user đồng ý "Gần đúng" vẫn bị coi là từ chối.
  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);
  const fine = result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
  const coarse = result[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];

  // Chỉ cần 1 trong 2 — tính phí ship thì "Gần đúng" (vài trăm mét) là quá đủ
  if (
    fine === PermissionsAndroid.RESULTS.GRANTED ||
    coarse === PermissionsAndroid.RESULTS.GRANTED
  ) {
    return true;
  }

  // Mỗi quyền trả về 3 giá trị: 'granted' | 'denied' | 'never_ask_again'
  if (
    fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
    coarse === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
  ) {
    Alert.alert(
      'Quyền vị trí đã bị chặn',
      'Bạn đã chọn "Không hỏi lại". Hãy vào Cài đặt > ShopAI > Quyền > Vị trí để bật lại.',
      [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
      ],
    );
  }
  return false;
};

/**
 * Gói API callback cũ thành Promise để dùng được await / try-catch.
 * highAccuracy=false -> hỏi Wi-Fi/trạm phát sóng (NETWORK) | true -> hỏi vệ tinh (GPS).
 */
const getPosition = (highAccuracy: boolean) =>
  new Promise<Coords>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      reject,
      {
        enableHighAccuracy: highAccuracy,
        timeout: highAccuracy ? 20000 : 8000, // BẮT BUỘC có timeout, nếu không app treo vô hạn
        maximumAge: 60000, // Chấp nhận toạ độ đã cache trong 60 giây gần nhất
      },
    );
  });

export const useCurrentLocation = () => {
  const [state, setState] = useState<LocationState>({
    coords: null,
    loading: true,
    error: null,
  });

  const fetchLocation = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));

    const ok = await requestLocationPermission();
    if (!ok) {
      setState({ coords: null, loading: false, error: 'Chưa được cấp quyền vị trí' });
      return;
    }

    // 🔧 NETWORK trước (nhanh, tiết kiệm pin) -> hỏng thì dự phòng GPS.
    //    Emulator KHÔNG có Wi-Fi/trạm phát sóng: toạ độ "Set location" chỉ đi vào GPS,
    //    nên chỉ dùng enableHighAccuracy:false (như giáo trình) sẽ luôn timeout.
    try {
      let coords: Coords;
      try {
        coords = await getPosition(false);
      } catch {
        coords = await getPosition(true);
      }
      setState({ coords, loading: false, error: null });
    } catch (err) {
      // err.code: 1 = từ chối quyền, 2 = không bắt được tín hiệu, 3 = quá thời gian chờ
      const code = (err as { code?: number }).code ?? 0;
      const messages: Record<number, string> = {
        1: 'Bạn đã từ chối quyền vị trí',
        2: 'Không bắt được tín hiệu GPS',
        3: 'Quá thời gian chờ GPS (thử ra ngoài trời)',
      };
      setState({
        coords: null,
        loading: false,
        error: messages[code] ?? 'Không lấy được vị trí',
      });
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { ...state, refresh: fetchLocation };
};
