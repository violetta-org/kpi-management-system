# BÁO CÁO KIỂM THỬ TOÀN DIỆN (QA BUG REPORT) - PHÂN HỆ PROJECT MANAGER

---

## 1. THÔNG TIN CHUNG (GENERAL INFORMATION)

* **Người thực hiện kiểm thử:** Nguyễn Hữu Minh Quân, K2023 ngành Kỹ thuật Công nghệ Thông tin tại Trường Đại học Bách khoa - Đại học Đà Nẵng (DUT).
* **Hệ thống kiểm thử:** Hệ thống Quản lý Công việc và Chỉ số Hiệu suất (Task Management & KPI System) phát triển trên nền tảng Microsoft Power Platform (Canvas Apps & Dataverse).
* **Vai trò kiểm thử (Role Under Test):** Project Manager (Quản lý dự án).
* **Thời gian ghi nhận chuỗi sự kiện:** Ngày 29 tháng 05 năm 2026.
* **Mục tiêu kiểm thử:** Xác hóa luồng nghiệp vụ đặc quyền của Quản lý dự án bao gồm tạo lập danh mục dự án, phân bổ nguồn lực nguồn nhân sự, phê duyệt đánh giá hiệu suất đội nhóm và thiết lập mục tiêu chỉ số KPI cho nhân viên.

---

## 2. TỔNG HỢP TRẠNG THÁI CÁC TÍNH NĂNG (TEST EXECUTION SUMMARY)

| Tên chức năng trên Menu | Trạng thái kiểm thử | Kết luận kỹ thuật | Mức độ nghiêm trọng |
| --- | --- | --- | --- |
| **Dashboard** | Tạm ổn định | Hiển thị lời chào định danh chính xác, tuy nhiên liên kết điều hướng sâu bị lỗi. | Minor |
| **Resources -> Projects List** | **Bị nghẽn (Blocked)** | Lỗi không thể lưu dữ liệu dự án mới vào hệ thống backend. | **Critical** |
| **Resources -> Project Allocations** | Trống dữ liệu | Không có dữ liệu để hiển thị do hệ quả từ lỗi không thể tạo dự án ở tab kế bên. | High |
| **Performance -> My Appraisals** | Đúng logic | Hiển thị trống lịch sử tự đánh giá của cá nhân Quản lý dự án. | N/A |
| **Performance -> Team Appraisals** | **Lỗi nghiêm trọng** | Mất liên kết định danh nhân sự, lỗi logic nút bấm tính toán điểm và ghi đè dữ liệu rỗng. | **Critical** |
| **Requests** | **Lỗi hệ thống** | Liệt hoàn toàn chức năng điều hướng chuyển đổi màn hình. | High |
| **Directory** | Lỗi giao diện UI/UX | Tải thành công danh sách nhân sự gốc nhưng thiếu hụt hoàn toàn công cụ tìm kiếm. | Medium |
| **My KPIs (KPI Target Management)** | **Bị nghẽn (Blocked)** | Biểu mẫu gán chỉ tiêu đóng bình thường nhưng chặn đứng luồng ghi dữ liệu vào Dataverse. | **Critical** |

---

## 3. DANH SÁCH CHI TIẾT CÁC BUG PHÁT HIỆN (DETAILED BUG LOG)

### Bug 01: Form "Tạo mới dự án" đóng nhưng không lưu dữ liệu vào hệ thống (Silent Failure)

* **Mã lỗi:** BUG-PM-RES-001
* **Màn hình xuất hiện:** `Resources` -> `Projects List` (Tham chiếu tệp ảnh `image_d61754.png`, `image_d6131e.png`, `image_d6129e.png`, `image_d60f3c.png`).
* **Mức độ nghiêm trọng:** **Critical (Nghiêm trọng - Blocker)**.
* **Các bước tái hiện lỗi (Steps to Reproduce):**
1. Truy cập vào phân hệ điều hướng bằng vai trò `Project Manager`.
2. Click chọn danh mục menu `Resources` và chuyển hướng tiếp sang tab `Projects List`.
3. Click chọn nút tác vụ màu tím `+ Thêm dự án`.
4. Nhập đầy đủ dữ liệu kiểm thử vào biểu mẫu: Tên dự án là *Hệ thống Phân tích Mật độ Giao thông* hoặc *Warehouse Management System (WMS)*, cấu hình thời gian bắt đầu từ `25/05/2026` đến ngày kết thúc `30/06/2026`, cấu hình trạng thái xử lý nghiệp vụ sang `Đang thực hiện`.
5. Click chọn nút tác vụ màu tím `Lưu lại`.
6. Thực hiện chuyển đổi qua lại giữa trang `Dashboard` và `Resources` để kích hoạt reload thủ công giao diện.


