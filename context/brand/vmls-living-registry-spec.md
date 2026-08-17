---
title: VMLS Living Registry visual specification
status: current
authority: canonical
last_reviewed: 2026-08-17
evidence_labels:
  - FACT
  - INFERENCE
  - PROPOSAL
  - OPEN QUESTION
---

# VMLS Living Registry visual specification

Tài liệu này chuyển [Living Registry board](./assets/vmls-living-registry.png) thành ngôn ngữ thiết kế có thể dùng để thiết kế, triển khai và review frontend. Tài liệu không thay thế artwork gốc; khi có xung đột, áp dụng thứ tự sau:

1. Quyết định sản phẩm đã được chấp thuận.
2. Bảng màu và typeface được ghi trực tiếp trên artwork.
3. Ngữ pháp thị giác nhìn thấy trên artwork.
4. Các `PROPOSAL` trong tài liệu này.
5. Token hoặc CSS đang có trong prototype.

## Ranh giới bằng chứng

- `FACT`: chi tiết nhìn thấy trực tiếp trên artwork hoặc giá trị được artwork ghi rõ.
- `INFERENCE`: cách đọc có cơ sở từ nhiều chi tiết trên artwork, nhưng artwork không công bố thành rule.
- `PROPOSAL`: quy tắc triển khai để biến artwork thành giao diện thực dụng, responsive và accessible.
- `OPEN QUESTION`: điểm chưa đủ căn cứ để khóa.

`FACT` không có nghĩa là phải sao chép từng pixel. Ví dụ, đường viền đen bao quanh ba vùng lớn là khung của presentation board, không phải border của sản phẩm. Các nhãn tiếng Anh như `Property ID`, `Listing` và `Audit Trail` là nội dung minh họa; chúng không thay thế [ngôn ngữ miền VMLS](../domain/language.md).

## Quyết định nhận diện đã khóa

**Quyết định của người dùng, ngày 2026-08-17:** VMLS xuất hiện như một thương hiệu độc lập. Bỏ hoàn toàn `by HouseNow`, `Powered by HouseNow` và các biến thể tương đương khỏi logo, header, footer, loading state, ảnh chia sẻ và nội dung trình diễn.

Artwork gốc có dòng `by HouseNow`; từ ngày trên, chi tiết này là lịch sử của artwork và không còn là hướng triển khai. Không thay bằng một byline khác.

## Tinh thần tổng thể

### FACT

- Nền chủ đạo là trắng ngà; chữ xanh đậm và đen xanh tạo cảm giác hồ sơ, sổ bộ và hạ tầng công.
- Nội dung xoay quanh định danh tài sản, nguồn dữ liệu, kiểm chứng, phân quyền và nhật ký.
- Website mẫu kết hợp khoảng trắng rộng với các vùng dữ liệu có cấu trúc và mật độ cao hơn.
- Đường bản đồ địa chính, mã thửa, bản đồ Việt Nam, đường vòng đời và node thời gian được dùng làm ngữ cảnh dữ liệu.
- Màu cam san hô chỉ xuất hiện nổi bật tại hành động chính hoặc điểm cần chú ý.

### INFERENCE

VMLS phải đọc như **hạ tầng dữ liệu thị trường có thể truy vết**, không phải cổng tin bất động sản, portfolio công nghệ, landing page SaaS hay bộ dashboard trang trí. Cảm giác đúng là bình tĩnh, chính xác, có thẩm quyền và hữu dụng hàng ngày.

### PROPOSAL

Mỗi màn hình nên trả lời ít nhất một câu hỏi vận hành rõ ràng:

- Tôi đang nhìn bản ghi nào?
- Nguồn nào tạo nên bản ghi này?
- Trạng thái nào đã được xác nhận, trạng thái nào còn thiếu?
- Ai có quyền xem hoặc hành động?
- Thay đổi nào vừa xảy ra và bước tiếp theo là gì?

Không dùng motif brand nếu nó không giúp trả lời một trong các câu hỏi trên.

## Logo và wordmark

### FACT

- Ký hiệu V là một dấu gấp hình học, tạo bởi các facet/ribbon xiên.
- Hai cấp xanh tạo chiều sâu: Registry Green cho khối chính và Mint Trace cho facet phụ.
- Wordmark `VMLS` viết hoa, nặng, gọn và nằm bên phải ký hiệu.
- Artwork dùng logo trên nền sáng và dành nhiều khoảng thở quanh logo.

### Quy tắc triển khai

