import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from '@store/redux/cartSlice';
import type { ReduxRootState } from '@store/redux/store';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';

// Sản phẩm mẫu để bấm thử — module này CHỈ dùng cho bài tập đề cương,
// KHÔNG liên quan gì tới Cart Production (Zustand) ở CartScreen.
const DEMO_PRODUCTS = [
  {
    id: 'rtk_1',
    name: 'RTK Demo - Bàn phím cơ',
    price: 990000,
    image: 'https://picsum.photos/id/1/400/400',
  },
  {
    id: 'rtk_2',
    name: 'RTK Demo - Chuột không dây',
    price: 450000,
    image: 'https://picsum.photos/id/2/400/400',
  },
];

const ReduxCartDemoScreen = () => {
  // useSelector: ĐỌC dữ liệu từ Redux Store
  const items = useSelector((state: ReduxRootState) => state.cartRedux.items);
  // useDispatch: GỬI Action lên Redux Store
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>
          [Demo Bắt Buộc Đề Cương] Redux Toolkit Cart
        </Text>
        <Text style={styles.note}>
          Store này chạy SONG SONG với Zustand — không thay thế Giỏ hàng thật.
        </Text>

        <View style={styles.addRow}>
          {DEMO_PRODUCTS.map(p => (
            <ShopButton
              key={p.id}
              title={`+ ${p.id}`}
              onPress={() => dispatch(addItem(p))}
              style={styles.addBtn}
              textStyle={styles.addBtnText}
            />
          ))}
        </View>

        <FlatList
          data={items}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Chưa có gì. Bấm nút "+" ở trên để dispatch(addItem).
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowText}>
                {item.name} x {item.quantity}
              </Text>
              <ShopButton
                title="Xóa"
                onPress={() => dispatch(removeItem(item.id))}
                style={styles.removeBtn}
                textStyle={styles.addBtnText}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SIZES.padding },
  title: { fontSize: SIZES.h3, fontWeight: 'bold', marginBottom: 4 },
  note: { fontSize: SIZES.small, color: COLORS.textLight, marginBottom: 16 },
  addRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  addBtn: { flex: 1, height: 36 },
  addBtnText: { fontSize: 12 },
  removeBtn: { width: 70, height: 32, backgroundColor: COLORS.error },
  empty: { color: COLORS.textLight, textAlign: 'center', marginTop: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowText: { flex: 1, color: COLORS.text },
});

export default ReduxCartDemoScreen;
