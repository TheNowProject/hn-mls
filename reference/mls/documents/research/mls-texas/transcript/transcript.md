# Transcript — screen-capture (34)

- Nguồn project: `tmp/mls-texas-walkthrough.mp4` (bản MP4 cục bộ, Git ignored)
- Nguồn phân tích ban đầu: `screen-capture (34).webm`
- Audio đã giải mã: 01:08:05.640, mono PCM 16 kHz
- Ngôn ngữ: tiếng Việt, xen thuật ngữ tiếng Anh
- Nhận dạng chính: `mlx-whisper 0.4.3` + `mlx-community/whisper-large-v3-turbo`, word timestamps
- Kiểm chứng tăng cường: `mlx-community/whisper-large-v3-mlx` tại 00:00–05:30, 10:44–11:50, 36:04–42:10, 43:22–46:30 và 58:00–68:05
- Ký hiệu `⚠` = mô hình có độ tin cậy thấp, giọng chồng nhau hoặc tên riêng được suy ra theo ngữ cảnh; nên đối chiếu audio/frame
- Không gán speaker vì chưa chạy diarization đáng tin cậy
- File nguồn có một Opus packet lỗi sát cuối; ffmpeg vẫn giải mã đến 01:08:05.640

## Thuật ngữ đã chuẩn hóa theo ngữ cảnh

MLS, Matrix, NTREIS (North Texas Real Estate Information Systems), Realtor, real estate agent, broker/brokerage, Supra, ShowingTime, RentSpree, BrokerBay, Zillow, Realtor.com, Quick CMA, Cloud CMA, NAR, TREC, eXp Realty, Days on Market, title company.

## Nội dung có timestamp

### 00:00–05:00

[00:00:00–00:00:15] Thông tin cho Bộ Xây Dựng để làm mấy cái chuyển đổi số ở Việt Nam thì nó có một cái mảng mà nó liên quan đến cái hệ thống cơ sở dữ liệu và nó sẽ đồng bộ các cái thông tin của thị trường tương tự giống như kiểu bên Mỹ.

[00:00:15–00:00:28] Đấy thì lúc mà viết luật thì cũng tham khảo thì tham chiếu của Mỹ ở Trung Quốc đang muốn nhờ Thúy hôm nay dành thời gian để cho mấy anh em có thể xem được cái hệ thống MLS ở bên Mỹ nó đang vận hành như thế nào.

[00:00:30–00:00:41] Tức là trong này thì có anh Bảo là CTO và có Bình là Dev Lead của công ty tớ thì mọi người trước đây đều từng làm PropTech ở bên Mỹ rồi.

[00:00:41–00:00:51] Nhưng mà giai đoạn trước ở giai đoạn này thì đâu đấy nó cũng khác nhau. Đấy và đợt đấy thì mình cũng chỉ là mình lại làm ở trên chỗ Boston.

[00:00:52–00:00:58] Đấy thì cũng muốn là tham khảo nhiều hệ thống MLS ở nhiều nơi xem là nó có những cái gì khác nhau không.

[00:00:58–00:01:08] Và để mình có thể làm cái hệ thống của Việt Nam ấy. Thì nếu mà Thúy tiện thì nhờ Thúy share screen. Đấy để mọi người cùng tham khảo.

[00:01:09–00:01:10] Ok ok

[00:01:10–00:01:13] thì chào anh Bảo và chào Bình

[00:01:13–00:01:17] thì mình là làm Realtor ở bên Mỹ

[00:01:17–00:01:21] nhưng mà nói chung là Hiếu cũng reach out một thời gian rồi

[00:01:21–00:01:23] thì cảm ơn Hiếu đã rất là patient với mình

[00:01:24–00:01:29] để mà thời gian hôm nay các thứ phù hợp được thì cảm ơn cả nhà rất là nhiều

[00:01:29–00:01:33] thì nói chung là cũng trong gia đình thôi

[00:01:33–00:01:36] nên là mọi người có câu hỏi gì mà mình biết thì mình sẽ trả lời

[00:01:38–00:01:40] thì cơ thể bắt đầu ha

[00:01:40–00:01:43] anh Bảo, Anh Bảo lead tiếp giúp em đấy nhé

[00:01:44–00:01:45] Ok ok

[00:01:49–00:01:54] Ok thì bây giờ em sẽ chia sẻ screen nha

[00:01:54–00:01:58] thì mọi người muốn xem gì thì mọi người cứ bảo em

[00:01:59–00:02:00] rồi cảm ơn

[00:02:03–00:02:09] thì cái đầu tiên là bây giờ mọi người có thấy được một cái trang ghi là

[00:02:09–00:02:11] ⚠ North Texas Real Estate Information Systems (NTREIS) không ạ

[00:02:12–00:02:13] mình đã thấy được rồi

[00:02:14–00:02:15] Ok ok

[00:02:15–00:02:19] thì mình sẽ vào trang này ha

[00:02:20–00:02:23] thì nói chung là hệ thống cũng khá là nhiều chức năng

[00:02:23–00:02:28] với mình là Realtor thì mình cũng dùng một số chức năng nhất định ý

[00:02:29–00:02:34] và mọi người mà có một số câu hỏi gì nhất định thì mọi người có thể chia sẻ

[00:02:34–00:02:38] thì cái đầu tiên á ở trên trang này cái mình cảm thấy nha

[00:02:38–00:02:41] mình là người dùng mình cảm thấy khá là tiện

[00:02:41–00:02:45] là có nhiều những cái app mà nó kết nối với nhau ở đây

[00:02:45–00:02:51] thì có một số app là mình hay dùng ở đây là cái app Supra

[00:02:51–00:02:53] với cả app ShowingTime

[00:02:53–00:02:59] hai cái app này là dùng để mở cửa cho khách vào nhà ấy

[00:02:59–00:03:02] thì như kiểu là mỗi lần khi show nhà chẳng hạn thì

[00:03:02–00:03:06] những cái app này là mình phải đặt lịch ở trên đó là giúp mình đặt lịch với cả

[00:03:07–00:03:09] lấy được thông tin của những người đã đến xem

[00:03:11–00:03:14] thì cái này thường là thông tin này là thông tin cho người bán nhà

[00:03:15–00:03:21] là để biết được những ai đến nhà mình và Realtor nào là người đã dẫn khách đến

[00:03:24–00:03:28] có một cái app nữa

[00:03:30–00:03:33] mà nó đang phasing out thì có thể là nó sẽ có một cái app khác

[00:03:33–00:03:34] nó sẽ lên

[00:03:35–00:03:38] thì trước đây nó có một app nữa là nó cũng link vào

[00:03:38–00:03:42] theo kiểu là nếu đăng cho thuê nhà ở trên này

[00:03:42–00:03:45] ⚠ thì cái app đấy nó cũng sẽ giúp screen tenant

[00:03:45–00:03:48] như kiểu nó mọi người submit application qua đấy

[00:03:48–00:03:49] và nó có thể pull background check luôn

[00:03:50–00:03:53] thì có một cái app nữa là nó cũng hay link đến cái này

[00:03:53–00:03:56] thì cái app đấy vừa phasing out ra xong thì có thể sẽ có một app mới

[00:03:58–00:03:59] ờm...

[00:03:59–00:04:02] có một app nữa mình hay dùng ở trên này

[00:04:04–00:04:05] ờm...

[00:04:06–00:04:07] gọi là cái CMA

[00:04:07–00:04:13] cái này là hay dùng theo kiểu là để so sánh giá nhà của mình ấy

[00:04:13–00:04:17] tức là trong này có rất là nhiều cách để pull data với cả analyze data luôn

[00:04:18–00:04:23] nhưng mà một trong những cái tiện nhất hay dùng là ví dụ như khách của mình đang xem một căn nhà

[00:04:24–00:04:24] ờm...

[00:04:24–00:04:28] thì mình sẽ xem được cái CMA này nó gọi là comparable market analysis

[00:04:29–00:04:33] là tí nữa mình cũng có thể ví dụ một cái đấy nếu mà mình muốn xem

[00:04:33–00:04:38] thì nói chung là nó cũng là một cách thông minh để mà nó tự search sẵn là

[00:04:38–00:04:42] là cái căn nào nó tương tự với căn của mình để mình so sánh giá

[00:04:46–00:04:47] ờm...

[00:04:47–00:04:51] Thôi cho mình hỏi là cái này là hiện tại là một không phải là MLS đúng không

[00:04:51–00:04:56] mà cái này là một cái hệ thống app mà downstream lấy data từ MLS về

[00:04:56–00:04:59] và sẽ có nhiều cái đơn vị khác nhau làm những cái app để mà phục vụ

[00:04:59–00:05:01] cho Realtor đúng không ha

### 05:00–10:00

[00:05:02–00:05:08] ờm... đúng rồi đúng rồi Matrix cái này là đúng là MLS chỉ có Matrix này thôi

[00:05:08–00:05:14] nhưng mà như của bây giờ nếu mà mỗi mỗi cần một Realtor nào đó chẳng hạn

[00:05:14–00:05:18] họ sẽ phải trả membership để mà họ có được access với MLS

[00:05:18–00:05:20] với cả họ có được login chẳng hạn

[00:05:20–00:05:24] thì tất cả những cái app này là trong cùng một cái login đấy luôn

[00:05:24–00:05:25] họ được tất cả những cái app này

[00:05:25–00:05:28] ờm... tức là cùng một cái login là họ sẽ thấy được hết những cái app này

[00:05:30–00:05:34] Tất cả những cái app này là các app downstream đúng không?

[00:05:34–00:05:37] Tức là ví dụ như mình đang mường tượng.

[00:05:37–00:05:40] Tức là theo cái kiến thức của mình về MLS.

[00:05:40–00:05:47] MLS nó sẽ là một cái hệ thống giống như là centralized ở từng bang một hoặc là ở từng cái khu vực một.

[00:05:47–00:05:57] Thì là bên Realtor hay Realtor agent hay là các agency sẽ đưa update những cái data về housing, về listing lên trên đó.

[00:05:57–00:06:09] Rồi sau đó ở trên đó nó sẽ có một cái phần là ok là tôi muốn các listing này nó sẽ được public ra downstream để cho các app khác như là Zillow hay Realtor hay những cái app mình đang thấy trong này.

[00:06:10–00:06:13] Thì mà họ có thể là các vụ trên đó.

[00:06:14–00:06:23] Thì là cho mình hỏi là cái phần này là nó chỉ là exclusively là các app downstream thôi hay là nó là có luôn cái MLS ở trên luôn luôn rồi ha?

[00:06:25–00:06:28] Tức là cái này là nó kết nối với MLS.

[00:06:28–00:06:31] Như bạn nói như anh nói đúng là cái này là kết nối với MLS.

[00:06:31–00:06:33] Nhưng nó hơi khác một chút.

[00:06:33–00:06:36] Ví dụ như là Zillow chẳng hạn.

[00:06:38–00:06:39] Em dạy ví dụ như thế này đi.

[00:06:40–00:06:48] Ví dụ như là tất cả những cái app trong này nó như kiểu kết nối giữa Microsoft Excel với cả Microsoft Word, Microsoft PowerPoint.

[00:06:48–00:06:53] Thì nó như kiểu là nó cùng một cái package nhưng mà nó kết nối và nó là những cái khác nhau.

[00:06:54–00:07:00] Còn ví dụ như MLS mà kết nối với Zillow chẳng hạn thì hơi giống như kiểu là mình muốn kết nối PowerPoint với cả Canva chẳng hạn.

[00:07:00–00:07:04] Thì nó hơi khác nhau với cả nó là độc lập, nó danh thu nó khác nhau ấy.

[00:07:07–00:07:10] Đúng hơn là một là MLS.

[00:07:11–00:07:17] Có thể nó là partial ownership hoặc là nó là những cổ bản quyền để kết nối với nhau.

[00:07:17–00:07:18] Ồ.

[00:07:19–00:07:21] Đại loại là như vậy.

[00:07:23–00:07:24] Đó.

[00:07:24–00:07:24] Thì...

[00:07:35–00:07:36] Thì...

[00:07:39–00:07:42] Có hai loại mà mình hay dùng nhiều nhất.

[00:07:43–00:07:44] Mình sẽ dùng hai loại nhiều nhất.

[00:07:44–00:07:46] Thì dụ như là Realtor của mình.

[00:07:47–00:07:48] Thì...

[00:07:49–00:07:52] Mình sẽ có thể đại diện người bán hoặc là đại diện người mua.

[00:07:52–00:07:53] Đúng không?

[00:07:53–00:07:54] Đại diện người mua nhá.

[00:07:54–00:07:59] Thì ví dụ như là đại diện người mua thẳng thị thương ấy.

[00:07:59–00:08:01] Là mình...

[00:08:02–00:08:06] Ví dụ đây là mình sẽ lấy một cái...

[00:08:06–00:08:08] Một cái note.

[00:08:11–00:08:12] Ví dụ đi là...

[00:08:12–00:08:14] Mình là người mua thì mình có hai loại.

[00:08:14–00:08:16] Một là ví dụ như mình...

[00:08:16–00:08:18] Represent người mua.

[00:08:18–00:08:19] Thì người mua có thể...

[00:08:19–00:08:22] Một là họ đã có một cái nhà nhất đấy.

[00:08:22–00:08:22] Họ muốn xem rồi.

[00:08:22–00:08:24] Hoặc là họ mới cho mình tiêu chuẩn thôi.

