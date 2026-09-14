import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
// ĐÚNG: SafeAreaView phải lấy từ 'react-native-safe-area-context', KHÔNG lấy từ 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import ProductCard from '@components/ProductCard';
import { MOCK_PRODUCTS } from '@data/mockProducts';
import { COLORS, SIZES } from '@constants/theme';
import { useNavigation } from '@react-navigation/native'; 
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import ShopButton from '@components/ShopButton'; 
import type { HomeStackParamList } from '@navigation/HomeStackNavigator'; 

type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>; 

const HomeScreen = ({ onLogout }: { onLogout: () => void }) => { 
  const navigation = useNavigation<HomeNavProp>(); 
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Giả lập gọi lại API mất 1.5 giây — Chương 6 sẽ thay bằng refetch() thật của React Query
    setTimeout(() => {
      setProducts([...MOCK_PRODUCTS].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header AppBar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Khám phá</Text>
          <ShopButton 
            title='Thoát'
            onPress={onLogout}
            style={styles.logoutBtn}
          />
        </View>


        <FlashList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            // Chỉ gửi productId (ID) qua navigate, không gửi nguyên object sản phẩm
            <Pressable
              style={styles.cardPressable}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: item.id })
              }
            >
              <ProductCard product={item} />
            </Pressable>
          )}

          numColumns={2}
          refreshing={refreshing} // FlashList tự vẽ vòng xoay loading khi true
          onRefresh={handleRefresh} // Gọi khi người dùng kéo tay xuống đầu danh sách
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background, // Màu nền vùng tai thỏ
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
    backgroundColor: COLORS.surface,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logoutBtn: { width: 80, height: 32, backgroundColor: COLORS.textLight }, 
  cardPressable: { flex: 1 }, 
  listContent: { padding: SIZES.padding / 2 },
});

export default HomeScreen;
