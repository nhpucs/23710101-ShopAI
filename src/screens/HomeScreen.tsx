import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import ProductCard from '@components/ProductCard';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';
import { useCartStore } from '@store/useCartStore';
import { Product, ProductListSchema } from '../types/product.schema';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';
import type { MainTabParamList } from '@navigation/MainTabNavigator';
import LocationBadge from '@components/LocationBadge';

// HomeScreen cần navigate ở CẢ 2 tầng: trong Stack (ProductDetail) VÀ sang Tab cha (Cart)
type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList>
>;

const PAGE_SIZE = 10;
const TOTAL_MOCK_PRODUCTS = 47; // Giả lập Server có 47 sản phẩm — đủ nhiều trang để thấy Pagination

interface ProductPage {
  items: Product[];
  nextPage: number | null;
}

// 2 lớp lỗi riêng biệt để UI phân biệt "lỗi mạng" và "lỗi dữ liệu bẩn"
class ZodValidationError extends Error {}
class NetworkError extends Error {}

const fetchProductsPage = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<ProductPage> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Giả lập ~10% mất mạng để thấy rõ nhánh lỗi Mạng
      if (Math.random() < 0.1) {
        reject(new NetworkError('Mất kết nối mạng, vui lòng thử lại!'));
        return;
      }

      const start = (pageParam - 1) * PAGE_SIZE;
      const rawItems = Array.from({ length: PAGE_SIZE })
        .map((_, i) => {
          const index = start + i;
          if (index >= TOTAL_MOCK_PRODUCTS) return null;
          return {
            id: `api_prod_${index}`,
            name: `Sản phẩm từ Cloud ${index}`,
            price: 500000 + index * 5000,
            image: `https://picsum.photos/id/${100 + index}/400/400`,
          };
        })
        .filter(item => item !== null);

      // TRẠM KIỂM SOÁT ZOD: soi TỪNG TRANG trước khi cho đi tiếp
      const result = ProductListSchema.safeParse(rawItems);
      if (!result.success) {
        console.error('❌ Zod chặn dữ liệu bẩn từ API:', result.error.format());
        reject(new ZodValidationError('Dữ liệu sản phẩm không hợp lệ!'));
        return;
      }

      const hasMore = start + PAGE_SIZE < TOTAL_MOCK_PRODUCTS;
      resolve({ items: result.data, nextPage: hasMore ? pageParam + 1 : null });
    }, 1200);
  });
};

const HomeScreen = ({ navigation, route }: Props) => {
  const logout = useAuthStore(state => state.logout);
  const totalQuantity = useCartStore(state => state.totalQuantity());
  const scannedCode = route.params?.scannedCode;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['productsInfinite'],
    queryFn: fetchProductsPage,
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
  });

  // data.pages là mảng CÁC TRANG — làm phẳng thành 1 mảng duy nhất cho FlashList
  const allProducts = data?.pages.flatMap(page => page.items) ?? [];

  // Phân biệt 2 loại lỗi bằng instanceof — không gộp chung 1 câu mơ hồ
  const errorMessage =
    error instanceof ZodValidationError
      ? '⚠️ Dữ liệu sản phẩm không hợp lệ (lỗi kiểm tra Zod) — báo kỹ thuật viên!'
      : '📡 Lỗi mạng — vui lòng kiểm tra kết nối và kéo xuống thử lại!';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Khám phá</Text>
          <View style={styles.headerActions}>
            <ShopButton
              title={`Giỏ hàng (${totalQuantity})`}
              onPress={() => navigation.navigate('Cart')}
              style={styles.cartBtn}
              textStyle={styles.cartBtnText}
            />
            <ShopButton title="Thoát" onPress={logout} style={styles.logoutBtn} />
          </View>
        </View>
        {/* ➕ Chương 7 — thẻ vị trí + phí ship, tự dò GPS khi màn hình mount */}
        <LocationBadge />

        <View style={styles.scanBar}>
          <ShopButton
            title="📷 Quét mã vạch sản phẩm"
            onPress={() => navigation.navigate('Scanner')}
            style={styles.scanBtn}
            textStyle={styles.scanBtnText}
          />
        </View>

        {scannedCode && (
          <View style={styles.scanResult}>
            <Text style={styles.scanResultText}>Mã vừa quét: {scannedCode}</Text>
          </View>
        )}

        {/* TRẠNG THÁI 1: đang tải lần đầu */}
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.centerLoader}
          />
        )}

        {/* TRẠNG THÁI 2: lỗi — 1 cờ isError nhưng 2 thông điệp khác nhau */}
        {isError && <Text style={styles.errorText}>{errorMessage}</Text>}

        {/* TRẠNG THÁI 3: có dữ liệu */}
        {allProducts.length > 0 && (
          <FlashList
            data={allProducts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
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
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={refetch}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary}
                  style={styles.footerLoader}
                />
              ) : null
            }
          />
        )}
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
  headerActions: { flexDirection: 'row', gap: 10 },
  cartBtn: { width: 120, height: 32, backgroundColor: COLORS.secondary },
  cartBtnText: { fontSize: 12 },
  logoutBtn: { width: 80, height: 32, backgroundColor: COLORS.textLight },
  cardPressable: { flex: 1 }, // BẮT BUỘC với numColumns={2}, thiếu là lưới lệch 1 cột
  listContent: { padding: SIZES.padding / 2 },
  centerLoader: { marginTop: 50 },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red' },
  footerLoader: { marginVertical: 16 },
  scanBar: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
  },
  scanBtn: { height: 40, backgroundColor: COLORS.secondary },
  scanBtnText: { fontSize: 14 },
  scanResult: { backgroundColor: '#FFF3CD', padding: 10, alignItems: 'center' },
  scanResultText: { fontWeight: 'bold', color: COLORS.text },
});

export default HomeScreen;