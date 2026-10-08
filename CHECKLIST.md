# ✅ Checklist ShopAI – React Native Thực Chiến

> Nguồn: các mục "Checklist nghiệm thu" / "Bạn phải tự kiểm" trong docs của thầy
> https://thayduy.github.io/react-native-thuc-chien/
>
> **Cách dùng:** tick bằng `- [x]` (hoặc nhấn **Alt + C** với extension *Markdown All in One*), rồi commit kèm code của mục đó.

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
| 8 | Bảo mật & AI | ⬜ |
| 9 | Backend NestJS + Prisma | ⬜ |
| 10 | Môi trường, Crashlytics, Release & OTA | ⬜ |
| 11 | Testing & CI/CD | ⬜ |

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

> Docs chương này không có checklist dạng tick. Danh sách dưới đây chuyển từ bảng "Bạn phải trả lời được" ở phần Tổng kết.

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

> Docs chương này không có checklist dạng tick. Danh sách dưới đây chuyển từ bảng "Bạn phải trả lời được" ở phần Tổng kết.

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
  - **Trả lời:** **API Key Gemini nằm ngay trong app** (nhóm Improper Credential Usage). Ai giải nén APK cũng lấy được và tiêu hết hạn mức của bạn. Chỉ chữa được ở Chương 9 khi chuyển lời gọi AI về server.

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
- [ ] `GET /api/products` trả 20 sản phẩm, id **ổn định** giữa các lần gọi
- [ ] `GET /api/products/:id` trả `200` với id hợp lệ, `404` (message tiếng Việt) với id sai
- [ ] `POST /api/products` với `price: -100` bị `ValidationPipe` chặn, trả `400` kèm danh sách lỗi
- [ ] `npx prisma migrate dev` thành công, có `prisma/migrations/` và `prisma/dev.db`
- [ ] Seed được ít nhất 1 User (`npx prisma db seed`), xem bằng `npx prisma studio`
- [ ] `POST /api/auth/login` đúng email/mật khẩu trả `{ accessToken }` là JWT thật (đọc được trên `jwt.io`)
- [ ] `POST /api/auth/login` sai mật khẩu trả `401`
- [ ] `POST /api/auth/register` tạo user + trả JWT; email trùng → `409`
- [ ] `POST /api/orders` **không có** `Authorization: Bearer` trả `401` (Guard hoạt động)
- [ ] `POST /api/orders` **có** Token: tạo đơn `PENDING`, tự tính lại tổng tiền, từ chối `total` gian lận bằng `400`
- [ ] `GET /api/orders` (có JWT) chỉ trả đơn của user; `GET /api/orders/:id` chi tiết; `POST …/pay` → `PAID`
- [ ] Restart Server đơn **vẫn còn** (Prisma + SQLite)
- [ ] `POST /api/ai/chat` trả `{ reply }`, Key chỉ nằm trong `.env` phía Server
- [ ] Swagger chạy tại `/api/docs`, đủ nhóm Auth/Products/Orders/Ai, nút "Authorize" hoạt động; `.env.example` đã commit, `.env` và `prisma/dev.db` thì không
- [ ] `main.ts` có đủ: `enableCors()`, `useGlobalPipes(ValidationPipe)`, `listen(3000, '0.0.0.0')`

**Mobile `ShopAI`:**
- [ ] Chỉ **một nơi** khai báo địa chỉ Server: `src/constants/api.ts`; `axiosClient.baseURL` trỏ đúng `API_BASE_URL`
- [ ] `LoginScreen` / `RegisterScreen` gọi API thật — không còn `mock_token_123`
- [ ] `HomeScreen` fetch sản phẩm thật, vẫn qua Zod
- [ ] `ProductDetailScreen` fetch theo `id`, xử lý được `404`
- [ ] `CheckoutScreen` gọi `POST /api/orders` qua `axiosClient`, hiện mã đơn `PENDING`, **chỉ xóa giỏ khi thành công**
- [ ] Tab Đơn hàng + Chi tiết HĐ lấy từ Nest; nút Pay gọi `POST …/pay` → `PAID`
- [ ] `AIChatScreen` không còn import `@google/generative-ai`; đã xóa `geminiConfig.ts`

---

## Chương 10 – Môi trường, Crashlytics, Release & OTA

**Cấu hình môi trường:**
- [ ] `src/constants/env.ts` khai báo đủ `APP_ENV`, `API_BASE_URL`, `ENABLE_CRASHLYTICS`
- [ ] Không còn chỗ nào hardcode IP LAN ngoài `env.ts`

