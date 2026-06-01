# 📋 Hướng Dẫn Kiểm Thử & Demo Hệ Thống KPI Management System (A-Z)

> **Mục đích:** Giúp người chưa biết gì về hệ thống có thể nắm bắt toàn bộ chức năng để thuyết trình/bảo vệ trước hội đồng.

---

## 🔑 Bước 0: Đăng nhập & Chuyển đổi vai trò

1. Mở ứng dụng trên trình duyệt (Power Apps / localhost).
2. Hệ thống yêu cầu đăng nhập bằng tài khoản Microsoft (OAuth2).
3. Sau khi đăng nhập, ở **góc trên bên phải** có dropdown chọn vai trò:
   - **Admin**: Thấy toàn bộ 16 menu, toàn quyền CRUD.
   - **Employee**: Chỉ thấy 5 menu cơ bản (Dashboard, Tasks, Timesheets, KPI, Requests).
4. Có nút **🌐 EN/VI** để chuyển ngôn ngữ Anh ↔ Việt.
5. Có **icon chuông 🔔** để xem thông báo hệ thống.

> [!TIP]
> Khi demo, hãy bắt đầu bằng vai trò **Admin** để giới thiệu tổng quan, sau đó chuyển sang **Employee** để demo góc nhìn nhân viên.

---

## 📊 Module 1: Dashboard (Bảng điều khiển)

**Menu:** `Bảng điều khiển` (mục đầu tiên trên sidebar)

### Kiểm thử:
| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Click menu "Bảng điều khiển" | Hiển thị trang Dashboard với nhiều widget |
| 2 | Xem widget **Headcount Metrics** | Thống kê tổng số nhân sự, tỷ lệ active |
| 3 | Xem widget **Bell Curve** | Biểu đồ phân phối điểm đánh giá (đường cong) |
| 4 | Xem widget **KPI Risk Predictor** | Hiển thị cảnh báo KPI đang At Risk / High Risk |
| 5 | Xem widget **Workload Heatmap** | Phân loại nhân sự: Overloaded / Optimal / Underutilized |
| 6 | Xem widget **Hiệu suất theo công ty** | Thanh progress KPI Achievement + Task Completion |
| 7 | Xem widget **Compliance** | Tỷ lệ nhân sự đã nộp tự đánh giá / quản lý đã chấm |
| 8 | Click ⚙️ **Cài đặt Dashboard** | Modal cho phép bật/tắt từng widget |
| 9 | Tắt 1 widget → Lưu | Widget biến mất khỏi Dashboard |

> [!IMPORTANT]
> Dashboard là điểm nhấn demo quan trọng nhất — nơi tổng hợp dữ liệu từ mọi module.

---

## ✅ Module 2: Tasks (Công việc)

**Menu:** `Công việc`

### Kiểm thử:
| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách Task | Hiển thị bảng Tasks với cột: Tên, Trạng thái, Assignee, Project, Due Date |
| 2 | Dùng **ô tìm kiếm** | Lọc tasks theo từ khóa |
| 3 | Lọc theo **Project** (dropdown) | Chỉ hiện tasks thuộc project đã chọn |
| 4 | Click **"+ Tạo Task"** | Mở modal tạo Task mới |
| 5 | Điền: Tên, Mô tả, Project, Phase, Assignee, Due Date → Lưu | Task mới xuất hiện trong danh sách |
| 6 | Click icon ✏️ sửa 1 task | Modal edit mở ra với dữ liệu cũ |
| 7 | Đổi Status sang "Completed" → Lưu | Trạng thái task cập nhật |
| 8 | Kiểm tra task có **subtask** (parent-child) | Task con hiển thị lồng dưới task cha |

---

## ⏱️ Module 3: Timesheets (Chấm công & Phép)

**Menu:** `Chấm công & Phép`

### Sub-tabs:
- **Timesheet Logs**: Nhật ký giờ làm
- **Leave Balances**: Quỹ phép năm
- **Leave Requests**: Đơn xin nghỉ phép
- **Holidays**: Ngày lễ
- **Overtime**: Yêu cầu tăng ca