[00:08:24–00:08:25] Và họ chưa tìm được nhà.

[00:08:25–00:08:26] Ừ.

[00:08:26–00:08:28] Thì cái đầu tiên á...

[00:08:28–00:08:31] Là ví dụ họ đã có một cái nhà cụ thể chẳng hạn.

[00:08:31–00:08:33] Thì ví dụ mình vào đây...

[00:08:33–00:08:36] Mình đánh cái số địa chỉ nhà ra.

[00:08:40–00:08:41] Mình ấn vào.

[00:08:42–00:08:44] Thì mình cũng sẽ tìm được luôn...

[00:08:44–00:08:46] Đây là tất cả những cái listing liên quan đến cái nhà đó.

[00:08:47–00:08:49] Mà đã ở trên...

[00:08:49–00:08:49] Trong...

[00:08:49–00:08:50] Đã ở trên MLS.

[00:08:52–00:08:53] Trong lịch sử luôn tất cả...

[00:08:53–00:08:55] Thực trì database ở đây...

[00:08:55–00:08:56] Nó cũng không có được lâu lắm đâu.

[00:08:56–00:08:58] Nó cũng chỉ có tầm chục năm đổ lại thôi.

[00:08:59–00:09:01] Nên là những cái căn nhà...

[00:09:01–00:09:02] Mà có thể...

[00:09:02–00:09:03] Bán năm chín mấy...

[00:09:03–00:09:05] Năm 2000 thì có thể nó cũng không có trên này cơ.

[00:09:06–00:09:06] Thì...

[00:09:06–00:09:07] Cái này chỉ...

[00:09:07–00:09:08] Trong mấy chút năm đổ lại thôi.

[00:09:08–00:09:09] Thì...

[00:09:09–00:09:10] Dụ như cái...

[00:09:10–00:09:11] Mình xem mà cái status ở đây.

[00:09:11–00:09:12] Nếu mà nó đã active.

[00:09:12–00:09:13] Nghĩa là cái đấy...

[00:09:13–00:09:14] Nó đang tăng.

[00:09:14–00:09:16] Còn tất cả những cái này là trước đấy.

[00:09:17–00:09:18] Thì mình sẽ ấn vào cái số MLS.

[00:09:22–00:09:23] Thì...

[00:09:23–00:09:23] Trong đấy...

[00:09:23–00:09:25] Đây là một cái trang rất là phổ biến...

[00:09:25–00:09:27] Về tất cả những cái thông tin mà nó có.

[00:09:28–00:09:29] Thì ví dụ như mình là...

[00:09:29–00:09:30] Mình mua chẳng hạn là...

[00:09:30–00:09:31] Mình muốn xem thông tin về cái nhà này.

[00:09:31–00:09:33] Thì mình sẽ đọc tất cả những cái thông tin ở đây.

[00:09:33–00:09:35] Tương tự nếu mình mà...

[00:09:35–00:09:36] Người bán nhà này.

[00:09:36–00:09:38] Thì khi mà mình đang bán.

[00:09:38–00:09:40] Mình cũng sẽ phải điến tất cả những cái thông tin này ra.

[00:09:43–00:09:44] Cho mình hỏi.

[00:09:45–00:09:46] Bạn nói tiếp đi.

[00:09:46–00:09:48] Tí mình hỏi chung một lần luôn.

[00:09:50–00:09:51] Thì nói chung là mình cứ...

[00:09:51–00:09:53] Mình cứ nói qua những cái mình hay dùng trước nhé.

[00:09:53–00:09:54] Xong rồi...

[00:09:54–00:09:55] Có gì thì...

[00:09:56–00:09:57] Tất cả những cái thông tin trên này này.

[00:09:58–00:09:59] Là...

[00:09:59–00:10:00] Đang là trên màn hình đấy nha.

[00:10:00–00:10:01] Tất cả những cái này là có trên Zillow.

### 10:00–15:00

[00:10:01–00:10:02] Nó sang tất cả những trang khác hết.

[00:10:03–00:10:04] Cái nhất định ý.

[00:10:04–00:10:05] Ví dụ...

[00:10:05–00:10:07] Đến cái đoạn...

[00:10:07–00:10:09] Private Remarks ở dưới này.

[00:10:10–00:10:11] Cái này là cái...

[00:10:11–00:10:13] Thì có Agent lên MLS thì mình xem được thôi.

[00:10:15–00:10:17] Thì có một số đoạn ở đây là...

[00:10:17–00:10:19] Thì có Agent lên MLS mới xem được.

[00:10:19–00:10:20] Hoặc là...

[00:10:20–00:10:22] Tất cả những cái từ dưới này xuống dưới này.

[00:10:23–00:10:24] Cái này cũng là...

[00:10:24–00:10:26] Chỉ có Agent lên MLS mới xem được.

[00:10:26–00:10:28] Còn nói chung là từ cái...

[00:10:29–00:10:29] Public...

[00:10:29–00:10:31] Cái Property Description lên tất cả chỗ này.

[00:10:32–00:10:33] Thì nó sẽ hiện qua MLS.

[00:10:34–00:10:34] Thì...

[00:10:34–00:10:36] Dụ như mình là người mua nhá.

[00:10:36–00:10:38] Hoặc là kể cả mình không phải là người mua đi.

[00:10:38–00:10:39] Mình chỉ muốn tìm hiểu về cái này thôi.

[00:10:40–00:10:40] Thì...

[00:10:40–00:10:42] Có những cái chat khác bên cạnh này này.

[00:10:42–00:10:44] Là những cái này là thông tin MLS nó pull vào.

[00:10:46–00:10:52] Thông tin của county, thông tin của county tự đồng thuế cho mình.

[00:10:52–00:10:57] Dụ như chính cái nhà này họ đóng thuế năm 2025, 2024, 2023 bao nhiêu.

[00:10:57–00:11:05] Dụ như cái địa chỉ nhà, đây là cái legal description, cái này nó pull từ trang của public information của county lên luôn.

[00:11:07–00:11:13] Thì tất cả những cái owner này, tất cả những cái này là public information luôn.

[00:11:17–00:11:20] Tất cả những cái này cũng là từ public information.

[00:11:20–00:11:28] Thì cái tab này nhá, nó giúp mình được một bước là mình không phải lên cái trang web của city hoặc của county để mình tìm cái căn này mà nó pull trong này.

[00:11:30–00:11:34] Cái tab tiếp theo là hình ảnh nhá, thì họ upload hình ảnh đây thì mình xem được này.

[00:11:35–00:11:35] Cái history là hình ảnh của county.

[00:11:35–00:11:40] Cái history này là mình cũng sẽ xem được là history là history chuyên ở trên MLS.

[00:11:42–00:11:50] Là ví dụ nhá, thì ví dụ là cái căn này họ đăng từ tháng 7 này.

[00:11:51–00:11:52] Ở trên Days on Market

[00:11:52–00:11:52] Thì thường nó sẽ count

[00:11:52–00:11:54] Cái ngày đấy cho mình ở đây

[00:11:54–00:11:55] Xong rồi dụ như mình bảo

[00:11:57–00:11:59] Nhấn cái địa chỉ của cái nhà này ra

[00:11:59–00:12:01] Thì nó có 4 cái listing ở trên đấy

[00:12:01–00:12:03] Thì hẳn là cái 3 cái còn lại

[00:12:03–00:12:05] Ở dưới này là 3 cái còn lại

[00:12:05–00:12:06] Mà trước đấy nó ra lịch sử

[00:12:06–00:12:08] Tận hạn năm 22, 24, 25

[00:12:09–00:12:12] Cái này nó cũng pull từ public record luôn

[00:12:12–00:12:14] Phần còn lại ở dưới này là public record hết

[00:12:14–00:12:18] Là trước đấy là giao dịch là chủ nhà

[00:12:18–00:12:20] Tên gì bán cho người nào

[00:12:20–00:12:22] Vào năm nào xong rồi

[00:12:22–00:12:23] Loại ở đây là thường là

[00:12:23–00:12:25] Loại bên

[00:12:26–00:12:27] ⚠ Thì nó sẽ bên này có nhiều loại

[00:12:27–00:12:28] Loại khác nhau

[00:12:28–00:12:29] Thì như kiểu là

[00:12:29–00:12:30] Trong gia đình của mình

[00:12:30–00:12:31] Mà sang tên

[00:12:31–00:12:32] Thì tên của nó là

[00:12:32–00:12:33] Một loại đi khác

[00:12:33–00:12:34] Còn khi mình bán nhà

[00:12:34–00:12:35] Một loại đi khác

[00:12:35–00:12:36] Thì mình cũng có thể đọc được

[00:12:36–00:12:37] Cái loại đấy ở trên này

[00:12:38–00:12:38] Xong rồi

[00:12:39–00:12:40] Khi mà public record

[00:12:40–00:12:43] Là nhà đấy mà họ có vay tiền

[00:12:43–00:12:44] Để mà họ mua hay không

[00:12:44–00:12:46] Thì nó cũng có cái mortgage history

[00:12:46–00:12:48] Để nó cũng là public record luôn

[00:12:48–00:12:49] Thì nó cũng pull vào ngay

[00:12:49–00:12:50] Trong cái phần này là

[00:12:50–00:12:51] Năm nào

[00:12:51–00:12:53] Kể cả cái chủ nhà đấy nhá

[00:12:53–00:12:54] Ví dụ

[00:12:57–00:12:59] Ví dụ nhá là chủ nhà đấy

[00:13:00–00:13:01] Bao nhiêu năm nay vẫn ở đấy

[00:13:01–00:13:02] Nhưng mà họ

[00:13:02–00:13:04] Họ refinance

[00:13:04–00:13:05] Tức là họ lấy một cái mortgage

[00:13:05–00:13:06] Nó cũng hiện ở trên này luôn

[00:13:08–00:13:09] Mấy lần đây là nó refinance

[00:13:09–00:13:10] Rồi nó hiện ở trên này

[00:13:10–00:13:11] Đây là refinance

[00:13:13–00:13:15] Những cái nhà mà trước đấy

[00:13:15–00:13:16] Kiểu bị foreclosure á

[00:13:16–00:13:19] Là kiểu họ không trả được tiền

[00:13:19–00:13:21] Mà kiểu họ bị nhà banh lấy lại nhà

[00:13:21–00:13:22] Thì nó cũng hiện ở trên này luôn

[00:13:24–00:13:24] Ok

[00:13:26–00:13:27] Thì đấy còn đâu

[00:13:27–00:13:28] Mấy cái còn lại

[00:13:28–00:13:29] Thì nó khá là đơn giản

[00:13:29–00:13:30] Thì thường ấy

[00:13:30–00:13:31] Là khi vào một trang

[00:13:31–00:13:32] Thì dụ như mình nói

[00:13:32–00:13:33] Ban vừa nãy nhá

[00:13:33–00:13:34] Là có nhiều cái app

[00:13:36–00:13:37] Nó kết nối vào ấy

[00:13:37–00:13:39] Thì ở ngay cái hàng dưới cùng

[00:13:39–00:13:40] Trên màn hình của mình nhá

[00:13:40–00:13:41] Mình thấy BrokerBay

[00:13:41–00:13:42] Mình cái Cloud CMA

[00:13:42–00:13:44] Thì như vừa nãy mình

[00:13:44–00:13:45] ⚠ Mình hay dùng Quick CMA

[00:13:45–00:13:47] Hoặc Cloud CMA

[00:13:47–00:13:48] Để mà so sánh nhà này

[00:13:48–00:13:48] Với những cái nhà

[00:13:48–00:13:50] Lân cận chẳng hạn

[00:13:50–00:13:51] Thì mình dùng những cái app

[00:13:51–00:13:51] Ở đây luôn

[00:13:52–00:13:53] Hoặc là ví dụ như

[00:13:53–00:13:55] Mình muốn cái này cho khách

[00:13:55–00:13:57] Hoặc là mình muốn in ra

[00:13:57–00:13:57] Email các thứ

[00:13:57–00:13:58] Thì cái đấy nó khá là bình thường

[00:14:04–00:14:06] Cho mình hỏi sơ là

[00:14:06–00:14:07] Hồi nãy ở cái trang trước

[00:14:07–00:14:08] Là khi mà mình thấy

[00:14:08–00:14:09] Mình xếp cái căn 515

[00:14:09–00:14:11] Ở cái địa chỉ này nè

[00:14:11–00:14:12] Thì là mình sẽ thấy

[00:14:12–00:14:13] Nó sẽ có nhiều cái

[00:14:14–00:14:15] Là mỗi cái MLS

[00:14:15–00:14:16] Nó sẽ represent

[00:14:16–00:14:18] Cho mỗi lần cái căn đó

[00:14:18–00:14:18] Được sale

[00:14:18–00:14:19] Hay là được chuyển ngay trần

[00:14:19–00:14:20] Đúng không các bạn

[00:14:21–00:14:21] Đúng rồi

[00:14:21–00:14:22] Đúng rồi

[00:14:23–00:14:24] Đúng rồi

[00:14:24–00:14:24] Đúng rồi

[00:14:24–00:14:25] Thì bây giờ

[00:14:25–00:14:26] Đúng rồi

[00:14:26–00:14:26] Thì mấy là mình

[00:14:26–00:14:27] Ví dụ

[00:14:27–00:14:28] Đúng rồi

[00:14:28–00:14:29] Nói chung là

[00:14:31–00:14:31] Thì bây giờ