- Dùng ký hiệu V cùng wordmark `VMLS`; không thêm tagline hoặc tên tổ chức vào lockup.
- Không kéo giãn, đổi tỷ lệ, đổ gradient, tạo hiệu ứng 3D hoặc đặt logo trong capsule trang trí.
- Trên nền sáng: dùng Registry Green, Mint Trace và wordmark Registry Green.
- Trên nền Registry Green: dùng Paper White cho phần chính; Mint Trace có thể giữ làm facet phụ nếu tương phản đủ.
- Khoảng trống tối thiểu quanh lockup nên bằng ít nhất chiều rộng một facet chính của ký hiệu V. Đây là `PROPOSAL`, vì artwork không công bố clear-space token.
- Logo trong shell sản phẩm phải nhỏ, ổn định và không tranh vai trò với tiêu đề hoặc dữ liệu.

## Typography

### Typeface canonical

| Vai trò | Typeface | Trọng lượng | Nguồn | Cách dùng |
|---|---|---:|---|---|
| Display | Be Vietnam Pro | ExtraBold / `800` | `FACT` — artwork ghi rõ | Hero, tiêu đề trang, tiêu đề section quan trọng |
| Interface | IBM Plex Sans | Không công bố trên artwork | `FACT` về family; `PROPOSAL` về weight | Điều hướng, label, form, bảng, body, button |
| Identifier | IBM Plex Mono | Không công bố trên artwork | `FACT` về family; `PROPOSAL` về weight | NPID, PLID, PTID, mã nguồn, timestamp, version, audit key |

### Phân cấp đề xuất

- Display lớn: Be Vietnam Pro `800`, tracking âm nhẹ, line-height chặt; dùng cho thông điệp ngắn hoặc tên màn hình, không dùng cho đoạn văn.
- Heading trong workspace: Be Vietnam Pro `700–800`; giữ kích thước vừa phải để không làm giảm mật độ dữ liệu.
- Body và control: IBM Plex Sans `400–500`.
- Label, tab, button và trạng thái quan trọng: IBM Plex Sans `600–700`.
- Identifier và timestamp: IBM Plex Mono `400–600`; không biến toàn bộ bảng thành monospace.
- Eyebrow: IBM Plex Sans `700`, uppercase, tracking rộng vừa; chỉ dùng để phân loại section.

### Nhịp chữ nhìn thấy

- `FACT`: hero dùng dòng ngắn, rất đậm, xuống dòng có chủ ý và tương phản mạnh với body nhỏ hơn.
- `FACT`: app mockup dùng ID lớn ở đầu hồ sơ, còn metadata và timeline nhỏ, đều và dày hơn.
- `INFERENCE`: độ tương phản giữa display và body đến từ weight, size và khoảng trắng; không cần thêm màu hoặc hiệu ứng chữ.
- `PROPOSAL`: body mặc định nên có line-height khoảng `1.45–1.6`; heading khoảng `1.0–1.2`. Artwork không công bố token line-height cụ thể.

## Hệ màu canonical

Các mã dưới đây được artwork ghi trực tiếp và phải giữ nguyên khi khai báo token gốc.

| Token | Hex | Vai trò canonical | Cách dùng đúng | Không dùng cho |
|---|---|---|---|---|
| Registry Green | `#0D5142` | Màu chủ đạo | Logo, heading, active navigation, primary brand surface, đường nét quan trọng | Tô mọi card hoặc mọi trạng thái |
| Archive Ivory | `#F3EFE5` | Canvas | Nền trang, nền registry, khoảng âm giữa các surface | Text hoặc CTA |
| Ledger Ink | `#17211D` | Mực sổ bộ | Body chính, dữ liệu, heading cần trung tính, text trên nền sáng | Background đại trà làm UI quá nặng |
| Paper White | `#FCFBF7` | Giấy/hồ sơ | Card, panel, form, vùng dữ liệu nổi trên Archive Ivory | Pure-white glare hoặc block trang trí rỗng |
| Mint Trace | `#6BCBB1` | Vòng đời / provenance | Trace, node, verified cue, nền nhấn rất nhẹ | CTA cạnh tranh với Coral Signal |
| Coral Signal | `#F06445` | CTA / action | Một hành động chính, pin hoặc tín hiệu cần chú ý | Navigation chrome, nhiều button đồng cấp, surface trang trí |
| Patina | `#6D8E82` | Secondary / border | Border, icon phụ, rule, metadata | Body nhỏ trên nền sáng nếu không kiểm tra tương phản |
| Amber | `#C88A2C` | Warning | Cảnh báo, cần bổ sung, trạng thái chờ có ý nghĩa | Màu brand hoặc positive state |

