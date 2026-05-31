# QA Testing Report: KPI Management System

## 1. Thông tin chung

* **Người thực hiện:** Nguyễn Hữu Minh Quân (Vai trò: Employee)
* **Ngày thực hiện:** 29/05/2026
* **Nền tảng:** Microsoft Power Platform (Canvas App)

---

## 2. Timeline of Events & Bug Log

| Bước | Tính năng kiểm thử | Thao tác thực hiện | Kết quả thực tế | FIXED | Trạng thái / Ghi chú (Bug Log) |
| --- | --- | --- | --- | --- | --- |
| **1** | **Dashboard (Khởi tạo)** | Truy cập hệ thống lần đầu dưới quyền Employee. | Mọi chỉ số (Tasks, Hours, KPIs) đều bằng `0`. Giao diện sạch. | No | **Pass** |
| **2** | **Timesheets (Log công)** | Bấm `Log Time ->`, điền mô tả công việc, nhập **8 giờ** cho ngày 29/05/2026, bỏ trống ô chọn Project. | Hệ thống tự động xếp vào **"Không thuộc dự án"**. Lưu thành công trạng thái **Pending**. | No | **Pass** (Tính năng tự động gán nhiệm vụ chung hoạt động tốt). |
| **3** | **Dashboard (Đồng bộ)** | Quay lại kiểm tra màn hình chính sau khi log công. | Ô *Hours This Week* tăng lên **8.0h**, ô *Pending Approvals* tăng lên **1**. | No | **Pass** (Dữ liệu đồng bộ realtime). |
| **4** | **Task Management (Tạo việc)** | Vào mục *My Tasks*, bấm `+ New Task` để tự tạo việc với hạn chót là 29/05/2026. | Các ô *Project, Phase, Objective, Subtask* trống và không chọn được do thiếu dữ liệu cấu hình từ cấp Admin. | No | **Observation** (Hệ thống ràng buộc dữ liệu dạng thác nước). |
| **5** | **Task Display (Hiển thị việc)** | Kiểm tra thẻ nhiệm vụ vừa tạo ngoài danh sách. | Thẻ hiện đúng tên việc, trạng thái **In Progress**. Tuy nhiên, dòng phân công lại ghi là **"Chưa phân công"**. | Yes | ✅ **Fixed:** Form tạo đã chọn Assignee là chính mình và thẻ hiển thị đúng thông tin phân công. |
| **6** | **Task Lifecycle (Đóng việc)** | Bấm nút `Hoàn tất` trên thẻ công việc. | Trạng thái chuyển sang **Completed** (Màu xanh lá). Nút hành động biến mất. | No | **Pass** |
| **7** | **Dashboard (Thống kê việc)** | Quay lại Dashboard xem cập nhật sau khi hoàn tất task đầu tiên. | Thống kê *Weekly Progress* ghi nhận **1 tasks**, nhưng ô *Tasks Due Today* và *upcoming* về lại `0`. | No | **Pass** (Logic ẩn việc đã hoàn thành hoạt động đúng). |
| **8** | **Dashboard (Cảnh báo hạn)** | Tạo thêm 1 task mới có hạn là ngày hôm nay (29/05/2026) và giữ nguyên trạng thái *In Progress*. | Ô *Tasks Due Today* nhảy lên **1**. Đồng thời xuất hiện banner màu đỏ thông báo: *"Bạn đang có các công việc trễ hạn!"* | Yes | ✅ **Fixed (30/05/2026):** Đã sửa logic so sánh ngày (date-only) để chỉ coi task là trễ hạn khi ngày hạn đã qua; banner Dashboard, modal thông báo và số *Tasks Due Today* đã được cập nhật và triển khai. |
| **9** | **My KPIs (Theo dõi hiệu suất)** | Bấm `View KPIs ->` để xem biểu đồ mục tiêu cá nhân. | Giao diện hiện **0** chỉ số và thông báo trống (*No KPI targets found*). | No | **Pass** (Đúng logic vì tài khoản chưa được HR/Admin giao KPI). |
| **10** | **Requests (Điều hướng)** | Bấm vào nút `Requests` (Hình cái chuông) trên menu điều hướng bên trái. | Ứng dụng không chuyển trang mà tự động tải lại (load) về trang **Dashboard**. | No | ❌ **Bug Navigation:** Lỗi gán sai hàm điều hướng (`Navigate`) trên thuộc tính `OnSelect` của nút Requests. |

---

## 3. Đánh giá tổng quan

* **Mức độ hoàn thiện:** Khung giao diện (UI) đẹp, trực quan, các luồng tính toán số giờ (Timesheets) và trạng thái Task cơ bản hoạt động mượt mà.
* **Vấn đề cần xử lý:** Cần chuyển sang vai trò **Project Manager / HR Manager** để cấu hình dữ liệu nền (Dự án, KPIs) nhằm kiểm thử sâu hơn, đồng thời chuyển danh sách 3 Bug phát hiện ở trên cho đội phát triển (Dev) để fix lỗi điều hướng và logic hiển thị.