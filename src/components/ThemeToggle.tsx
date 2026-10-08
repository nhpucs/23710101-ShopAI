import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

/**
 * Chương 3 — Nút chuyển Sáng/Tối.
 * Không giữ state riêng: toàn bộ trạng thái nằm ở ThemeContext, nên mọi màn hình
 * dùng useTheme() đều đổi màu cùng lúc mà không cần truyền props xuống.
 */
const ThemeToggle = () => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Chuyển sang nền Sáng' : 'Chuyển sang nền Tối'}
      style={[styles.btn, { backgroundColor: colors.surface }]}
    >
      <Text style={styles.icon}>{isDark ? '☀️' : '🌙'}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 16 },
});

export default ThemeToggle;