### Tỷ lệ sử dụng

- `INFERENCE`: Archive Ivory và Paper White chiếm phần lớn diện tích.
- `INFERENCE`: Registry Green và Ledger Ink tạo cấu trúc và thứ bậc.
- `INFERENCE`: Mint Trace, Patina, Coral Signal và Amber là màu ngữ nghĩa có liều lượng thấp.
- `PROPOSAL`: trong một viewport, chỉ nên có một cụm hành động Coral Signal trội. Nếu nhiều thao tác cùng cấp, dùng Registry Green outline hoặc text action cho các thao tác còn lại.

### Tương phản

Các tỷ lệ dưới đây được tính từ mã canonical, không phải token được artwork công bố:

| Pair | Contrast | Hướng dùng |
|---|---:|---|
| Registry Green / Paper White | `8.92:1` | Text và icon an toàn ở kích thước thường |
| Ledger Ink / Archive Ivory | `14.38:1` | Body và dữ liệu chính |
| Mint Trace / Ledger Ink | `8.49:1` | Ledger Ink trên nền Mint |
| Coral Signal / Paper White | `3.07:1` | Không đủ cho text thường theo WCAG AA |
| Coral Signal / `#28110A` | `5.63:1` | `PROPOSAL`: dùng text tối cho CTA nhỏ |
| Patina / Paper White | `3.47:1` | Ưu tiên border/icon lớn; không dùng body nhỏ |
| Amber / Ledger Ink | `5.60:1` | Ledger Ink trên nền Amber |

Artwork cho thấy text sáng trên Coral Signal ở CTA lớn. Khi triển khai button kích thước thông thường, ưu tiên Ledger Ink hoặc màu tối đã kiểm tra thay vì sao chép text sáng và làm giảm accessibility.

### Màu dẫn xuất đang có trong prototype

Các giá trị sau xuất hiện trong `src/styles/tokens.css`, nhưng **không được artwork công bố**. Chúng là implementation token có thể giữ, chỉnh hoặc bỏ sau review:

| Token hiện tại | Hex | Trạng thái |
|---|---|---|
| Muted surface | `#E8EEE9` | `PROPOSAL` |
| Muted ink | `#50615A` | `PROPOSAL` |
| Soft brand | `#DCEBE4` | `PROPOSAL` |
| Ordinal/focus dark coral | `#9E321F` | `PROPOSAL` |
| Neutral border | `#B8C5BE` | `PROPOSAL` |
| Text on Coral Signal | `#28110A` | `PROPOSAL`, có kiểm tra tương phản |

Không mở rộng palette bằng các màu ngẫu nhiên theo từng component. Mỗi màu dẫn xuất phải map về một intent semantic và được kiểm tra tương phản.

## Ngữ pháp không gian và layout

### Marketing/landing

- `FACT`: header ngang, mảnh, logo trái, navigation giữa/phải; không có sidebar marketing.
- `FACT`: hero là split composition bất đối xứng: thông điệp và CTA ở trái, ảnh tài sản lớn ở phải.
- `FACT`: một cạnh chéo cắt giữa khối nội dung và ảnh, tạo cảm giác hồ sơ/bản đồ được mở ra.
- `FACT`: khoảng trắng lớn bao quanh headline; body có độ rộng dòng ngắn hơn headline.
- `FACT`: sau hero là một đường lifecycle mảnh nối ID, listing, nguồn, xác minh và audit.
- `INFERENCE`: landing nên giới thiệu mô hình dữ liệu bằng một tác vụ thật hoặc đường dẫn vào dữ liệu, không bằng nhiều marketing card rời.

### Product/workspace

- `FACT`: app mockup dùng shell có sidebar hẹp, header hồ sơ, tab ngang và các vùng dữ liệu dạng cột.
- `FACT`: tiêu đề hồ sơ bắt đầu bằng identifier; trạng thái verified nằm gần identifier.
- `FACT`: nguồn dữ liệu, kiểm chứng, phân quyền và audit được tách thành nhóm nhưng cùng một registry context.
- `FACT`: bảng và timeline có mật độ cao hơn landing; divider mảnh giữ nhịp thay vì khoảng trống quá lớn.
- `INFERENCE`: màn hình công việc nên ưu tiên table/list/detail và thao tác tại chỗ. Hero, quote hoặc đoạn kể chuyện không thuộc workspace hàng ngày.
- `PROPOSAL`: desktop dùng content grid rõ trục; tablet cho phép panel xuống hàng; mobile chuyển table thành record rows nhưng không ẩn ID, trạng thái và hành động chính.

