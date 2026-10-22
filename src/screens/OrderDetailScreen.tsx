import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ShopButton from '@components/ShopButton';
import { useOrderStore } from '@store/useOrderStore';
import { useAuthStore } from '@store/useAuthStore';
import { getOrderById, payOrder } from '@services/orderService';
import { fetchAllProducts } from '@services/productService';
import { COLORS, SIZES } from '@constants/theme';
import { RootStackParamList } from '@navigation/RootStackNavigator';
import { PaymentMethod, getPaymentMethod } from '@constants/payment';
import { hapticError, hapticSuccess } from '@utils/haptics';
import { getServerErrorMessage } from '@utils/serverError';
import { formatCurrency } from '@utils/formatCurrency';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

// Chữ trên nút chuyển PENDING -> PAID, tuỳ phương thức. DEFAULT cho đơn không rõ phương thức
const PAY_BUTTON_TITLE: Record<PaymentMethod | 'DEFAULT', string> = {
  COD: 'Đã nhận hàng & trả tiền (→ PAID)',
  BANK: 'Thanh toán giả lập (→ PAID)',
  CARD: 'Thanh toán giả lập (→ PAID)',
  MOMO: 'Thanh toán giả lập (→ PAID)',
  DEFAULT: 'Thanh toán giả lập (→ PAID)',
};

const OrderDetailScreen = ({ route }: Props) => {
  const { orderId } = route.params;
  const queryClient = useQueryClient();
  const token = useAuthStore(s => s.token);

  // Ch.9 Bước 9f: hoá đơn lấy từ Server (GET /api/orders/:id) thay cho useOrderStore
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', orderId, token],
    queryFn: () => getOrderById(orderId),
    enabled: !!token,
  });

  // Server chỉ lưu productId + giá snapshot -> tra TÊN sản phẩm trong danh sách của Server
  const { data: products = [] } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: fetchAllProducts,
  });
  const nameOf = (productId: string) =>
    products.find(p => p.id === productId)?.name ?? `Sản phẩm #${productId}`;

  // Phương thức thanh toán Server không lưu -> đọc ghi chú lưu trong máy lúc đặt hàng (nếu có)
  const localNote = useOrderStore(s => s.getById(orderId));
  const method = localNote?.paymentMethod ? getPaymentMethod(localNote.paymentMethod) : undefined;

  // POST /api/orders/:id/pay — PENDING -> PAID trên Server, rồi làm mới cache liên quan
  const payMutation = useMutation({
    mutationFn: () => payOrder(orderId),
    onSuccess: () => {
      hapticSuccess();
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => hapticError(),
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>
          {getServerErrorMessage(error, `Không tìm thấy đơn ${orderId}`)}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Hóa đơn</Text>
        <Text style={styles.row}>Mã: {order.id}</Text>
        <Text style={styles.row}>Trạng thái: {order.status}</Text>
        {method && (
          <Text style={styles.row}>
            Phương thức: {method.label}
            {localNote?.paymentBank ? ` (${localNote.paymentBank})` : ''}
          </Text>
        )}
        <Text style={styles.row}>Ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}</Text>

        <Text style={[styles.heading, styles.headingSpaced]}>Chi tiết</Text>
        {order.items.map(it => (
          <View key={it.productId} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {nameOf(it.productId)} × {it.quantity}
            </Text>
            {/* Giá SNAPSHOT lúc đặt hàng — đổi giá sau này không làm sai hoá đơn cũ */}
            <Text>{formatCurrency(it.price * it.quantity)}</Text>
          </View>
        ))}

        <Text style={styles.total}>Tổng: {formatCurrency(order.total)}</Text>

        {payMutation.isError && (
          <Text style={styles.errorText}>
            {getServerErrorMessage(payMutation.error, 'Thanh toán thất bại, vui lòng thử lại')}
          </Text>
        )}

        {order.status === 'PENDING' ? (
          <ShopButton
            title={PAY_BUTTON_TITLE[localNote?.paymentMethod ?? 'DEFAULT']}
            onPress={() => payMutation.mutate()}
            isLoading={payMutation.isPending}
            style={styles.payBtn}
          />
        ) : (
          <Text style={styles.paidNote}>Đã thanh toán ✓</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding },
  loader: { marginTop: 40 },
  heading: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  headingSpaced: { marginTop: 20 },
  row: { marginBottom: 4, color: COLORS.text },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemName: { flex: 1 },
  total: {
    marginTop: 16,
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.text,
  },
  errorText: { marginTop: 16, color: COLORS.error, textAlign: 'center' },
  payBtn: { marginTop: 24 },
  paidNote: {
    marginTop: 24,
    color: COLORS.success,
    fontWeight: '700',
    textAlign: 'center',
  },
  missing: { padding: 24, color: COLORS.textLight },
});

export default OrderDetailScreen;