[00:14:31–00:14:32] Thì bây giờ

[00:14:32–00:14:32] Nó có

[00:14:33–00:14:34] Vừa nãy nó có ra

[00:14:34–00:14:35] 4 result

[00:14:35–00:14:35] Đúng không

[00:14:35–00:14:36] Thì đây là 1

[00:14:36–00:14:37] 1 of 4 này

[00:14:37–00:14:38] Thì dự mình ấn

[00:14:38–00:14:39] Thằng cái 2

[00:14:39–00:14:40] 2 of 4 là cái tiếp theo

[00:14:40–00:14:42] Trong cái danh sách đấy luôn

[00:14:42–00:14:43] Là nó có thể nó tiếp tục

[00:14:43–00:14:44] Thì cái này

[00:14:45–00:14:45] Là

[00:14:45–00:14:45] Và

[00:14:46–00:14:47] Listing date

[00:14:47–00:14:48] Là đăng hồi

[00:14:48–00:14:49] 2025

[00:14:50–00:14:51] Xong nó close

[00:14:51–00:14:53] Vào cuối tháng 12

[00:14:53–00:14:54] Và cái này

[00:14:54–00:14:55] Hồi đấy họ đã đăng

[00:14:55–00:14:56] 1 lần

[00:14:56–00:14:57] Expire

[00:14:57–00:14:58] Có nghĩa là hồi đấy

[00:14:58–00:14:58] Họ đăng

[00:14:58–00:14:59] Nhưng mà họ chưa bán được

### 15:00–20:00

[00:15:01–00:15:03] Và mỗi lần đăng như vậy

[00:15:03–00:15:05] Thì nó sẽ có 1 cái number khác nhau

[00:15:06–00:15:07] Cho mình hỏi

[00:15:07–00:15:09] Ở trên cái hệ thống này là

[00:15:09–00:15:11] Mình cũng không rõ lắm

[00:15:11–00:15:12] Ở Mỹ với Việt Nam

[00:15:12–00:15:12] Có gì khác nhau

[00:15:12–00:15:13] Thì là

[00:15:14–00:15:15] Cái này là

[00:15:15–00:15:16] 1 cái căn nhà

[00:15:16–00:15:17] Thì có thể có nhiều

[00:15:17–00:15:18] Bạn agent đăng cùng

[00:15:18–00:15:19] 1 lúc không hả

[00:15:21–00:15:23] Thường thì không được

[00:15:23–00:15:24] Thường thì không được

[00:15:25–00:15:27] Thường thì không được

[00:15:27–00:15:27] Ví dụ ý

[00:15:27–00:15:28] Theo đúng luật

[00:15:29–00:15:29] Thường thì tôi nghĩ

[00:15:29–00:15:30] Thì nó có 1 cái gọi là

[00:15:30–00:15:31] Listing type

[00:15:31–00:15:32] Nghĩa là

[00:15:32–00:15:33] Cái

[00:15:33–00:15:34] Cái người đấy

[00:15:34–00:15:35] Có được exclusive

[00:15:35–00:15:36] Để mà sell

[00:15:36–00:15:37] Hoặc là có thể

[00:15:37–00:15:38] Rent cái nhà đấy ra không

[00:15:38–00:15:39] Thì nó có

[00:15:39–00:15:41] Nó có cái term đấy

[00:15:41–00:15:41] Nhưng mà

[00:15:41–00:15:42] Cái term này nói chung

[00:15:42–00:15:43] Nó chỉ đại loại

[00:15:43–00:15:44] Như kiểu là

[00:15:46–00:15:47] Exclusive right to sell

[00:15:47–00:15:48] Có nghĩa là cái agent này

[00:15:49–00:15:50] Được quyền exclusive

[00:15:50–00:15:51] Để bà bán

[00:15:52–00:15:53] Nhưng mà kể cả

[00:15:53–00:15:53] Phủ nhà

[00:15:53–00:15:54] Họ tự tìm được

[00:15:54–00:15:55] Người mua chẳng hạn

[00:15:55–00:15:56] Thì agent này vẫn được

[00:15:56–00:15:58] Thì nói chung là cái term này

[00:15:58–00:15:59] Nói chung là

[00:15:59–00:16:04] đa số là nó chỉ để giúp bảo là ai là người được tiền thôi nhưng mà cái quan trọng ở đây là cái

[00:16:04–00:16:10] cái system này khi mà mình khi mà mình đăng lên ý là nó sẽ tự báo là bây giờ nó đang được đăng ở

[00:16:10–00:16:16] một nhà khác hay các thứ thì của một người khác chẳng hạn thì nó sẽ không cho mình đăng thêm nữa

[00:16:20–00:16:26] Vậy là phải là một xp mới có người khác đăng lên được thì cho mình hỏi là cái quy trình đó tức là làm

[00:16:26–00:16:32] sao để mình một cái người agent biết được là ok là tôi đang có cái Exclusive right cho căn này hay là

[00:16:32–00:16:39] tôi đang hay là một cái trận khác là Exclusive right cho căn này để tránh trường hợp giảm chừng nhau

[00:16:40–00:16:49] đúng rồi đúng rồi thì thì cái này nhanh thì nó chung là đơn luật pháp với cả quy luật nó vào thì nó

[00:16:49–00:16:55] chặt chẽ nghĩa là khi mà mình đăng một cái nhà của ai đấy là mình phải ký hợp đồng với họ thì nó có

[00:16:55–00:17:03] hẳn một cái form luôn là như kiểu có thể là listing representation agreement thì trong đấy nó sẽ hỏi là

[00:17:03–00:17:10] loại listing của mình là loại gì thì mình sẽ lại đấy ra xong rồi khi mình đăng cái nhà này là mình cũng

[00:17:10–00:17:16] phải biết cái loại đấy của mình là loại gì ra thì nó chung là mình nó chung là mình phải có hợp đồng

[00:17:16–00:17:22] sau này trên này khi mình đang mình phải là phải phải chuẩn cái đấy với nhau rồi mình mà là người đầu tiên

[00:17:22–00:17:29] đang chẳng hạn mình đã có hợp đồng rồi thì ok xong rồi sau đấy những người mà sau đấy mà muốn xem

[00:17:29–00:17:34] chủ nhà này chẳng hạn thì dũng giống như mình mình vừa làm thôi là mình đang muốn nghiên cứu cái

[00:17:34–00:17:40] nhà này hoặc là mình muốn gặp chủ nhà để mình được bán cái này chẳng hạn thì mình mình điền cái mình tìm

[00:17:40–00:17:45] cái địa chỉ nhà ở đây là mình tự biết được là họ đang có một người khác mà họ đã có exclusive right to

[00:17:45–00:17:53] xeo rồi à à à à à thường là một cái hợp đồng như vậy là nó kéo dài cho bao lâu hả

[00:17:53–00:18:00] muốn biết bao nhiêu bao lâu được đấy là tùy chủ nhà với cả tùy họ muốn biết bắt đầu được nhưng mà

[00:18:00–00:18:08] họ có được dừng giữa chừng không có họ họ biết được họ họ được bỏ thì họ trong luận như thế họ

[00:18:08–00:18:12] sẽ biết ở trong hợp đồng như thế luôn đó là tôi có thể đơn phương chấm dứt hợp đồng cử đấy

[00:18:15–00:18:21] thường cái này không không ai được đơn phương chấm dứt cả hai bên chấm dứt rất thì nó lại có một

[00:18:21–00:18:28] cái form khác họ phải điền là để để gọi là chung nơi xin lập lý thì họ lại điền cái ra hai bên cùng điền

[00:18:28–00:18:36] với nhau khi mà ví dụ ở đây nhá dụ như như bản thân mình là mình là bố tờ chẳng hạn thì dụng

[00:18:36–00:18:45] cái listing agent ở đây tên là gì xong rồi họ phải có một cái brokerage thì cái broker của họ là

[00:18:45–00:18:54] Coldwell Banker chẳng hạn thì cái cái người thì broker của họ phải là cái người kéo cái này xuống chứ cái người

[00:18:54–00:19:00] agent cũng không kéo được xuống cơ tức là mình chỉ là tức là bên này theo kiểu là lời khác nào cũng thế

[00:19:00–00:19:06] thế nên là cái người broker bên trên này như kiểu là Supervisor là người đấy phải phải liên hệ với

[00:19:06–00:19:14] mô để mà kéo xuống sẽ đưa cái tên này ra cho MLS để kéo xuống chứ còn tự agent cũng không làm được

[00:19:19–00:19:25] cho mình hỏi thêm là ai sẽ là người phụ trách để mà khiếp những cái thông tin này up to date ha

[00:19:25–00:19:33] chẳng hạn như ok là khi mà một cái hợp đồng nó expire hay là một cái hợp đồng thì ai sẽ là người

[00:19:33–00:19:42] giống như là chuyển những cái status đó hay là đưa một cái căn nhà lên mls ha thì thì phần lớn nhất từ cái

[00:19:42–00:19:48] việc từ cái việc là kéo hợp đồng xuống kéo listing xuống thì mình phải liên quan đến broker còn vụ như bản

[00:19:48–00:19:55] thân mình chẳng hạn thì Realtor là người phải phải phải phải lên đây mình trên thằng những cái

[00:19:55–00:20:01] information này và luật khá là chặt chẽ theo kiểu là đúng cho like thằng của mình luôn đi theo luật luôn

### 20:00–25:00

[00:20:01–00:20:07] ý là nó sẽ đề xuất là trong tất cả những cái mục là mình phải up đến như nào ví dụ nhá Bây giờ mình

[00:20:07–00:20:15] có thể làm ví dụ là dụ như mình vào một cái hợp đồng chẳng hạn xong mình có ba ngày tức là 72 tiếng để

[00:20:15–00:20:24] mình để để mình thay đổi cái cái xa đấy mình mà không thay đổi đúng đấy anh khác họ mà biết họ có thể

[00:20:24–00:20:32] mình lên với lên lên với lên lên với association hoặc là mình có thể bị phạt cái đấy là những tất cả những

[00:20:32–00:20:40] cái thông tin đấy là Realtor rất là phải chật chẽ cho đúng là mình phải tự làm cái đấy thì bây giờ

[00:20:40–00:20:48] mình ví dụ cho các bạn bây giờ mình đang có mấy cái xin có mấy cái xin cái này của mình là mình đang vừa

[00:20:48–00:20:57] đăng vừa để bán và vừa để vừa để thuê thì bạn có thể thấy ở đây là cái căn này mình vừa đăng bán và vừa

[00:20:58–00:21:06] cho đây là hai cái listing của mình thì ví dụ như mình chọn một trong hai cái này thì nói chung ấy khi

[00:21:06–00:21:12] mình edit với cả khi mình mới điền mới điền mới tinh thì nó cũng khá là giống nhau thì bây giờ mình dùng

[00:21:12–00:21:19] cái ví dụ này để mà các bạn xem được là là khi mà điền rồi thì chông nó như thế nào ha thì khi mình

[00:21:19–00:21:24] thay đổi mình có thể thay đổi những cái sau residential cái này là mình sẽ ấn vào là mình từng cái thông

[00:21:24–00:21:30] tiền thông tin nhà như thế nào là mình có thể điền đa số với tất cả những cái thông tin mà là bao nhiêu

[00:21:30–00:21:38] phòng ngủ kích cỡ bao nhiêu có có những tiện nghi gì các thứ nọ chẳng hạn thì cái đấy mình luôn luôn

[00:21:38–00:21:45] biết ở trong đấy là cái người mua và cái agent của người mua họ họ vẫn phải kiểm tra lại cái này mình

[00:21:45–00:21:52] chỉ là mình viết so với cái cái mà mình hiểu biết hoặc là sao giờ họ cho mình được cái gì thì họ ấy

[00:21:52–00:21:58] có thể không nên một số lúc họ có thể bị nhầm chẳng hạn hoặc là ví dụ một cái nhà nó đang ở 3 năm

[00:21:58–00:22:05] trước nó có thể là được đi học ở cái trường cấp 2 này nhưng mà nhưng mà sau này gần đây nó đổi trường

[00:22:05–00:22:09] chẳng hạn dự đến người sau rồi của mình mà không có con học trường cấp 2 thì có thể họ không để ý

[00:22:09–00:22:16] họ không biết chẳng hạn thì mình vẫn có có một số trường hợp cũng không phổ biến đâu nhưng mà có thể

[00:22:16–00:22:23] thấy ra là có thể vẫn để cái trường cấp 2 cũ thì ví dụ cái người mua họ thực sự muốn mua nhà để cho

[00:22:23–00:22:29] con mình đi đúng học một cái trường cấp 2 đấy chẳng hạn thì họ vẫn phải tự tự confirm cái cái cái thông tin

[00:22:29–00:22:37] ở trên này còn đâu bây giờ những cái chỗ này nhớ tất cả những cái chỗ trên này biết là tất cả cái

[00:22:37–00:22:44] này nó sẽ là status hết là tất cả cái này mình vừa nói luôn là là theo đúng luật là có 72 tiếng để mà

[00:22:44–00:22:49] mình thì nó có thể là active contingency active option contract nó là một thể loại là mình đang trong

[00:22:49–00:22:57] hợp đồng trên suy pending cái này là sau khi họ đã hết cái option xong thì họ vẫn đang trong hợp đồng

[00:22:57–00:23:03] xong rồi dự như active kick out lại dự như làm ai đang định mua rồi nhưng mà lý do họ không mua