### Nhịp khoảng cách

- `FACT`: khoảng cách macro lớn giữa section marketing, nhưng spacing nội bộ của panel dữ liệu nhỏ và đều.
- `INFERENCE`: dùng một thang spacing nhất quán; không trộn khoảng cách cực lớn với card nhỏ như bento portfolio.
- `PROPOSAL`: thang `4, 8, 12, 16, 20, 24, 32, 40, 48, 64px` đang phù hợp với tỷ lệ của board. Đây là quy ước triển khai, không phải số đo được artwork công bố.
- `PROPOSAL`: content marketing có thể giới hạn khoảng `84–90rem`; workspace data có thể rộng hơn nếu bảng cần, nhưng phải giữ lề tối thiểu và không để dòng body chạy xuyên màn hình.

## Line, border, radius và shadow

### FACT

- Divider và border chủ yếu mảnh, màu Patina hoặc xanh xám rất nhạt.
- Active tab/nav có underline xanh rõ nhưng không quá dày.
- Card dữ liệu là Paper White, radius nhỏ đến vừa và có shadow rất mềm.
- Workflow chính dùng một trace Mint dày hơn border để diễn đạt thứ tự; nó không phải decoration độc lập.
- Status verified dùng vùng xanh nhạt nhỏ, gọn, cạnh bo nhẹ.

### INFERENCE

Sản phẩm nên có cảm giác “paper records on a registry canvas”: surface phân biệt đủ rõ nhưng không nổi như thẻ thương mại điện tử. Border và divider làm phần lớn công việc; shadow chỉ giúp tách lớp khi cần.

### PROPOSAL

- Border thường: `1px`; dùng Patina hoặc neutral border dẫn xuất với opacity phù hợp.
- Active edge/tab: `2–3px` Registry Green.
- Radius nhỏ: `8px` cho input, button và row action.
- Radius vừa: `12–14px` cho panel/card.
- Radius lớn: tối đa khoảng `20px`, chỉ cho container lớn hoặc mobile sheet.
- Pill radius chỉ dành cho status/chip có label ngắn; không biến navigation, card hay mọi button thành pill.
- Card shadow: rất nhẹ, low-opacity Ledger Ink; không dùng glow màu, neon hoặc shadow nhiều tầng.
- Raised/modal shadow có thể sâu hơn card nhưng vẫn trung tính.

Prototype hiện có `8px`, `14px`, `20px`, pill radius và hai shadow xanh/ink. Đây là implementation proposal tương thích về hướng, không phải bằng chứng rằng mọi component nên dùng radius hoặc shadow đó.

## Hình ảnh và lớp nền địa lý

### FACT

- Ảnh chính mô tả khu nhà ở đô thị hiện đại, ánh sáng tự nhiên, cây xanh và vật liệu trung tính.
- Ảnh được dùng như bằng chứng về loại tài sản/thị trường, không phải collage phong cách sống.
- Artwork phủ cadastral lines, parcel label, dot-map Việt Nam và network arcs ở opacity rất thấp.
- Các lớp địa lý không làm giảm khả năng đọc chữ hoặc dữ liệu.

### Quy tắc triển khai

- Chỉ dùng ảnh khi nó giúp nhận biết tài sản, dự án, khu vực hoặc nguồn dữ liệu.
- Ưu tiên crop rõ địa điểm/tài sản; tránh ảnh stock có người tạo dáng, skyline vô danh hoặc luxury cliché.
- Cadastral/map trace phải gắn với search, vị trí, identity resolution hoặc provenance. Không rải ngẫu nhiên lên mọi card.
- Trên workspace, background trace nên hiếm và cực nhạt; dữ liệu luôn thắng decoration.
- Nếu không có ảnh có giá trị nghiệp vụ, dùng structured data surface thay vì placeholder minh họa lớn.

## Iconography

### FACT

- Artwork dùng icon outline đơn sắc cho actor và chức năng: người dùng, tổ chức, tòa nhà, ngân hàng, cơ quan quản lý, khiên, clipboard, tài liệu, search và timeline.
- Stroke tương đối đều, góc mềm vừa phải, không có icon 3D hoặc emoji.
- Icon được đặt cạnh label hoặc bên trong sơ đồ quy trình có ý nghĩa.

