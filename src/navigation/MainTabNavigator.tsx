import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStackNavigator from '@navigation/HomeStackNavigator';
import CartScreen from '@screens/CartScreen';
import OrdersScreen from '@screens/OrdersScreen';
import ReduxCartDemoScreen from '@screens/ReduxCartDemoScreen';
import { COLORS } from '@constants/theme';
import { useCartStore } from '@store/useCartStore';

// Export ParamList để các màn hình điều hướng "xuyên tầng" Stack <-> Tab
export type MainTabParamList = {
  HomeTab: undefined;
  Cart: undefined;
  Orders: undefined;
  ReduxDemo: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// KHÔNG còn nhận Props onLogout / cartBadgeCount — đọc thẳng từ Zustand
const MainTabNavigator = () => {
  // Badge là số THẬT từ giỏ hàng, không còn giá trị demo cứng 2 nữa
  const cartCount = useCartStore(state => state.totalQuantity());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-variant-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart-outline" color={color} size={size} />
          ),
          // undefined (KHÔNG phải 0) để React Navigation tự ẩn badge khi giỏ trống
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />

      {/* Chương 6 — Bước 9.6: Lịch sử đơn hàng */}
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color, size }) => (
            <Icon name="clipboard-list-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Chương 6 — Bước 10: Tab demo Redux Toolkit (bài tập bắt buộc đề cương) */}
      <Tab.Screen
        name="ReduxDemo"
        component={ReduxCartDemoScreen}
        options={{
          title: 'RTK Demo',
          tabBarIcon: ({ color, size }) => (
            <Icon name="flask-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
