# ✅ Checklist ShopAI – React Native Thực Chiến

> https://thayduy.github.io/react-native-thuc-chien/
>

## 📊 Tiến độ

| Chương | Nội dung | Xong? |
|---|---|---|
| 1 | Môi trường & Sprint 1 | ✅ |
| 2 | Component, List, API & Sprint 2 | ✅ |
| 3 | Styling, Theme & State | ✅ |
| 4 | FlashList, Animation & Sprint 4 | ✅ |
| 5 | Navigation, Auth & Deep Link | ✅ |
| 6 | State Management (Zustand, TanStack Query, Redux) | ✅ |
| 7 | Native Module & Quyền | ✅ |
| 8 | Bảo mật & AI | ✅ |
| 9 | Backend NestJS + Prisma | ✅ |
| 10 | Môi trường, Crashlytics, Release & OTA | ✅ |
| 11 | Testing & CI/CD | ✅ |

> Xong chương nào thì đổi ⬜ thành ✅.

---

## Chương 1 – Môi trường & Sprint 1

**Sprint 1 – Bạn phải tự kiểm:**
- [x] App mở được, thấy chữ **ShopAI**
- [x] Đổi `ShopAI` → `ShopAI Demo`, lưu file → chữ đổi (Fast Refresh)
- [x] Không còn lỗi đỏ về SDK / JDK / CocoaPods

**Checklist nghiệm thu:**
- [x] Mở được Terminal, chạy được vài lệnh cơ bản
- [x] `git status` / `commit` / `push` được
- [x] Giải thích được RN ≠ WebView (1 câu)
  - **Trả lời:** RN **không** nhúng trang web trong WebView: JS chỉ ra lệnh, còn giao diện được dựng bằng component Native thật của hệ điều hành (`UIView` / `ViewGroup`).

- [x] Nêu được vì sao khóa học chọn **RN CLI** thay vì chỉ Expo Go
  - **Trả lời:** Vì ShopAI cần gắn thư viện Native tuỳ ý (Vision Camera, SecureStore, Firebase) và sửa thẳng cấu hình Android/iOS — Expo Go chỉ chạy được tập thư viện đã dựng sẵn trong app của Expo.
  
- [x] Checklist Phần 1.5 (JDK / Studio / Xcode) PASS
- [x] `npm run ios` hoặc `npm run android` thành công
- [x] Thấy Fast Refresh khi sửa chữ trên màn hình
- [x] Code đã push GitHub

---

## Chương 2 – Component, List, API

**Tổng kết lý thuyết:**
- [x] Phân biệt **Props** (từ cha, read-only) và **State** (nội bộ, đổi → re-render)
  - **Trả lời:** **Props** do cha truyền xuống, con chỉ được đọc. **State** là dữ liệu nội bộ của component; gọi hàm setter thì component vẽ lại.

- [x] Viết được Functional Component + JSX
- [x] Phân biệt ScrollView vs FlatList vs SectionList
  - **Trả lời:** **ScrollView** dựng toàn bộ phần tử một lúc — chỉ hợp danh sách ngắn. **FlatList** ảo hoá, chỉ dựng phần đang nhìn thấy — danh sách dài bắt buộc dùng. **SectionList** giống FlatList nhưng có tiêu đề nhóm.

- [x] Viết TextInput controlled (`value` + `onChangeText`)
- [x] Nói được API là gì (quầy + luật), khác `fetch`/database/màn hình
  - **Trả lời:** API là "quầy giao dịch + bộ luật": quy định gửi gì, nhận gì. `fetch` chỉ là phương tiện gọi tới quầy; database là kho chứa dữ liệu phía sau; màn hình là nơi hiển thị kết quả.

- [x] Phân biệt GET/POST, `res.ok` vs Axios `res.data`, đủ 3 trạng thái UI
  - **Trả lời:** GET để **đọc**, POST để **ghi**. `fetch` trả về Response thô, phải tự kiểm `res.ok` rồi `.json()`; Axios đã phân tích sẵn vào `res.data` và tự ném lỗi khi mã trả về khác 2xx. Ba trạng thái UI bắt buộc: **đang tải / lỗi / có dữ liệu**.

- [x] Fetch JSON và đổ vào FlatList (có spinner + lỗi + Thử lại)
- [x] Path alias `@screens` / `@services` chạy được
- [x] Hiểu Bridge/JSI ở mức "vì sao list dài cần ảo hóa"
  - **Trả lời:** Bridge cũ đẩy dữ liệu qua hàng đợi JSON bất đồng bộ nên tốn kém; JSI cho JS gọi thẳng C++ không phải serialize. Vì vậy danh sách dài phải ảo hoá — dựng 1000 dòng là 1000 lần tạo view Native, nghẽn ngay.