* **Kết quả kỳ vọng (Expected Result):** Biểu mẫu tạo mới đóng lại, hệ thống đồng bộ dữ liệu với cơ sở dữ liệu Dataverse, màn hình danh sách tự động tải lại và cập nhật số lượng dự án tăng từ `0` lên `1`, hiển thị bản ghi dự án vừa tạo.
* **Kết quả thực tế (Actual Result):** Biểu mẫu đóng lại bình thường nhưng màn hình danh sách vẫn báo trạng thái *Danh sách dự án (0) - Không có dự án nào trong hệ thống*. Dữ liệu biến mất hoàn toàn không dấu vết mà không xuất hiện bất kỳ thông báo lỗi nào từ hệ thống.
* **Phân tích nguyên nhân kỹ thuật (Technical Root Cause):** Lập trình viên thiết lập hàm đóng form (`ResetForm` hoặc `UpdateContext`) đồng thời với hàm ghi dữ liệu (`SubmitForm` hoặc `Patch`) nhưng cấu hình sai thứ tự logic hoặc thiếu cơ chế bẫy lỗi (`Error Handling`). Ứng dụng đã xảy ra hiện tượng **Silent Failure** - lỗi kết nối hoặc từ chối ghi từ database Dataverse nền nhưng không được hiển thị cảnh báo ra giao diện người dùng.

### Bug 02: Cột "Nhân viên" trống rỗng hoàn toàn tại màn hình đánh giá đội nhóm (Missing Bound Data)

* **Mã lỗi:** BUG-PM-PERF-001
* **Màn hình xuất hiện:** `Performance` -> `Team Appraisals` (Tham chiếu tệp ảnh `image_d60b96.png`).
* **Mức độ nghiêm trọng:** **Critical (Nghiêm trọng)**.
* **Các bước tái hiện lỗi (Steps to Reproduce):**
1. Chọn danh mục menu `Performance` từ thanh điều hướng bên trái.
2. Click di chuyển sang tab chức năng `Team Appraisals`.


* **Kết quả kỳ vọng (Expected Result):** Bảng dữ liệu hiển thị chi tiết danh sách đợt đánh giá kèm theo tên hoặc ảnh đại diện tương ứng của từng nhân viên sở hữu bản ghi đó để cấp quản lý nhận diện trước khi duyệt điểm.
* **Kết quả thực tế (Actual Result):** Toàn bộ dữ liệu hiển thị tại cột đầu tiên tên là *Nhân viên* bị trống rỗng hoàn toàn, không hiển thị tên hay bất kỳ chuỗi thông tin định danh nào.
* **Phân tích nguyên nhân kỹ thuật (Technical Root Cause):** Đây là lỗi lập trình giao diện khi bind dữ liệu vào cấu trúc lưới (`Gallery` hoặc `Data Table` trong Power Apps). Thuộc tính hiển thị văn bản của ô dữ liệu này đã bị cấu hình sai trường liên kết (ví dụ: thay vì gọi dữ liệu từ bảng liên kết `ThisItem.Employee.FullName` thì lại gọi sai trường hoặc để trống thuộc tính `Text`), dẫn đến việc dữ liệu tên nhân sự không thể hiển thị dù database hệ thống vẫn có dữ liệu đầy đủ.

### Bug 03: Lỗi sắp xếp lộn xộn trong danh sách đợt đánh giá hiệu suất (Sorting Bug)

* **Mã lỗi:** BUG-PM-PERF-002
* **Màn hình xuất hiện:** `Performance` -> `Team Appraisals` (Tham chiếu tệp ảnh `image_d60b96.png`).
* **Mức độ nghiêm trọng:** **Medium (Trung bình)**.
* **Các bước tái hiện lỗi (Steps to Reproduce):** Quan sát trực tiếp cột dữ liệu có tên *Đợt đánh giá*.
* **Kết quả kỳ vọng (Expected Result):** Danh sách các đợt đánh giá phải được sắp xếp theo trình tự thời gian tăng/giảm dần hoặc theo thứ tự số thứ tự định danh (ví dụ: từ *Appraisal 1* đến *Appraisal 5*).
* **Kết quả thực tế (Actual Result):** Thứ tự hiển thị chuỗi dữ liệu bị đảo lộn hoàn toàn không theo quy luật: *Performance Appraisal 5* -> *Performance Appraisal 2* -> *Performance Appraisal 4* -> *Performance Appraisal 1* -> *Performance Appraisal 3*.
* **Phân tích nguyên nhân kỹ thuật (Technical Root Cause):** Lập trình viên quên sử dụng hàm sắp xếp dữ liệu nguồn `Sort()` hoặc `SortByColumns()` trong thuộc tính `Items` của Gallery hiển thị dữ liệu, khiến ứng dụng hiển thị các bản ghi theo thứ tự ngẫu nhiên thu nhận được từ database.