**Crashlytics:**
- [ ] Firebase Crashlytics hoạt động, Dashboard nhận được Test Crash
- [ ] Nút test Crash chỉ có trong `__DEV__`
- [ ] Lỗi fetch ở `HomeScreen` ghi Non-Fatal qua `recordError`, App không sập khi mất mạng
- [ ] Lỗi đặt hàng ở `CheckoutScreen` ghi với tên `CheckoutOrderFailed`, kèm Breadcrumb và Custom Keys
- [ ] `mappingFileUploadEnabled true` đã bật cho `buildTypes.release`

**Không phá vỡ tính năng cũ:**
- [ ] `App.tsx` còn đủ `SafeAreaProvider`, `QueryClientProvider`, `NavigationContainer`, `AuthStack`, `MainTabNavigator`
- [ ] Toàn bộ luồng Chương 9 (sản phẩm, chi tiết, đặt hàng, chat AI) vẫn chạy đúng

**Release & OTA:**
- [ ] Đã tạo `shopai-release.keystore`, **đã sao lưu**, `.gitignore` đã chặn
- [ ] `./gradlew bundleRelease` thành công, sinh `app-release.aab` đã ký
- [ ] Bản Release chạy được trên máy thật (R8 không làm crash)
- [ ] `eas.json` đủ 3 profile `development` / `preview` / `production`
- [ ] Hiểu: EAS Update/`code-push-server` chỉ vá JS, không vá Native; không dùng CodePush/App Center (ngừng từ 3/2025)
- [ ] Biết rollback OTA lỗi bằng `eas update:republish` hoặc `eas channel:edit`

**iOS & EAS Build:**
- [ ] Hoàn thành Bundle ID + Automatic Signing + Team trên Xcode (nếu có Mac), HOẶC ghi rõ lý do bỏ qua
- [ ] Chạy được `npx react-native run-ios --mode Release` (nếu có Mac) hoặc nắm quy trình Archive → TestFlight
- [ ] Chạy thành công **ít nhất một**: `eas build --platform android --profile preview` HOẶC `./gradlew bundleRelease`
- [ ] Biết chọn Cloud (EAS Build) hay Local cho từng tình huống

---

## Chương 11 – Testing & CI/CD

**Tầng 1 — Unit Test (Jest):**
- [ ] `formatCurrency` tách ra `src/utils/formatCurrency.ts`, có Unit Test PASS
- [ ] `useCartStore.test.ts` PASS: `addItem` (gồm gộp số lượng), `removeItem`, `totalPrice`, `totalQuantity`, `clearCart`
- [ ] `jest.setup.js` mock đủ Native Module (Crashlytics, SecureStore, AsyncStorage, Reanimated)

**Tầng 2 — Integration Test (RNTL):**
- [ ] **[Đề cương]** `ShopButton.test.tsx` PASS, kiểm tra cả `onPress` và `disabled`

**Tầng 3 — E2E (Maestro):**
- [ ] `maestro test .maestro/login_home.yaml` PASS, đúng UI thật của ShopAI
- [ ] `maestro test .maestro/cart_checkout.yaml` PASS với Server NestJS đang bật
- [ ] `appId` trong Maestro khớp `applicationId` trong `android/app/build.gradle`

**Coverage & công cụ:**
- [ ] `npm run test:coverage` chạy được, sinh `coverage/`
- [ ] `coverageThreshold` đã cấu hình, test hiện tại vượt ngưỡng
- [ ] `coverage/` có trong `.gitignore`
- [ ] **[Đề cương]** Biết mở React Native DevTools (`j` trong Metro), hiểu vai trò Network Inspector của Flipper

**CI/CD:**
- [ ] `.github/workflows/ci.yml` tự chạy khi `git push`, có Lint và Test
- [ ] Pipeline có Matrix nhiều phiên bản Node, có Cache, upload Artifact coverage
- [ ] *(Tùy chọn)* Husky + lint-staged chạy khi `git commit`
- [ ] Hiểu ranh giới: CI bắt buộc nắm; CD (Fastlane) là kiến thức mở rộng

**Tầng 4 — Backend NestJS (Jest + Supertest):**
- [ ] `AuthModule` + Prisma + `JwtAuthGuard` từ Sprint 9 còn nguyên
- [ ] `src/auth/auth.service.spec.ts` PASS — `login` thành công, `validateUser` ném `UnauthorizedException` ở cả 2 nhánh sai email/sai mật khẩu
- [ ] `test/auth-orders.e2e-spec.ts` PASS — login trả `accessToken`; `POST /api/orders` trả `401` khi thiếu Token, `201` khi có Token
- [ ] `npm run test:e2e` (trong `shopai-backend`) chạy sạch, không treo (có `afterAll(() => app.close())`)
- [ ] *(Tùy chọn)* Job `backend-test` chạy trong CI, độc lập với job `test` của Mobile