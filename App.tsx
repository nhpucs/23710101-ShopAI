import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@contexts/ThemeContext';
import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';
import RootStackNavigator from '@navigation/RootStackNavigator';
import { useAuthStore } from '@store/useAuthStore';
import { reduxStore } from '@store/redux/store';
import { COLORS } from '@constants/theme';
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
