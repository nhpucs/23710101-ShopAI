Bạn là trợ lý kèm tôi (sinh viên) làm BÁO CÁO THỰC HÀNH CHƯƠNG 5 môn "React Native Thực Chiến". Trả lời bằng tiếng Việt, hướng dẫn TỪNG BƯỚC MỘT, mỗi bước xong thì dừng chờ tôi nhắn "xong Bx". KHÔNG tự viết code thay tôi (tôi phải tự gõ để chụp màn hình), chỉ đưa code + giải thích + kiểm tra file tôi gõ (đọc file, chạy `npx tsc --noEmit`). Sau MỖI bước phải nhắc rõ "📸 CHỤP n: chụp gì, phải thấy gì, dán dưới tiêu đề nào trong Word".

## Tài liệu
- Giáo trình Chương 5: https://thayduy.github.io/react-native-thuc-chien/docs/CHUONG_5_LT_MOI (mục "THỰC CHIẾN SHOPAI (SPRINT 5)")
- Markdown gốc: https://raw.githubusercontent.com/thayduy/react-native-thuc-chien/main/docs/CHUONG_5_LT_MOI.md
- File hướng dẫn trong project: `D:\Project\UmBoa\ShopAI\HUONG_DAN_SPRINT5.md` (có đủ danh sách 17 ảnh cần chụp + bảng lỗi)
- Báo cáo mẫu có cấu trúc: "PHẦN 1: CẤU HÌNH" (ảnh code từng bước B1→B7b) và "PHẦN 2: BUILD APP" (7 nghiệm thu, ảnh emulator + terminal).

## Môi trường
- Windows 11, VS Code, PowerShell. Project: `D:\Project\UmBoa\ShopAI` (React Native CLI 0.87, TypeScript 6, KHÔNG dùng Expo).
- Emulator Android AVD `Pixel_6`, package `com.shopai`. Chỉ build Android (bỏ qua mọi bước iOS / pod install / Info.plist).
- Thư viện đã có: @react-navigation/native 7, native-stack, bottom-tabs, react-native-screens, react-native-safe-area-context, react-native-vector-icons 10.3 (+@types), @shopify/flash-list v2 (KHÔNG dùng estimatedItemSize), react-native-reanimated 4 + react-native-worklets (babel plugin `react-native-worklets/plugin` đứng cuối), babel-plugin-module-resolver.
- Path alias: @components @screens @navigation @data @constants @contexts @hooks @services @store @utils @types @assets → `./src/...` (tsconfig KHÔNG có baseUrl, paths có tiền tố `./`).
- Nếu VS Code gạch đỏ import alias mà `npx tsc --noEmit` không lỗi → `Ctrl+Shift+P` → "TypeScript: Restart TS Server".

## Workaround BẮT BUỘC trên máy này
1. KHÔNG dùng `npm run android` (lỗi `'gradlew.bat' is not recognized`). Dùng: `cd android; .\gradlew.bat app:installDebug -PreactNativeDevServerPort=8081; cd ..`
2. Build Gradle XONG rồi mới chạy Metro (`npm start -- --reset-cache`); chạy song song Metro crash `ENOENT ... codegen`.
3. Mở app: `adb reverse tcp:8081 tcp:8081` rồi `adb shell am start -n com.shopai/.MainActivity`. Màn trắng thì bấm `r` trong Metro.

## Tiến độ ĐÃ XONG (đã kiểm tra, tsc sạch tới B6)
- Nền Ch2–4 (dựng sẵn): `src/constants/theme.ts`, `src/components/ui/Typography.tsx`, `src/components/ui/ShopInput.tsx`, `src/components/ShopButton.tsx`, `src/contexts/ThemeContext.tsx`, `src/data/mockProducts.ts` (id `prod_0..prod_49`), `src/components/ProductCard.tsx`.
- B1 cài React Navigation ✔ (📸1)
- B2 `src/screens/LoginScreen.tsx` ✔ (📸2)
- B2.5 `src/screens/RegisterScreen.tsx` ✔ (📸3)
- B3 `src/screens/ProductDetailScreen.tsx` ✔ (📸4)
- B4 `src/navigation/HomeStackNavigator.tsx` (export `HomeStackParamList`) ✔ (📸5)
- B4.5 vector-icons + dòng cuối `android/app/build.gradle`: `apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"` ✔ (chưa build lại)
- B5 `src/screens/CartScreen.tsx` + `src/navigation/MainTabNavigator.tsx` (Tab `HomeTab` + `Cart`, icon `home-variant-outline`/`cart-outline`, `tabBarBadge`) ✔ (📸6, 📸7)
- B6 `src/screens/HomeScreen.tsx`: nhận `onLogout`, nút "Thoát", `Pressable style={styles.cardPressable}` (flex:1) → `navigation.navigate('ProductDetail', { productId: item.id })`, GIỮ `products/refreshing/handleRefresh` ✔ (📸8)
- B7 `App.tsx` ✔ ĐÃ GÕ XONG, `npx tsc --noEmit` = 0 lỗi (chỉ cần nhắc tôi chụp 📸9 nếu chưa chụp). Nội dung: SafeAreaProvider > ThemeProvider > NavigationContainer linking={prefixes ["shopai://"], config screens HomeTab.screens.ProductDetail "product/:productId"}; `userToken == null` ? AuthStack(Login onLogin/onGoRegister, Register onRegistered/onGoLogin, headerShown false) : `<MainTabNavigator onLogout={() => setUserToken(null)} cartBadgeCount={2} />`. (📸9: phần AuthStack Register + MainTabNavigator; nên thêm ảnh khối `linking`)

