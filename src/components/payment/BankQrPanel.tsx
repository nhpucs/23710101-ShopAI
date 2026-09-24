import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ShopButton from '@components/ShopButton';
import QrCode from '@components/payment/QrCode';
import { BANKS, BankId, getBank } from '@constants/payment';
import { COLORS, SIZES } from '@constants/theme';
import { formatVnd } from '@utils/format';

interface Props {
  amount: number;
  reference: string; // Nội dung giao dịch
  bankId: BankId | null;
  onSelectBank: (id: BankId) => void;
  onPaid: () => void;
  isLoading: boolean;
}

// Liên kết ngân hàng GIẢ LẬP: chọn ngân hàng -> quét QR bằng app ngân hàng đó -> xác nhận
const BankQrPanel = ({
  amount,
  reference,
  bankId,
  onSelectBank,
  onPaid,
  isLoading,
}: Props) => {
  const bank = bankId ? getBank(bankId) : undefined;

  return (
    <View>
      <Text style={styles.title}>Chọn ngân hàng của bạn</Text>
      <View style={styles.grid}>
        {BANKS.map(b => {
          const selected = b.id === bankId;
          return (
            <Pressable
              key={b.id}
              onPress={() => onSelectBank(b.id)}
              style={[
                styles.bankChip,
                selected && { borderColor: b.color, backgroundColor: `${b.color}14` },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <View style={[styles.bankDot, { backgroundColor: b.color }]} />
              <Text style={[styles.bankName, selected && { color: b.color }]}>
                {b.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {bank ? (
        <View style={styles.qrSection}>
          <Text style={styles.subtitle}>Quét mã bằng app {bank.name}</Text>
          <View style={[styles.qrWrap, { backgroundColor: bank.color }]}>
            <QrCode value={`SHOPAI-BANK-DEMO|${bank.id}|${reference}|${amount}`} />
          </View>
          <Text style={styles.amount}>{formatVnd(amount)}</Text>
          <Text style={styles.meta}>Nội dung: {reference}</Text>
          <Text style={styles.hint}>
            Mở app {bank.name} → Quét QR → Xác nhận thanh toán. Xong quay lại đây bấm
            nút bên dưới.
          </Text>
          <ShopButton
            title={`Tôi đã thanh toán trên ${bank.name}`}
            onPress={onPaid}
            isLoading={isLoading}
            style={[styles.btn, { backgroundColor: bank.color }]}
          />
        </View>
      ) : (
        <Text style={styles.pickHint}>Chọn 1 ngân hàng để hiện mã QR thanh toán.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: SIZES.body1, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bankChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
  },
  bankDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  bankName: { fontSize: SIZES.body2, fontWeight: '600', color: COLORS.text },
  pickHint: { fontSize: SIZES.small, color: COLORS.textLight, marginTop: 16, textAlign: 'center' },
  qrSection: { alignItems: 'center', marginTop: 20 },
  subtitle: { fontSize: SIZES.body1, fontWeight: '600', color: COLORS.text },
  qrWrap: { marginVertical: 16, padding: 6, borderRadius: 12 },
  amount: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.primary },
  meta: { fontSize: SIZES.body2, color: COLORS.text, marginTop: 4 },
  hint: { fontSize: SIZES.small, color: COLORS.textLight, textAlign: 'center', marginTop: 12 },
  btn: { marginTop: 20 },
});

export default BankQrPanel;