[00:23:03–00:23:09] được nữa thì họ có thể lại quay lại active close là khi mình bán xong rồi mình bán xong mình bán giá

[00:23:09–00:23:18] bao nhiêu mình cũng mình cũng cũng bắt buộc là mình phải để đúng cái giá ở trên này đúng cái giá mình bán

[00:23:18–00:23:25] và cái người agent của bên kia tên là gì mình cũng phải viết rất là cụ thể luôn và cái này là mình là

[00:23:25–00:23:29] cái người cái người của người bán là phải phải có cái thông tin này

[00:23:34–00:23:40] thế nhá xong rồi ở dưới này thì nó cũng đơn giản hô dự mình có thể đăng hình ảnh này

[00:23:40–00:23:47] là upload document ở đây để mọi người xem được này khi mà mình vào xem đúng cái listing này của

[00:23:47–00:23:54] mình nhất thì mình phải đi đến tất cả những cái sát này khi mà mình khi mình đăng nhà thì ở đây có giá có

[00:23:56–00:24:00] có ngày list này gửi trong hợp đồng của mình cái ngày hết hạn là ngày bao nhiêu mình cũng phải ghi

[00:24:00–00:24:12] vào đây xong mình tận những thông tin này dụ như cái này cái mấy bạn vừa hỏi là làm thế nào để thể hiện được là cái người

[00:24:12–00:24:17] này là cái người được bán chẳng hạn thì đây nó có rất nhiều xa ở đây luôn mình sẽ phải chọn một cái này để ghiền vào

[00:24:25–00:24:34] ở bên đấy lúc mà mình đăng một cái listing đấy Thúy thì họ có một cái gọi là một cái để để data để

[00:24:34–00:24:40] ví dụ bạn thì cần nhập cái địa thị nhà đấy là nó tự phu ra diện tích nhà rồi xây dựng năm bao nhiêu

[00:24:40–00:24:48] phương phô rồi các kiểu hay là mình phải phê phê bằng tay hết có có một số trường hợp là mình sẽ

[00:24:48–00:24:55] ấy được thì bây giờ ví dụ như mình chẳng vào mình thao tác và mình làm một cái nhà mới đi thì bây giờ

[00:24:55–00:25:01] từ từ để mình ví dụ nha là mình sẽ lấy đúng cái số MLS của cái nhà này mình có gì ví dụ historical

### 25:00–30:00

[00:25:01–00:25:06] data của cái căn đấy listing cũ của nó là hả thì nó có full những cái description với cái nhà đấy

[00:25:10–00:25:17] nó có auto fill hay nó có vẻ dữ liệu đấy không hay là anh lại phải nhập lại từ đâu có nó có đây ca sẵn

[00:25:17–00:25:24] thì nhớ mình thức mình vào đây mình vào input là cái này là như khi mình thiết lập mới mình có thể đi

[00:25:24–00:25:30] bởi xe xin hoặc là mình ăn một cái new thì mình áo như đây mình có thể có nhiều cách khác nhau dùng

[00:25:30–00:25:38] như mình bán nhà để ở thì ra residential là cái này là để mình cho thuê nhà để ở trong có commercial

[00:25:38–00:25:44] cái này nữa thì ví dụ mình đang trong cùng mà cái category là cái nhà kia mình đang ở ấy ha thì

[00:25:44–00:25:50] một đấy là nó sẽ ra sống trơn như thế này mình có thể điền thì ở trên này cái ba cái nút ở trên này

[00:25:50–00:25:58] là ba cách mình có thể lấy cái data ra một đi làm những có thể khu từ tử tất cái này là thông tin ở

[00:25:58–00:26:04] nhà hàng đầu public database của của county và của city thì có thể nhà này có thể tax ID thường mọi

[00:26:04–00:26:10] người không ai nhớ tax ID của nhà mình đâu thì họ biển cái địa chỉ nhà ra hoặc là địa chỉ tên chủ nhà

[00:26:10–00:26:16] ra thì nếu mà nó nó kéo được ở trên xách xuống thì có thể điền vào cái này hay là nếu mà cái nhà

[00:26:16–00:26:23] đấy đã có trên MLS rồi chẳng hạn ấy thì bây giờ ví dụ nhá mình có cái căn vừa nãy mình vừa copy cái số MLS

[00:26:23–00:26:29] nó sẽ xong kể cả cái số MLS từ bao nhiêu năm rồi hoặc là nhà này đã chốt từ lâu rồi nhá mình lấy

[00:26:29–00:26:34] số nào cũng được nhưng mà mình mà dùng được cái số đấy thì nó cũng sẽ cho mình thì đây thì nó có cái

[00:26:34–00:26:42] những cái căn bàn ở đây xong rồi sau đấy mình vẫn phải biết giá mình vẫn phải những cái mới ra nhưng mà

[00:26:42–00:26:49] có những cái điều chỉnh còn những cái thông tin gọi là phít rồi thì nó nó sẽ có sẵn ở đấy hết rồi thì

[00:26:49–00:26:58] mình sẽ nói đây là thường thường là 60 70 phần trăm là mình có thể kéo được từ cái số này ra còn dụng

[00:26:58–00:27:05] như đã giống như nhà đa số mọi người mà ở lâu rồi hoặc là như cử mình bảo là MLS cái database này

[00:27:05–00:27:12] có thể chỉ là chục năm đổ lại mà nó cũ quá nhà đấy mà không bán không có một cái giao dịch gì trong

[00:27:12–00:27:17] vòng chục năm vừa rồi thì có khi họ cũng không có MLS number thì mình một số trường hợp là mình phải điền

[00:27:32–00:27:39] cái cái anh bảo nghe view cái luồng đăng tin này tức khi mà đây là mình đăng ký là mình bán cái nhà

[00:27:39–00:27:46] đấy gọi là với cái hệ thống MLS này còn sau đấy thì mình hoàn toàn có thể đi gọi là đăng trên các cái

[00:27:46–00:27:51] nền tảng khác đúng không theo kiểu là Zillow hay là whatever những cái nền tảng mà mọi người hay dùng

[00:27:51–00:27:58] để để bán nhà ấy thì nó tự động đăng từ cái này lên hay là mình phải sang bên đấy để mình thao tác

[00:27:59–00:28:06] đa số nó tự động à tự động luôn hả từ cái MLS này nó tự đẩy lên trên Zillow và các nền tảng khác mình

[00:28:06–00:28:15] không cần phải lên đấy và thông tin nó sẽ đồng bộ với nhau đúng rồi nó đồng bộ luôn dụng như là mà

[00:28:15–00:28:20] nó khá là nhanh nhanh ví dụ ví dụ như một cái căn nhà này của mình mình đang muốn thay đổi giá chẳng hạn

[00:28:20–00:28:26] mình thay đổi giá xong rồi mình chờ vài phút thì mình lên Zillow nó cũng đã hiện rồi ồ ồ anh gần như là nó

[00:28:26–00:28:37] có update khá là real time đúng rồi đúng rồi à à à Nhưng mà có một cái nhé cái này theo luật thôi

[00:28:37–00:28:42] nhưng mà cũng ít người dùng áp dụng trong cái listing agreement của mình với cả cái người bán trải hạn

[00:28:42–00:28:49] nhất thì trong đấy nó sẽ có một mục mà cái em có thể xách ra xong mình không biết bán khác nào có thể

[00:28:49–00:28:57] không thì nó sẽ hỏi ở đây là cái người sau rồi có đồng ý cho anh của mình đăng đăng cả của họ lên

[00:28:57–00:29:04] những trang những trang quảng cáo như Zillow các thứ không thì lấy phải một mục họ phải chọn nào thì đa

[00:29:04–00:29:11] số mọi người cũng có có thôi có một số có một số khách chẳng hạn có thể một lý do cá nhân nào đấy

[00:29:11–00:29:18] thì nó sẽ như kiểu là họ không muốn họ hàng biết được họ đang bán đúng rồi đúng rồi thì thì họ

[00:29:18–00:29:23] cũng thể lựa chọn là không thì trên này cũng có một cái chỗ là mình có thể bảo nó không được đăng lên

[00:29:23–00:29:31] rêu cái trang kia nữa mà chỉ làm tôi đang đăng ký quyền bán đăng ký cái quyền lên bán cái này với

[00:29:31–00:29:40] với MLS rồi mà không đăng ra cái nền tảng đúng rồi đúng rồi mình có một cái này có thể là sẽ giúp mọi

[00:29:41–00:29:48] trang kia này của mình vừa bán và vừa ăn cho thuê thì nó có thể hiện cả hai nhưng mà một trang như

[00:29:48–00:29:53] Zillow chẳng hạn nhé nó chỉ hiện được một trong hai thôi nên là nó không nó không hiện được vừa bán vừa

[00:29:53–00:29:59] mua ở trên Zillow đâu thế nên là nên là cái gì mình lên trước là cái đấy là nó sẽ hiện trên Zillow

### 30:00–35:00

[00:30:01–00:30:07] ở trên cái MLS này nó có nhiều cái tab ở phía trên phết nhở tức là nó có rất nhiều các cái tính năng

[00:30:07–00:30:13] tên tên tên nhiều nhiều cái feature khác nữa em em chắc là đối với Realtor chắc chỉ chủ yếu là dùng

[00:30:13–00:30:20] những cái liên quan đến gọi là lý tinh ngày thôi đúng không thực ra những cái tab này nó cũng khá là

[00:30:20–00:30:27] giống ở nó cũng chỉ là từng đấy thông tin nhưng mà nó kéo những cái khác nhau thì ví dụ nhá tôi đã mình

[00:30:27–00:30:33] ví dụ là cái người khách ấy hoặc là bản thân mình mình có một cái nhà cụ thể mình muốn xem đúng không thì

[00:30:33–00:30:38] mình thì mình lên đấy ví dụ lên cái trang search này thằng hạn đó mình đang muốn residential mà

[00:30:38–00:30:45] ở mỗi quýt search thì lựa như là hiểu đang đi tìm nhà đi mà hiểu chưa biết ở đâu cả nhưng mà nó làm

[00:30:45–00:30:51] đang khoảng giá này các thứ thì họ có thể điền cái này thì nó kéo ra được mấy chục cái nhà chẳng hạn

[00:30:51–00:30:58] thì mình thêm thì cái search này là nó nó cũng dừng đến đây đã ra thôi nhưng mà kéo cái khác nhau rồi

[00:30:58–00:31:08] cái này nó cũng vậy nó sát nó cũng cũng vậy là nó có thể kéo được là ô giá trị nhà trong một cái

[00:31:08–00:31:15] khu vực thì nó cũng hãy nó được nhiều nhà cùng một lúc để nó kéo cùng số liệu xong rồi bên thuế cũng vậy

[00:31:15–00:31:22] hết thuế nó có thể nhiều nhà cùng một lúc thì thực ra tất cả những cái này nó giống hết những cái mình xem

[00:31:22–00:31:27] cái này nó lên trên kia thôi chỉ chẳng qua là nó thông tin một cái cách khác cũng như ai mà thích thân

[00:31:27–00:31:33] tích số liệu thị trường các thứ thì có thể lên đây dùng cái đấy cái này là dành cho broker là

[00:31:33–00:31:42] agent only thôi đúng không đúng rồi đúng rồi tức là nhắc cái này là một cái một cái bước khác hơn

[00:31:43–00:31:52] bình thường họ cũng cũng có thể không có cái cái access với cái này cho nó phải chạy một cái tưởng họ

[00:31:52–00:31:58] tưởng họ tưởng nghĩ là cái này bắt buộc khi bạn đã làm bây giờ thì bạn bắt buộc phải sử dụng cái này

[00:31:58–00:32:08] hay là có quyền lấy chọn tức là nói chung ấy là để mà để mình thành công với việc mình làm thì mình

[00:32:09–00:32:19] ⚠ có thể tin thì mình phải đây là này trước hết không phải là MLS đúng rồi cái này cái access nó

[00:32:19–00:32:27] đi theo association Realtor gì ví dụ như mình ở khu Dallas Fox 1 sản hạn ở đây có tận 45 cái

[00:32:27–00:32:33] association khác nhau luôn thì khi mình tham gia cho sưu xe trên đấy thì mình sẽ được mình trả tiền

[00:32:33–00:32:40] hàng tháng từng order một thì sẽ được access với mls cho tới hỏi một chút là cái chi phí mà mỗi tháng

[00:32:40–00:32:50] mà Realtor cần phải trả để xét đến hệ thống này là bao nhiêu mình ví dụ nha là một năm là hơn 2.000 đô

[00:32:50–00:32:52] ⚠ một năm hơn 2.000 đô

[00:32:53–00:32:53] dạ dạ

[00:32:55–00:32:55] dạ

[00:32:55–00:32:56] anh bảo ơi

[00:32:57–00:32:58] ôi

[00:32:58–00:33:02] một năm trả tận 60 triệu hệ thống này anh bảo ơi

[00:33:02–00:33:06] ở đâu thời tài cũng bằng em mua căn nhà xong em trả thơi đất cho nó cũng mấy ngàn

[00:33:06–00:33:06] nam hả

[00:33:09–00:33:13] ⚠ em nghĩ em vong về Việt Nam mình chỉ lên chạc về tầm 10 triệu rồi chúng nó đã khóc rồi ấy

[00:33:15–00:33:24] đó thì thì thì cái này cũng là một trong những cái bí thức xe khá là khá là cao cho với để làm

