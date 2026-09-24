import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ShopButton from '@components/ShopButton';
import PaymentMethodPicker from '@components/payment/PaymentMethodPicker';
import CardForm, { CardData } from '@components/payment/CardForm';
import MomoPanel from '@components/payment/MomoPanel';
import BankQrPanel from '@components/payment/BankQrPanel';
import { useCartStore, CartItem } from '@store/useCartStore';
import { useOrderStore, PaymentStatus } from '@store/useOrderStore';
import {
  BankId,
  DECLINED_CARD_SUFFIX,
  PaymentMethod,
  getBank,
  getPaymentMethod,
} from '@constants/payment';
import { COLORS, SIZES } from '@constants/theme';
import { formatVnd } from '@utils/format';
import { hapticError, hapticSuccess } from '@utils/haptics';

interface CreateOrderPayload {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  card?: CardData; // Chỉ có khi trả bằng thẻ — KHÔNG bao giờ lưu vào store
}

interface CreateOrderResponse {
  orderId: string;
  status: PaymentStatus;
}

// Lỗi riêng cho thẻ bị ngân hàng từ chối — để UI báo đúng lý do (giống 2 loại lỗi ở HomeScreen Ch.6)
class PaymentDeclinedError extends Error {}

// Ch.6: giả lập Server. Nay nhận thêm phương thức thanh toán:
// Thẻ/MoMo trả xong ngay -> PAID | COD/Ngân hàng trả sau -> PENDING
// Ch.9 Bước 9c: đổi thành axiosClient.post('/orders', payload) — CẤU TRÚC gọi không đổi.
const createOrderLocal = async (
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 1200));

  if (payload.card?.number.endsWith(DECLINED_CARD_SUFFIX)) {
    throw new PaymentDeclinedError('Thẻ bị ngân hàng từ chối');
  }

  const { paysImmediately } = getPaymentMethod(payload.paymentMethod);
  return {
    orderId: payload.orderId,
    status: paysImmediately ? 'PAID' : 'PENDING',
  };
};

// Mã đơn tạo 1 lần khi mở Checkout — dùng luôn làm "nội dung chuyển khoản" MoMo/Ngân hàng
const newOrderId = () => `ORD-${Date.now()}`;