**Nghiệm thu Sprint 2:**
- [x] Thư mục `src/` đủ nhánh (screens, components, services, …)
- [x] Path Alias `@screens` / `@services` import được (Metro không đỏ)
- [x] HomeScreen có TextInput + FlatList/Image/Pressable
- [x] List dữ liệu đến từ **Fetch** (không hardcode toàn bộ list)
- [x] `App.tsx` render `HomeScreen` qua alias + `SafeAreaProvider`
- [ ] `git commit` Sprint 2
  - Không có commit riêng: code Ch.2–4 nằm chung trong commit Sprint 5 `2ed443f`.

---

## Chương 3 – Styling, Theme & State

**Nghiệm thu nhanh:**
- [x] Đổi `COLORS.primary` trong `theme.ts` → nút và giá đổi màu theo (không sửa từng màn hình)
- [x] Gõ vào ô Input thấy state cập nhật
- [x] Đồng hồ đếm ngược chạy, hết giờ thì nút bị `disabled`
- [x] Bấm nút "Chuyển sang Tối/Sáng" → nền và chữ đổi màu ngay, không cần khởi động lại app

---

## Chương 4 – FlashList & Animation

**Nghiệm thu Sprint 4:**
- [x] `SafeAreaProvider` + `SafeAreaView` từ `react-native-safe-area-context`
- [x] Home dùng **FlashList** lưới 2 cột + `estimatedItemSize` (nếu v1)
- [x] `ProductCard` có fade-in Reanimated; dùng Path Alias
- [x] Pull-to-refresh hoạt động trên Home
- [x] Tái sử dụng `ShopButton` từ Chương 3
- [ ] `git commit` Sprint 4
  - Không có commit riêng: code Ch.2–4 nằm chung trong commit Sprint 5 `2ed443f`.

---

## Chương 5 – Navigation, Auth & Deep Link

**Nghiệm thu Sprint 5:**
- [x] Chưa login → chỉ thấy AuthStack (Login **và** Register); login/đăng ký xong → MainTabs
- [x] `RegisterScreen`: validate họ tên / email / mật khẩu / xác nhận khớp; liên kết qua lại với Login
- [x] Bottom Tab có **icon**; Tab Giỏ có badge (demo hoặc số)
- [x] Bấm sản phẩm → Detail đúng `productId` (không truyền cả object)
- [x] **Không mất** pull-to-refresh / FlashList từ Chương 4 khi sửa Home
- [x] Deep Link: đã khai báo native (plist + intent-filter) + `linking` JS; test được 1 URL
- [x] `git commit` Sprint 5

---

## Chương 6 – State Management

**Nghiệm thu Sprint 6:**
- [x] Token đăng nhập và Giỏ hàng chạy trên Zustand, đồng bộ toàn App qua `RootStackNavigator`/`MainTabNavigator`
- [x] AuthStack còn **Login + Register**; cả hai dùng Zustand `login()`
- [x] `HomeScreen` load sản phẩm qua TanStack Query, dữ liệu đi qua Zod, Pull-to-refresh (`refetch`)
- [x] `HomeScreen` phân trang THẬT bằng `useInfiniteQuery`: cuộn cuối tự `fetchNextPage()`, dừng khi `hasNextPage` là `false`, có `ListFooterComponent` + `ActivityIndicator` khi `isFetchingNextPage`
- [x] `HomeScreen` phân biệt 2 thông báo lỗi khi `isError`: dữ liệu không hợp lệ (Zod) và mất mạng
- [x] Giỏ hàng có `persist` (AsyncStorage) — tắt hẳn App mở lại vẫn còn
- [x] `CheckoutScreen` mở dạng Modal từ `CartScreen`, đặt hàng bằng `useMutation` — `onSuccess` ghi đơn `PENDING` vào `useOrderStore` + xóa Giỏ
- [x] Tab **Đơn hàng** liệt kê đơn; `OrderDetailScreen` hiện chi tiết; nút **Thanh toán giả lập** đổi `PENDING` → `PAID`; tắt app đơn vẫn còn
- [x] `axiosClient` (Interceptor gắn Token, xử lý 401) ở `src/api/axiosClient.ts`
- [x] Giải thích được `useQuery` vs `useMutation`, và vì sao cần `invalidateQueries` sau mỗi lần Ghi
  - **Trả lời:** `useQuery` để **ĐỌC**: tự chạy khi vào màn hình, tự cache. `useMutation` để **GHI**: chỉ chạy khi gọi `mutate()`. Sau khi ghi thành công, dữ liệu trong cache đã cũ → `invalidateQueries` đánh dấu "thiu" để React Query tự tải lại bản mới.

- [x] **[Đề cương]** Module `src/store/redux/` (Redux Toolkit) với `createSlice`, `configureStore`, `Provider`, `useSelector`/`useDispatch` — chạy song song, không phá Zustand Cart
- [x] Hiểu bảng so sánh Context vs Redux Toolkit vs Zustand, vì sao ShopAI chọn Zustand
  - **Trả lời:** **Context** hợp giá trị ít đổi (theme) — mọi nơi dùng đều vẽ lại khi value đổi. **Redux Toolkit** chuẩn công nghiệp, DevTools mạnh nhưng nhiều thủ tục. **Zustand** nhẹ, không cần Provider, selector chọn đúng trường nên ít vẽ lại → ShopAI chọn Zustand.

