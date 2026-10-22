import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getCrashlytics, log, recordError } from '@react-native-firebase/crashlytics';
import * as Updates from 'expo-updates';
import { ThemeProvider } from '@contexts/ThemeContext';
import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';
import RootStackNavigator from '@navigation/RootStackNavigator';
import { useAuthStore } from '@store/useAuthStore';
import { reduxStore } from '@store/redux/store';
import { COLORS } from '@constants/theme';
import { APP_ENV, APP_VERSION, ENABLE_OTA_UPDATE } from '@constants/env';
import BiometricGateScreen from '@screens/BiometricGateScreen';
import { useAppLock } from '@hooks/useAppLock';

const AuthStack = createNativeStackNavigator();

// GIỮ từ Chương 5 — Deep Link shopai://product/api_prod_1
// Chương 6 thêm 1 tầng: RootStack(MainTabs) > Tab(HomeTab) > Stack(ProductDetail)
const linking: LinkingOptions<any> = {
  prefixes: ['shopai://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeTab: {
            screens: {
              ProductDetail: 'product/:productId',
            },
          },
        },
      },
    },
  },
};

// Cấu hình "tủ lạnh" React Query — tạo 1 lần duy nhất, NGOÀI component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu còn "Tươi" trong 5 phút
      retry: 2,
    },
  },
});

function App(): React.JSX.Element {
  // Selector RIÊNG cho từng trường — gọi useAuthStore() trống sẽ khiến App
  // vẽ lại mỗi khi BẤT KỲ trường nào đổi, kể cả trường App không quan tâm
  const token = useAuthStore(state => state.token);
  const isLoading = useAuthStore(state => state.isLoading);
  const checkLocalToken = useAuthStore(state => state.checkLocalToken);
  const isUnlocked = useAuthStore(state => state.isUnlocked);
  const setIsUnlocked = useAuthStore(state => state.setIsUnlocked);

  useEffect(() => {
    checkLocalToken(); // Móc vào két SecureStore ngay khi App vừa khởi chạy
  }, [checkLocalToken]);

  // Chương 10 (Bước 2): vụn bánh mì đầu tiên — biết app đã mở ở bản nào, môi trường nào
  useEffect(() => {
    log(getCrashlytics(), `App ShopAI đã khởi động (v${APP_VERSION}, ${APP_ENV}).`);
  }, []);

  // Chương 10 (Bước 6): kiểm tra bản vá OTA mỗi lần mở app. Lúc dev thì code đã đến từ Metro
  // nên bỏ qua, tránh app tự reload giữa chừng.
  useEffect(() => {
    async function checkForUpdate() {
      if (!ENABLE_OTA_UPDATE || !Updates.isEnabled) return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); // Tải xong thì mở lại app bằng bản JS mới
        }
      } catch (error) {
        // Không có mạng hay server Expo lỗi thì app vẫn chạy bản cũ, chỉ ghi lại để theo dõi
        recordError(getCrashlytics(), error as Error, 'OtaUpdateFailed');
      }
    }
    checkForUpdate();
  }, []);

    // Canh gác App Lock — tự khoá nếu App ở nền quá lâu (Phần 8.12)
  useAppLock({ isUnlocked, setIsUnlocked });

  // Đang lục két -> hiện vòng xoay tràn màn hình, chưa quyết định đi đâu
  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  
  // Có token nhưng chưa vượt cổng -> chặn tại đây.
  // Chỉ chặn khi CÓ token; chưa đăng nhập thì đi thẳng vào Login.
  if (token != null && !isUnlocked) {
    return <BiometricGateScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* Chương 6 Bước 10 — Provider Redux Toolkit, chạy SONG SONG với Zustand */}
        <Provider store={reduxStore}>
          <ThemeProvider>
            <NavigationContainer linking={linking}>
              {token == null ? (
                <AuthStack.Navigator screenOptions={{ headerShown: false }}>
                  <AuthStack.Screen name="Login" component={LoginScreen} />
                  <AuthStack.Screen
                    name="Register"
                    component={RegisterScreen}
                  />
                </AuthStack.Navigator>
              ) : (
                <RootStackNavigator />
              )}
            </NavigationContainer>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default App;
