import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';
import ShopInput from '@components/ui/ShopInput';
import ShopButton from '@components/ShopButton';

// Zod gác cổng form thẻ — cùng ý tưởng "trạm kiểm soát" đã dùng cho dữ liệu sản phẩm ở Ch.6
const CardSchema = z.object({
  number: z
    .string()
    .transform(s => s.replace(/\s/g, ''))
    .pipe(z.string().regex(/^\d{16}$/, 'Số thẻ phải gồm 16 chữ số')),
  holder: z.string().trim().min(3, 'Nhập tên in trên thẻ'),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Định dạng MM/YY, ví dụ 08/28'),
  cvv: z.string().regex(/^\d{3}$/, 'CVV gồm 3 chữ số'),
});

export type CardData = z.infer<typeof CardSchema>;
type CardErrors = Partial<Record<keyof CardData, string>>;

interface Props {
  onSubmit: (card: CardData) => void;
  isLoading: boolean;
}

// Tự chèn dấu cách mỗi 4 số: "4111111111111111" -> "4111 1111 1111 1111"
const formatCardNumber = (text: string) =>
  text
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

// Tự chèn dấu "/" sau 2 số tháng: "0828" -> "08/28"
const formatExpiry = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const CardForm = ({ onSubmit, isLoading }: Props) => {
  const [number, setNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<CardErrors>({});

  const handleSubmit = () => {
    const result = CardSchema.safeParse({ number, holder, expiry, cvv });
    if (!result.success) {
      // Gom lỗi theo từng ô để hiện NGAY DƯỚI ô bị sai
      const next: CardErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CardData;
        if (!next[field]) next[field] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    onSubmit(result.data);
  };

  return (
    <View>
      <ShopInput
        label="Số thẻ"
        placeholder="4111 1111 1111 1111"
        keyboardType="number-pad"
        value={number}
        onChangeText={t => setNumber(formatCardNumber(t))}
        error={errors.number}
      />
      <ShopInput
        label="Tên chủ thẻ"
        placeholder="NGUYEN VAN A"
        autoCapitalize="characters"
        value={holder}
        onChangeText={setHolder}
        error={errors.holder}
      />
      <View style={styles.row}>
        <ShopInput
          label="Hết hạn"
          placeholder="MM/YY"
          keyboardType="number-pad"
          value={expiry}
          onChangeText={t => setExpiry(formatExpiry(t))}
          error={errors.expiry}
          containerStyle={styles.half}
        />
        <ShopInput
          label="CVV"
          placeholder="123"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={3}
          value={cvv}
          onChangeText={setCvv}
          error={errors.cvv}
          containerStyle={styles.half}
        />
      </View>
      <ShopButton title="Thanh toán" onPress={handleSubmit} isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});

export default CardForm;