[00:33:24–00:33:30] Realtor nhưng mà như như mình xem đấy là có thể nói là suốt hết nhưng mà ai cũng phải cần đấy ai cũng

[00:33:30–00:33:39] phải mua cho mình hỏi là nếu mà như vậy thì là cái cái MLS này nó giống như là một cái sinh của

[00:33:39–00:33:44] nó giống số sắp chút luôn có nghĩa là mình sẽ không được lăng cái tin khác ở trên các hệ thống khác

[00:33:44–00:33:49] như Zillow hay Realtor đúng không tức là mình nó hoàn toàn phụ thuộc vào MLS này còn thấy dụ như

[00:33:49–00:33:56] hồi nãy bạn nói là mình có một căn cho thuê và cái căn mua căn bán nó cùng một địa chỉ thì nó

[00:33:56–00:34:01] chỉ là tô là bán thôi nhưng mà mình có được quyền lên Zillow để mình tạo thêm một cái listing cho thuê

[00:34:01–00:34:02] hay không hay là cái đó là không được luôn

[00:34:04–00:34:09] Mình thì mình cũng bản thân mình cũng hay dùng Zillow mà cũng một phần ý là bản thân mình dùng

[00:34:09–00:34:16] Zillow chẳng hạn khi mà cho thuê là khách là mình hay dùng cái Zillow Rental Management cái đấy là

[00:34:16–00:34:24] cái giao diện dành cho một Realtor của Zillow luôn á thì nó cái đấy nó cũng làm được back project cho cho

[00:34:24–00:34:29] khách và họ cũng apply được các thứ trên đấy thì mình cũng rất hay thích dùng về đấy nhưng mà chỉ có một

[00:34:29–00:34:36] cái là nếu mà đã đăng bán rồi thì riêng trên Zillow nó sẽ không hiện nhưng mà mình có thấy được ý là

[00:34:36–00:34:40] những cái này nó cũng đăng tất cả các trang ấy thì mình cũng không biết được lý do mình cũng chưa có nghiên

[00:34:40–00:34:47] cứu để biết lý do tại sao nhưng mà ví dụ Zillow thì nó sẽ nó sẽ chọn cái đầu tiên này dự như một số

[00:34:47–00:34:56] trang của homes.com chẳng hạn thì nó vẫn hiện được cái rental của mình xong rồi trang Realtor.com thì một số lúc nó cũng

[00:34:56–00:35:01] hiện được cả một trong hai tức là luôn luôn nó chỉ hiện được một trong hai nhưng mà cái sequence nó

### 35:00–40:00

[00:35:01–00:35:07] chọn cái nào thì cái đấy là cái mình chưa chưa nghiên cứu rõ lắm thì mỗi trang nó logic hơi khác nhau một

[00:35:07–00:35:15] chút còn những căn đăng bán là mình có được quyền mình không thông qua MLS mà mình lên những cái trang khác

[00:35:15–00:35:23] mình đăng không hả? Đó cái đấy như kiểu cái này gọi là off market là cái cổ mình không vẫn mình đúng

[00:35:23–00:35:28] đúng không? Đúng không? Đúng như kiểu là bán như kiểu Việt Nam luôn đấy là mình chỉ như kiểu trao điền

[00:35:28–00:35:34] trước cửa ai muốn đến thì đến tự xem xong rồi tự nêm mếp giá với nhau kiểu vậy ạ thì cái đúng kiểu off

[00:35:34–00:35:40] market thì được được phép không ai bắt mình phải cho lên trên này cả nhưng mà với vì công nghệ số với các

[00:35:40–00:35:47] thứ thì thường lên MLS mình sẽ được quảng cáo nhiều nhất và kiểu qua được các trang nên là thường mọi

[00:35:47–00:35:51] là các trang xem được nhiều nhất thì nên là dụ như mình là Realtor chẳng hạn khi mà mình bán hàng bán

[00:35:51–00:35:58] nhà giúp cho khách thì mình cũng luôn khuyên khách là nên cho lên mls để mà được có cái quả bán toàn diện

[00:36:09–00:36:16] ⚠ Bên Mỹ, những role của ngành này bao gồm các lớp nào?

[00:36:19–00:36:21] ⚠ Rồi, lớn nhất là agency.

[00:36:23–00:36:27] ⚠ Rồi, lớn nhất là National Association.

[00:36:32–00:36:42] Ok, thì thực ra cái này nó có khá là nhiều thì mình có thể gửi cho. Nhưng mà nó khá là nhiều những cái tổ chức khác nhau nhé.

[00:36:42–00:36:48] Thì cái đầu tiên là cái mà nó nằm ở DC, để ra luật nó gọi là TREC.

[00:36:50–00:37:00] TREC thì cái đấy nó, đấy là cái, đấy là như kiểu governing body, là như kiểu họ viết luật, viết form và kiểu ra luật luôn cho các lớp.

[00:37:00–00:37:02] Bộ xây dựng, anh bảo đấy, bộ xây dựng.

[00:37:02–00:37:02] Ok.

[00:37:04–00:37:05] ⚠ Thì họ có cái đấy.

[00:37:06–00:37:13] Thì như kiểu, như là cái MLS này nó vẫn kiểu là optional ấy, như kiểu là mình, mình có thể làm real estate mà mình không trên MLS ấy.

[00:37:13–00:37:15] Thì cái NAR ấy, nó cũng là optional.

[00:37:16–00:37:18] NAR là nó, như kiểu nó không liên quan đến chính phủ.

[00:37:18–00:37:21] Nó chỉ là, nó gọi là National Association, cứ vậy thôi.

[00:37:21–00:37:25] Nhưng mà nó có thể ra một số form riêng của nó nữa.

[00:37:26–00:37:36] Nhưng mà, dù như một số form riêng của nó hoặc là MLS như thế này thì mình phải, mình phải trả membership một năm như vậy thì mình mới được dùng và mình mới được tham gia vào NAR.

[00:37:37–00:37:39] Vậy trong NAR ấy, từng bang ấy nó có cái khác nhau.

[00:37:40–00:37:46] Thì như kiểu trong này của mình ấy, mình chỉ ra, tham gia cái tổ chức gần nhất của mình thôi là nó, nó chỉ là NAR Texas thôi ấy.

[00:37:46–00:37:47] Ừ.

[00:37:48–00:37:49] ⚠ Mà nó cũng có cái body khác nữa.

[00:37:49–00:37:49] Ừm.

[00:37:52–00:38:00] Rồi là cái mà, cái phần mà cái, những cái phần mà đi bán á, thì nó sẽ có là, nó gọi là Broker là cao nhất đúng không?

[00:38:00–00:38:07] Tức là, ví dụ như một cái đơn vị mà có được quyền bán những cái bất động sản, thì là cái, cái tầng cao nhất sẽ là Broker.

[00:38:08–00:38:15] Thì bây giờ mình, ví dụ nhá, ví dụ ấy là, nó chung là môn bán thì bao giờ cũng có giữ giá to nó liên quan đến luật pháp đúng không?

[00:38:15–00:38:16] Ừm.

[00:38:16–00:38:18] Thì ví dụ ấy, nếu mà trong một trường hợp đó, nó có giữ giá to nó liên quan đến luật pháp đúng không?

[00:38:18–00:38:24] trường hợp làm làm ăn mà không không minh bạch hoặc là cái gì đấy có thể kiện nhau đâu có chứ

[00:38:24–00:38:30] ai có thể kiện ai cũng có kính mấy muốn thể kiện broker hoặc là bán thì kiện broker hoặc là hai

[00:38:30–00:38:35] bước của hai bên kiện nhau chung là ai mà kiện nhau chẳng hạn thì thường họ sẽ kiện worker chứ

[00:38:35–00:38:41] họ không không kiện Realtor thì những người như mình như kiểu là realtor chẳng hạn ấy là mình phải trả

[00:38:41–00:38:49] một cái phí cho broker của mình để mình làm việc dưới broker của mình với điều kiện là như kiểu là

[00:38:49–00:38:55] như kiểu là mình được bảo vệ bảo vệ là nếu mà có ai kiện mình hay là có cái gì đấy chẳng hạn thì

[00:38:55–00:39:01] broker nó sẽ nó nó người ta sẽ bị kiện hoặc là người ta sẽ bảo vệ mình nhưng mà cũng ngược lại

[00:39:01–00:39:08] là broker như nó hơi giống kiểu là vừa là kiểu mentor vừa là supervisor một chút ý một là bởi

[00:39:08–00:39:10] vì họ biết là họ bè các

[00:39:11–00:39:16] cái cái cái cái cân nặng về vấn đề kiểu pháp ý ấy thế nên là tất cả những cái form tất cả những cái

[00:39:16–00:39:22] giao dịch của mình chẳng hạn là họ kiểm tra những cái đấy hết thì một phần ý là mình trả tiền cho

[00:39:22–00:39:27] broker để mình trao bằng mình ở đấy làm với họ chẳng hạn thì họ cũng sẽ kiểm tra giấy tờ từng

[00:39:27–00:39:32] cái giao dịch của mình luôn để make sure là mình sẽ không bao giờ bị kiện thì sẽ có một bộ phận là

[00:39:32–00:39:40] chuyên làm kiểu legal transaction như vậy và thứ hai nữa là ai mà làm broker mà một số lúc tham

[00:39:40–00:39:40] ra một số

[00:39:41–00:39:47] ⚠ một số mà mình không biết là mình làm đúng hay sai cũng có thể gọi định cho broker của mình để mình hỏi

[00:39:47–00:39:55] ⚠ Thì cái đấy là cái để những công báo vậy nhau còn đâu broker với Thì nó nó chỉ khác một cái là có thể

[00:39:55–00:40:00] ⚠ kinh nghiệm cũng đưa hoặc nó cũng một cái bằng thêm Ví dụ như là mình của bằng Realtor chẳng hạn

### 40:00–45:00

[00:40:00–00:40:07] ⚠ mà cũng lên broker cũng có thể lấy một cái bằng em để lên broker mà cũng sẽ lên broker hết á tưởng ý là

[00:40:07–00:40:11] Mình đã qua bằng và mình có đủ cái giáo dục để mình được lên broker được

[00:40:11–00:40:16] Không có nghĩa là mình cần phải làm broker có nghĩa là mình phải có công ty riêng

[00:40:16–00:40:17] Mình không cần phải như thế, mình vẫn có thể

[00:40:18–00:40:21] Dù như ngày mai chẳng hạn mình mà muốn đi team mình muốn làm broker

[00:40:21–00:40:23] Mình vẫn có thể làm broker và mình vẫn có thể ngồi dưới cái broker

[00:40:23–00:40:25] Bây giờ mình làm mình vẫn có thể làm thế được

[00:40:26–00:40:31] Nhưng mà một khi được danh broker thì kiểu là mình có nhiều xét nghiệm về pháp lý hơn

[00:40:34–00:40:36] Thì đấy thì ví dụ như trong này chẳng hạn

[00:40:37–00:40:39] Trong listing của mình, mình ở đây nhé

[00:40:41–00:40:42] Thì đây là listing của mình này

[00:40:43–00:40:47] Thì dù như mình có tên ở đây xong rồi mình có tên của broker của mình

[00:40:47–00:40:48] eXp Realty chẳng hạn

[00:40:48–00:40:52] Thì khi mà làm giao dịch thì họ sẽ liên hệ với tên của mình

[00:40:53–00:40:55] Xong rồi có số điện thoại các thứ ở đây

[00:40:55–00:40:57] Xong rồi mình có supervisor của mình ở đây

[00:40:57–00:41:00] Thì thường người này là cái người broker trong brokerage của mình

[00:41:00–00:41:04] Thì cái người này cũng như có assign sẵn trong broker của mình

[00:41:04–00:41:07] Là họ chuyên làm broker

[00:41:07–00:41:08] Ở trong Texas

[00:41:08–00:41:10] Tại vì công ty của mình là công ty international chẳng hạn

[00:41:10–00:41:13] Thì đấy thì Karen sẽ là người supervisor

[00:41:13–00:41:16] Thì nếu mà ai đấy mà có một cái vấn đề gì về mình

[00:41:16–00:41:20] Họ có thể gọi điện cho broker của mình

[00:41:20–00:41:23] Còn đâu đây là có số điện thoại các thứ này nó của brokerage

[00:41:27–00:41:29] Cho mình hỏi thêm là

[00:41:29–00:41:33] Không có sự khác biệt giữa Realtor với Real Estate Agent đúng không?

[00:41:33–00:41:34] Là hai cái đó là làm một đúng không?

[00:41:36–00:41:36] Đúng!

[00:41:37–00:41:40] Mình nói là người bình thường thì mọi người sẽ dùng hai cái hơi giống nhau

[00:41:40–00:41:47] Nhưng mà như mình bảo ấy ai mà tham gia NAR hoặc là tham gia những cái Realtor Real Estate Association ấy

[00:41:47–00:41:52] Thì họ phải tham gia cái đấy và họ phải trả cái phí hàng năm đấy thì họ mới được gọi là Realtor

[00:41:54–00:41:56] Còn không họ chỉ là Real Estate Agent thôi

[00:41:56–00:41:58] Thì theo đúng definition của nó như thế

[00:41:59–00:41:59] Definition

[00:42:00–00:42:00] Ok

[00:42:05–00:42:06] Và hình như

[00:42:06–00:42:07] ESP này như là một cái

