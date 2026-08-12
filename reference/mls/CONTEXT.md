# Ngôn ngữ miền MLS tham chiếu

Ngôn ngữ chuẩn rút ra từ video để dùng trong phân tích project dữ liệu thị trường bất động sản Việt Nam. Các khái niệm này còn cần được đối chiếu với pháp luật và mô hình vận hành trong nước trước khi trở thành glossary chính thức.

## Tài sản và dữ liệu nền

**Property**:
Tài sản bất động sản vật lý hoặc đơn vị bất động sản có danh tính bền vững qua nhiều lần đưa ra thị trường.
_Avoid_: Listing, tin đăng, giao dịch

**Parcel**:
Đơn vị thửa đất pháp lý/địa chính có định danh riêng và có thể liên hệ với một hoặc nhiều property. Parcel không phải chính hồ sơ thuế/địa chính mô tả nó.
_Avoid_: Property, Listing, Source Record

**Source Record**:
Bản ghi nhận từ một nguồn bên ngoài như địa chính, thuế hoặc public record, kèm nguồn gốc và thời điểm hiệu lực.
_Avoid_: Property master, dữ liệu đã xác minh

**Property History**:
Chuỗi sự kiện liên quan đến tài sản qua thời gian, gồm listing, sale và public-record event, không ghi đè hồ sơ hiện tại.
_Avoid_: Listing history

## Đưa tài sản ra thị trường

**Listing**:
Một lần cụ thể đưa property ra bán hoặc cho thuê, có định danh, giá, bên đại diện, khoảng hiệu lực và vòng đời riêng.
_Avoid_: Property, bài đăng, giao dịch đã hoàn tất

**Listing Agreement**:
Quan hệ đại diện làm cơ sở cho một listing, xác định loại giao dịch, bên đại diện và phạm vi/thời hạn tiếp thị.
_Avoid_: Listing, sale contract

**Listing Status**:
Trạng thái nghiệp vụ hiện tại của listing trong vòng đời tiếp thị và giao dịch.
_Avoid_: Property status, nhãn tự do

**Listing Status Event**:
Một lần listing chuyển từ trạng thái này sang trạng thái khác; thuật ngữ này tách trạng thái hiện tại khỏi lịch sử chuyển trạng thái.
_Avoid_: Listing Status, sửa trực tiếp status history

**Incomplete Listing Input**:
Hồ sơ nhập listing chưa được submit; có thể lưu để tiếp tục hoàn thiện nhưng chưa nên đồng nhất với một trạng thái thị trường.
_Avoid_: Incoming Listing, Active Listing

**Closing Record**:
Hồ sơ kết quả khi một listing dẫn tới giao dịch hoàn tất, gồm thời điểm, giá và các bên/vai trò được phép ghi nhận.
_Avoid_: Listing, Property History

**Incoming Listing**:
Listing đã có MLS number nhưng chưa được công bố rộng rãi; người phụ trách có thể tiếp tục bổ sung dữ liệu và tài liệu.
_Avoid_: Active Listing, Incomplete Listing Input

**Active Listing**:
Listing đã vượt qua các rule đầu vào để trở thành hồ sơ đang được phân phối/tìm thấy theo phạm vi quyền thích hợp.
_Avoid_: Incoming Listing, Property đang tồn tại

**Syndication**:
Việc phân phối một tập dữ liệu listing đã cho phép từ MLS sang các kênh downstream.
_Avoid_: Sao chép toàn bộ hồ sơ nội bộ, integration nói chung

## Chủ thể và tổ chức

**Party / Client**:
Người hoặc tổ chức tham gia với vai trò như bên bán, bên mua, bên cho thuê hoặc bên thuê và có thể được agent đại diện.
_Avoid_: Member, Agent, Owner mặc định

**Member**:
Người có tư cách truy cập hệ sinh thái theo association, brokerage và entitlement tương ứng.
_Avoid_: Customer, người xem công khai

**Agent**:
Chủ thể nghiệp vụ đại diện một bên và chịu trách nhiệm với listing hoặc giao dịch trong phạm vi quyền được cấp.
_Avoid_: Member, Broker

**Broker**:
Chủ thể chịu trách nhiệm ở cấp brokerage/office và có quyền giám sát hoặc can thiệp vào listing theo mô hình vận hành.
_Avoid_: Agent, Association

**Association**:
Tổ chức quản lý tư cách hội viên và quyền tiếp cận một phần hệ sinh thái nghề nghiệp.
_Avoid_: Brokerage, cơ quan quản lý nhà nước

**Brokerage / Office**:
Đơn vị hành nghề mà agent trực thuộc hoặc liên kết, đồng thời là phạm vi quản trị listing và báo cáo.
_Avoid_: Association

## Phân tích giá

**CMA Report**:
Báo cáo phân tích thị trường so sánh cho một subject property, được tạo từ tập comparable đã chọn và một phiên bản nội dung cụ thể.
_Avoid_: Chứng thư định giá, giá chính thức

**Comparable**:
Listing hoặc giao dịch được agent chọn làm mẫu so sánh vì có đặc điểm và bối cảnh thị trường phù hợp với subject property.
_Avoid_: Mọi property ở gần, kết quả tự động mặc định

**Subject Property**:
Property đang được phân tích trong một CMA report.
_Avoid_: Comparable, Listing bắt buộc phải active

## Phạm vi hiển thị

**Public Field**:
Field được phép phân phối tới người dùng hoặc kênh công khai theo consent và policy có hiệu lực.
_Avoid_: Mọi field trên listing

**Member-Only Field**:
Field chỉ hiển thị cho member có entitlement phù hợp, như private remarks hoặc một phần thông tin nghiệp vụ.
_Avoid_: Public Field, field bí mật tuyệt đối

**Restricted Field**:
Field chỉ dành cho actor hoặc phạm vi tổ chức cụ thể và cần kiểm soát cả khi search, export, report và audit.
_Avoid_: Chỉ ẩn bằng giao diện
