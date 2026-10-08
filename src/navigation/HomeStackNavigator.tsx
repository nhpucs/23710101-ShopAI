import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import ProductDetailScreen from '@screens/ProductDetailScreen';
import ScannerScreen from '@screens/ScannerScreen';
import AIChatScreen from '@screens/AIChatScreen';


export type HomeStackParamList = {
  Home: { scannedCode?: string } | undefined; // có thể nhận mã vừa quét từ Scanner
  ProductDetail: { productId: string };
  Scanner: undefined;
  AIChat: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

// KHÔNG còn nhận Props onLogout — HomeScreen tự lấy useAuthStore().logout
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Chi tiết sản phẩm' }}
      />
      <Stack.Screen name="Scanner" component={ScannerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIChat" component={AIChatScreen} options={{ title: 'Tư vấn AI ShopAI' }} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
