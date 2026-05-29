# 🚀 Power Platform React Code App - Quản lý Công việc & KPI

Kho lưu trữ này chứa ứng dụng **Code-First React + TypeScript Code App** (Hệ thống Quản lý Công việc & KPI) được phát triển cục bộ và kết nối trực tiếp với môi trường `QLDA` của Microsoft Power Platform.

Ứng dụng ban đầu được xây dựng bằng Vibe Portal (`vibe.powerapps.com`), sau đó đã được chuyển đổi thành công sang cấu trúc **Code App** thuần túy để cho phép kiểm soát bố cục toàn diện, tùy biến linh hoạt ở cấp độ component và hỗ trợ chạy thử nghiệm tối ưu dưới máy cục bộ.

> [!NOTE]
> Chi tiết kiến trúc hệ thống, điều kiện tiên quyết và hướng dẫn cấu hình quản trị được tài liệu hóa chi tiết tại [power_apps_code_apps_research.md](file:///c:/Users/violet/Documents/MQF/Study%20Materials/Sixth%20Semester/QLDA/vibepowerapps/power_apps_code_apps_research.md).
> Đối với việc tích hợp và gọi Power Automate Cloud Flows, vui lòng tham khảo [Hướng dẫn tích hợp Power Automate Flows](file:///c:/Users/violet/Documents/MQF/Study%20Materials/Sixth%20Semester/QLDA/vibepowerapps/docs/power_apps_add_flows_guide.md).

---

## 📂 Cấu trúc dự án (Project Structure)

*   `code-app/`: Thư mục gốc chứa mã nguồn của ứng dụng React + TypeScript Code App.
    *   `src/`: Chứa mã nguồn React.
        *   `App.tsx`: Bảng điều khiển (Dashboard) chính và logic định tuyến giao diện, hỗ trợ giả lập phân quyền người dùng (RBAC).
        *   `index.css` & `App.css`: Hệ thống thiết kế phẳng, viền tối giản (Flat Outline) tông màu nền trắng tinh với điểm nhấn đỏ Crimson (`#b6393a`), góc thẻ bo cong tròn `50px` và phông chữ Fluent UI.
        *   `generated/`: Các TypeScript Models và Services được tạo tự động đại diện cho các bảng dữ liệu kết nối trong Dataverse.
    *   `power.config.json`: File định nghĩa Code App và danh sách các bảng Dataverse đã đăng ký.
*   `src/`: Chứa các thành phần Canvas Solution gốc (được lưu trữ để đối chiếu).

---

## 🛠️ Hướng dẫn Khởi chạy (Phát triển Cục bộ)

### 1. Điều kiện tiên quyết
Đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- Node.js (phiên bản 18 trở lên)
- Git
- CLI thư viện máy khách Power Apps (`@microsoft/power-apps`)

### 2. Khởi tạo & Cấu hình
Để cài đặt các gói phụ thuộc hoặc đăng nhập vào hệ thống Power Platform:
```bash
cd code-app
npm install

# Khởi tạo cấu hình môi trường (qua giao diện tương tác hoặc bằng ID môi trường cụ thể)
npx power-apps init --display-name "KPI Management System" --environment-id 84534e74-80d5-e347-ade4-4236f035288a
```

### 3. Khởi chạy Máy chủ Thử nghiệm
Bắt đầu chạy máy chủ thử nghiệm cục bộ bằng Vite:
```bash
npm run dev
```
Mặc định máy chủ sẽ khởi chạy tại địa chỉ [http://localhost:3000](http://localhost:3000) (được cấu hình trong `power.config.json`).

> [!WARNING]
> **Hạn chế truy cập mạng cục bộ (Chrome/Edge):**
> Trình duyệt hạn chế các yêu cầu từ nguồn web công cộng đến các điểm cuối cục bộ (localhost). Để khắc phục khi debug:
> - Sử dụng cùng một cấu hình trình duyệt đã đăng nhập tài khoản Power Platform Maker.
> - Đảm bảo iframe lưu trữ chứa thuộc tính `allow="local-network-access"`.

---

## 🔄 Đồng bộ hóa bảng Dataverse (Data Sources)

Tất cả 33 bảng Dataverse có tiền tố `cr5db_` được khai báo trong tệp `power.config.json`. Để đồng bộ cấu trúc bảng từ đám mây và tái tạo các tệp TypeScript Model/Service cục bộ:

```bash
# Đồng bộ hóa cấu trúc bảng từ Dataverse
npx power-apps sync
```

Sau khi đồng bộ xong, các tệp mã nguồn sẽ tự động ghi vào thư mục `code-app/src/generated/`. Bạn có thể trực tiếp import để sử dụng:
```typescript
import { UsersService } from './generated/services/UsersService';
```

---

## 🎨 Hệ thống Thiết kế & Giao diện (UI Design System)

Giao diện ứng dụng tuân thủ nghiêm ngặt các mã token thiết kế trong tệp `design-tokens-apps-powerapps-com.json`:
- **Hình nền/Nền Canvas:** Trắng tinh khiết (`#ffffff`)
- **Tông màu chủ đạo (Primary Accent):** Đỏ Crimson (`#b6393a`)
- **Tông màu phụ (Secondary Accent):** Hồng trầm (`#b15058`)
- **Văn bản:** Đen thuần (`#000000` / `#323130`)
- **Đường viền (Borders):** Viền mảnh xám tối (`#262626` / `#e5e5e5`)
- **Bo góc (Rounding):** Bo góc lớn `50px` cho các thẻ chỉ số (metrics) và khung thẻ layout chính, bo góc nhẹ `2px`/`4px` đối với nút nhấn và các trường nhập liệu.
- **Phông chữ (Typography):** Font chữ `Inter` làm tiêu đề, font `sans-serif` mặc định cho nội dung chính.

---

## 📦 Đóng gói & Triển khai lên Đám mây (ALM Deployment)

Để biên dịch mã nguồn React và triển khai ứng dụng trực tiếp lên đám mây Power Platform:
```bash
# 1. Biên dịch ứng dụng React
npm run build

# 2. Đẩy gói ứng dụng đã build trực tiếp lên Power Apps Host
npx power-apps push
```
