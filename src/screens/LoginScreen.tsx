import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import ShopButton from "@components/ShopButton";
import ShopInput from "@components/ui/ShopInput";
import { COLORS, SIZES } from "@constants/theme";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@store/useAuthStore";
import axiosClient from "@api/axiosClient"; // ➕ Ch.9 Bước 9d
import { getServerErrorMessage } from "@utils/serverError";


const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null); // ➕ Ch.9: lỗi từ Server (sai mật khẩu...)

  // Validate đơn giản: Email phải chứa @, Mật khẩu tối thiểu 6 ký tự
  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.includes("@")) next.email = "Email không hợp lệ (phải chứa @)";
    if (password.length < 6) next.password = "Mật khẩu phải có ít nhất 6 ký tự";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Ch.9 Bước 9d: đăng nhập THẬT — POST /api/auth/login trả JWT ký bằng JWT_SECRET (Bước 7e).
  // Token giả của Ch.6 giờ luôn bị JwtAuthGuard từ chối (401).
  const handleLogin = async () => {
    if (!validate()) return; // Validate phía Client GIỮ NGUYÊN — chặn sớm trước khi tốn 1 request
    setLoading(true);
    setServerError(null);
    try {
      const response = await axiosClient.post<{ accessToken: string }>("/api/auth/login", {
        email: email.trim(),
        password,
      });
      await login(response.data.accessToken); // Token THẬT -> SecureStore -> App.tsx tự đổi sang Main
    } catch (error) {
      // 401 từ AuthService: "Email hoặc mật khẩu không đúng"
      setServerError(getServerErrorMessage(error, "Đăng nhập thất bại, vui lòng thử lại"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ShopAI</Text>
      <Text style={styles.subtitle}>Vui lòng đăng nhập để tiếp tục</Text>

      <ShopInput
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <ShopInput
        label="Mật khẩu"
        placeholder="Ít nhất 6 ký tự"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
      />

      {serverError && <Text style={styles.errorText}>⚠️ {serverError}</Text>}

      <ShopButton
        title="Đăng nhập ngay"
        onPress={handleLogin}
        isLoading={loading}
        style={styles.loginBtn}
      />

      <Pressable onPress={() => navigation.navigate("Register")} style={styles.registerLink}>
        <Text style={styles.registerLinkText}>
          Chưa có tài khoản?{" "}
          <Text style={styles.registerLinkBold}>Đăng ký</Text>
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: SIZES.padding,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: SIZES.body1,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 32,
  },
  loginBtn: { marginTop: 8 },
  errorText: { color: COLORS.error, textAlign: "center", marginBottom: 12 },
  registerLink: { marginTop: 20, alignItems: "center" },
  registerLinkText: { fontSize: SIZES.body2, color: COLORS.textLight },
  registerLinkBold: { color: COLORS.primary, fontWeight: "700" },
});

export default LoginScreen;
