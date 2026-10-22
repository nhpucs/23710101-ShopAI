import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ShopButton from '@components/ShopButton';
import { useCartStore } from '@store/useCartStore';
import { COLORS, SIZES } from '@constants/theme';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';
import { fetchProductById, ProductPage } from '@services/productService';
import { formatCurrency } from '@utils/formatCurrency';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params; // Chỉ nhận đúng 1 chuỗi ID, KHÔNG nhận Object
  const queryClient = useQueryClient();
  const addItem = useCartStore(state => state.addItem);

  // Chương 9 — Bước 9b: tự gọi GET /api/products/:id, nên mở thẳng bằng Deep Link
  // (Trang chủ chưa tải) vẫn có dữ liệu.
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', productId], // Mỗi sản phẩm có ô cache riêng
    queryFn: () => fetchProductById(productId),
    // Hiện NGAY dữ liệu từ cache danh sách Trang chủ (Chương 6) trong lúc request chi tiết
    // đang bay -> không chớp màn hình Loading. Cache của useInfiniteQuery có dạng
    // { pages: ProductPage[] } nên phải flatMap trước khi find.
    placeholderData: () =>
      queryClient
        .getQueryData<{ pages: ProductPage[] }>(['productsInfinite'])
        ?.pages.flatMap(page => page.items)
        .find(p => p.id === productId),
  });

  // Chưa có gì để hiện (mở bằng Deep Link, cache trống) -> đang tải
  if (isLoading && !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.hint}>Đang tải sản phẩm (mã {productId})...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Server trả 404 (sản phẩm không tồn tại) hoặc lỗi mạng
  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.notFound}>
            {error instanceof Error ? error.message : 'Không tìm thấy sản phẩm'}
          </Text>
          <Text style={styles.hint}>Mã sản phẩm: {productId}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <Text style={styles.idNote}>Mã sản phẩm: {product.id}</Text>
        <ShopButton
          title="Thêm vào giỏ hàng"
          onPress={() => addItem(product)}
          style={styles.buyBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding },
  // ➕ MỚI (Chương 6) — căn giữa khối thông báo khi Cache trống
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  name: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  price: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  idNote: { fontSize: SIZES.body2, color: COLORS.textLight, marginBottom: 24 },
  buyBtn: { marginTop: 8 },
  notFound: {
    fontSize: SIZES.body1,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  // ➕ MỚI (Chương 6)
  hint: { fontSize: SIZES.body2, color: COLORS.textLight, textAlign: 'center' },
});

export default ProductDetailScreen;
