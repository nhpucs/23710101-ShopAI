import { formatCurrency } from '../formatCurrency';

// Intl của Node chèn khoảng trắng KHÔNG NGẮT (U+00A0) trước "₫" chứ không phải dấu cách thường
// -> chuẩn hoá về dấu cách cho dễ đọc, đúng cảnh báo ở Bước 6 về Intl giữa các môi trường.
const fmt = (value: number) => formatCurrency(value).replace(/\s/g, ' ');

describe('formatCurrency', () => {
  it('định dạng đúng số tiền VND có dấu phân cách hàng nghìn', () => {
    expect(fmt(1500)).toBe('1.500 ₫');
  });

  it('xử lý đúng giá trị 0 đồng', () => {
    expect(fmt(0)).toBe('0 ₫');
  });

  it('xử lý đúng số tiền lớn (sản phẩm giá cao)', () => {
    expect(fmt(64999000)).toBe('64.999.000 ₫');
  });

  it('làm tròn tiền lẻ vì VND không có xu', () => {
    expect(fmt(1999.6)).toBe('2.000 ₫');
  });
});
