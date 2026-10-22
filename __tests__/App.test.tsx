/**
 * @format
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

// Chương 11: App dựng được đủ Provider (SafeArea, Query, Redux, Theme, Navigation) trong Jest,
// và khi chưa có token trong SecureStore (mock trả null) thì phải vào màn Đăng nhập.
test('mở app khi chưa đăng nhập thì thấy màn Đăng nhập', async () => {
  await render(<App />);

  expect(await screen.findByText('Đăng nhập ngay')).toBeTruthy();
  expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
});