### Kiểm thử:
| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Tab **Timesheet Logs** → Click **"+ Log giờ"** | Modal: chọn Task, nhập số giờ, ngày, mô tả |
| 2 | Tạo timesheet → Lưu | Bản ghi mới với status "Pending" |
| 3 | (Admin) Click **Approve** trên 1 timesheet | Status → Approved |
| 4 | (Admin) Click **Reject** → nhập lý do | Status → Rejected, hiển thị lý do |
| 5 | Tab **Leave Balances** | Bảng quỹ phép: Entitlement, Carried Over, Used Days |
| 6 | Tab **Leave Requests** → **"+ Tạo đơn nghỉ"** | Modal: loại phép, ngày bắt đầu/kết thúc, lý do |
| 7 | Tab **Holidays** → **"+ Thêm ngày lễ"** | Thêm ngày lễ vào lịch |
| 8 | Tab **Overtime** → **"+ Đăng ký OT"** | Tạo yêu cầu tăng ca |

---

## 🎯 Module 4: KPI (KPI của tôi)

**Menu:** `KPI của tôi`

### Sub-tabs: Danh sách KPI | Biểu đồ | Capacity Alerts

### Kiểm thử:
| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách KPI targets | Bảng: Tên KPI, Target, Actual, Weight, Achievement % |
| 2 | Lọc theo **Employee / Objective / Period** | Danh sách lọc tương ứng |
| 3 | Click **"+ Tạo KPI Target"** | Modal: tên, target, actual, weight, gán employee/objective |
| 4 | Xem cột **Achievement %** | Tự động tính = (Actual/Target)*100 |
| 5 | Kiểm tra KPI có formula **#TASKS_ON_TIME** | Actual tự động = % tasks hoàn thành đúng hạn |
| 6 | Kiểm tra KPI có formula **#HOURS_LOGGED** | Actual tự động = tổng giờ timesheet approved |
| 7 | Xem **KPI Tree** (parent-child rollup) | KPI cha tính Sum/Average từ KPI con |
| 8 | Click **🤖 AI Generate** | AI tự sinh KPI suggestions (Gemini API) |
| 9 | Tab **Capacity Alerts** | Cảnh báo nhân sự vượt giờ hoặc quá nhiều task |

> [!NOTE]
> Đây là module phức tạp nhất, tích hợp AI Advisory. KPI Achievement Rate tự động tính dựa trên dữ liệu Tasks và Timesheets — đây là điểm nhấn kỹ thuật.

---

## 🏆 Module 5: Performance (Đánh giá hiệu suất)

**Menu:** `Đánh giá hiệu suất` (chỉ Admin thấy)

### Sub-tabs: Appraisals | Evaluation Periods | Competency | IDP

### Kiểm thử:
| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Tab **Evaluation Periods** → Tạo kỳ đánh giá | Nhập tên, ngày bắt đầu/kết thúc |
| 2 | **Lock** 1 period | Period hiển thị 🔒, không cho sửa KPI trong period đó |
| 3 | Tab **Appraisals** → **"+ Giao đánh giá"** | Chọn employee, evaluator, period |
| 4 | Xem bảng Appraisals | Cột: Employee, Score, Rating, Status |
| 5 | Tab **Competency** → Xem danh sách năng lực | Tên năng lực, loại, max level |
| 6 | Gán **Job Competency** cho vị trí | Chọn competency + required level |
| 7 | Tab **IDP** → Xem kế hoạch phát triển cá nhân | Danh sách IDP + Actions |
| 8 | Xem **Bonus Matrix** | Bảng: Min Score, Max Score, Multiplier |

---

## 🏢 Module 6: Companies (Công ty)

**Menu:** `Công ty` (Admin only)

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách công ty | Bảng: Mã công ty, Tên công ty |
| 2 | Click **"+ Thêm công ty"** | Modal nhập Company Code + Name |
| 3 | Click **"+ Thêm phòng ban"** | Modal: Mã PB, Tên PB, thuộc Công ty nào |
| 4 | Sửa / Xóa công ty | CRUD hoạt động bình thường |

---

## 📑 Module 7: Positions (Danh mục chức danh)

**Menu:** `Danh mục chức danh` (Admin only)

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách Position Catalog | Bảng: Mã, Tên chức danh |
| 2 | Tạo **Job Position** mới | Chọn Department, Catalog, Quota |
| 3 | Xem **Headcount Quota vs Actual** | So sánh định biên vs thực tế |

---

## 👥 Module 8: Headcount (Định biên nhân sự)

