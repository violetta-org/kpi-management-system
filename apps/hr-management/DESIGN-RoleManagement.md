# DESIGN.md: Role Management - Tabbed Interface

## 1. Navigation Tabs (Tab List)
Hệ thống sử dụng component Tabs của Radix UI/Tailwind CSS để chuyển đổi giữa các góc nhìn dữ liệu.

- **Container**: Một dải màu xám nhạt (`bg-muted`), bo góc `8px` (`rounded-lg`), padding `3px`.
- **Tab Triggers**:
  - **Font Size**: `14px` (text-sm)
  - **Weight**: `500` (Medium)
  - **Padding**: `4px 8px` (px-2 py-1)
  - **Active State (`Assignment History`)**: 
    - Nền trắng (`bg-background`), có đổ bóng nhẹ (`shadow-sm`).
    - Bo góc `6px` (`rounded-md`).
    - Chữ màu đen (`text-foreground`).
  - **Inactive State (`Users & Assignments`)**:
    - Nền trong suốt, chữ màu xám (`text-muted-foreground`).

## 2. Tab Content: Assignment History (Active)
Khi tab **Assignment History** được chọn, nội dung bên dưới hiển thị lịch sử thay đổi quyền của hệ thống.

### 2.1. Card Header
- **Title**: "Role Assignment History" (`font-semibold`, `text-lg`).
- **Description**: "View all role assignments and their status" (`text-muted-foreground`, `text-sm`).

### 2.2. Data Table Structure
Bảng hiển thị lịch sử với các cột sau:
- **User**: Tên người dùng được gán quyền.
- **Role**: Tên quyền (Role) được gán.
- **Assigned By**: Người thực hiện việc gán quyền.
- **Date**: Ngày thực hiện.
- **Status**: Trạng thái (VD: Active, Revoked).
- **Notes**: Ghi chú đi kèm.
- **Actions**: Các thao tác (VD: View details).

- **Header Divider**: Một đường kẻ đen (`border-b`) ngăn cách tiêu đề cột và nội dung.
- **Spacing**: Khoảng cách giữa các cột được phân bổ đều (`flex-1` hoặc `grid-cols-7`).

### 2.3. Empty State (Lúc chưa có dữ liệu)
- **Container**: Căn giữa nội dung bên trong bảng (`text-center`).
- **Main Text**: "No role assignments" (`font-medium`).
- **Subtext**: "No roles have been explicitly assigned yet." (`text-muted-foreground`).

## 3. Layout Principles
- **Vertical Spacing**: Sử dụng `space-y-4` (16px) hoặc `space-y-6` (24px) để ngăn cách Header Card, Tab List và Content Card.
- **Responsiveness**: Trên màn hình nhỏ (`sm`), các cột trong bảng có thể được ẩn bớt hoặc chuyển sang dạng list; trên màn hình lớn (`md`, `lg`), hiển thị đầy đủ bảng dữ liệu.

## 4. Role-Based Permissions & Views (SuperAdmin vs HR Manager)
Hệ thống phân quyền truy cập cho tính năng Roles Management dựa trên vai trò hiện tại của người dùng đăng nhập (`activeRole`):

### 4.1. Super Admin (Admin) - Quyền tối cao
Super Admin có toàn quyền kiểm soát hệ thống phân quyền:
- **Gán vai trò (Assign Role)**: Được phép gán mọi vai trò (`Employee`, `ProjectManager`, `HRManager`, `Admin`) cho bất kỳ người dùng nào.
- **Thu hồi vai trò (Revoke Role)**: Được phép thu hồi vai trò đã gán của bất kỳ người dùng nào, kể cả các Super Admin khác.
- **Xem Lịch sử (Assignment History)**: Xem toàn bộ lịch sử thay đổi quyền của hệ thống không giới hạn.

### 4.2. HR Manager - Quyền hạn chế
HR Manager được phép quản lý quyền của nhân viên thông thường nhưng bị giới hạn đối với vai trò quản trị cấp cao:
- **Gán vai trò (Assign Role)**:
  - Chỉ được phép gán các vai trò: `Employee`, `ProjectManager`, `HRManager`.
  - **KHÔNG** được phép gán vai trò `Admin` (Super Admin). Lựa chọn "Super Admin" sẽ bị ẩn khỏi danh sách select khi HR Manager thực hiện gán quyền.
- **Thu hồi vai trò (Revoke Role)**:
  - Chỉ được phép thu hồi vai trò của các tài khoản có vai trò hiện tại là `Employee`, `ProjectManager`, `HRManager`.
  - **KHÔNG** được phép thu hồi vai trò của bất kỳ tài khoản nào đang là `Admin` (Super Admin). Nút "Revoke" sẽ bị ẩn đối với các tài khoản này.
- **Xem Lịch sử (Assignment History)**: Xem lịch sử gán quyền bình thường, nhưng các thông tin nhạy cảm liên quan đến việc thay đổi quyền Admin sẽ được hiển thị dưới dạng chỉ đọc hoặc ẩn các thao tác chỉnh sửa sâu hơn.