### Bug 04: Nút "Tự tính" sai logic kích hoạt và ghi đè giá trị 0 vào cơ sở dữ liệu (Data Override Bug)

* **Mã lỗi:** BUG-PM-PERF-003
* **Màn hình xuất hiện:** `Performance` -> `Team Appraisals` (Tham chiếu tệp ảnh `image_d5b91e.png`, `image_d5b5a2.png`).
* **Mức độ nghiêm trọng:** **High (Cao)**.
* **Các bước tái hiện lỗi (Steps to Reproduce):**
1. Tại màn hình `Team Appraisals`, click trực tiếp vào nút tác vụ `Tự tính` khi ô nhập liệu số đang có sẵn dữ liệu gốc (ví dụ: `95`). -> *Kết quả: Hệ thống không có phản hồi.*
2. Thực hiện xóa toàn bộ ký tự số đang có trong ô nhập liệu thuộc cột *Điểm chung cuộc* để đưa ô về trạng thái trống rỗng hoàn toàn.
3. Click chọn lại nút tác vụ `Tự tính`.


* **Kết quả kỳ vọng (Expected Result):** Khi click nút `Tự tính`, hệ thống phải tự động chạy công thức toán học backend tính toán dựa trên chỉ số thực tế KPIs và tỷ trọng để điền kết quả vào ô trống, ví dụ:

$$\text{Điểm chung cuộc} = \frac{\sum (\text{Điểm số KPIs} \times \text{Tỷ trọng})}{100}$$


* **Kết quả thực tế (Actual Result):** Hệ thống hiển thị thanh trạng thái đang tải dữ liệu "Đang cập nhật Dataverse...", nhưng sau khi hoàn tất tải, giá trị trả về và hiển thị cố định trong ô nhập liệu lại là số `0`.
* **Phân tích nguyên nhân kỹ thuật (Technical Root Cause):** Lỗi nghiêm trọng trong tư duy xử lý logic code của lập trình viên:
1. Thuộc tính kích hoạt nút bấm bị gán sai điều kiện (chỉ kích hoạt chạy hàm khi giá trị ô nhập bằng rỗng).
2. Thay vì dùng hàm tính toán logic để sinh ra điểm số mới, hàm xử lý tại thuộc tính `OnSelect` của nút bấm này lại thực hiện lệnh ghi đè trực tiếp giá trị hiện tại của ô nhập dữ liệu (`TextInput.Text`) ngược lại vào Dataverse. Do ô dữ liệu vừa bị người dùng xóa trống (`Blank`), hệ thống tự động ép kiểu định dạng dữ liệu từ chuỗi rỗng về giá trị số `0` và lưu bản ghi lỗi này vào database hệ thống.



### Bug 05: Liệt chức năng điều hướng tại danh mục menu "Requests" (Broken Navigation Link)

* **Mã lỗi:** BUG-PM-NAV-001
* **Màn hình xuất hiện:** Thanh menu điều hướng dọc bên trái hệ thống.
* **Mức độ nghiêm trọng:** **High (Cao)**.
* **Các bước tái hiện lỗi (Steps to Reproduce):** Click chuột vào tab danh mục menu có tên `Requests`.
* **Kết quả kỳ vọng (Expected Result):** Ứng dụng thực hiện lệnh chuyển đổi màn hình giao diện đưa người dùng truy cập vào trang quản lý và phê duyệt các yêu cầu từ nhân viên gửi lên.
* **Kết quả thực tế (Actual Result):** Giao diện màn hình đứng im hoàn toàn, không xuất hiện hiệu ứng chuyển đổi trang hay tải dữ liệu.
* **Phân tích nguyên nhân kỹ thuật (Technical Root Cause):** Hiện tượng lỗi liên kết toàn cục (Global Broken Link). Do lập trình viên thực hiện sao chép nguyên bản cấu trúc thanh điều hướng từ vai trò nhân viên sang phân hệ quản lý nhưng quên cấu hình lại thuộc tính `OnSelect` của nút `Requests` cho màn hình mới, hoặc quên không khởi tạo trang giao diện đích cho vai trò này dẫn đến hàm `Navigate()` bị trống đối tượng truyền vào.

