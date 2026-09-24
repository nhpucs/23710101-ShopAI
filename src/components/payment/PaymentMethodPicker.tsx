import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PAYMENT_METHODS, PaymentMethod } from '@constants/payment';
import { COLORS, SIZES } from '@constants/theme';

interface Props {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

// 4 dòng kiểu radio — chỉ chọn được ĐÚNG 1 phương thức
const PaymentMethodPicker = ({ value, onChange }: Props) => {
  return (
    <View>
      {PAYMENT_METHODS.map(method => {
        const selected = method.id === value;
        return (
          <Pressable
            key={method.id}
            onPress={() => onChange(method.id)}
            style={[styles.row, selected && styles.rowSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Icon
              name={method.icon}
              size={28}
              color={selected ? COLORS.primary : COLORS.textLight}
            />
            <View style={styles.texts}>
              <Text style={styles.label}>{method.label}</Text>
              <Text style={styles.description}>{method.description}</Text>
            </View>
            <Icon
              name={selected ? 'radiobox-marked' : 'radiobox-blank'}
              size={22}
              color={selected ? COLORS.primary : COLORS.border}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
  },
  rowSelected: { borderColor: COLORS.primary, borderWidth: 2 },
  texts: { flex: 1, marginHorizontal: 12 },
  label: { fontSize: SIZES.body2, fontWeight: '600', color: COLORS.text },
  description: { fontSize: SIZES.small, color: COLORS.textLight, marginTop: 2 },
});

export default PaymentMethodPicker;