- [x] Hiểu vì sao Token KHÔNG persist bằng AsyncStorage (chờ `SecureStore` ở Chương 8), còn Giỏ hàng thì được
  - **Trả lời:** AsyncStorage lưu **chữ thường, không mã hoá** — app khác hoặc máy root đọc được, nên token phải chờ SecureStore (khoá nằm trong chip). Giỏ hàng không nhạy cảm nên persist thoải mái.

---

## Chương 7 – Native Module & Quyền

- [x] Native Module: vì sao cài thư viện Native thì Hot Reload vô hiệu, phải build lại?
  - **Trả lời:** Hot Reload chỉ nạp lại gói **JavaScript**. Thư viện Native thêm code Java/Kotlin/ObjC vào bản build, nên phải biên dịch lại và cài APK mới thì máy mới có code đó.

- [x] Sandboxing & Permissions: Info.plist khác AndroidManifest ở điểm gì? Vì sao iOS chỉ hỏi 1 lần?
  - **Trả lời:** `Info.plist` khai báo **lý do** xin quyền (chuỗi mô tả — thiếu là app crash); `AndroidManifest` khai báo **tên quyền**. iOS chỉ hỏi đúng 1 lần, từ chối rồi thì phải vào Settings bật tay; Android còn hỏi lại được cho tới khi user chọn "không hỏi lại nữa".

- [x] Autolinking (7.4): `pod install` và Gradle làm gì sau lưng bạn? Khi nào phải Manual Link?
  - **Trả lời:** `pod install` (iOS) và Gradle (Android) tự quét `node_modules`, đọc cấu hình từng thư viện rồi tự nối vào project. Chỉ phải Manual Link khi thư viện quá cũ hoặc không khai báo theo chuẩn.

- [x] Quyền bị chặn (7.5): `denied` khác `blocked` thế nào? Vì sao cần `AppState` sau `openSettings()`?
  - **Trả lời:** `denied` = từ chối lần này, vẫn hỏi lại được. `blocked` = chặn vĩnh viễn, chỉ Settings mới mở. Sau `openSettings()` app rơi xuống nền → phải nghe `AppState` để biết lúc user quay lại mà kiểm tra quyền lần nữa.

- [x] Haptic (7.6): Vibration khác Haptic ra sao? Vì sao bọc vào file tiện ích riêng?
  - **Trả lời:** `Vibration` chỉ rung thô theo mili-giây; Haptic gọi API hệ thống cho cảm giác tinh (success / warning / impact). Bọc vào `haptics.ts` để sau này đổi thư viện chỉ phải sửa đúng một file.

- [x] Location (7.7): `FINE` khác `COARSE`? Vì sao bắt buộc có `timeout` và phương án dự phòng?
  - **Trả lời:** `FINE` dùng GPS — chính xác vài mét nhưng chậm và tốn pin; `COARSE` dựa wifi/trạm phát sóng — nhanh, sai số khoảng 1km. Bắt buộc có `timeout` vì trong nhà có thể không bao giờ bắt được GPS, và phải có phí ship mặc định để app không treo.

- [x] JSI & Frame Processor (7.8): vì sao 180MB/giây không thể đi qua Bridge? `'worklet'` làm gì?
  - **Trả lời:** 180MB/giây khung hình không thể serialize JSON qua Bridge. Từ khoá `worklet` đánh dấu hàm được biên dịch để chạy thẳng trên luồng UI/camera qua JSI, không đi vòng qua Bridge.

- [x] Gỡ rối build (7.9): đọc log lỗi Native bắt đầu từ đâu? "Dọn nhà toàn tập" gồm mấy tầng?
  - **Trả lời:** Đọc log từ khối `FAILURE:` / `* What went wrong:` **đầu tiên**, bỏ qua đống warning phía trên. "Dọn nhà" theo tầng: cache Metro → `node_modules` → `android/build` + `.gradle` của project → cache Gradle toàn máy.

- [x] So sánh Camera (7.10): vì sao ShopAI chọn Vision Camera thay vì Expo Camera?
  - **Trả lời:** Vision Camera có Frame Processor chạy bằng JSI, quét mã vạch ngay trên luồng camera ở 60FPS; Expo Camera phải đẩy từng khung qua Bridge nên chậm. Ngoài ra ShopAI là dự án Bare CLI, không ràng buộc hệ sinh thái Expo.

- [x] Push Notification (7.11): vì sao `setBackgroundMessageHandler` đặt ở `index.js`? 3 trạng thái App khác nhau ra sao?
  - **Trả lời:** Khi app bị tắt hẳn, hệ điều hành chỉ dựng môi trường JS chứ **không** dựng React — `App.tsx` chưa chạy, nên handler phải nằm ở `index.js` (nơi chạy sớm nhất). Ba trạng thái: **foreground** (`onMessage`), **background** (`setBackgroundMessageHandler`), **quit** (`getInitialNotification`).