### Bug 06: Ô nhập "Chu kỳ đánh giá (Period)" thiết kế sai định dạng kiểm soát dữ liệu (UX Defect / Free-text Box)

* **Mã lỗi:** BUG-PM-KPI-001
* **Màn hình xuất hiện:** Form `Gán chỉ tiêu KPI mới` (Tham chiếu tệp ảnh `image_d5b163.png`).
* **Mức độ nghiêm trọng:** **Medium (Trung bình - Lỗi thiết kế UX)**.
* **Các bước tái hiện lỗi (Steps to Reproduce):** Click chọn vào ô nhập liệu tại vị trí trường thông tin *Chu kỳ đánh giá (Period)*.
* **Kết quả kỳ vọng (Expected Result):** Ô dữ liệu chu kỳ phải là dạng danh sách chọn có sẵn (`Dropdown` hoặc `Choice Column`) chứa các giá trị quy chuẩn của doanh nghiệp như *Q1/2026*, *Q2/2026*, *Q3/2026*, *Q4/2026* để đảm bảo tính đồng bộ dữ liệu toàn hệ thống.
* **Kết quả thực tế (Actual Result):** Trường thông tin này lại được thiết kế dưới dạng một ô nhập văn bản tự do hoàn toàn (`Text Input Box`). Người dùng có thể tự gõ bất kỳ chuỗi văn bản lạ nào vào hệ thống.
* **Phân tích nguyên nhân kỹ thuật (Technical Root Cause):** Lập trình viên lựa chọn sai loại điều khiển (Control) giao diện khi kéo thả form. Việc cho phép người dùng nhập tự do văn bản vào một trường mang tính phân loại chu kỳ thời gian như thế này sẽ phá vỡ cấu trúc chuẩn hóa của database Dataverse nền khi người dùng nhập sai định dạng.

### Bug 07: Form "Gán chỉ tiêu KPI mới" xảy ra lỗi lưu dữ liệu ngầm thất bại (Silent Failure)

* **Mã lỗi:** BUG-PM-KPI-002
* **Màn hình xuất hiện:** Biểu mẫu `Gán chỉ tiêu KPI mới` -> Màn hình `KPI Target Management` (Tham chiếu tệp ảnh `image_d5ad5e.png`, `image_d5aa5b.png`, `image_d5aa40.png`).
* **Mức độ nghiêm trọng:** **Critical (Nghiêm trọng - Blocker)**.
* **Các bước tái hiện lỗi (Steps to Reproduce):**
1. Tại trang `My KPIs`, click chọn nút tác vụ `+ Gán KPI mới`.
2. Điền đầy đủ thông tin chuẩn hóa theo kịch bản kiểm thử: Chọn nhân sự thực hiện là *Nguyễn Hữu Minh Quân*, danh mục là *Quality (%)*, nhập tên mục tiêu hiển thị là *Đạt chất lượng kiểm thử phần mềm*, liên kết mục tiêu chung chọn *Phải đạt top 1 QLDA*. Giữ nguyên thông số định lượng mặc định (100, 0, 10, %).
3. Click chọn nút tác vụ màu tím `Gán chỉ tiêu`.
4. Thay đổi bộ lọc thành viên tại ô *Lọc theo nhân sự* từ *Tất cả nhân viên* sang *Nguyễn Hữu Minh Quân* hoặc *Hà Minh Khoa*.
5. Click chọn chuyển hướng sang tab chức năng `Progress Charts`.


* **Kết quả kỳ vọng (Expected Result):** Dữ liệu chỉ tiêu KPI được nạp thành công vào cơ sở dữ liệu Dataverse. Bảng điều khiển ngoài giao diện cập nhật tăng các chỉ số tổng hợp, danh sách lưới hiển thị bản ghi KPI vừa gán, và trang `Progress Charts` vẽ biểu đồ tiến độ.
* **Kết quả thực tế (Actual Result):** Biểu mẫu đóng lại bình thường, nhưng toàn bộ các thẻ chỉ số tổng hợp bên ngoài vẫn giữ nguyên số `0` tròn trĩnh. Hệ thống báo trạng thái *No KPI targets found* và màn hình biểu đồ báo trống *No KPI progress data*.
* **Phân tích nguyên nhân kỹ thuật (Technical Root Cause):** Tiếp tục là một lỗi hệ quả của hiện tượng **Silent Failure** tương tự như phân hệ Dự án. Lập trình viên không viết hàm kiểm tra trạng thái lưu của form dữ liệu (`Form.Valid`) trước khi đóng và chuyển giao diện, đồng thời thiếu tính năng thông báo trạng thái gửi dữ liệu thất bại khiến luồng xử lý bị đứt gãy mà không có dấu hiệu cảnh báo.

