// src/constants/payment.ts — 4 phương thức thanh toán GIẢ LẬP của ShopAI

export type PaymentMethod = 'COD' | 'CARD' | 'MOMO' | 'BANK';

export interface PaymentMethodInfo {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: string; // Tên icon MaterialCommunityIcons (đã kiểm tra có trong glyphmap)
  paysImmediately: boolean; // true = trả xong ngay -> PAID | false = trả sau -> PENDING
}

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'COD',
    label: 'Thanh toán khi nhận hàng (COD)',
    description: 'Trả tiền mặt cho shipper khi nhận hàng',
    icon: 'cash',
    paysImmediately: false,
  },
  {
    id: 'CARD',
    label: 'Thẻ tín dụng / ghi nợ',
    description: 'Visa, Mastercard, JCB',
    icon: 'credit-card-outline',
    paysImmediately: true,
  },
  {
    id: 'MOMO',
    label: 'Ví MoMo',
    description: 'Quét mã QR bằng ứng dụng MoMo',
    icon: 'wallet-outline',
    paysImmediately: true,
  },
  {
    id: 'BANK',
    label: 'Liên kết ngân hàng',
    description: 'Quét mã QR bằng app ngân hàng của bạn',
    icon: 'bank-outline',
    paysImmediately: true,
  },
];

export const getPaymentMethod = (id: PaymentMethod) =>
  PAYMENT_METHODS.find(m => m.id === id) ?? PAYMENT_METHODS[0];

/** Ngân hàng hỗ trợ quét QR (giả lập). color = màu thương hiệu để phân biệt nhanh. */
export const BANKS = [
  { id: 'VCB', name: 'Vietcombank', color: '#007A3D' },
  { id: 'TCB', name: 'Techcombank', color: '#E31837' },
  { id: 'MB', name: 'MB Bank', color: '#1E3A8A' },
  { id: 'BIDV', name: 'BIDV', color: '#006B68' },
  { id: 'CTG', name: 'VietinBank', color: '#005993' },
  { id: 'ACB', name: 'ACB', color: '#1D4F91' },
] as const;

export type BankId = (typeof BANKS)[number]['id'];

export const getBank = (id: string) => BANKS.find(b => b.id === id);

/** Thẻ có 4 số cuối này luôn bị từ chối — để thử nhánh lỗi (giống thẻ test của Stripe). */
export const DECLINED_CARD_SUFFIX = '0002';
