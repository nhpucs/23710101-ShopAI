import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@store/useAuthStore';
import { getMyOrders } from '@services/orderService';
import { getServerErrorMessage } from '@utils/serverError';
import { COLORS, SIZES } from '@constants/theme';
import { formatCurrency } from '@utils/formatCurrency';

const OrdersScreen = () => {
  const navigation = useNavigation<any>();
  const token = useAuthStore(s => s.token);

  // Ch.9 Bước 9f: lịch sử đơn lấy từ Server (GET /api/orders, lọc theo JWT) thay cho useOrderStore.
  // Gắn token vào queryKey: đổi tài khoản là ô cache khác, không hiện nhầm đơn của người trước.
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['orders', token],
    queryFn: getMyOrders,
    enabled: !!token,
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Đơn hàng của tôi</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : isError ? (
        <View style={styles.empty}>
          <Text style={styles.errorText}>
            {getServerErrorMessage(error, 'Không tải được danh sách đơn hàng')}
          </Text>
          <Pressable onPress={() => refetch()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={orders.length === 0 ? styles.emptyList : styles.listContent}
          // Kéo xuống để tải lại từ Server
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có đơn nào. Hãy đặt hàng từ Giỏ.</Text>
          }
          renderItem={({ item }) => (
            // OrderDetail nằm ở tầng RootStackNavigator — navigate tự nổi bọt lên tầng cha
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            >
              <Text style={styles.orderId}>{item.id}</Text>
              <Text style={styles.meta}>
                {formatCurrency(item.total)} · {item.status}
              </Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: COLORS.primary,
    padding: SIZES.padding,
  },
  loader: { marginTop: 40 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyList: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  emptyText: { color: COLORS.textLight, textAlign: 'center' },
  errorText: { color: COLORS.error, textAlign: 'center' },
  retryBtn: { marginTop: 12, padding: 8 },
  retryText: { color: COLORS.primary, fontWeight: '700' },
  listContent: { padding: SIZES.padding },
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  orderId: { fontWeight: '700', fontSize: SIZES.body1, color: COLORS.text },
  meta: { marginTop: 4, color: COLORS.primary, fontWeight: '600' },
  date: { marginTop: 4, color: COLORS.textLight, fontSize: SIZES.body2 },
});

export default OrdersScreen;