### Bug 08: Trang danh bạ nhân sự thiếu hụt thanh công cụ tìm kiếm dữ liệu (Missing UI Control)

* **Mã lỗi:** BUG-PM-DIR-001
* **Màn hình xuất hiện:** `Directory` (Tham chiếu tệp ảnh `image_d5b542.png`).
* **Mức độ nghiêm trọng:** **Medium (Trung bình)**.
* **Các bước tái hiện lỗi (Steps to Reproduce):** Truy cập vào danh mục menu `Directory` và quan sát tổng thể giao diện màn hình.
* **Kết quả kỳ vọng (Expected Result):** Đúng như nội dung dòng chữ mô tả tính năng ở tiêu đề trang: *"Tìm kiếm thành viên hoặc quản lý danh sách nhân sự..."*, giao diện phải xuất hiện một thanh tìm kiếm (`Search Bar / Text Input`) để người dùng thực hiện lọc nhanh danh sách nhân sự khi quy mô tổ chức mở rộng.
* **Kết quả thực tế (Actual Result):** Trang chỉ hiển thị thô các thẻ thông tin nhân sự dạng tĩnh của hệ thống, hoàn toàn không tồn tại bất kỳ ô nhập liệu tìm kiếm nào.
* **Phân tích nguyên nhân kỹ thuật (Technical Root Cause):** Lập trình viên viết dòng chữ mô tả tính năng theo tài liệu đặc tả thiết kế hệ thống nhưng lại quên kéo thả thêm Control nhập liệu văn bản (`Text Input`) vào giao diện app và thiếu hàm lọc dữ liệu `Filter(DataSource, SearchText in FullName)` cho danh bạ.

---

## 4. ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG & ĐỀ XUẤT (QUALITY ASSESSMENT & RECOMMENDATIONS)

### Kết luận tổng quan của Tester

Ứng dụng Power Apps Canvas này hiện tại đang nằm ở trạng thái **Chưa thể phát hành (Not Ready for Production)** và đang gặp lỗi nghiêm trọng về cấu trúc liên kết cơ sở dữ liệu nền. Toàn bộ các tính năng hiển thị giao diện tĩnh (UI) như danh bạ hay bộ lọc danh mục hoạt động bình thường, chứng tỏ kết nối đọc dữ liệu (`Read`) từ Dataverse ổn định.

Tuy nhiên, toàn bộ các chức năng ghi dữ liệu cốt lõi thuộc quyền hạn của Quản lý dự án bao gồm **Ghi nhận dự án mới**, **Cập nhật tính toán điểm số hiệu suất** và **Thiết lập mục tiêu KPI** đều lỗi code nghiêm trọng ở các nút bấm tác vụ, dẫn đến việc dữ liệu bị chặn đứng hoàn toàn không thể nạp vào hệ thống (Silent Failure).

### Đề xuất hướng xử lý dành cho Đội ngũ Phát triển (Dev Team)

1. **Cấu hình lại luồng xử lý nút Lưu (Submit Form):** Rà soát lại toàn bộ thuộc tính `OnSelect` của các nút tác vụ mang tính chất ghi dữ liệu (`Lưu lại`, `Gán chỉ tiêu`). Thay thế việc đóng form tùy tiện bằng việc sử dụng hàm kiểm tra điều kiện logic bẫy lỗi có cấu trúc:
```powerapps
If(FormName.Valid, SubmitForm(FormName); Refresh(DataSourceName), Notify("Đã xảy ra lỗi lưu dữ liệu. Vui lòng kiểm tra lại kết nối Dataverse!", NotificationType.Error))

```



```
2.  **Sửa lỗi Logic tính điểm tự động:** Thay thế luồng ghi đè dữ liệu rỗng của nút `Tự tính` bằng việc viết đúng công thức toán học tính toán tự động dựa trên các trường dữ liệu có sẵn của bản ghi nhân sự hiện tại trước khi thực hiện hàm `Patch`.
3.  **Chuẩn hóa cấu trúc nhập liệu (Data Integrity):** Chuyển đổi toàn bộ các ô nhập liệu văn bản tự do mang tính chất phân loại thời gian hoặc chu kỳ (như trường *Chu kỳ đánh giá*) sang dạng thẻ chọn `Dropdown` gắn với các danh mục quy chuẩn để bảo vệ tính toàn vẹn của dữ liệu hệ thống.

```