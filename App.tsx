import React from 'react';
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
  // Không còn useState! Token giờ nằm trong tủ Zustand
  const token = useAuthStore(state => state.token);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* Bước 10 — Provider của Redux Toolkit, chạy SONG SONG với Zustand (bài tập đề cương) */}
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
                // Bước 9.5 — đổi từ <MainTabNavigator /> sang RootStack để có Checkout Modal + OrderDetail
                <RootStackNavigator />
              )}
            </NavigationContainer>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
