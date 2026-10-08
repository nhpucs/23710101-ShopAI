import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShopButton from '@components/ShopButton';
import { useTheme } from '@contexts/ThemeContext';
import { COLORS, SIZES } from '@constants/theme';

/** Thời lượng khuyến mãi (giây). 90 giây để dễ quay video nghiệm thu. */
const SALE_DURATION_SECONDS = 90;

const formatClock = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Chương 3 — Đồng hồ đếm ngược Flash Sale.
 * Hết giờ thì nút "Mua giá sốc" bị disabled, minh hoạ State điều khiển UI.
 */
const FlashSaleBar = () => {
  const { colors } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(SALE_DURATION_SECONDS);

  useEffect(() => {
    // Hết giờ rồi thì không tạo thêm bộ đếm nữa
    if (secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    // Dọn bộ đếm mỗi lần effect chạy lại / component unmount —
    // thiếu dòng này sẽ có nhiều setInterval chạy chồng nhau, số nhảy loạn.
    return () => clearInterval(id);
  }, [secondsLeft]);

  const isExpired = secondsLeft === 0;

  return (
    <View style={[styles.bar, { backgroundColor: colors.surface }]}>
      <View style={styles.info}>
        <Text style={[styles.label, { color: colors.text }]}>⚡ Flash Sale</Text>
        <Text style={[styles.clock, isExpired && styles.clockExpired]}>
          {isExpired ? 'Đã kết thúc' : `Còn ${formatClock(secondsLeft)}`}
        </Text>
      </View>

      <ShopButton
        title={isExpired ? 'Hết giờ' : 'Mua giá sốc'}
        onPress={() => {}}
        disabled={isExpired}
        style={styles.saleBtn}
        textStyle={styles.saleBtnText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  info: { flex: 1 },
  label: { fontSize: SIZES.body2, fontWeight: '700' },
  clock: {
    fontSize: SIZES.body2,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  clockExpired: { color: COLORS.textLight },
  saleBtn: { width: 120, height: 32 },
  saleBtnText: { fontSize: 12 },
});

export default FlashSaleBar;