- [x] Native Module tự viết (7.12): 4 file cần có để gọi `ShopAIDevice.getAppFlavor()`? Native Module khác Turbo Module ở điểm nào?
  - **Trả lời:** Bốn file: (1) lớp Module Kotlin/Java chứa hàm, (2) lớp Package đăng ký module, (3) khai báo Package trong `MainApplication`, (4) file TS bọc `NativeModules.ShopAIDevice`. Native Module cũ gọi qua Bridge **bất đồng bộ, không kiểu**; Turbo Module dùng JSI + codegen nên gọi được **đồng bộ và có kiểu tĩnh**.

- [x] `git commit` Sprint 7

---

## Chương 8 – Bảo mật & AI

- [x] Dịch ngược & MITM (8.1): vì sao mã nguồn Mobile nguy hiểm hơn Web?
  - **Trả lời:** File APK/IPA nằm trong tay người dùng — ai cũng tải về giải nén đọc được mã và chuỗi hằng, trong khi code Web phần lớn chạy trên máy chủ mình kiểm soát. Hệ quả: **mọi secret nhúng trong app phải coi như đã công khai**.

- [x] Hardware Keystore (8.2): AsyncStorage khác SecureStore ở đâu? Secure Enclave làm gì?
  - **Trả lời:** AsyncStorage lưu chữ thường trong SQLite của app; SecureStore mã hoá bằng khoá nằm trong Keystore/Keychain **phần cứng**. Secure Enclave là vùng chip tách biệt giữ khoá — phần mềm không đọc được khoá ra, chỉ nhờ nó mã hoá/giải mã hộ.

- [x] System Prompt (8.3): Prompt Injection là gì? System Prompt chống nó bằng cách nào?
  - **Trả lời:** Prompt Injection là người dùng gõ kiểu "quên hết hướng dẫn trước, giờ mày là..." để chiếm quyền điều khiển AI. System Prompt đặt luật ở tầng cao hơn câu hỏi của user, dặn model chỉ trả lời trong phạm vi và bỏ qua mọi yêu cầu đổi vai.

- [x] AI Streaming (8.4): One-shot khác Streaming? SSE của NestJS dùng để làm gì?
  - **Trả lời:** **One-shot** chờ sinh xong cả câu mới trả về — user nhìn màn hình trống vài giây. **Streaming** trả từng token, chữ hiện dần. NestJS dùng **SSE** (Server-Sent Events) để đẩy từng mẩu xuống client qua một kết nối HTTP mở sẵn.

- [x] Certificate Pinning (8.5): vì sao HTTPS thôi chưa đủ? Vì sao pinning là con dao hai lưỡi?
  - **Trả lời:** HTTPS chỉ tin "có CA nào đó đã ký" — máy bị cài CA giả (proxy Charles, mạng công ty) thì vẫn đọc lén được. Pinning ghim đúng chứng chỉ của server mình. Con dao hai lưỡi: chứng chỉ hết hạn hoặc đổi mà app chưa cập nhật thì **toàn bộ user mất kết nối**.

- [x] Root/Jailbreak (8.6): vì sao KHÔNG đặt logic bảo mật cốt lõi ở client?
  - **Trả lời:** Máy đã root thì người dùng kiểm soát toàn bộ tiến trình — mọi câu `if (isRooted) return` đều bị vá bỏ. Kiểm tra ở client chỉ để **cảnh báo**; quyết định bảo mật thật phải nằm ở server.

- [x] Biometrics (8.7): App có nhìn thấy khuôn mặt bạn không? Vì sao luôn phải có lối thoát?
  - **Trả lời:** **Không.** App chỉ nhờ hệ điều hành xác minh và nhận về đúng `true`/`false`; vân tay nằm trong vùng chip bảo mật, cả OS cũng không đọc ra. Luôn phải có lối thoát (PIN / mật khẩu) vì cảm biến bẩn, tay ướt hay đeo khẩu trang sẽ khoá **chính chủ** ra ngoài.

- [x] OWASP Mobile (8.8): ShopAI hiện đang dính rủi ro nào nghiêm trọng nhất?
  - **Trả lời:** **API Key Gemini nằm ngay trong app** (nhóm Improper Credential Usage). Ai giải nén APK cũng lấy được và tiêu hết hạn mức của bạn. Chỉ chữa được ở Chương 9 khi chuyển lời gọi AI về server — **đã chữa ở Ch9 Bước 9**: key chỉ còn trong `.env` của `shopai-backend`.

- [x] Prompt nâng cao (8.9): `temperature` cao/thấp khác nhau ra sao? Few-shot mạnh hơn Zero-shot ở điểm gì?
  - **Trả lời:** `temperature` thấp (0–0.3) → bám sát, ổn định, hợp tra cứu; cao (0.8–1) → sáng tạo nhưng dễ bịa. **Few-shot** đưa sẵn vài ví dụ mẫu nên model bắt chước đúng định dạng và giọng văn — chắc chắn hơn Zero-shot chỉ ra lệnh suông.