### PROPOSAL

- Dùng một family outline duy nhất trong mỗi surface; giữ stroke weight và optical size nhất quán.
- Icon mặc định dùng Registry Green, Ledger Ink hoặc Patina; Mint/Coral/Amber chỉ khi icon mang đúng trạng thái đó.
- Mỗi icon phải có label nhìn thấy hoặc accessible name khi là control.
- Không dùng icon chỉ để lấp khoảng trống; nếu bỏ icon mà ý nghĩa không đổi, cân nhắc bỏ icon.
- Actor icon chỉ biểu thị vai trò, không thay avatar hoặc danh tính pháp lý.

## Motif dữ liệu: identifier, provenance và audit

### Identifier

- `FACT`: identifier là điểm neo nổi bật, dùng IBM Plex Mono hoặc nhịp tương đương; ví dụ trên board nằm gần trạng thái xác minh.
- `PROPOSAL`: NPID, PLID và PTID phải tách thành object/label riêng; không gộp thành một chuỗi “mã hồ sơ”.
- `PROPOSAL`: ID có thể copy được và không bị truncate ở detail view; ở list view phải có full value qua accessible name hoặc tooltip nếu thiếu chỗ.

### Provenance

- `FACT`: nguồn chính thống, ngày ghi nhận và trạng thái kiểm chứng được trình bày thành cột/nhóm riêng.
- `FACT`: Mint Trace và các node nối những dấu vết liên quan.
- `PROPOSAL`: trace chỉ nối các event có quan hệ thật. Mỗi nguồn nên có tên, thời điểm, trạng thái và quyền xem phù hợp.

### Audit

- `FACT`: timeline dọc/horizontal có line mảnh, node tròn, timestamp và mô tả event.
- `FACT`: copy trên board nhấn mạnh thay đổi được lưu vết và không thể sửa xóa.
- `PROPOSAL`: event mới nhất cần dễ tìm; timestamp dùng mono; actor, hành động và outcome phải đọc được mà không dựa riêng vào màu.

## Component grammar và state

### Navigation

- Inactive: text/icon trung tính, nền phẳng.
- Active: Registry Green, underline hoặc soft-green surface; chỉ một tín hiệu active chính.
- Không dùng Coral Signal để đánh dấu vị trí điều hướng.

### Button

- Primary: Coral Signal, label tối có tương phản đủ, một hành động trội trong context.
- Secondary: Paper White hoặc transparent, border Registry Green/Patina, label Registry Green.
- Tertiary: text action Registry Green với arrow/icon khi cần.
- Destructive không có token canonical trên board; không tái sử dụng Coral Signal làm destructive mặc định. Đây là `OPEN QUESTION` cần token riêng nếu sản phẩm có thao tác phá hủy.

### Input và search

- Paper White surface, border mảnh, label rõ; focus ring hiển thị độc lập với hover.
- Search có thể là control nổi bật nếu tra cứu là use case chính, nhưng không nên biến thành hero giả trong workspace.
- Placeholder không thay thế label và không được chứa hướng dẫn quan trọng duy nhất.

### Table/list/detail

- Cột và group tuân theo domain object; ID, trạng thái, chủ thể/quyền, nguồn và action ở vị trí ổn định.
- Header nhỏ, đậm vừa; row dùng divider mảnh và khoảng dọc tiết chế.
- Row hover/focus phải rõ nhưng không thay đổi layout.
- Detail panel dùng heading, tab và section rule; tránh nhiều card lồng nhau.

### Status và feedback

- Verified/approved: Registry Green + soft green/Mint Trace, kèm icon hoặc text.
- Warning/supplement required: Amber, kèm label cụ thể.
- Primary next action: Coral Signal; action không đồng nghĩa với status.
- Disabled: giảm emphasis nhưng text vẫn đọc được; không giả vờ clickable.
- Loading, error, rejected và inaccessible không có mẫu đầy đủ trên board; chúng phải được thiết kế theo semantics, không chỉ đổi màu.

### Focus, hover và motion

- `FACT`: artwork tĩnh không công bố interaction state hoặc motion token.
- `PROPOSAL`: focus ring cần tương phản cao và không phụ thuộc màu background; prototype hiện dùng dark coral.
- `PROPOSAL`: hover chỉ đổi nhẹ border/background/underline, không nhảy vị trí hoặc phóng to card.
- `PROPOSAL`: transition nhanh khoảng `140–240ms`; tắt motion không thiết yếu khi `prefers-reduced-motion`.

