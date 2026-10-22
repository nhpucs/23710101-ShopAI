// Chương 11 (Bước 5): hàm định dạng tiền DUY NHẤT của app — tách ra để dùng chung và viết test được.
// Tạo sẵn 1 lần, không new Intl.NumberFormat mỗi lần vẽ (FlashList gọi hàm này rất nhiều).
const vndFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

/** 1500000 -> "1.500.000 ₫" */
export const formatCurrency = (value: number): string => vndFormatter.format(value);