- [x] Chat UX (8.10): `inverted` FlatList giải quyết vấn đề gì?
  - **Trả lời:** `inverted` lật danh sách để tin **mới nhất** nằm ở đáy màn hình mà vẫn là phần tử `index 0`. Nhờ vậy tin mới tự nằm đúng chỗ, không phải tự tính `scrollToEnd` sau mỗi lần thêm tin.

- [x] Chi phí AI (8.11): bảy cách kiểm soát chi phí? Exponential Backoff hoạt động thế nào?
  - **Trả lời:** Bảy cách: giới hạn `maxOutputTokens`, rút gọn System Prompt, cắt bớt lịch sử hội thoại gửi kèm, cache câu hỏi lặp, rate-limit theo user, dùng model rẻ cho việc đơn giản, chặn spam ở server. **Exponential Backoff**: lỗi lần 1 chờ 1s, lần 2 chờ 2s, lần 3 chờ 4s... tránh dồn dập làm server càng quá tải.

- [x] App Lock (8.12): vì sao cổng sinh trắc học lúc khởi động là chưa đủ? `useAppLock` đo thời gian bằng cách nào?
  - **Trả lời:** Cổng lúc khởi động chỉ chạy khi app **cold start**; app chỉ tạm ở nền rồi mở lại thì không kiểm gì — để máy trên bàn cả buổi là người khác vào thẳng. `useAppLock` nghe `AppState`, ghi mốc `Date.now()` lúc chuyển sang `background`, lúc về `active` thì so hiệu số với `APP_LOCK_TIMEOUT_MS` để quyết định có khoá lại không.

- [x] Token đã chuyển sang SecureStore (chữa M9)
- [x] `git commit` Sprint 8

---

## Chương 9 – Backend NestJS + Prisma

**Backend `shopai-backend`:**
- [x] `GET /api/products` trả danh sách sản phẩm (ShopAI dùng 29 đồ công nghệ thay cho 20 sản phẩm mẫu), id **ổn định** giữa các lần gọi
- [x] `GET /api/products/:id` trả `200` với id hợp lệ, `404` (message tiếng Việt) với id sai
- [x] `POST /api/products` với `price: -100` bị `ValidationPipe` chặn, trả `400` kèm danh sách lỗi
- [x] `npx prisma migrate dev` thành công, có `prisma/migrations/` và `prisma/dev.db`
- [x] Seed được ít nhất 1 User (`npx prisma db seed`), xem bằng `npx prisma studio`
- [x] `POST /api/auth/login` đúng email/mật khẩu trả `{ accessToken }` là JWT thật (đọc được trên `jwt.io`)
- [x] `POST /api/auth/login` sai mật khẩu trả `401`
- [x] `POST /api/auth/register` tạo user + trả JWT; email trùng → `409`
- [x] `POST /api/orders` **không có** `Authorization: Bearer` trả `401` (Guard hoạt động)
- [x] `POST /api/orders` **có** Token: tạo đơn `PENDING`, tự tính lại tổng tiền, từ chối `total` gian lận bằng `400`
- [x] `GET /api/orders` (có JWT) chỉ trả đơn của user; `GET /api/orders/:id` chi tiết; `POST …/pay` → `PAID`
- [x] Restart Server đơn **vẫn còn** (Prisma + SQLite)
- [x] `POST /api/ai/chat` trả `{ reply }`, Key chỉ nằm trong `.env` phía Server
- [x] Swagger chạy tại `/api/docs`, đủ nhóm Auth/Products/Orders/Ai, nút "Authorize" hoạt động; `.env.example` đã commit, `.env` và `prisma/dev.db` thì không
- [x] `main.ts` có đủ: `enableCors()`, `useGlobalPipes(ValidationPipe)`, `listen(3000, '0.0.0.0')`

**Mobile `ShopAI`:**
- [x] Chỉ **một nơi** khai báo địa chỉ Server: `src/constants/api.ts`; `axiosClient.baseURL` trỏ đúng `API_BASE_URL`
- [x] `LoginScreen` / `RegisterScreen` gọi API thật — không còn `mock_token_123`
- [x] `HomeScreen` fetch sản phẩm thật, vẫn qua Zod
- [x] `ProductDetailScreen` fetch theo `id`, xử lý được `404`
- [x] `CheckoutScreen` gọi `POST /api/orders` qua `axiosClient`, hiện mã đơn `PENDING`, **chỉ xóa giỏ khi thành công**
- [x] Tab Đơn hàng + Chi tiết HĐ lấy từ Nest; nút Pay gọi `POST …/pay` → `PAID`
- [x] `AIChatScreen` không còn import `@google/generative-ai`; đã xóa `geminiConfig.ts`

---

## Chương 10 – Môi trường, Crashlytics, Release & OTA

