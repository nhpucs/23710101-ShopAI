import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import ProductCard from '@components/ProductCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';
import { useCartStore } from '@store/useCartStore';
import { fetchProductsPage, ZodValidationError } from '@services/productService';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';
import type { MainTabParamList } from '@navigation/MainTabNavigator';
import LocationBadge from '@components/LocationBadge';
import ThemeToggle from '@components/ThemeToggle';
import FlashSaleBar from '@components/FlashSaleBar';
import { useTheme } from '@contexts/ThemeContext';

// HomeScreen cần navigate ở CẢ 2 tầng: trong Stack (ProductDetail) VÀ sang Tab cha (Cart)
type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList>
>;

// PAGE_SIZE và địa chỉ server giờ nằm ở @constants/api, dùng chung với productService
const HomeScreen = ({ navigation, route }: Props) => {
  const logout = useAuthStore(state => state.logout);
  const totalQuantity = useCartStore(state => state.totalQuantity());
  const scannedCode = route.params?.scannedCode;
  // Chương 3 — bộ màu theo Theme hiện hành (Sáng/Tối), đổi là mọi chỗ dưới đây đổi theo
  const { colors } = useTheme();
  // Chương 2 — ô tìm kiếm: TextInput controlled (value + onChangeText)
  const [keyword, setKeyword] = useState('');

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
  const allProducts = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  // Chương 2 — lọc theo từ khoá. useMemo để không lọc lại mỗi lần vẽ nếu
  // danh sách và từ khoá đều chưa đổi.
  const visibleProducts = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return allProducts;
    return allProducts.filter(p => p.name.toLowerCase().includes(kw));
  }, [allProducts, keyword]);

  // Phân biệt 2 loại lỗi bằng instanceof — không gộp chung 1 câu mơ hồ
  const errorMessage =
    error instanceof ZodValidationError
      ? '⚠️ Dữ liệu sản phẩm không hợp lệ (lỗi kiểm tra Zod) — báo kỹ thuật viên!'
      : '📡 Lỗi mạng — vui lòng kiểm tra kết nối và kéo xuống thử lại!';

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Khám phá</Text>
          <View style={styles.headerActions}>
            {/* ➕ Chương 3 — nút chuyển Sáng/Tối */}
            <ThemeToggle />
            <Pressable
              style={[styles.pillBtn, { backgroundColor: colors.background }]}
              onPress={() => navigation.navigate('Scanner')}
              accessibilityRole="button"
              accessibilityLabel="Quét mã vạch sản phẩm"
            >
              <Icon name="barcode-scan" size={18} color={COLORS.primary} />
              <Text style={[styles.pillText, { color: colors.text }]}>Quét mã</Text>
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Cart')}
              accessibilityRole="button"
              accessibilityLabel={`Giỏ hàng, ${totalQuantity} sản phẩm`}
            >
              <Icon name="cart-outline" size={24} color={COLORS.primary} />
              {totalQuantity > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalQuantity}</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={logout}
              accessibilityRole="button"
              accessibilityLabel="Đăng xuất"
            >
              <Icon name="logout" size={22} color={colors.textLight} />
            </Pressable>
          </View>
        </View>

        {/* ➕ Chương 2 — ô tìm kiếm: TextInput controlled. Chương 8 — gắn nút Hỏi AI */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Icon name="magnify" size={20} color={colors.textLight} />
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Tìm sản phẩm..."
            placeholderTextColor={colors.textLight}
            style={[styles.searchInput, { color: colors.text }]}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {/* ➕ Chương 8 — mở màn hình tư vấn AI (Gemini) */}
          <Pressable
            style={styles.aiPill}
            onPress={() => navigation.navigate('AIChat')}
            accessibilityRole="button"
            accessibilityLabel="Hỏi trợ lý AI"
          >
            <Icon name="robot" size={16} color={COLORS.surface} />
            <Text style={styles.aiPillText}>Hỏi AI</Text>
          </Pressable>
        </View>

        {/* ➕ Chương 3 — đồng hồ đếm ngược, hết giờ thì nút bị disabled */}
        <FlashSaleBar />

        {/* ➕ Chương 7 — thẻ vị trí + phí ship, tự dò GPS khi màn hình mount */}
        <LocationBadge />

        {scannedCode && (
          <View style={styles.scanResult}>
            <Text style={styles.scanResultText}>Mã vừa quét: {scannedCode}</Text>
          </View>
        )}

        {/* TRẠNG THÁI 1: đang tải lần đầu */}
        {isLoading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.centerLoader} />
        )}

        {/* TRẠNG THÁI 2: lỗi — 1 cờ isError nhưng 2 thông điệp khác nhau */}
        {isError && <Text style={styles.errorText}>{errorMessage}</Text>}

        {/* TRẠNG THÁI 3: có dữ liệu */}
        {/* Có dữ liệu nhưng lọc không ra kết quả nào */}
        {allProducts.length > 0 && visibleProducts.length === 0 && (
          <Text style={styles.errorText}>Không tìm thấy sản phẩm nào khớp "{keyword}"</Text>
        )}

        {visibleProducts.length > 0 && (
          <FlashList
            data={visibleProducts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.cardPressable}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
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
  headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  // ➕ Chương 8 — thanh tìm kiếm bo tròn, có nút Hỏi AI bên phải
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    marginBottom: 4,
    height: 44,
    borderRadius: 22,
    paddingLeft: 12,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, height: 44, paddingVertical: 0, fontSize: SIZES.body2 },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
  },
  aiPillText: { color: COLORS.surface, fontWeight: 'bold', fontSize: 13 },
  // Nút dạng "viên thuốc": icon + chữ ngắn
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
  },
  pillText: { fontSize: 13, fontWeight: '600' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  // Chấm đỏ đếm số món trong giỏ — position absolute để "đậu" lên góc icon
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: COLORS.surface, fontSize: 10, fontWeight: 'bold' },
  cardPressable: { flex: 1 }, // BẮT BUỘC với numColumns={2}, thiếu là lưới lệch 1 cột
  listContent: { padding: SIZES.padding / 2 },
  centerLoader: { marginTop: 50 },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red' },
  footerLoader: { marginVertical: 16 },
  scanResult: { backgroundColor: '#FFF3CD', padding: 10, alignItems: 'center' },
  scanResultText: { fontWeight: 'bold', color: COLORS.text },
});

export default HomeScreen;