**Menu:** `Định biên nhân sự` (Admin only)

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách yêu cầu tuyển dụng | Bảng: Tên YC, Loại, PB, Số lượng, Trạng thái |
| 2 | Click **"+ Tạo yêu cầu"** | Modal: Loại (New/Replace), PB, Position, Qty, Lý do |
| 3 | Duyệt / Từ chối yêu cầu | Status chuyển Approved/Rejected |

---

## 📝 Module 9: Requests (Yêu cầu phê duyệt)

**Menu:** `Yêu cầu phê duyệt`

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách Change Requests | Các yêu cầu thay đổi đang chờ duyệt |
| 2 | Expand 1 request | Hiển thị diff: giá trị cũ ↔ mới |
| 3 | Click **Approve / Reject** | Cập nhật bản ghi gốc nếu Approved |

> [!NOTE]
> Module này hoạt động theo cơ chế **Approval Engine** — khi Employee sửa dữ liệu, thay vì lưu trực tiếp, hệ thống tạo Change Request để Admin duyệt.

---

## 📁 Module 10: Resources (Quản lý dự án)

**Menu:** `Quản lý dự án` (Admin/PM only)

### Sub-tabs: Projects | Resource Allocation

### Kiểm thử:
| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách Projects | Bảng: Tên, Status, Start/End Date |
| 2 | Click **"+ Tạo dự án"** | Modal: Tên, mô tả, ngày, trạng thái |
| 3 | Click vào 1 Project → Xem chi tiết | Hiển thị Phases, Risks, Team Members |
| 4 | **"+ Thêm Phase"** cho project | Tạo giai đoạn mới |
| 5 | **"+ Thêm Risk"** cho project | Tạo rủi ro: Impact, Probability, Mitigation |
| 6 | Tab **Resource Allocation** | Bảng phân bổ nhân sự: User, Project, % Allocation |
| 7 | Tạo allocation **> 100%** | Hệ thống cảnh báo overallocation |
| 8 | Click **🤖 AI Suggest** | AI gợi ý nhân sự phù hợp cho dự án |

---

## 👤 Module 11: Directory (Danh bạ nhân viên)

**Menu:** `Danh bạ nhân viên` (Admin only)

### Sub-tabs: Employee List | Org Chart | Permission Groups

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách nhân viên | Bảng: Tên, Email, Job Position, Role, Active |
| 2 | Click **"+ Thêm nhân viên"** | Modal: Tên, Email, Job Position |
| 3 | Click tên nhân viên | Xem profile chi tiết (KPI, Tasks, Timesheets) |
| 4 | **Gán Role** cho nhân viên | Chọn Permission Group |
| 5 | Tab **Org Chart** | Sơ đồ tổ chức dạng cây (expandable) |
| 6 | Tab **Permission Groups** | Tạo/sửa nhóm quyền, chọn tabs được phép truy cập |

> [!IMPORTANT]
> **Permission Groups** là cơ chế RBAC (Role-Based Access Control) — điểm nhấn bảo mật quan trọng khi demo.

---

## 📚 Module 12: KPI Catalog (Danh mục KPI)

**Menu:** `Danh mục KPI` (Admin only)

### Sub-tabs: KPI Library | Objectives | Evaluation Periods | Bonus Matrix

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Tab **KPI Library** → Tạo KPI mẫu | Nhập: Tên, Unit, Formula, Direction |
| 2 | Tab **Objectives** → Tạo mục tiêu | Nhập: Tên, Target, gắn Period |
| 3 | Tab **Evaluation Periods** | Quản lý kỳ đánh giá (CRUD + Lock) |
| 4 | Tab **Bonus Matrix** | Cấu hình: Min/Max Score → Multiplier |

---

## ✅ Module 13: Approval Routes (Quy trình phê duyệt)

**Menu:** `Quy trình phê duyệt` (Admin only)

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách Approval Routes | Bảng: Route Name, Entity, Operation, Approver |
| 2 | Click **"+ Tạo Route"** | Modal: Entity, Operation, Requester Role, Approver |
| 3 | Sửa route → thay đổi Approver | Lần sau request sẽ gửi cho approver mới |

---

## 🔄 Module 14: My Processes (Quy trình của tôi)

**Menu:** `Quy trình của tôi`

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Xem danh sách Employee Processes | Bảng: Tên quy trình, Template, Trạng thái |
| 2 | Click xem chi tiết | Hiển thị các Process Steps + trạng thái từng bước |
| 3 | Đánh dấu step hoàn thành | Step chuyển sang trạng thái Done |

---

