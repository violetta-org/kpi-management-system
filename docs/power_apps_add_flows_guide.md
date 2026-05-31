# Hướng Dẫn: Tích Hợp và Gọi Power Automate Flow Từ Code App (Preview)

Tài liệu này hướng dẫn chi tiết cách khám phá, thêm, gọi và gỡ bỏ các **Power Automate Cloud Flows** từ một **Power Apps Code App** sử dụng npm CLI và thư viện client `@microsoft/power-apps`.

> [!IMPORTANT]
> **Điều kiện cốt lõi:**
> Hiện tại hệ thống chỉ hỗ trợ các flow sử dụng trigger **Power Apps (V1 hoặc V2)**. Các flow kích hoạt tự động (automated), theo lịch trình (scheduled), hoặc instant flow sử dụng trigger khác (như Power Apps Button) sẽ **không** được hỗ trợ.

---

## 1. Điều Kiện Tiên Quyết (Prerequisites)

Để tích hợp cloud flow vào dự án Code App của bạn, hãy đảm bảo các yêu cầu sau:

1. **Code App đã được khởi tạo**: Đã cấu hình và đăng nhập thông qua CLI.
2. **Flow nằm trong Solution (Solution-aware)**: Flow phải thuộc một Giải pháp (Solution) trên Power Platform và sử dụng trigger **Power Apps**.
   * *Nếu flow của bạn chưa nằm trong Solution, hãy tham khảo [cách thêm flow vào Solution](https://learn.microsoft.com/en-us/power-automate/create-flow-solution).*
3. **Thư viện `@microsoft/power-apps`**: Đảm bảo phiên bản gói `@microsoft/power-apps` trong `package.json` của bạn từ **1.1.1** trở lên.
   * *Lưu ý: Các lệnh quản lý flow chỉ khả dụng trong npm-based CLI (`npx power-apps`). Chúng **không** chạy được trên Power Platform CLI (`pac code`).*

---

## 2. Bước 1: Liệt Kê Các Flow Khả Dụng (List Available Flows)

Chạy lệnh sau trong thư mục dự án (`code-app/`) để xem danh sách toàn bộ các flow hỗ trợ giải pháp trong môi trường hiện tại:

```bash
npx power-apps list-flows
```

Kết quả trả về sẽ hiển thị dưới dạng bảng:

```text
Name                    Status   Modified On   Flow ID
──────────────────────────────────────────────────────────────────────────────
Approval Workflow       Started  2026-01-15    a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1
Send Notification       Started  2026-02-01    b1b1b1b1-cccc-dddd-eeee-f2f2f2f2f2f2

Total flows: 2
```

> [!TIP]
> Bạn có thể lọc danh sách flow theo tên bằng tham số `--search`:
> ```bash
> npx power-apps list-flows --search approval
> ```

Hãy copy giá trị **Flow ID** của flow bạn muốn thêm để chuẩn bị cho bước tiếp theo.

---

## 3. Bước 2: Thêm Flow Vào Code App (Add Flow to App)

Sử dụng lệnh `add-flow` với tham số `--flow-id`:

```bash
npx power-apps add-flow --flow-id <flow-id>
```

**Ví dụ thực tế:**
```bash
npx power-apps add-flow --flow-id a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1
```

Khi thành công, màn hình sẽ hiển thị:
```text
Flow added successfully.
```

> [!NOTE]
> Lệnh `add-flow` có tính chất **idempotent** (đồng nhất). Nếu bạn chạy lại lệnh này với cùng một Flow ID, CLI sẽ cập nhật định nghĩa mới nhất của flow mà không làm hỏng cấu hình cũ.

### Cơ chế hoạt động của `add-flow`
Khi bạn thêm một flow:
1. CLI sẽ tải định nghĩa OpenAPI của flow xuống máy cục bộ.
2. CLI tự động biên dịch và tạo ra các file TypeScript (Services/Models) tương ứng với kiểu dữ liệu (strongly-typed) của flow đó.
3. CLI cập nhật file `power.config.json` để đăng ký tham chiếu kết nối (Connection Reference).

> [!IMPORTANT]
> **Yêu cầu quyền truy cập:**
> Tài khoản của Maker chạy lệnh `add-flow` phải có quyền **đọc flow** và quyền sử dụng các **connections** liên kết trong flow đó (ví dụ: connection Office 365 Outlook). Nếu thiếu quyền, lệnh sẽ thất bại với lỗi xác thực (authorization error).

### Các file được tự động tạo/cập nhật
Sau khi chạy lệnh thành công, các file sau sẽ xuất hiện trong dự án của bạn (tên file được lấy theo Display Name của flow):

```text
src/
  services/
    ApprovalWorkflowService.ts   ← Lớp service chứa hàm tĩnh Run() đã được định nghĩa kiểu dữ liệu
  models/
    ApprovalWorkflowModel.ts     ← Định nghĩa các kiểu dữ liệu (Types/Interfaces) đầu vào và đầu ra
schemas/
  logicflows/
    ApprovalWorkflow.Schema.json ← OpenAPI schema của flow (Không chỉnh sửa file này thủ công)
```

Đồng thời, một cấu hình sẽ tự động được thêm vào file `power.config.json`:

```json
"ApprovalWorkflow": {
  "id": "/providers/microsoft.powerapps/apis/shared_logicflows",
  "displayName": "Logic flows",
  "dataSources": ["ApprovalWorkflow"],
  "workflowDetails": {
    "workflowEntityId": "<dataverse-entity-guid>",
    "workflowDisplayName": "Approval Workflow",
    "workflowName": "a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1",
    "dependencies": {
      "shared_office365": "<dependency-uuid>"
    }
  }
}
```

---

## 4. Bước 3: Gọi Flow Từ Ứng Dụng (Call Flow from React)

Các class service được sinh ra tự động cung cấp một phương thức tĩnh là `Run()`. Signature của hàm này sẽ tự động thay đổi dựa trên các tham số đầu vào được cấu hình trong trigger của flow.

### Trường hợp 1: Flow có tham số đầu vào (Input Parameters)
Nếu flow yêu cầu các tham số như người yêu cầu, số tiền, v.v.:

```typescript
import { ApprovalWorkflowService } from './services/ApprovalWorkflowService';

const triggerFlow = async () => {
  const result = await ApprovalWorkflowService.Run({
    requester: 'Alex',
    amount: 1500,
  });

  if (result.success) {
    console.log('Kích hoạt flow thành công. Kết quả:', result.data);
  } else {
    console.error('Lỗi kích hoạt flow:', result.error);
  }
};
```

### Trường hợp 2: Flow không có tham số đầu vào
```typescript
import { SendNotificationService } from './services/SendNotificationService';

const triggerFlow = async () => {
  const result = await SendNotificationService.Run();

  if (result.success) {
    console.log('Đã gửi yêu cầu kích hoạt flow.');
  } else {
    console.error('Lỗi:', result.error);
  }
};
```

### Cấu trúc dữ liệu trả về (`result`)

| Thuộc tính (Property) | Kiểu dữ liệu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `success` | `boolean` | Trả về `true` nếu flow được kích hoạt và chạy thành công trên host. |
| `data` | Varies (Tùy thuộc flow) | Payload kết quả được trả về từ action **Respond to a PowerApp or flow** (nếu có). |
| `error` | `Error` (Optional) | Chi tiết thông tin lỗi khi `success` bằng `false`. |

> [!NOTE]
> Các tham số có cấu hình `x-ms-visibility: internal` kèm giá trị mặc định sẽ được thư viện sinh code tự động xử lý nội bộ, không hiển thị trong tham số truyền vào của hàm `Run()`.

---

## 5. Cập Nhật và Gỡ Bỏ Flow (Update and Remove Flow)

### Cập nhật Flow khi có thay đổi định nghĩa
Khi tác giả của flow cập nhật tham số đầu vào/đầu ra hoặc các kết nối bên trong flow, ứng dụng Code App sẽ không tự động nhận biết. Bạn cần chạy lại lệnh `add-flow` để đồng bộ lại:

```bash
npx power-apps add-flow --flow-id <flow-id>
```
CLI sẽ tự động khớp thông tin qua `workflowEntityId` và tái sử dụng UUID cũ trong `power.config.json`, giúp bảo toàn mã nguồn mà không cần dọn dẹp thủ công.

### Gỡ bỏ Flow khỏi ứng dụng
Sử dụng lệnh `remove-flow`. Bạn có thể chỉ định bằng **Data Source Name** hoặc bằng **Flow ID**:

*   **Theo tên nguồn dữ liệu:**
    ```bash
    npx power-apps remove-flow --flow-name ApprovalWorkflow
    ```
*   **Theo Flow ID:**
    ```bash
    npx power-apps remove-flow --flow-id a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1
    ```

Lệnh này sẽ thực hiện dọn dẹp:
* Xóa cấu hình của flow khỏi `power.config.json`.
* Xóa/Tái tạo lại các file TypeScript service tương ứng để tránh lỗi biên dịch code dư thừa.

---

## 6. Đóng Gói và Triển Khai (Build and Deploy)

Sau khi kiểm thử hoạt động của flow thành công dưới môi trường Local (`npm run dev`), tiến hành build ứng dụng và deploy lên cloud:

```bash
# Build mã nguồn React
npm run build

# Đẩy phiên bản mới lên Power Apps Host
npx power-apps push
```

---

## 7. Các Giới Hạn và Lưu Ý Quan Trọng (Limitations & Considerations)

| Giới hạn (Limitation) | Chi tiết (Details) |
| :--- | :--- |
| **Chỉ hỗ trợ PowerApps Trigger** | Chỉ các instant flow được khởi chạy bằng trigger **PowerApps** mới có thể tích hợp. Các flow tự động hoặc instant flow dùng trigger khác sẽ bị lỗi runtime. |
| **Flow bắt buộc thuộc Solution** | Lệnh `list-flows` chỉ tìm thấy các flow đã được thêm vào Solution trong môi trường hiện tại. |
| **Quyền Maker lúc phát triển** | Người chạy lệnh `add-flow` phải được share quyền truy cập flow và toàn bộ connection tương ứng. |
| **Quyền của người dùng cuối lúc Runtime** | Người dùng cuối chạy ứng dụng phải có đủ quyền Dataverse để gọi flow. Bạn cần gán vai trò bảo mật **App Opener** (hoặc tương đương) cho họ. |
| **Đồng bộ thủ công** | Mọi thay đổi về cấu trúc flow đều yêu cầu chạy lại lệnh `add-flow` để tái tạo mã TypeScript. |
| **Giới hạn CLI** | Chỉ hỗ trợ trên npm CLI (`npx power-apps`), chưa được tích hợp vào `pac code`. |