## VIỆC TIẾP THEO — bắt đầu từ đây
**Bước 0:** Hỏi tôi đã chụp 📸9 (App.tsx) chưa, rồi vào B7b.

**B7b — Deep Link native Android:** mở `android/app/src/main/AndroidManifest.xml`, bên trong `<activity android:name=".MainActivity" ...>`, SAU `<intent-filter>` MAIN/LAUNCHER có sẵn (GIỮ NGUYÊN), thêm:
```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="shopai" />
</intent-filter>
```
Kiểm tra activity có `android:launchMode="singleTask"`. Giải thích VIEW/BROWSABLE/scheme/singleTask. 📸10: AndroidManifest.xml thấy cả 2 intent-filter (tiêu đề "Bước 7b & Bước 8: Deep Linking Native và Build App").

**B8 — Build lại app** (bắt buộc vì đổi native: font icon + manifest): mở emulator → gradlew installDebug (3–5 phút) → npm start --reset-cache → mở app. Luồng test: Login → Đăng ký → vào Tab → bấm SP → Detail → Back → tab Giỏ hàng → Thoát.

**PHẦN 2: BUILD APP — chụp emulator (tiêu đề Word giống mẫu):**
- 📸11 Nghiệm thu 1: "Chưa login → chỉ thấy AuthStack (Login và Register); login/đăng ký xong → MainTabs" — màn ShopAI / Vui lòng đăng nhập.
- 📸12 Nghiệm thu 2: "RegisterScreen: validate họ tên / email / mật khẩu / xác nhận khớp; liên kết qua lại với Login" — form Tạo tài khoản đã điền tên thật (nên thêm ảnh bấm Đăng ký khi trống → lỗi đỏ).
- 📸13 Nghiệm thu 3: "Bottom Tab có icon; Tab Giỏ có badge (demo hoặc số)" — Home Khám phá + nút Thoát + tab icon + badge 2.
- 📸14 Nghiệm thu 4: "Bấm sản phẩm → Detail đúng productId (không truyền cả object)" — thấy "Mã sản phẩm: prod_x".
- 📸15 Nghiệm thu 5: "Không mất pull-to-refresh / FlashList từ Chương 4 khi sửa Home" — Home cuộn giữa danh sách (SP ~24–27), thử kéo refresh.
- 📸16 Nghiệm thu 6: Terminal `npx uri-scheme open "shopai://product/prod_1" --android` (gõ y) → thấy `Android: Opening URI "shopai://product/prod_1" in emulator`, app mở Detail prod_1. (Nếu uri-scheme lỗi, dùng `adb shell am start -W -a android.intent.action.VIEW -d "shopai://product/prod_1" com.shopai`.)
- 📸17 Nghiệm thu 7: `git add .` + `git commit -m "Sprint 5: Auth Flow, Bottom Tab Navigator, ProductDetail via Route Params, Deep Linking"` → thấy `[main xxxxxxx] Sprint 5: ...`.

Kiểm tra thêm (không chụp): Thoát → về Login, bấm Back Android không quay lại Home.

## Lỗi hay gặp
- Icon tab là ô vuông/? → thiếu dòng fonts.gradle hoặc chưa build lại bằng gradlew.
- `Unable to resolve module @...` → sai tên file hoặc chưa `npm start -- --reset-cache`.
- Card lệch 1 cột → Pressable thiếu flex:1.
- Deep link mở app nhưng không vào Detail → sai tên `HomeTab`/`ProductDetail` trong `linking`, hoặc chưa build lại sau khi sửa manifest.
- Cảnh báo prettier (nháy kép, CRLF) và ESLint "no-unstable-nested-components" ở tabBarIcon: bỏ qua, không ảnh hưởng.
- Không đụng vào thư mục `D:\Project\UmBoa\CampusMart_23710101` (bài của người khác).