[00:42:07–00:42:09] Cái công ty mà nó rất là

[00:42:09–00:42:10] Lớn

[00:42:14–00:42:23] lấy chi phí thấp đó thực ra là cũng có nhiều cũng có nhiều nhiều broker khác nhau nhưng mà nhưng mà cũng

[00:42:23–00:42:32] có thể một phần là có nhiều cách mọi người chọn broker của mình có thể một số người broker của dư đưa ví dụ nhé

[00:42:32–00:42:39] mình chọn mình chọn exp bởi vì họ là cái business model của họ là International của họ online thì

[00:42:39–00:42:48] mình chạy phí bàn ví dụ như đúng không đúng văn phòng có bàn có bàn ghế có thuê chứ không phải physical

[00:42:51–00:42:58] ⚠ thì nó đặt được chi phí ừ ừ ừ ừ

[00:43:00–00:43:06] cái ví dụ đây là khi mình đăng bán này thì khi mà mình hoàn thành giao dịch ấy mà mình sang tên được cho

[00:43:06–00:43:12] người mua người bán với nhau xong rồi thì sao đấy có phải quay lại cái này mình update là tôi đã bán với

[00:43:12–00:43:19] cái giá bao nhiêu rồi giao dịch vào ngày nào số hợp đồng có thứ như nào không có nhá thì ví dụ

[00:43:22–00:43:29] Bắt buộc, bắt buộc tại vì mình đã bán rồi mà cái người, đấy là nhiệm vụ của cái người listing agent nhá.

[00:43:30–00:43:34] Nghĩa là họ đã bán cái này rồi mà họ vẫn để active ở trên này thì đấy là lỗi của họ.

[00:43:34–00:43:36] À và có thể bị phản vì việc đó.

[00:43:39–00:43:52] Ví dụ mình vào cái close listing của mình đúng không thì mình có bao nhiêu cái close đây chẳng hạn thì mình sẽ cố tình chọn một cái là mình làm người giúp người mua chẳng hạn.

[00:43:52–00:43:57] Thì ví dụ cái này mình bảo vệ người mới mua chẳng hạn thì đây là tất cả những cái thông tin họ ấy xong.

[00:43:57–00:44:05] Thì sau lúc thông tin xong ấy, khi mà người listing agent bên kia họ phải update là contract này bao nhiêu, head option này bao nhiêu.

[00:44:05–00:44:10] Tức là cái này là system nó tự note lại khi mà cứ mỗi lần mình đổ status ấy là nó sẽ ấy.

[00:44:10–00:44:13] Xong cái ngày close là ngày bao nhiêu, họ viết vào đấy giá bao nhiêu.

[00:44:14–00:44:20] Xong rồi ví dụ seller mà cho bao nhiêu tiền chẳng hạn thì họ phải viết vào trong này.

[00:44:20–00:44:21] Xong rồi...

[00:44:22–00:44:25] Về eXp Realty mình là người agent này thì họ phải viết ra đây.

[00:44:25–00:44:29] Email của mình như thế này. Họ dùng title company nào họ cũng phải viết.

[00:44:29–00:44:35] Xong rồi ví dụ như khách của mình có mortgage hay là trả bằng tiền mặt chẳng hạn thì nó cũng phải viết ở đây.

[00:44:36–00:44:42] Và cái này ở đây là cái nó sẽ vào record là khi mà mình bán xong thì nó bán bao nhiêu tiền per square feet.

[00:44:43–00:44:45] Như kiểu là 1m2 ở Việt Nam mình bao nhiêu tiền ấy.

[00:44:46–00:44:50] Ờ cái này mình vẫn thấy, Thúy bảo là ghi cả kiểu như hoa hồng ở đấy luôn à.

[00:44:50–00:44:52] Hoa hồng của Realtor ở đấy luôn à.

[00:44:52–00:44:56] Hoa hồng thì không nằm trên này, hoa hồng nó không bao giờ nằm trên này luôn.

[00:44:57–00:44:59] Cái đấy là tự, tự điều với nhau.

[00:45:00–00:45:00] Ồ.

### 45:00–50:00

[00:45:01–00:45:01] Ừ.

[00:45:01–00:45:07] Tự điều với nhau thì nhớ họ đưa kiểu cash về tiền ngoài và nó là 1 cái hình thức lách thuế thì sao?

[00:45:09–00:45:09] Ờm...

[00:45:10–00:45:11] Cái đấy nó có phổ biến không?

[00:45:12–00:45:12] Ờm...

[00:45:12–00:45:17] Ở Việt Nam thì nó rất phổ biến ấy. Ở Việt Nam thì nó gần như là nó không ai đóng thuế gì cái đấy luôn ấy.

[00:45:17–00:45:19] Nhưng mà mình nói hỏi ở Mỹ thì nó có như vậy không?

[00:45:20–00:45:22] Tại vì ở bên Mỹ cái này nó...

[00:45:22–00:45:26] Nó không phổ biến bởi vì ấy, trả tiền ở đây là thực ra là trả cho broker.

[00:45:27–00:45:28] Xong broker phải trả tiền...

[00:45:28–00:45:30] Trả qua công ty, xong rồi công ty mới trả lại cho mình.

[00:45:31–00:45:38] Đúng rồi, đúng rồi. Thế nên là broker để mà nó luôn luôn làm cho pháp lý.

[00:45:38–00:45:40] Thế nên là kiểu gì họ cũng sẽ phải trên đấy thôi.

[00:45:40–00:45:44] Tức là tự điều với nhau nhưng mà điều với nhau ở đây vẫn là trong contract ấy.

[00:45:44–00:45:45] Điều với nhau đây là cái...

[00:45:45–00:45:45] Rồi, rồi, rồi.

[00:45:46–00:45:48] Mình không biết nhưng mà chỉ the rest of the world doesn't know.

[00:45:49–00:45:51] Ah ha ha. Ok, ok.

[00:45:54–00:45:57] Còn đâu ấy, tất cả những cái broker nhá, những cái công ty title company này.

[00:45:57–00:46:01] Bên này là cái công ty nằm ở giữa họ, họ cầm tiền đúng không?

[00:46:01–00:46:01] Ok.

[00:46:01–00:46:06] Dù như là họ seller lấy lại tiền bao nhiêu, buyer trả bao nhiêu,

[00:46:06–00:46:10] tất cả những agent được trả bao nhiêu tiền là cái công ty title company họ làm.

[00:46:10–00:46:14] Thì bên này họ sẽ cần phải có contract của mình cực kỳ rõ ràng.

[00:46:14–00:46:17] Bao, ai, bao nhiêu hoa hồng thì lúc đấy họ mới trả.

[00:46:18–00:46:19] Uhm, uhm, uhm, uhm.

[00:46:19–00:46:20] Uhm.

[00:46:21–00:46:21] Uhm.

[00:46:26–00:46:30] Anh bảo hỏi tiếp đây, anh bảo ơi, có nội dung gì hả?

[00:46:30–00:46:30] Uhm.

[00:46:36–00:46:42] dùng cho nhà mình này thì có một cái nó gọi là khá cma nha thì cái này mình cũng hay dùng tại vì cái

[00:46:42–00:46:49] này thì có thể sử dụng ở Việt Nam này như kiểu là mọi người nói là mua nhà bao nhiêu các thứ thế nào

[00:46:49–00:46:58] ấy từ từ từ về giá đúng đúng rồi đúng rồi nhẹ thì cái này nhớ mình cái cực kỳ hay dùng luôn

[00:46:58–00:47:05] thì đây là cái trước đấy mình làm cho khách của mình thì bây giờ mình sẽ lấy một ví dụ cụ thể nhanh

[00:47:06–00:47:14] cái list hẳn hoi thì mình hôm nay mình đang cần kéo lại số liệu cho khách xem thì mình sẽ cho lên đây

[00:47:16–00:47:26] thì mình ra report CMA cái này là mình vừa có thể dùng nó chung là vừa cho người bán cho người mua cho

[00:47:26–00:47:33] ai cũng được chung là ai cũng cần làm cái này để mình biết được là mình mình nên trả giá bao nhiêu ấy thì

[00:47:33–00:47:41] bây giờ mình cho địa chỉ của cái nhà cái nhá thì cái cái cái CMA này nó có CMA thì cái concept của

[00:47:41–00:47:48] nó là có lâu rồi và cái thu của nó cũng có rất là nhiều mình nhớ là hồi đấy mình mua nhà cách cách đây

[00:47:49–00:47:56] 6-7 năm thì hồi đấy chứ có cái Cloud CMA này thì các CMA này là tìm đến mình sẽ chỉ cho là nó tự

[00:47:56–00:48:03] tự suggest được là bao nhiêu nhà xung quanh mình các thứ là nó tự suggest được còn đâu có cái CMA là

[00:48:03–00:48:07] cái này trên này nó khá là lâu rồi như kiểu là mình phải tự lên mình phải tự tìm trong database để

[00:48:07–00:48:13] mình so sánh thì cái đấy là cái cũ hơn đây là cái mới hơn thì nó rất là nhanh thì

[00:48:21–00:48:27] nhà này là nhà của khách mình nhé mình ngay thì nó tìm thấy số thông tin của tax nó phải tự hiện lên

[00:48:27–00:48:33] nhưng mà đa số của mình mình cũng phải tự cho so sánh vào là nhà này bao nhiêu phòng ngủ 4 phòng ngủ 3

[00:48:33–00:48:43] phòng tắm cái này là đúng rồi xong rồi mình có thể viết report đây là tôi hiếu hay xong rồi mình có

[00:48:43–00:48:52] hình ảnh đây là chứ là một cái report thì cái ở dưới này nếu mà mình muốn tìm một số so sánh chỉ là

[00:48:52–00:48:59] để giúp mình là mình biết nhà cụ thể mình muốn so sánh rồi mình chỉ muốn cho report trên report cho

[00:48:59–00:49:03] mình chẳng hạn thì mình có thể đánh hàng số mls vào đây nhưng trong tình hợp này là mình mình chưa biết

[00:49:03–00:49:09] tìm mình chỉ muốn tìm không thì khi mà mình với sức chẳng hạn thì mình có thể thay đổi là mình muốn

[00:49:09–00:49:17] kéo tất cả những cái nhà đã bán trong vòng bao nhiêu thời gian đấy chẳng hạn thì tùy mình thì

[00:49:17–00:49:24] dự mình chọn một năm và mình chỉ cần muốn 10 cái thôi dụ một số lúc mà nhà rất là khó tìm một cái nhà

[00:49:24–00:49:29] tương tự chẳng hạn thì có thể mình sẽ lên ba 20 30 cái nhà nhưng mà ví dụ là mình chọn tay nhé

[00:49:30–00:49:36] mình không mình cũng có thể hiện lên mình cũng có thể biết vào đây thì bây giờ mình sẽ tương giản nhé

[00:49:36–00:49:45] là mình không biết vào đây thì để nó hiện những cái gì thì nó sẽ tự chọn cho mình 10 cái căn nhà mà

[00:49:45–00:49:52] đã bán gần đây sẽ hiện lên là cái nhà của mình đang đang hỏi là cái nào ta một góc này thì nó biết được

[00:49:52–00:49:58] địa chỉ nào ở đâu thì nó cố tình là kéo những cái nhà xung quanh và trong cái của mình là phải bán

[00:49:58–00:50:05] trong vòng một năm vừa rồi nó hiện lên là đây có bao nhiêu cái active bao nhiêu cái xô ở đây xong rồi

### 50:00–55:00

[00:50:05–00:50:12] nó sẽ tự tự tính cho mình cái này khi đấy là cái công việc của agent của mình nghĩ là mình phải tự tìm

[00:50:12–00:50:18] xem cái căn nào nó phù hợp với cái của mình ví dụ như cái đã expired mình không bao giờ mình cũng đã không

[00:50:18–00:50:25] thường thường mình không so sánh vì những cái này đi kiểu là họ không bán được thế nên là cái số của

[00:50:25–00:50:31] họ nó không không tốt đấy thì mình những cái khô là những cái mà đã bán rồi thì mình có thể bảo mình

[00:50:31–00:50:37] xem thì đây đây cái tổ history record nó sẽ giúp mình như kiểu là bây giờ mình muốn so sánh nhà

[00:50:37–00:50:43] nhưng mình cũng muốn là xem trong nhà ấy nó có tương đương với cái giá trị của mình như là họ cũng

[00:50:43–00:50:49] những cái gì cũng tốt hay không chẳng hạn mình xem xong rồi xong rất là những cái feature này cũng

[00:50:49–00:50:57] có thì mình cũng so sánh cái này là đô tờ thôi thì ví dụ như nhà mình một tầng chẳng hạn thì system

[00:50:57–00:51:02] nó không biết nó không kéo được là một tầng hay hai tầng nó sẽ luôn kéo cả hai chẳng hạn thì dụ như

[00:51:02–00:51:08] nhà mình đang một tầm thì cái này một tầng mà ok này nhưng mà ví dụ mình xem nhà của mình xây 2023

[00:51:08–00:51:13] như nhà này là xây 2010 thì nó tranh lệch nhau quá nên là mình không chọn cái nhà này nữa hay

[00:51:13–00:51:23] xây 2029 mình cũng không chọn nhà này xây 2022 nó khá là gần với nhà của mình có vẻ như nhà này

[00:51:23–00:51:30] hai tầng đúng không nhà hai tầng thì không thể so sánh với nhau được bởi vì nó nó hơi khập khiễng nhưng

