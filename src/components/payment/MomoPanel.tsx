import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ShopButton from '@components/ShopButton';
import QrCode from '@components/payment/QrCode';
import { COLORS, SIZES } from '@constants/theme';
import { formatVnd } from '@utils/format';

interface Props {
  amount: number;
  reference: string; // Nội dung giao dịch — giúp shop đối soát
  onPaid: () => void;
  isLoading: boolean;
}

// Màn hình quét QR MoMo GIẢ LẬP: mã QR chứa chuỗi mô tả giao dịch, không phải mã MoMo thật
const MomoPanel = ({ amount, reference, onPaid, isLoading }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quét mã bằng ứng dụng MoMo</Text>
      <View style={styles.qrWrap}>
        <QrCode value={`SHOPAI-MOMO-DEMO|${reference}|${amount}`} />
      </View>
      <Text style={styles.amount}>{formatVnd(amount)}</Text>
      <Text style={styles.meta}>Nội dung: {reference}</Text>
      <Text style={styles.hint}>
        Mở MoMo → Quét mã → Xác nhận thanh toán. Xong quay lại đây bấm nút bên dưới.
      </Text>
      <ShopButton
        title="Tôi đã thanh toán trên MoMo"
        onPress={onPaid}
        isLoading={isLoading}
        style={styles.btn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  title: { fontSize: SIZES.body1, fontWeight: '600', color: COLORS.text },
  qrWrap: {
    marginVertical: 16,
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#A50064', // Viền hồng MoMo
  },
  amount: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.primary },
  meta: { fontSize: SIZES.body2, color: COLORS.text, marginTop: 4 },
  hint: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 12,
  },
  btn: { marginTop: 20, backgroundColor: '#A50064' }, // Màu hồng đặc trưng của ví MoMo
});

export default MomoPanel;
