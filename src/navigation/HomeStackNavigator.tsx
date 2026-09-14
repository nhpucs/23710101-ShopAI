import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@screens/HomeScreen";
import ProductDetailScreen from "@screens/ProductDetailScreen";

// báo lỗi nếu bạn quên gửi productId hoặc gửi sai kiểu khi gọi navigate()
export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
  // Scanner: undefined; 
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

interface Props {
  onLogout: () => void;
}

const HomeStackNavigator = ({ onLogout }: Props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {() => <HomeScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Chi tiết sản phẩm" }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