[00:51:30–00:51:37] mà nó cũng sẽ hiện những cái thông tin cụ thể đây on market là bao nhiêu ngày họ ở trên thị trường thì

[00:51:38–00:51:43] giờ mình hay dùng cái này để mình biết được thêm xem là cái đi men ở đấy như thế nào tôi là họ bán

[00:51:43–00:51:49] như thế này khá là chậm họ bất chừng ngày ngày để họ bán khá là chậm nên mình mình mà thấy nhiều nhà

[00:51:49–00:51:58] cùng cái khu đấy đều có cái số liệu như thế thì mình biết được cái đi men của cái khu nhà đấy xong rồi

[00:51:58–00:52:07] tức là họ bán ngày nào họ các thứ ví dụ như bên này của mình ý là mùa hè là thường cái mùa gia đình và

[00:52:07–00:52:14] con cái nghỉ học thì họ hay hay chuyển nhà hơn ý thì mình cũng thể xem là cái ngày họ bán là mùa nào trong

[00:52:14–00:52:20] năm nó cũng có thể ảnh hưởng giá của mình mình cũng có thể xem cái nhá thì cái này hai tầng mình bỏ đi này

[00:52:20–00:52:26] cái này hoặc một số cái khác dụ như nhà này nhá cũng hai ngàn hai mươi tư thì mình cũng bỏ rồi này

[00:52:26–00:52:31] nhưng mà cái số lượng bedroom về bathroom hoặc là cái quay phía mà nó chênh quá thì mình cũng không

[00:52:31–00:52:38] chọn nhưng mà đấy tại loại là mình có thể xem nó thu tất cả các nhà luôn thường như cái nhạc đang

[00:52:38–00:52:42] ách tích chẳng hạn thì mình đây là chính nhà của mình luôn là này là cái nhà này thì nó cũng tự

[00:52:42–00:52:49] hiện lên hoặc là hàng xóm cũng đang bán về giá cao hơn thẳng hạn nhiều lúc cái cái này mình cũng

[00:52:49–00:52:54] không hay dùng để mà so sánh giá đâu bởi vì họ chưa bán đúng hơn bên này là mình chỉ so sánh những

[00:52:54–00:53:00] căn đã bán rồi thôi đã bán được thì lúc đấy mình mới dùng cái số liệu đấy để mà phân tích cái giá

[00:53:00–00:53:06] xung quanh ý còn bao nhiêu nhà đang bán chẳng thì mình đi cường mình biết là mình đang cạnh thanh với những

[00:53:06–00:53:13] nhà này cái nhà này như vậy thôi thì mình xem cái này còn đâu nhớ mình cứ đang ví dụ

[00:53:14–00:53:21] Ừ thực ra mình cũng không có quá nhiều nhà trong khu này để mà so sánh thì mình sẽ phải xem thử

[00:53:22–00:53:34] căn này căn này một tầm Ok các này comparable thì ví dụ mình chọn cái căn này để mình compare nhá

[00:53:35–00:53:40] thường là mình sẽ phải chọn mấy nhà không thường mình chọn một nhà là cũng chưa comparable cho lắm

[00:53:40–00:53:46] mình muốn có một cái phu của nhiều nhà để nó ra được cái thì mình sẽ chọn cái đấy

[00:53:48–00:53:56] cái này hai tầng một số lúc mà không tìm được thì mình lại expand ra là muốn nó suggest 20 nhà 30 nhà

[00:53:56–00:54:03] hoặc là mình phải expand cái thời gian này nhưng cứ ví dụ như là mình cái nhà mình muốn rồi thì mình

[00:54:03–00:54:11] có thể trên cái report ấy ừ ừ ừ ừ

[00:54:11–00:54:11] Ừ

[00:54:11–00:54:11] Ừ

[00:54:11–00:54:18] thì trong này mình có thể chọn rất là nhiều thứ là mình có muốn introduction về bản thân mình không

[00:54:18–00:54:24] dùng dụ như mình muốn gửi một khách nào chẳng hạn ấy thì mình có thể cho cover letter tất cả những

[00:54:24–00:54:32] cái này what is CMA mình cũng có thể giải thích cái đấy với họ nếu mình muốn thì họ có tên cái này

[00:54:36–00:54:42] một cái này giống như là nguyên một cái sắp đi bọt PDF để gửi cho một khách hàng đúng không đúng

[00:54:42–00:54:50] đúng không cái này sẽ ra được thằng luôn ạ thì cái này là một số chính họ muốn là mình nói thêm mình

[00:54:50–00:54:56] education họ hay các thứ này nọ thì mình muốn thêm vào thì mình cho thêm nhá thì này nó chung là cái

[00:54:56–00:55:03] thua là full sẵn thường thì mình chọn sẵn rồi rồi mình hay dùng thì mình bảo là mình chỉ muốn nó thể

### 55:00–60:00

[00:55:03–00:55:11] hiện là cái mát là ở đâu xong rồi cho thêm cái hình ảnh để họ xem được cho mình muốn ở đây là họ mình

[00:55:12–00:55:20] cho mình cho mình cái cái price per square footage ở đây thì mình chọn cái đấy nhất từ mình chọn từ

[00:55:20–00:55:26] bên trái này mình cho sang bên phải là cái mình muốn nó cho cho mình thì mình ra được cái report

[00:55:26–00:55:37] cho mình hỏi là cái Cloud CMA này là mình phải là Realtor thì mình mới và mình phải đăng ký nó nói

[00:55:37–00:55:44] cái chung cái này là cùng một cái gói mình trả hàng năm luôn đúng không là nó sẽ có rồi rồi nó có

[00:55:44–00:55:51] mấy cái áp nhỏ mà nãy mà bạn nói đúng không đúng rồi đúng rồi nó nó cùng mấy cái đấy luôn

[00:55:54–00:56:01] thì đúng ra em không biết nó bố là nó nó có cái khuyết CMA sẵn cái Cloud CMA này như là một cái

[00:56:01–00:56:06] cái app thêm để nó nó phê hơn thôi thì dựng cái này là cái cân bản nhá mình mà muốn đẹp hơn mình có

[00:56:06–00:56:13] thể làm thì mình có thể lấy thông tin của mình nó tự hiện ra thông tin của mình luôn nó hiện ra là hai

[00:56:13–00:56:18] cái này mình đang so sánh hẳn như thế này nó đều 4 phòng 3 phòng tắm và square footage là hơi chênh

[00:56:18–00:56:25] cái này nó gặp nhau một chút thì thì mình đang so sánh hai cái đấy thì cái căn căn mình vừa xem là

[00:56:25–00:56:36] nó average nó ra được là 209 dollar per square feet xong rồi sau đấy nó sẽ hiện ra cái căn này như thế nào

[00:56:36–00:56:44] đây là cái thông tin MLS của cái căn cũ đấy nhá là họ họ bán như đây John Market họ có những thông tin

[00:56:44–00:56:51] cái gì tất cả nó hiện ở đây rồi mình là muốn thêm hình ảnh thường mình hay cho khách để xem hình ảnh

[00:56:51–00:56:59] để so sánh nhà xong rồi ví dụ mình mà có nhiều nhà nhất như còn mình chọn nhiều cái thì nó sẽ có average là

[00:56:59–00:57:09] cái mình thường chọn 3 cái nhà đi là nó nằm trong lên sẽ như thế nào nó sẽ biết ở đây xong rồi xong rồi

[00:57:09–00:57:16] thì nó cũng ra được một số cái sát này ừ ừ ừ ừ ừ ừ ừ ừ ừ ừ ừ

[00:57:16–00:57:23] đấy thì nó cũng ra được average 2 square feet nó chung là cái này là cái khá là mình mình cái này phải là khá

[00:57:23–00:57:28] là sức khô kiểu khách của mình dễ hiểu dễ tập thì mình thường cho mấy cái trang này còn mình muốn thêm

[00:57:28–00:57:36] dâu kia là mình có thể chọn vào để nó ra cái mình mình mình hiểu này cũng chi tiết phát

[00:57:44–00:57:52] đó thì nó chung là đấy là cái từ nãy giờ là cái cái mình hay dùng xong mọi người có câu hỏi gì không

[00:57:53–00:58:00] mình thì chắc cũng hết câu hỏi rồi mình có câu hỏi gì không phải bình chạm thời thì em chưa có cảm ơn mọi người

[00:58:02–00:58:02] Ok.

[00:58:08–00:58:22] Cho mình hỏi là những cái app hồi nãy lúc ban đầu mà bạn giới thiệu là thường là những cái app đó nó chỉ là exclusively cho cái khu vực Texas này thôi hay là những cái ví dụ như Realtor ở các bang khác nó cũng sẽ là cùng những cái app giống giống như vậy hả?

[00:58:23–00:58:45] ⚠ Ờ đúng rồi. Thường cái giao diện nó khác nhau thôi nhưng mà ở đâu cũng có hết á. Ví dụ như, ở đâu cũng có hết rồi. Như cái RentSpree là cái mà mình bảo là mình có thể screen tenant chẳng hạn là nó cũng có thể ở đây. BrokerBay là cả. Nói chung cái app này đều là kiểu cả nước dùng hết.

[00:58:45–00:58:52] Tức là bạn ví dụ mình làm đối tòa ở Texas nhưng mà mình hoàn toàn có thể lên những cái hệ thống này để mình search.

[00:58:52–00:58:58] Hay là báo cáo report ở những cái khu vực như bang khác như Maryland, Boston đúng không? Hay là nó chỉ exclusively cho Texas.

[00:59:02–00:59:12] Về những cái thông tin available ấy thì nó như kiểu, như kiểu anh biết là mỗi bang là nó có cái database riêng đúng không?

[00:59:12–00:59:16] Thì như kiểu mình ở Texas mình chỉ xem được Texas và quanh đây thôi.

[00:59:17–00:59:22] Nhưng mà tất cả những cái app hoặc những cái data hoặc những cái field nào mà mình có thể xem được,

[00:59:22–00:59:24] thì thực ra cả nước nó cũng rất là giống nhau.

[00:59:25–00:59:31] Đúng thôi, nó chỉ có giao diện khác nhau thôi. Kể cả thực ra mình vào một giao diện khác nó cũng khá là khó dùng

[00:59:31–00:59:35] bởi vì là có thể nút này nó bên trái, nút kia nó ở một cái tab khác xong mình phải đi tìm ấy.

[00:59:35–00:59:43] Thì cái đấy là cái learning curve về cái việc mình xem nó ở đâu thôi nhưng mà thông tin available nó khá là giống nhau.

[00:59:44–00:59:45] Ok.

[00:59:48–00:59:52] Và nếu mà mình là Realtor ở Texas, mình có được quyền bán nhà ở bang khác không?

[00:59:54–00:59:58] Cái đấy là bởi vì lý do pháp lý mình không được.

[00:59:58–00:59:58] Không được.

[00:59:58–01:00:02] Bởi vì là mỗi bang nó có thể ra luật khác nhau.

### 60:00–65:00

[01:00:02–01:00:09] Đấy là bởi vì cái luật, dụ như TREC chẳng hạn, bộ xây dựng không, nó chỉ ra,

[01:00:10–01:00:15] khi mà mình làm contract các thứ nó chỉ ra cho mình form nó ra cho mình mười mấy form gì đấy.

[01:00:15–01:00:21] Cái đấy dùng chung cả nước. Còn đâu ý, mỗi bang nó khác nhau lắm.

[01:00:22–01:00:30] Mình có thể làm những cái form khác mà như kiểu là Texas Association of Realtors thẳng hạn là phải viết cái form riêng bởi vì là cái market nó khác nhau.

[01:00:30–01:00:33] Ví dụ nhá, mình chỉ ví dụ thôi vì cái market nó cũng khác nhau.

[01:00:34–01:00:37] Ví dụ như là ở Texas có nhiều dầu mỏ các thứ đúng không?

[01:00:37–01:00:44] Thì khi mà mình mua bán nhà ấy, nhiều lúc người ta cũng quan tâm đến dầu mỏ ở dưới cái mảnh đất mình ấy.

[01:00:44–01:00:46] Thì nó cũng sẽ có thêm một số luật chẳng hạn.

[01:00:47–01:00:52] Hoặc là một số bang như Florida mà nó gần biển chẳng hạn, nó bị lụi.

[01:00:52–01:00:52] Ừ.

[01:00:52–01:00:55] Các thứ nhiều chẳng hạn thì nó cũng có thêm một số luật của nó ấy.

[01:00:55–01:00:59] Thì một là vừa về cái knowledge của mình về từng cái market nó khác nhau.

[01:00:59–01:01:03] Với hai là bang đấy nó tự viết được luật của họ. Thế nên là nó cũng khá là khác nhau.

[01:01:05–01:01:13] Nếu vậy thì ví dụ một Realtor có thể là mình giống như có bằng ở nhiều bang mà mình hoạt động ở nhiều bang được hay không?

[01:01:13–01:01:15] Hay là luật pháp chỉ cho mình hoạt động ở một bang thôi?

[01:01:16–01:01:21] Được. Là mình có thể xin bằng nhiều bang.

[01:01:22–01:01:27] Ở phía Bắc chẳng hạn, ví dụ như là New Hampshire nó gần với Massachusetts.

[01:01:27–01:01:32] Có thể một số Realtor là họ ở border đấy là có thể họ lấy cả hai bang.

