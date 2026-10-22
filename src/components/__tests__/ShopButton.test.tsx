import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ShopButton from '../ShopButton';

// Chương 11 (Bước 8): test như người dùng nhìn thấy — tìm theo chữ trên nút, bấm, xem kết quả
describe('ShopButton', () => {
  it('hiển thị đúng title được truyền vào', async () => {
    await render(<ShopButton title="Xác nhận thanh toán" onPress={() => {}} />);
    expect(screen.getByText('Xác nhận thanh toán')).toBeTruthy();
  });

  it('gọi đúng hàm onPress khi người dùng bấm vào nút', async () => {
    const handlePress = jest.fn();
    await render(<ShopButton title="Đăng nhập ngay" onPress={handlePress} />);

    await fireEvent.press(screen.getByText('Đăng nhập ngay'));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('KHÔNG gọi onPress khi nút đang ở trạng thái disabled', async () => {
    const handlePress = jest.fn();
    await render(<ShopButton title="Đang xử lý" onPress={handlePress} disabled />);

    await fireEvent.press(screen.getByText('Đang xử lý'));

    expect(handlePress).not.toHaveBeenCalled();
  });

  it('đang loading thì ẩn chữ và không cho bấm (chống đặt hàng 2 lần)', async () => {
    const handlePress = jest.fn();
    await render(<ShopButton title="Xác nhận đặt hàng" onPress={handlePress} isLoading />);

    expect(screen.queryByText('Xác nhận đặt hàng')).toBeNull();
    await fireEvent.press(screen.getByRole('button'));
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('có accessibilityLabel mặc định bằng title cho TalkBack/VoiceOver', async () => {
    await render(<ShopButton title="Mua ngay" onPress={() => {}} />);
    expect(screen.getByLabelText('Mua ngay')).toBeTruthy();
  });
});
