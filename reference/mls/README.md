# MLS

Workspace cho việc discovery, mô hình hóa và phát triển hệ thống dữ liệu thị trường bất động sản/MLS tại Việt Nam.

Repository hiện đang ở giai đoạn **research và domain discovery**. Chưa có quyết định chính thức về tech stack, kiến trúc triển khai, database hay chuẩn tích hợp. Bộ MLS Texas là reference implementation về sản phẩm/nghiệp vụ, không phải specification được phép copy nguyên trạng.

## Bắt đầu từ đâu

1. Đọc [CONTEXT.md](./CONTEXT.md) để thống nhất ngôn ngữ miền.
2. Đọc [báo cáo BA tổng hợp](./documents/research/mls-texas/BA-report.md).
3. Khi cần kiểm tra bằng chứng, dùng [visual analysis](./documents/research/mls-texas/visual-analysis.md), [transcript](./documents/research/mls-texas/transcript/transcript.md), [24 keyframe](./documents/research/mls-texas/frames/selected/) và [26 contact sheet](./documents/research/mls-texas/contact-sheets/).
4. Đọc [AGENTS.md](./AGENTS.md) trước khi giao việc cho coding/PM/QA agent.

## Cấu trúc

```text
mls/
├── .agents/                         # Role instructions và repository skills
├── AGENTS.md                        # Router + project grounding cho agents
├── CONTEXT.md                       # Ubiquitous language hiện tại
├── documents/
│   └── research/
│       └── mls-texas/               # BA, transcript và visual evidence
├── output/                          # Artifact QA/research cục bộ, không commit
└── tmp/                             # Video nguồn và scratch files, không commit
```

Video walkthrough cục bộ nằm tại `tmp/mls-texas-walkthrough.mp4`. Toàn bộ `tmp/` được Git ignore.

## Cách đọc evidence

- `FACT`: thấy trực tiếp trên video hoặc nghe rõ trong audio.
- `SOURCE CLAIM`: người tham gia nêu, chưa được kiểm chứng bằng luật/tài liệu/hệ thống bên ngoài.
- `INFERENCE`: suy luận có căn cứ, không phải bằng chứng implementation.
- `PROPOSAL`: đề xuất cho dự án MLS Việt Nam.
- `OPEN QUESTION`: quyết định chưa được Product/BA/Legal/Engineering xác nhận.

Không được tự động chuyển rule Texas — ví dụ tư cách REALTOR, license theo bang, association, SLA 72 giờ, listing agreement hay syndication policy — thành yêu cầu Việt Nam.

## Những điểm domain đã đủ mạnh để làm baseline

- Tách `Property`, `Parcel`, `Listing` và `Transaction/Closing`.
- Một Property có thể có nhiều Listing qua thời gian; relist không ghi đè lịch sử.
- Tách hồ sơ nhập chưa submit, `Incoming`, `Active` và market status.
- Status change cần được thiết kế như transition có guard/audit.
- Dữ liệu phải có provenance và classification public/member-only/restricted.
- CMA là luồng human-in-the-loop; auto suggestion không đồng nghĩa định giá tự động.
- Search, report, syndication và partner integration là các downstream consumer phải được reconcile khi dữ liệu thay đổi.

## Việc cần discovery tiếp

- Mô hình vận hành và chủ thể quản lý MLS tại Việt Nam.
- Định danh chuẩn cho Property/Parcel/Unit/Project xuyên địa phương.
- State machine chính thức theo sale, lease, project/new development và loại giao dịch khác.
- Nguồn dữ liệu, source of truth, consent, privacy, retention và dispute workflow.
- Chuẩn feed/API, field mapping, SLA, retry/replay và reconciliation.
- Ranh giới MVP và tech stack sau khi domain/policy được chốt.