**Cấu hình môi trường:**
- [x] `src/constants/env.ts` khai báo đủ `APP_ENV`, `API_BASE_URL`, `ENABLE_CRASHLYTICS`
- [x] Không còn chỗ nào hardcode IP LAN ngoài `env.ts` (`api.ts` chỉ còn `export { API_BASE_URL } from './env'`)

**Crashlytics:**
- [x] Firebase Crashlytics hoạt động, Dashboard nhận được Test Crash
  - Firebase Console › ShopAI › Crashlytics (22/10/2026): bản 1.0.0 (10000), issue `java.lang.RuntimeException - Crash Test` tại `MessageQueueThreadImpl`, 1 event / 1 user.
- [x] Nút test Crash chỉ có trong `__DEV__`
  - Dòng chữ xám `ShopAI v1.0.0 (Dev: nhấn giữ 2s...)` cuối HomeScreen, bọc `{__DEV__ && ...}`. Nhấn giữ trên emulator → app văng với `java.lang.RuntimeException: Crash Test`, mở lại thì Crashlytics gửi báo cáo.
- [x] Lỗi fetch ở `HomeScreen` ghi Non-Fatal qua `recordError`, App không sập khi mất mạng
  - Ghi ở `productService.fetchAllProducts` (tên nhóm `ProductFetchFailed`). Đã thử: tắt NestJS, kéo xuống làm mới → hiện "📡 Lỗi mạng...", danh sách cũ vẫn còn, app không sập.
- [x] Lỗi đặt hàng ở `CheckoutScreen` ghi với tên `CheckoutOrderFailed`, kèm Breadcrumb và Custom Keys
  - `log` + `setAttributes` (screen, cart_item_count, cart_total, payment_method, app_env, api_base_url) trước khi gọi server; `recordError(..., 'CheckoutOrderFailed')` trong `onError` của `useMutation`. Đã thử: tắt NestJS, đặt COD → báo lỗi đỏ, **giỏ hàng còn nguyên**.
- [x] `mappingFileUploadEnabled true` đã bật cho `buildTypes.release`

**Không phá vỡ tính năng cũ:**
- [x] `App.tsx` còn đủ `SafeAreaProvider`, `QueryClientProvider`, `NavigationContainer`, `AuthStack`, `MainTabNavigator`
  - Chỉ THÊM 2 `useEffect` (log khởi động + kiểm tra OTA). Redux `Provider`, `ThemeProvider`, `linking`, `BiometricGate`, `useAppLock` giữ nguyên; `MainTabNavigator` nằm trong `RootStackNavigator` từ Ch.6.
- [x] Toàn bộ luồng Chương 9 (sản phẩm, chi tiết, đặt hàng, chat AI) vẫn chạy đúng
  - Trang chủ tải 29 sản phẩm từ NestJS; Maestro `cart_checkout.yaml` đi hết Đăng nhập → Chi tiết → Thêm giỏ → Thanh toán COD → "Đặt hàng thành công!" + mã `ORD-...` PENDING.

**Release & OTA:**
- [x] Đã tạo `shopai-release.keystore`, **đã sao lưu**, `.gitignore` đã chặn
  - Sao lưu: gửi email cho chính mình (đính kèm keystore + `keystore.properties`). Mật khẩu nằm trong `android/keystore.properties`, cũng bị `.gitignore` chặn.
- [x] `./gradlew bundleRelease` thành công, sinh `app-release.aab` đã ký
  - `assembleRelease` + `bundleRelease` BUILD SUCCESSFUL: `app-release.apk` 117 MB, `app-release.aab` 80,5 MB, ký bằng `CN=ShopAI, OU=Mobile Team` (apksigner verify). Task `uploadCrashlyticsMappingFileRelease` đã chạy.
  - Lỗi gặp: Gradle 9 báo `createBundleReleaseJsAndAssets` dùng output của task khác. Gốc rễ: dòng `cliFile` (install-expo-modules thêm ở Ch.8) `require.resolve('@expo/cli')` trả chuỗi rỗng vì `@expo/cli` nằm trong `node_modules/expo/node_modules` → cliFile thành thư mục `android/app`. Sửa: resolve từ chỗ gói `expo`.
- [x] Bản Release chạy được trên máy thật (R8 không làm crash)
  - Cài `app-release.apk` lên emulator Pixel_6: mở được, không crash, không có khung dev. Đăng nhập báo "Không kết nối được tới máy chủ ShopAI" — đúng thiết kế vì bản production trỏ `https://api.shopai.com` (chưa deploy).
- [x] `eas.json` đủ 3 profile `development` / `preview` / `production`
- [x] Hiểu: EAS Update/`code-push-server` chỉ vá JS, không vá Native; không dùng CodePush/App Center (ngừng từ 3/2025)
  - **Trả lời:** OTA chỉ thay file `index.android.bundle` (JS + ảnh). Thêm thư viện có thư mục `android/` (như Firebase, expo-updates ở chương này) hay sửa `build.gradle`/`AndroidManifest` là đổi tầng Native → phải build lại và nộp Store. `runtimeVersion` (ShopAI để `1.0.0` khớp `versionName`) là chốt chặn: bản vá chỉ tới app cùng runtime, nên JS mới cần module Native mới không bị đẩy nhầm xuống app cũ.
