# HƯỚNG DẪN SPRINT 5 — Auth Flow, Bottom Tab, ProductDetail, Deep Link

> Giáo trình: https://thayduy.github.io/react-native-thuc-chien/docs/CHUONG_5_LT_MOI
> (mục **"THỰC CHIẾN SHOPAI (SPRINT 5)"** — code đầy đủ từng file nằm ở đó)
>
> 📸 = **CHỤP MÀN HÌNH cho báo cáo** (giống báo cáo mẫu).
> Mẹo chụp: `Win + Shift + S`. Ảnh code: mở file trong VS Code, **để thấy cây thư mục bên trái + tên file trên tab + Terminal bên dưới** như báo cáo mẫu.

---

## ✅ ĐÃ LÀM SẴN (nền Chương 2–4) — bạn KHÔNG cần làm lại

| File / cấu hình | Chương |
|---|---|
| `babel.config.js` + `tsconfig.json` (Path Alias `@components`, `@screens`, `@navigation`, `@data`, `@constants`, `@contexts`...) | Ch2 |
| `src/constants/theme.ts` (COLORS, SIZES, FONTS) | Ch3 |
| `src/components/ui/Typography.tsx`, `src/components/ui/ShopInput.tsx`, `src/components/ShopButton.tsx` | Ch3 |
| `src/contexts/ThemeContext.tsx` | Ch3 |
| `@shopify/flash-list` v2, `react-native-reanimated` v4 (+ `react-native-worklets`) | Ch4 |
| `src/data/mockProducts.ts`, `src/components/ProductCard.tsx` | Ch4 |
| `src/screens/HomeScreen.tsx` (FlashList 2 cột + pull-to-refresh) | Ch4 |
| `App.tsx` bọc `SafeAreaProvider` + `ThemeProvider` | Ch4 |
| Demo cũ chuyển vào `src/screens/demos/` | Ch2 |

**Đường dẫn import đúng trong project này** (giống giáo trình):
- `import ShopButton from "@components/ShopButton";`
- `import ShopInput from "@components/ui/ShopInput";`
- `import ProductCard from "@components/ProductCard";`

---

## PHẦN 1: CẤU HÌNH