[01:01:32–01:01:38] Hoặc là cái common khác như kiểu là North Carolina và South Carolina thì có thể mọi người sẽ lấy hai bằng chẳng hạn ấy.

[01:01:38–01:01:47] Thì họ cũng ấy được nhưng mà mỗi bang họ phải làm, họ phải ký với một broker riêng và họ phải trả tiền để vào MLS khác nhau.

[01:01:47–01:01:48] Thế nên là cái cost đấy nó sẽ nhân đôi.

[01:01:49–01:01:50] I see, I see.

[01:01:56–01:02:03] Hiếu ơi, em có câu hỏi gì không? Anh thì chắc cũng hòm hòm hết câu hỏi rồi đó Hiếu ơi.

[01:02:04–01:02:10] Em nghĩ là mình như vậy là cũng chiếm dụng thời gian của Thúy lâu phết rồi đấy.

[01:02:12–01:02:16] Có gì, không có gì. Nói chung là giúp được gì thì giúp thôi.

[01:02:17–01:02:22] Thì công ty của Hiếu là như kiểu mình đang làm project.

[01:02:22–01:02:26] Để mình muốn thiết kế cho bên bộ hay sao?

[01:02:27–01:02:36] Tức là cái giai đoạn này thì không biết là Thúy có để ý không thì ở Việt Nam hiện nay cái chuyển đổi số nó rất là mạnh mẽ ở trong chính phủ với cả nhà nước.

[01:02:36–01:02:39] Thì bộ xây dựng cũng đang làm một cái dự án chuyển đổi số như vậy.

[01:02:40–01:02:44] Thì cái đấy thì tất nhiên là bên trong bộ thì họ sẽ không có nguồn nhân lực để có thể làm rồi.

[01:02:44–01:02:51] Đấy thì bên mình là bên thầu lại cái mảng đấy ở bộ xây dựng để triển khai một cái hệ thống thông tin.

[01:02:52–01:02:59] Về data. Đấy sau đấy thì những cái nhiều MLS này thì nó có thể là những cái layer ở phía trên để ra thị trường.

[01:03:02–01:03:07] Nếu làm xong cái này thì mình nghĩ là cái dữ liệu nó cũng sẽ được tương tự như ở Mỹ đấy.

[01:03:08–01:03:10] Đấy bây giờ thì đang đi làm sạch dữ liệu đất đai ở trên cả nước rồi.

[01:03:15–01:03:20] Tức là chuyển đổi từ như có database ở trong bộ là như kiểu là những nhà đang existing ở ngoài kia.

[01:03:20–01:03:22] Là bây giờ mình cũng đi lấy hết số liệu.

[01:03:22–01:03:22] Đúng không?

[01:03:22–01:03:23] Đúng rồi. Đúng rồi.

[01:03:23–01:03:28] Và thực ra từ trước đến giờ ví dụ cái mua bán bất động sản ở Việt Nam ấy thì nó rất là thô sơ.

[01:03:29–01:03:32] Đấy ví dụ bạn đăng một cái tin lên thì nó sẽ không bao giờ là tin chuẩn cả.

[01:03:32–01:03:34] Không có ai xác thực đấy là nó là tin đúng.

[01:03:34–01:03:38] Nó không có một hệ thống như ở MLS để đồng bộ về dữ liệu.

[01:03:38–01:03:43] Còn người ta thế là chính vì như thế cho nên người ta còn không có intention để đăng thông tin thật cơ.

[01:03:43–01:03:47] Tại vì đăng thông tin thật thì khách đến tự gặp chủ nhà luôn thì môi giới chả để làm gì cả.

[01:03:48–01:03:52] Cho nên là họ còn đăng thông tin cố tình đăng sai lệch đi.

[01:03:52–01:03:57] Để họ có giá trị về cái việc là dẫn khách đến gặp chủ nhà và chốt được cái giao dịch đấy.

[01:03:57–01:04:01] Và nó cũng sẽ không có những cái quyền lợi để bảo vệ người môi giới ở giữa.

[01:04:01–01:04:02] Đấy.

[01:04:02–01:04:11] Chứ là ở trong một cái thị trường mà nó đang chưa centralized lại về dữ liệu thì mọi thứ nó làm việc nó rất là căn bản và nó rất là manh mún.

[01:04:12–01:04:19] Đấy thì hiện nay cái đề án này nó giúp cho thị trường là nó có chuẩn hóa được về dữ liệu và nó sẽ giúp cho thị trường nó minh bạch hơn.

[01:04:19–01:04:22] Đấy theo cái định hướng trước đây của Mỹ hay là...

[01:04:22–01:04:23] ⚠ Đấy theo cái định hướng trước đây của Mỹ hay là Trung Quốc họ đang triển khai rồi.

[01:04:25–01:04:26] Ok.

[01:04:26–01:04:27] Ok.

[01:04:27–01:04:29] Như kiểu hôm trước Hiếu bảo là...

[01:04:29–01:04:33] Như kiểu người khác có thể lên đây để mà xem login được không ấy.

[01:04:33–01:04:34] Thì ví dụ cái đó nhá.

[01:04:35–01:04:36] Là bên đó ấy.

[01:04:36–01:04:37] Nó khá là cụ thể.

[01:04:37–01:04:40] Ví dụ chỉ là mình đăng cái địa chỉ nhà của mình lên thôi.

[01:04:41–01:04:43] Nhưng mà ví dụ như street chẳng hạn là mình spell it out là street.

[01:04:43–01:04:45] Hoặc là mình là st chẳng hạn.

[01:04:46–01:04:49] Mình chỉ viết một trong hai cái đấy mà không đúng chuẩn của MLS ấy.

[01:04:50–01:04:50] Đấy luôn hả?

[01:04:51–01:04:51] Đấy luôn.

[01:04:53–01:04:55] ⚠ Mình spell reminder là quả bị lộn lên đi.

[01:04:56–01:04:56] Rất là chật chẽ.

[01:04:57–01:05:00] Xong họ remind mà hai lần mà không ấy là có thể sẽ bị tán.

### 65:00–69:00

[01:05:01–01:05:02] Hoặc là...

[01:05:02–01:05:05] Hoặc là bởi vì nó rất là nghiêm miết về vấn đề là...

[01:05:05–01:05:09] Là một là bằng cấp của mình số bao nhiêu đúng không? Broker của mình là gì?

[01:05:09–01:05:11] Ví dụ nhá là...

[01:05:11–01:05:12] Chỉ là typo thôi.

[01:05:13–01:05:14] Dụ như là mình...

[01:05:14–01:05:19] Mình bán một căn này mình bán là 699 chẳng hạn.

[01:05:19–01:05:21] Nhưng mình ghi là 698 chẳng hạn.

[01:05:23–01:05:27] Và một trong ai đấy có trong transaction của mình mà họ phát hiện ra mình viết sai.

[01:05:27–01:05:31] Họ cũng có được sắp explain lên với TREC.

[01:05:31–01:05:33] Và mình cũng có thể bị revoke cái license của mình.

[01:05:34–01:05:34] Thì...

[01:05:35–01:05:36] Yeah.

[01:05:37–01:05:38] Thì thế nên là...

[01:05:38–01:05:40] Là nó khá là chật chẽ kiểu như vậy.

[01:05:40–01:05:41] Thế nên là vừa...

[01:05:42–01:05:45] Vừa là luật pháp nó cũng vào để mà...

[01:05:45–01:05:47] Để mà niêm yết để mọi người phải theo luật.

[01:05:47–01:05:48] Với cả hai nữa là...

[01:05:48–01:05:52] Là trong market mọi người cũng nhiều lúc cũng tự...

[01:05:53–01:05:53] Bởi vì...

[01:05:53–01:05:55] Nó cũng ảnh hưởng đúng không?

[01:05:55–01:05:57] Vì tất cả những cái database này nó cũng ảnh hưởng đến mình hết.

[01:05:57–01:05:58] Ví dụ nhá.

[01:05:59–01:06:00] Ví dụ như...

[01:06:00–01:06:01] Như là...

[01:06:01–01:06:03] Ai đấy cần tìm agent chẳng hạn.

[01:06:03–01:06:05] Thì muốn xem là bản thân mình...

[01:06:06–01:06:08] Là có bán được nhiều nhà không hay các thứ chẳng hạn.

[01:06:08–01:06:10] Thì họ cũng có thể lên...

[01:06:10–01:06:12] Lên trang Realtor.com chẳng hạn.

[01:06:12–01:06:12] Để tìm tên của mình.

[01:06:12–01:06:13] Tìm review à?

[01:06:14–01:06:15] Một là review.

[01:06:15–01:06:17] Hai là nó cũng hiện được history.

[01:06:17–01:06:19] Trên những cái căn mình đã show luôn.

[01:06:19–01:06:20] Trên iOS nó cũng...

[01:06:20–01:06:21] Trên căn nó cũng hiện được...

[01:06:23–01:06:23] ⚠ Những cái thông tin hết luôn.

[01:06:24–01:06:24] Ok ok.

[01:06:25–01:06:27] Thế là check check để xem realtor nào tốt.

[01:06:27–01:06:29] Để mình tìm rồi giúp mình tìm nhà hay đúng không?

[01:06:29–01:06:29] Kiểu dạng như vậy.

[01:06:29–01:06:30] Ừm.

[01:06:31–01:06:31] Thế nên ý.

[01:06:31–01:06:32] Bởi vì cái lý do đấy.

[01:06:33–01:06:35] Ví dụ như mình mà bán được một cái nhà...

[01:06:35–01:06:36] Đắt tiền hoặc là...

[01:06:36–01:06:38] Bất cứ cái lý do nào đấy.

[01:06:38–01:06:39] Ai đấy mà...

[01:06:39–01:06:40] Viết thông tin sai về bản thân mình.

[01:06:40–01:06:42] Cũng cảm thấy là mình phải...

[01:06:42–01:06:43] Mình phải correct cái đấy.

[01:06:43–01:06:45] Để mà nó hiện đúng cái thông tin của mình.

[01:06:46–01:06:46] Ừm.

[01:06:46–01:06:48] Ở bên này ông Nghiêm ngọt thế chứ.

[01:06:48–01:06:49] Hôm trước là...

[01:06:49–01:06:53] Mấy lúc đầu là đang nghĩ là nhờ Thúy để xin cái account để tự login vào và tự xem.

[01:06:54–01:06:54] Đấy.

[01:06:54–01:06:57] Nhưng mà sau khi là thấy mọi thứ nó nghiêm ngọt như thế.

[01:06:57–01:06:58] Thì là mới nhờ cái buổi như thế này.

[01:06:59–01:07:00] Thì thực ra như thế này có khi nó lại tốt hơn.

[01:07:00–01:07:02] Bởi vì nếu mà tự xem mình sẽ không hiểu.

[01:07:02–01:07:04] Nhiều khi vào cái hệ thống mới mình không hiểu cái mục...

[01:07:04–01:07:05] Mục tiêu của những cái...

[01:07:05–01:07:07] Mini app ở trong đấy.

[01:07:07–01:07:08] Những cái feature đấy đang để làm gì.

[01:07:08–01:07:10] Và mọi người đang ứng dụng thực tế như thế nào.

[01:07:10–01:07:11] Thì cũng khó.

[01:07:11–01:07:12] Như thế này lại thành tốt hơn này.

[01:07:12–01:07:13] Đấy.

[01:07:13–01:07:15] Thúy lại dành được thời gian để có thể là...

[01:07:15–01:07:18] Present qua về cái ứng dụng thực tế của nó.

[01:07:18–01:07:19] Ừm.

[01:07:19–01:07:19] Ừm.

[01:07:20–01:07:21] Hôm nay là...

[01:07:21–01:07:24] Mấy anh em rất là cảm ơn Thúy về việc này.

[01:07:24–01:07:24] Đấy.

[01:07:24–01:07:26] Và chắc là cũng chưa kịp ăn tối đúng không?

[01:07:26–01:07:28] Vừa mới đi dẫn khách xong.

[01:07:29–01:07:29] Ừ.

[01:07:29–01:07:30] Nói chung là...

[01:07:30–01:07:31] Nói chung là...

[01:07:31–01:07:31] Nói chung là...

[01:07:32–01:07:35] Nói chung là công việc này cũng làm được có lại giờ khác nhau.

[01:07:37–01:07:39] Ok. Cảm ơn nhiều nhá.

[01:07:39–01:07:39] Have a good night.

[01:07:39–01:07:41] Bao giờ về Việt Nam thì đi cafe nhá.

[01:07:42–01:07:44] Ok. Cảm ơn Hiếu nhá.

[01:07:44–01:07:45] Chúc mọi người thành công nhá.

[01:07:45–01:07:45] Rõ ràng.

[01:07:45–01:07:48] Nếu mọi người trong này có thiết kế được ra app gì thì nhớ chia sẻ để mình xem thôi.

[01:07:49–01:07:49] Yeah yeah yeah.

[01:07:50–01:07:52] Lúc đấy có Hiếu thì phải nhờ lấy feedback ý chứ.

[01:07:55–01:07:56] Thải mái. Thải mái.

[01:07:56–01:07:56] Ok. Ok.

[01:07:57–01:07:59] Bye bye. Cảm ơn cả nhà. Bye bye.

[01:07:59–01:08:00] Ok. Cảm ơn cả nhà.

[01:08:00–01:08:00] Ok. Cảm ơn cả nhà.
