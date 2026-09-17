import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '@store/useCartStore';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);

const CartScreen = ({ navigation }: any) => {
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const totalPrice = useCartStore(state => state.totalPrice());

  // TRẠNG THÁI TRỐNG (Empty State) — không bao giờ để người dùng nhìn màn hình trắng vô hồn
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống trơn!</Text>
          <ShopButton
            title="Quay về mua sắm"
            onPress={() => navigation.goBack()}
            style={styles.emptyBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.price)} x {item.quantity}
              </Text>
            </View>
            <ShopButton
              title="Xóa"
              onPress={() => removeItem(item.id)}
              style={styles.removeBtn}
              textStyle={styles.removeBtnText}
            />
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>
          Tổng cộng:{' '}
          <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
        </Text>
        {/* Checkout nằm ở tầng RootStackNavigator — React Navigation tự "nổi bọt" lên tầng cha để tìm */}
        <ShopButton
          title="Thanh toán"
          onPress={() => navigation.navigate('Checkout')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  emptyIcon: { fontSize: 60, marginBottom: 10 },
  emptyText: {
    fontSize: SIZES.body1,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  emptyBtn: { marginTop: 20 },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
    backgroundColor: COLORS.surface,
  },
  headerTitle: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.text },
  listContent: { padding: SIZES.padding },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 10,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: SIZES.body2, color: COLORS.text, fontWeight: '500' },
  itemPrice: { fontSize: SIZES.body2, color: COLORS.primary, marginTop: 4 },
  removeBtn: { width: 70, height: 32, backgroundColor: COLORS.error },
  removeBtnText: { fontSize: 12 },
  footer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: { fontSize: SIZES.body1, color: COLORS.text, marginBottom: 10 },
  totalValue: { fontWeight: 'bold', color: COLORS.primary },
});

export default CartScreen;