### B1: Cài React Navigation V7 + Bottom Tabs
Mở Terminal trong VS Code (thư mục `ShopAI`), chạy:
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```
📸 **Chụp 1:** Terminal sau khi cài xong (thấy lệnh `npm install ...` và dòng `added ... packages`).

### B2: Nâng cấp LoginScreen dùng ShopInput
Tạo `src/screens/LoginScreen.tsx` → gõ theo **Bước 2** giáo trình.
📸 **Chụp 2:** file `LoginScreen.tsx` đang mở (thấy phần `validate` hoặc phần `styles` + `export default LoginScreen`).

### B2.5: Tạo RegisterScreen
Tạo `src/screens/RegisterScreen.tsx` → gõ theo **Bước 2.5**.
📸 **Chụp 3:** file `RegisterScreen.tsx` đang mở.

### B3: Tạo ProductDetailScreen
Tạo `src/screens/ProductDetailScreen.tsx` → gõ theo **Bước 3**.
📸 **Chụp 4:** file `ProductDetailScreen.tsx` — cố để thấy dòng `const { productId } = route.params;` và `MOCK_PRODUCTS.find(...)`.

### B4: Tạo HomeStackNavigator
Tạo `src/navigation/HomeStackNavigator.tsx` → gõ theo **Bước 4**.
📸 **Chụp 5:** file `HomeStackNavigator.tsx` — thấy `export type HomeStackParamList`.

### B4.5: Cài Icon cho Bottom Tab
```bash
npm install react-native-vector-icons
npm install --save-dev @types/react-native-vector-icons
```
Mở `android/app/build.gradle`, thêm vào **DÒNG CUỐI CÙNG** của file:
```groovy
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```
(Có cảnh báo `deprecated` khi cài là bình thường, vẫn dùng được.)
📸 *(Báo cáo mẫu chỉ ghi "Đã cài")* — nên chụp thêm cuối file `build.gradle` có dòng `apply from` cho chắc.

### B5: Tạo CartScreen + MainTabNavigator
- Tạo `src/screens/CartScreen.tsx` → **Bước 5** (phần 1).
- Tạo `src/navigation/MainTabNavigator.tsx` → **Bước 5** (phần 2).

📸 **Chụp 6:** file `CartScreen.tsx`.
📸 **Chụp 7:** file `MainTabNavigator.tsx` — thấy `tabBarIcon` (`home-variant-outline`).

### B6: Cập nhật HomeScreen bấm vào sản phẩm
⚠️ **KHÔNG xóa file cũ rồi dán đè!** `HomeScreen.tsx` hiện đã có `products`, `refreshing`, `handleRefresh`. Chỉ **THÊM**:
1. Import:
   ```tsx
   import { Pressable } from "react-native";            // thêm vào import react-native có sẵn
   import { useNavigation } from "@react-navigation/native";
   import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
   import ShopButton from "@components/ShopButton";
   import type { HomeStackParamList } from "@navigation/HomeStackNavigator";

   type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, "Home">;
   ```
2. Đổi `const HomeScreen = () => {` thành `const HomeScreen = ({ onLogout }: { onLogout: () => void }) => {` và thêm dòng `const navigation = useNavigation<HomeNavProp>();`
3. Trong header, thêm nút Thoát sau `<Text>Khám phá</Text>`:
   ```tsx
   <ShopButton title="Thoát" onPress={onLogout}
     style={{ width: 80, height: 32, backgroundColor: COLORS.textLight }} />
   ```
   và sửa style `header` thêm: `flexDirection: "row", justifyContent: "space-between", alignItems: "center"`.
4. Sửa `renderItem`:
   ```tsx
   renderItem={({ item }) => (
     <Pressable
       style={{ flex: 1 }}   // bắt buộc với numColumns={2}, không thì card bị lệch
       onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
     >
       <ProductCard product={item} />
     </Pressable>
   )}
   ```
5. **GIỮ NGUYÊN** `data={products}`, `refreshing={refreshing}`, `onRefresh={handleRefresh}`.
6. **KHÔNG** thêm `estimatedItemSize` (FlashList v2 đã bỏ prop này).

📸 **Chụp 8:** file `HomeScreen.tsx` — thấy đoạn `<Pressable ... navigation.navigate("ProductDetail", { productId: item.id })`.

### B7: Cấu hình tối thượng tại App.tsx
Thay nội dung `App.tsx` theo **Bước 7** (giữ `SafeAreaProvider` + `ThemeProvider`, thêm `NavigationContainer linking`, `AuthStack`, `MainTabNavigator cartBadgeCount={2}`).
📸 **Chụp 9:** file `App.tsx` — thấy đoạn `AuthStack.Screen name="Register"` và `<MainTabNavigator ... cartBadgeCount={2} />`.

### B7b & B8: Deep Linking Native + Build App
Mở `android/app/src/main/AndroidManifest.xml`, bên trong `<activity android:name=".MainActivity" ...>`, **sau** `<intent-filter>` MAIN/LAUNCHER có sẵn (GIỮ NGUYÊN cái đó), thêm:
```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="shopai" />
</intent-filter>
```
📸 **Chụp 10:** file `AndroidManifest.xml` — thấy cả 2 `intent-filter`.

**Build lại app (máy Windows này — làm đúng thứ tự):**
```powershell
# 1) Mở emulator Pixel_6 trước (Android Studio > Device Manager > ▶)
# 2) Build + cài app (KHÔNG dùng npm run android — trên máy này hay lỗi gradlew.bat)
cd android; .\gradlew.bat app:installDebug -PreactNativeDevServerPort=8081; cd ..
# 3) Build XONG mới chạy Metro (chạy song song Metro sẽ crash)
npm start -- --reset-cache
# 4) Mở app trên emulator (hoặc bấm icon ShopAI), nếu màn trắng thì bấm "r" trong cửa sổ Metro
adb shell am start -n com.shopai/.MainActivity
```

---

## PHẦN 2: BUILD APP (Nghiệm thu) — chụp màn hình EMULATOR

| # | Làm gì trên app | 📸 Chụp |
|---|---|---|
| **Nghiệm thu 1** | Mở app → đang ở màn Login (chưa đăng nhập) | 📸 **Chụp 11:** màn **ShopAI – Vui lòng đăng nhập** (có ô Email, Mật khẩu, nút Đăng nhập ngay, link Đăng ký) |
| **Nghiệm thu 2** | Bấm **Đăng ký** → điền Họ tên (tên bạn), Email, Mật khẩu, Xác nhận | 📸 **Chụp 12:** màn **Tạo tài khoản** đã điền form. *(Nên chụp thêm 1 ảnh bấm Đăng ký khi để trống → hiện lỗi đỏ, chứng minh có validate)* |
| **Nghiệm thu 3** | Bấm **Đăng ký ngay** → vào Home | 📸 **Chụp 13:** Home **Khám phá** + nút **Thoát** + Tab dưới có icon **Trang chủ** & **Giỏ hàng** có badge đỏ **2** |
| **Nghiệm thu 4** | Bấm 1 sản phẩm | 📸 **Chụp 14:** màn **Chi tiết sản phẩm** thấy dòng **"Mã sản phẩm: prod_x"** |
| **Nghiệm thu 5** | Back về Home, cuộn xuống giữa danh sách (vd SP 24–27); kéo từ đầu danh sách xuống thấy vòng xoay refresh | 📸 **Chụp 15:** Home đang cuộn giữa danh sách (chứng minh FlashList còn chạy) |
| **Nghiệm thu 6** | Terminal chạy: `npx uri-scheme open "shopai://product/prod_1" --android` (hỏi `Ok to proceed?` gõ `y`) → app tự mở Chi tiết prod_1 | 📸 **Chụp 16:** Terminal thấy dòng `Android: Opening URI "shopai://product/prod_1" in emulator` *(nên chụp kèm emulator đang ở Chi tiết prod_1)* |
| **Nghiệm thu 7** | Terminal: `git add .` rồi `git commit -m "Sprint 5: Auth Flow, Bottom Tab Navigator, ProductDetail via Route Params, Deep Linking"` | 📸 **Chụp 17:** Terminal thấy dòng `[main xxxxxxx] Sprint 5: Auth Flow, ...` |

Kiểm tra thêm (không cần chụp): bấm **Thoát** ở Home → về Login; ở Login bấm nút Back của Android **không** quay lại được Home.

---

## ❗ Lỗi hay gặp
| Lỗi | Cách sửa |
|---|---|
| `Unable to resolve module @navigation/...` | Tên file/đường dẫn sai, hoặc chưa `npm start -- --reset-cache` |
| Icon tab hiện ô vuông / dấu `?` | Quên dòng `apply from ... fonts.gradle` hoặc chưa build lại bằng gradlew |
| `'gradlew.bat' is not recognized` | Dùng `.\gradlew.bat` trong thư mục `android` như trên |
| Metro crash `ENOENT: watch ... codegen` | Tắt Metro, build gradle xong mới `npm start` |
| Card lệch / chỉ 1 cột | `Pressable` thiếu `style={{ flex: 1 }}` |
| Deep link mở app nhưng không vào Detail | `linking` trong App.tsx sai tên: `HomeTab` → `ProductDetail: "product/:productId"` |