## 🤖 Module 15: AI Chatbot (Trợ lý AI)

**Vị trí:** Nút chat ở **góc dưới bên phải** màn hình

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Click icon chat | Mở cửa sổ AI Chatbot |
| 2 | Hỏi "Phân tích hiệu suất Bob" | AI trả lời dựa trên dữ liệu KPI/Task thực |
| 3 | Hỏi "Gợi ý KPI cho developer" | AI sinh danh sách KPI phù hợp |
| 4 | Hỏi câu hỏi chung về hệ thống | AI trả lời bằng ngữ cảnh hệ thống |

> [!TIP]
> AI Chatbot sử dụng **Google Gemini API**, nhận toàn bộ snapshot dữ liệu hệ thống làm context để trả lời chính xác.

---

## ⚙️ Module 16: System Seed (Admin only)

**Menu:** `System Seed` (chỉ hiện khi vai trò Admin)

| # | Hành động | Kết quả mong đợi |
|---|-----------|-------------------|
| 1 | Click nút Seed Data | Tự động tạo dữ liệu mẫu cho toàn bộ hệ thống |

---

## 🎓 Kịch Bản Demo Bảo Vệ (Gợi ý 15 phút)

### Phút 1-2: Giới thiệu tổng quan
- Đăng nhập → Dashboard (Admin) → Giới thiệu các widget

### Phút 3-5: Luồng quản lý dự án
- Resources → Xem project "FPT Smart Traffic Engine" → Phases → Team → Allocation

### Phút 5-7: Luồng công việc
- Tasks → Tạo task mới → Gán cho nhân viên → Log timesheet

### Phút 7-9: Luồng KPI
- KPI Catalog → Tạo KPI Library → Tạo Objective
- KPI của tôi → Gán KPI Target → Xem auto-calculate từ Tasks/Timesheets

### Phút 9-11: Đánh giá hiệu suất
- Performance → Tạo Evaluation Period → Giao Appraisal → Xem Bell Curve

### Phút 11-12: Phân quyền & Approval
- Directory → Permission Groups → Tạo nhóm quyền
- Chuyển sang Employee → Thấy menu bị ẩn
- Sửa dữ liệu → Tạo Change Request → Chuyển Admin duyệt

### Phút 12-14: AI Advisory
- Mở AI Chatbot → Hỏi phân tích hiệu suất → AI trả lời dựa trên data thực
- KPI → Click AI Generate → AI sinh KPI suggestions

### Phút 14-15: Tổng kết
- Quay lại Dashboard → Chỉ ra các widget đã phản ánh đúng dữ liệu vừa tạo

---

## 🗂️ Tổng Kết Các Module

| STT | Module | Menu | Vai trò | Mô tả |
|-----|--------|------|---------|-------|
| 1 | Dashboard | Bảng điều khiển | All | Tổng quan dữ liệu toàn hệ thống |
| 2 | Tasks | Công việc | All | CRUD công việc, gán dự án/phase |
| 3 | My Processes | Quy trình của tôi | All | Theo dõi quy trình onboarding |
| 4 | Timesheets | Chấm công & Phép | All | Log giờ, nghỉ phép, OT, holidays |
| 5 | KPI | KPI của tôi | All | Theo dõi chỉ tiêu KPI cá nhân |
| 6 | Performance | Đánh giá hiệu suất | Admin | Appraisals, Competency, IDP |
| 7 | Requests | Yêu cầu phê duyệt | All | Duyệt/từ chối change requests |
| 8 | Resources | Quản lý dự án | Admin/PM | Projects, Phases, Risks, Allocation |
| 9 | Directory | Danh bạ nhân viên | Admin | CRUD nhân viên, Org Chart, RBAC |
| 10 | Companies | Công ty | Admin | Quản lý công ty + phòng ban |
| 11 | Positions | Danh mục chức danh | Admin | Position Catalog + Job Positions |
| 12 | KPI Catalog | Danh mục KPI | Admin | KPI Library, Objectives, Periods |
| 13 | Headcount | Định biên nhân sự | Admin | Yêu cầu tuyển dụng |
| 14 | Routes | Quy trình phê duyệt | Admin | Cấu hình luồng approval |
| 15 | AI Chatbot | Nút chat (góc phải) | All | Trợ lý AI phân tích dữ liệu |
| 16 | System Seed | System Seed | Admin | Khởi tạo dữ liệu mẫu |