type Step = 'select' | 'pay';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const items = useCartStore(state => state.items);
  const totalQuantity = useCartStore(state => state.totalQuantity());
  const totalPrice = useCartStore(state => state.totalPrice());
  const clearCart = useCartStore(state => state.clearCart);
  const addOrder = useOrderStore(state => state.addOrder);

  const [step, setStep] = useState<Step>('select');
  const [method, setMethod] = useState<PaymentMethod>('COD');
  const [bankId, setBankId] = useState<BankId | null>(null); // Chỉ dùng khi method = 'BANK'
  const [orderId] = useState(newOrderId);

  // useMutation: hành động GHI dữ liệu — CHỈ chạy khi ta gọi mutate(), không tự động như useQuery
  const { mutate, isPending, isError, error, isSuccess, data, reset } =
    useMutation({
      mutationFn: createOrderLocal,

      // onSuccess: chạy SAU KHI "Server" xác nhận đặt hàng thành công
      onSuccess: res => {
        addOrder({
          id: res.orderId,
          items: [...items],
          total: totalPrice,
          status: res.status,
          createdAt: new Date().toISOString(),
          paymentMethod: method,
          paymentBank: method === 'BANK' && bankId ? getBank(bankId)?.name : undefined,
        });
        if (res.status === 'PAID') hapticSuccess(); // 📳 Tiện ích rung Ch.7
        clearCart(); // Giỏ hàng xóa sạch — persist cũng tự xóa theo
        // Đơn mới có thể ảnh hưởng tồn kho -> đánh dấu Cache sản phẩm là "Thiu" (Stale)
        queryClient.invalidateQueries({ queryKey: ['productsInfinite'] });
        setTimeout(() => navigation.goBack(), 2500); // Đóng Modal sau 2.5s
      },

      // onError: thẻ bị từ chối / mất mạng — KHÔNG xóa giỏ hàng, cho thử lại
      onError: err => {
        hapticError();
        console.error('❌ Thanh toán thất bại:', err);
      },
    });

  const submit = (card?: CardData) => {
    mutate({ orderId, items, totalPrice, paymentMethod: method, card });
  };

  const backToSelect = () => {
    reset(); // Xóa lỗi cũ khi đổi phương thức
    setStep('select');
  };

  // ---------- Màn hình kết quả ----------
  if (isSuccess && data) {
    const paid = data.status === 'PAID';
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.center}>
          <Text style={styles.successIcon}>{paid ? '✅' : '🕒'}</Text>
          <Text style={styles.successText}>
            {paid ? 'Thanh toán thành công!' : 'Đặt hàng thành công!'}
          </Text>
          <Text style={styles.orderMeta}>Mã đơn: {data.orderId}</Text>
          <Text style={styles.orderMeta}>
            Phương thức: {getPaymentMethod(method).label}
            {method === 'BANK' && bankId ? ` (${getBank(bankId)?.name})` : ''}
          </Text>
          <Text style={styles.orderMeta}>
            Trạng thái:{' '}
            {paid ? 'PAID (đã thanh toán)' : 'PENDING (trả tiền khi nhận hàng)'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const errorMessage =
    error instanceof PaymentDeclinedError
      ? `💳 Thẻ bị từ chối — thử thẻ khác hoặc đổi phương thức. (Thẻ có đuôi ${DECLINED_CARD_SUFFIX} luôn bị từ chối để demo.)`
      : 'Thanh toán thất bại — vui lòng kiểm tra mạng và thử lại!';

  return (
    // edges bottom: phía trên đã có header "Thanh toán" của Stack, không cần chừa tai thỏ nữa
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {step === 'select' ? 'Xác nhận đơn hàng' : 'Hoàn tất thanh toán'}
        </Text>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Số lượng sản phẩm</Text>
          <Text style={styles.value}>{totalQuantity}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatVnd(totalPrice)}</Text>
        </View>

        {/* ===== BƯỚC 1: chọn phương thức ===== */}
        {step === 'select' && (
          <>
            <Text style={styles.section}>Phương thức thanh toán</Text>
            <PaymentMethodPicker value={method} onChange={setMethod} />
            <ShopButton
              title="Tiếp tục"
              onPress={() => setStep('pay')}
              disabled={totalQuantity === 0}
              style={styles.confirmBtn}
            />
          </>
        )}

        {/* ===== BƯỚC 2: trả tiền theo phương thức đã chọn ===== */}
        {step === 'pay' && (
          <>
            <Pressable onPress={backToSelect} disabled={isPending}>
              <Text style={styles.changeMethod}>
                ← {getPaymentMethod(method).label} (đổi phương thức)
              </Text>
            </Pressable>

            {/* isError: hiện khi mutation thất bại — KHÔNG rời màn hình, cho thử lại */}
            {isError && <Text style={styles.errorText}>{errorMessage}</Text>}

            {method === 'COD' && (
              <>
                <Text style={styles.note}>
                  Bạn sẽ trả {formatVnd(totalPrice)} tiền mặt cho shipper khi nhận hàng.
                </Text>
                <ShopButton
                  title="Xác nhận đặt hàng"
                  onPress={() => submit()}
                  isLoading={isPending}
                  style={styles.confirmBtn}
                />
              </>
            )}

            {method === 'CARD' && (
              <CardForm onSubmit={card => submit(card)} isLoading={isPending} />
            )}

            {method === 'MOMO' && (
              <MomoPanel
                amount={totalPrice}
                reference={orderId}
                onPaid={() => submit()}
                isLoading={isPending}
              />
            )}

            {method === 'BANK' && (
              <BankQrPanel
                amount={totalPrice}
                reference={orderId}
                bankId={bankId}
                onSelectBank={setBankId}
                onPaid={() => submit()}
                isLoading={isPending}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding, paddingBottom: 40 },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: { fontSize: SIZES.body1, color: COLORS.textLight },
  value: { fontSize: SIZES.body1, color: COLORS.text, fontWeight: '600' },
  totalValue: { fontSize: SIZES.h2, color: COLORS.primary, fontWeight: 'bold' },
  section: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  changeMethod: {
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 16,
  },
  note: { fontSize: SIZES.body1, color: COLORS.text, lineHeight: 22 },
  confirmBtn: { marginTop: 32 },
  errorText: { color: COLORS.error, textAlign: 'center', marginBottom: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successIcon: { fontSize: 60, marginBottom: 12 },
  successText: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 12,
  },
  orderMeta: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default CheckoutScreen;
