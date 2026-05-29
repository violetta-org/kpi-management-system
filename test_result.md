Lỗi này xảy ra do script Python trước đó đã gộp toàn bộ dữ liệu log vào chung một dòng văn bản thô (kèm ký tự `||`), làm hỏng cấu trúc bảng của trình hiển thị Markdown trong Cursor/VS Code.

Để khắc phục triệt để lỗi hiển thị này, cấu trúc nhật ký dưới đây đã được chuyển đổi sang dạng **danh bạ phân đoạn (Structured List)** giúp hiển thị chuẩn xác 100% trên mọi trình đọc Markdown:

---

# Báo cáo Nhật ký Sự cố và Vận hành Hệ thống

## 1. Tóm tắt Đánh giá (Executive Summary)

Tài liệu này thiết lập cấu trúc truy vết đối với chuỗi hành động kiểm thử trong phân hệ Quản lý Dự án (QLDA) trên nền tảng Power Apps và Dataverse. Chuỗi vận hành tập trung phân tích các bất thường trong tích hợp hệ thống, kiểm tra tính toàn vẹn dữ liệu khi ghi và các lỗi dựng hình giao diện (UI Rendering).

## 2. Thông tin Sự cố (Incident Information)

* **Loại sự cố**: Thất bại tích hợp dữ liệu hệ thống & Sai lệch liên kết thực thể.
* **Mã thời gian**: 2026-05-30 04:05:00
* **Môi trường**: QLDA Workspaces / Dynamics 365 (Super Admin).

---

## 3. Nhật ký Trình tự Sự kiện (Timeline of Events)

### 📌 Bước 2.1 | Khởi tạo Thực thể | Trạng thái: PASS

* **Mã thời gian:** 2026-05-30 03:45:12
* **Sự kiện:** Gửi yêu cầu tạo dự án `Traffic Analysis Engine` (Mô tả: `Phần mềm phân tích mật độ giao thông`, Trạng thái: *Chưa bắt đầu*).
* **Chi tiết:** Bản ghi được đẩy vào Dataverse thành công và hiển thị ngay trên lưới danh sách công việc.

### 📌 Bước 2.2 | Thiết lập Giai đoạn | Trạng thái: PASS

* **Mã thời gian:** 2026-05-30 03:48:45
* **Sự kiện:** Thêm mới giai đoạn phụ thuộc `Phase 1: Database Setup & Integration` (Trạng thái: *Đang thực hiện*).
* **Chi tiết:** Hệ thống không có trường nhập ngày theo thiết kế form. Tag trạng thái hiển thị chính xác màu xanh dương trên panel chi tiết.

### 📌 Bước 2.3 | Thao tác Giao diện | Mã lỗi: BUG-01 (Major Severity)

* **Mã thời gian:** 2026-05-30 03:50:30
* **Sự kiện:** Điều hướng sang tab phân bổ nguồn lực `Project Allocations`.
* **Chi tiết:** Giao diện báo trống và nút hành động cốt lõi `+ Phân bổ nhân sự` hoàn toàn biến mất, chặn đứng luồng nghiệp vụ gán nhân sự.

### 📌 Bước 2.4 | Đồng bộ Dataverse | Mã lỗi: BUG-02 (Critical - Silent Failure)

* **Mã thời gian:** 2026-05-30 03:52:18
* **Sự kiện:** Kích hoạt form gán KPI mới `Đảm bảo 95% Task đúng hạn` cho nhân sự.
* **Chi tiết:** Bấm nút lưu thì form đóng bình thường nhưng không ghi nhận bản ghi. Thực hiện lệnh tải lại trang (F5 Refresh), lưới dữ liệu vẫn báo trống và không xuất hiện thông báo lỗi.

### 📌 Bước 2.5 | Tra cứu Thực thể | Mã lỗi: BUG-03 (Minor - UI Rendering Bug)

* **Mã thời gian:** 2026-05-30 03:55:02
* **Sự kiện:** Khởi tạo Task `Thiết lập Schema Dataverse cho bảng ProjectRisk` liên kết với dự án.
* **Chi tiết:** Thao tác tạo thành công nhưng thẻ công việc ngoài danh sách hiển thị bị gán nhãn sai lệch thành `"Không thuộc dự án"`.

### 📌 Bước 2.5b | Kiểm tra Biểu mẫu | Trạng thái: PASS

* **Mã thời gian:** 2026-05-30 03:55:45
* **Sự kiện:** Kích hoạt nút `Edit` trên thẻ công việc bị lỗi hiển thị nhãn ở bước 2.5.
* **Chi tiết:** Bên trong biểu mẫu chỉnh sửa, trường tra cứu `Project` vẫn giữ đúng giá trị liên kết cũ. Xác nhận dữ liệu backend lưu đúng nhưng lớp hiển thị ngoài Gallery bị sai cấu trúc tham chiếu.

### 📌 Bước 2.5c | Thay đổi Trạng thái | Trạng thái: PASS

* **Mã thời gian:** 2026-05-30 03:56:40
* **Sự kiện:** Tương tác trực tiếp với nút hành động `Hoàn tất` ngoài danh sách Task.
* **Chi tiết:** Hệ thống cập nhật trạng thái sang `Completed` màu xanh lá và ẩn nút bấm tương ứng ngay lập tức theo đúng thiết kế phản ứng giao diện.

### 📌 Bước 2.6 | Đồng bộ Dataverse | Mã lỗi: BUG-04 (Critical - Silent Failure)

* **Mã thời gian:** 2026-05-30 03:58:15
* **Sự kiện:** Ghi nhận rủi ro mới `Model nặng gây nén sụt giảm FPS trên phần cứng Edge` trong panel dự án.
* **Chi tiết:** Biểu mẫu đóng lại ngay sau khi chọn nút lưu nhưng danh sách rủi ro của dự án vẫn trống trơn. F5 lại trang dữ liệu vẫn hoàn toàn mất mát, không lưu vào bảng thực thể `ProjectRisk`.

### 📌 Bước 2.7 | Phân tích Đồ thị | Mã lỗi: BUG-05 (Expected Behavior)

* **Mã thời gian:** 2026-05-30 04:00:10
* **Sự kiện:** Kiểm tra khả năng tổng hợp đồ thị tại tab `Progress Charts`.
* **Chi tiết:** Hệ thống báo trống `"No KPI progress data"`. Đây là hệ quả trực tiếp từ lỗi mất mát dữ liệu KPI đầu vào của mã lỗi BUG-02.