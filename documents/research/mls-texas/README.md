# MLS Texas — research package

Thư mục này chứa transcript, bằng chứng hình ảnh và phân tích BA/domain của video walkthrough MLS Texas dài 01:08:05. Video nguồn cục bộ nằm tại [`tmp/mls-texas-walkthrough.mp4`](../../../tmp/mls-texas-walkthrough.mp4) và không được Git track.

## Nên đọc theo thứ tự

1. [BA-report.md](./BA-report.md) — kết luận điều hành, timeline, cấu trúc sản phẩm, domain model, workflow, business rules, MVP, epics và open questions.
2. [CONTEXT.md](./CONTEXT.md) — glossary thống nhất các khái niệm Property, Parcel, Listing, Incoming/Active, actor và CMA.
3. [visual-analysis.md](./visual-analysis.md) — bằng chứng độc lập từ hình ảnh và OCR.
4. [transcript/transcript.md](./transcript/transcript.md) — transcript tiếng Việt có timestamp; `⚠` đánh dấu đoạn cần nghe lại.

## Thành phần

- `transcript/transcript.srt`, `transcript.vtt`: phụ đề dùng với trình phát video.
- `transcript/transcript.cleaned.json`: segment và word timestamp đã hợp nhất sau các lượt kiểm chứng.
- `transcript/transcript.cues.json`: cue đã chia cho subtitle/xử lý máy.
- `transcript/transcript.words.tsv`: word-level timestamp và confidence.
- `frames/selected/`: 24 keyframe nghiệp vụ đã chọn/crop ở độ phân giải cao.
- `contact-sheets/`: 26 contact sheet dùng để kiểm tra độ phủ toàn bộ video.

## Cách đọc độ chắc chắn

- `FACT`: thấy trực tiếp trên video hoặc nghe rõ trong audio.
- `SOURCE CLAIM`: người tham gia nêu nhưng chưa được kiểm chứng bằng luật/tài liệu/hệ thống bên ngoài.
- `INFERENCE`: suy luận có căn cứ nhưng video không chứng minh implementation.
- `PROPOSAL`: đề xuất cho project Việt Nam.
- `OPEN QUESTION`: cần BA/Product/Legal/Engineering xác nhận.

## Lưu ý

- Video không hiển thị IDE, repository, API, database schema hay deployment diagram. Báo cáo chỉ kết luận cấu trúc sản phẩm/domain/nghiệp vụ; kiến trúc kỹ thuật được ghi rõ là đề xuất.
- Screenshot có thể chứa địa chỉ hoặc thông tin của listing dùng trong demo. Chỉ chia sẻ trong phạm vi team/phạm vi được phép.
- Không commit: video, 409 frame lấy mẫu thô, bộ BA frame trung gian, model/cache, root review, raw Whisper JSON và các verification pass riêng lẻ.