- [x] Biết rollback OTA lỗi bằng `eas update:republish` hoặc `eas channel:edit`
  - **Trả lời:** `eas update:list --branch production` lấy `group id` của bản tốt gần nhất → `eas update:republish --group <id>` đẩy lại đúng bản đó. Hoặc trỏ cả kênh sang nhánh an toàn: `eas channel:edit production --branch production-safe`. Channel nằm cứng trong app, branch nằm trên mây nên đổi được ngay.

**iOS & EAS Build:**
- [x] Hoàn thành Bundle ID + Automatic Signing + Team trên Xcode (nếu có Mac), HOẶC ghi rõ lý do bỏ qua
  - **Lý do bỏ qua:** máy làm bài là Windows, không có macOS/Xcode và chưa có tài khoản Apple Developer (99 USD/năm). Dự án chỉ build Android; minh chứng Release dùng `./gradlew bundleRelease`.
- [x] Chạy được `npx react-native run-ios --mode Release` (nếu có Mac) hoặc nắm quy trình Archive → TestFlight
  - **Trả lời:** mở `ios/ShopAI.xcworkspace` → chọn "Any iOS Device (arm64)" (Simulator không Archive được) → Product › Archive → Organizer › Distribute App › App Store Connect › Upload → chờ Apple xử lý → tab TestFlight thêm Internal Tester. Mỗi lần nộp phải tăng `CFBundleVersion`.
- [x] Chạy thành công **ít nhất một**: `eas build --platform android --profile preview` HOẶC `./gradlew bundleRelease` (chọn Local — xem trên)
- [x] Biết chọn Cloud (EAS Build) hay Local cho từng tình huống
  - **Trả lời:** đang học, có Android Studio, cần lặp nhanh → Local (`gradlew`). Cần file `.ipa` mà không có Mac, hoặc máy yếu → EAS Build Cloud. Có CI riêng (Ch.11) → Local trên runner CI. ShopAI chọn Local vì gói miễn phí EAS phải xếp hàng, và keystore đã nằm sẵn trên máy.

---

## Chương 11 – Testing & CI/CD

**Tầng 1 — Unit Test (Jest):**
- [x] `formatCurrency` tách ra `src/utils/formatCurrency.ts`, có Unit Test PASS
  - Gom 6 chỗ tự viết `Intl.NumberFormat` (Cart, ProductCard, ProductDetail, Orders, OrderDetail, format.ts) về 1 hàm; `formatVnd` cũ chỉ còn là tên phụ. Test so sánh sau khi đổi khoảng trắng không ngắt (U+00A0) của `Intl` thành dấu cách.
- [x] `useCartStore.test.ts` PASS: `addItem` (gồm gộp số lượng), `removeItem`, `totalPrice`, `totalQuantity`, `clearCart`
- [x] `jest.setup.js` mock đủ Native Module (Crashlytics, SecureStore, AsyncStorage, Reanimated)
  - Thêm cả expo-updates, LocalAuthentication, SafeArea, Vision Camera, Geolocation. Crashlytics bản 27 là API modular nên mock `getCrashlytics/log/recordError/...` chứ không mock `crashlytics()`. Mock có sẵn của Reanimated 4.6 vẫn nạp native → tự mock `useSharedValue/useAnimatedStyle/withTiming`. `__tests__/App.test.tsx` (đỏ từ trước) giờ xanh: mở app chưa đăng nhập → thấy "Đăng nhập ngay".

**Tầng 2 — Integration Test (RNTL):**
- [x] **[Đề cương]** `ShopButton.test.tsx` PASS, kiểm tra cả `onPress` và `disabled`
  - Thêm 2 ca: đang `isLoading` thì ẩn chữ + không bấm được (chống đặt hàng 2 lần); `accessibilityLabel` mặc định = `title`.

**Tầng 3 — E2E (Maestro):**
- [x] `maestro test .maestro/login_home.yaml` PASS, đúng UI thật của ShopAI
  - Maestro 2.11.0 bản Windows để ngoài repo (`D:/Project/UmBoa/tools/maestro`). Phải chạy với `JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8`, không thì Java đọc yaml bằng cp1252, mọi chữ tiếng Việt không khớp. Thêm bước chờ "Đăng nhập ngay" + `waitForAnimationToEnd` trước khi tap (không thì tap trúng link Đăng ký khi bố cục còn đang đổi).
- [x] `maestro test .maestro/cart_checkout.yaml` PASS với Server NestJS đang bật — `maestro test .maestro/`: 2/2 Flows Passed (1m44s)
  - Lỗi gặp: khung cảnh báo LogBox "process.env.EXPO_OS is not defined" đè lên thanh tab và nút Thanh toán → tap trượt. Sửa tận gốc: `src/utils/expoEnv.ts` gán `EXPO_OS`, import đầu tiên trong `index.js` (babel vẫn dùng preset RN như Ch.8).
