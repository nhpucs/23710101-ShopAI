/** Định dạng tiền Việt: 1500000 -> "1.500.000 ₫" */
export const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    value,
  );