## Mật độ thông tin

- Landing: một thông điệp chính, một action chính, một visual có căn cứ, sau đó đi thẳng vào cấu trúc dữ liệu hoặc hệ sinh thái.
- Operational home: ưu tiên hàng đợi, search, counter, filter và record list; không dùng hero chiếm phần lớn viewport.
- Record detail: identifier và status trước; tabs/sections sau; provenance và audit luôn có đường truy cập rõ.
- Ecosystem/third-party app view: có thể show toàn bộ landscape, nhưng chỉ control có use case demo mới được interactive. Các app khác phải có trạng thái rõ như `Chưa khả dụng` hoặc chỉ là thông tin, không tạo affordance giả.

`INFERENCE`: đây là khác biệt cốt lõi giữa Living Registry và một portfolio: bố cục không tồn tại để kể về người làm ra sản phẩm; nó tồn tại để người dùng tìm, đối chiếu, ủy quyền, phân phối và truy vết dữ liệu.

## Do / Don't

### Do

- Neo màn hình bằng property/listing/transaction identifier và trạng thái thực.
- Dùng Archive Ivory làm canvas, Paper White làm hồ sơ, green/ink làm cấu trúc.
- Dùng Coral Signal có chọn lọc cho hành động chính.
- Dùng Mint Trace cho vòng đời hoặc provenance thật.
- Cho thấy nguồn, thời gian, quyền và lịch sử ở nơi chúng hỗ trợ quyết định.
- Kết hợp whitespace rộng ở marketing với density có kiểm soát ở workspace.
- Giữ copy ngắn, trực tiếp, bằng tiếng Việt và theo domain language đã chấp thuận.

### Don't

- Không dùng `by HouseNow` hoặc `Powered by HouseNow`.
- Không thiết kế như portfolio, pitch deck hoặc landing SaaS generic.
- Không dùng bento grid, glassmorphism, gradient glow, floating blob hoặc card trang trí không có use case.
- Không dùng ảnh bất động sản thay cho dữ liệu, provenance hoặc workflow.
- Không rải cadastral lines, map dots, timeline node hoặc icon nếu không biểu đạt thông tin.
- Không dùng Coral Signal cho mọi button, badge và active tab.
- Không bo tròn mọi surface thành capsule.
- Không đặt mono cho đoạn văn hoặc table body dài.
- Không đưa wording giải thích kiến trúc/demo vào UI nếu người dùng không cần nó để hoàn thành việc.

## Checklist review trước khi chấp nhận UI

1. Logo có hoàn toàn độc lập, không còn HouseNow byline không?
2. Typeface có đúng vai trò: Be Vietnam Pro cho display, IBM Plex Sans cho interface, IBM Plex Mono cho ID/time không?
3. Các token gốc có đúng tám mã canonical không?
4. Coral Signal có được dành cho action quan trọng thay vì trang trí không?
5. Mỗi card, icon, trace, ảnh và badge có use case rõ không?
6. Màn hình có đọc như công cụ dữ liệu và registry, hay như trang kể chuyện/portfolio?
7. ID, trạng thái, nguồn, quyền và audit có đủ dễ tìm theo use case không?
8. Text/action có đạt tương phản, keyboard focus và reduced-motion không?
9. Layout có giữ được thông tin cốt lõi ở desktop, tablet và mobile không?
10. Các chi tiết lấy từ artwork có bị nhầm với domain rule hoặc hợp đồng tích hợp không?

## Ghi chú về prototype hiện tại

Tại thời điểm review 2026-08-17:

- `src/styles/tokens.css` đã khai báo đúng tám màu canonical và đúng ba font family.
- Các font weight đã được bundle: Be Vietnam Pro `700/800`, IBM Plex Sans `400/500/600/700`, IBM Plex Mono `400/500/600`.
- `BrandMark` hiện dựng đúng motif V nhiều facet và có biến thể compact/inverse.
- `BrandMark` vẫn có khả năng render byline và landing từng gọi biến thể này. Việc loại bỏ là yêu cầu triển khai bắt buộc theo quyết định đã khóa ở trên.
- Radius, shadow, spacing, motion và các semantic derivative hiện tại là implementation proposal; không được dùng làm bằng chứng rằng giao diện đã đúng brandkit.

Một implementation chỉ “dùng đúng màu và font” vẫn có thể sai brand nếu hierarchy, mật độ, surface, imagery và motif dữ liệu không phục vụ use case.