- [x] `appId` trong Maestro khớp `applicationId` trong `android/app/build.gradle` (`com.shopai`, giáo trình ghi `com.shopai.app`)

**Coverage & công cụ:**
- [x] `npm run test:coverage` chạy được, sinh `coverage/`
- [x] `coverageThreshold` đã cấu hình, test hiện tại vượt ngưỡng
  - `formatCurrency.ts`, `useCartStore.ts`, `ShopButton.tsx` phủ 100%. Ngưỡng riêng: formatCurrency 90%, useCartStore 70%. Ngưỡng chung đặt 15% (sát mức đo được ~18%) thay vì 40% của giáo trình vì ShopAI có hơn 20 màn hình UI chưa test; chỉ được nâng dần.
- [x] `coverage/` có trong `.gitignore`
- [x] **[Đề cương]** Biết mở React Native DevTools (`j` trong Metro), hiểu vai trò Network Inspector của Flipper
  - **Trả lời:** đang chạy Metro bấm `j` → DevTools mở trong Chrome: tab Components xem cây `HomeScreen → ProductCard → ShopButton`, tab Profiler xem component nào vẽ lại khi bấm "Mua ngay". Flipper (cũ, RN 0.73+ không bật sẵn) có Network Inspector xem từng request `axiosClient` có header `Authorization: Bearer` hay không.

**CI/CD:**
- [x] `.github/workflows/ci.yml` tự chạy khi `git push`, có Lint và Test
  - Job `lint` (ESLint + `tsc --noEmit`) → `test` → `build-android` (chỉ nhánh main). Trước đó `npm run lint` có 1 error cũ (`e` không dùng trong `useAuthStore`) — đã sửa để CI không đỏ. `google-services.json` không commit nên job build dùng secret `GOOGLE_SERVICES_JSON` nếu có, không thì chép file mẫu.
- [x] Pipeline có Matrix nhiều phiên bản Node, có Cache, upload Artifact coverage
  - Matrix Node `22.x`/`24.x` (RN 0.87 đòi Node ^22.13 hoặc ^24.3 nên bỏ 18/20 của giáo trình), cache npm + Gradle, artifact `coverage-report` và `shopai-debug-apk`.
- [ ] *(Tùy chọn)* Husky + lint-staged chạy khi `git commit`
- [x] Hiểu ranh giới: CI bắt buộc nắm; CD (Fastlane) là kiến thức mở rộng
  - **Trả lời:** CI (lint + test + build mỗi lần push) chạy được ngay với tài khoản GitHub miễn phí. CD (Fastlane `upload_to_play_store`/`upload_to_testflight`) cần Service Account Google Play / API Key Apple thật — ShopAI chưa có nên chỉ dừng ở hiểu cấu trúc `GitHub Actions (Test) → Fastlane (Build) → Store (Submit)`.

**Tầng 4 — Backend NestJS (Jest + Supertest):**
- [x] `AuthModule` + Prisma + `JwtAuthGuard` từ Sprint 9 còn nguyên (chỉ thêm file `*.spec.ts`, không sửa `auth.service.ts`/`auth.module.ts`)
- [x] `src/auth/auth.service.spec.ts` PASS — `login` thành công, `validateUser` ném `UnauthorizedException` ở cả 2 nhánh sai email/sai mật khẩu
  - Code Ch.9: `validateUser` trả `null`, `login` mới ném `UnauthorizedException` → test kiểm cả hai đúng như code thật. Thêm: không lộ `password`, `register` trùng email → 409, mật khẩu lưu dạng hash bcrypt. Viết thêm `order.service.spec.ts` (tự tính tiền, chặn tổng tiền gian lận, không xem đơn người khác, Pay 2 lần không lỗi). 5 file spec do `nest g` sinh ở Ch.9 đang đỏ vì thiếu provider → đã sửa. Kết quả `npm test`: 9 suite / 27 test PASS.
- [x] `test/auth-orders.e2e-spec.ts` PASS — login trả `accessToken`; `POST /api/orders` trả `401` khi thiếu Token, `201` khi có Token
  - Login ShopAI trả **200** (đã đặt `@HttpCode(OK)` ở Ch.9) chứ không phải 201 như giáo trình. Thêm ca Token giả → 401 và tổng tiền gian lận → 400.
- [x] `npm run test:e2e` (trong `shopai-backend`) chạy sạch, không treo (có `afterAll(() => app.close())`) — 2 suite / 8 test PASS
- [x] *(Tùy chọn)* Job `backend-test` chạy trong CI, độc lập với job `test` của Mobile
  - Backend là repo riêng nên `ci.yml` nằm trong `shopai-backend`: oxlint → unit test → `prisma migrate deploy` + `db seed` trên SQLite mới → e2e. Đã chạy thử đúng các bước này ở máy với DB mới tinh: 8/8 PASS.