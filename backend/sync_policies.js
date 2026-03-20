const { Client } = require('pg');
const fs = require('fs');

const client = new Client({ connectionString: "postgresql://postgres.xwpkfnzireadfgzcdcbg:Namanhb52%40%40@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres" });

async function sync() {
    await client.connect();
    
    // First let's delete dummy/duplicate policies
    await client.query("DELETE FROM public.policies WHERE title = 'Test Policy';");
    await client.query("DELETE FROM public.policies WHERE title = 'Quy định làm việc từ xa';");

    // The data array 
    const policies = [
        {
            title: "Quy định Làm việc Online (Work From Home)",
            slug: "remote-work",
            category: "hr",
            excerpt: "Quy trình đăng ký, phê duyệt và báo cáo khi làm việc từ xa qua hệ thống LarkSuite.",
            icon: "home_work",
            content: `
      <h2>1. Mục đích & Phạm vi</h2>
      <p>Quy định này áp dụng cho toàn thể cán bộ nhân viên (CBNV) NetSpace khi có nhu cầu làm việc tại nhà hoặc ngoài văn phòng. Nhằm đảm bảo kỷ luật lao động và hiệu quả công việc.</p>

      <h2>2. Quy trình Đăng ký</h2>
      <ul>
        <li>Đăng ký qua <strong>LarkSuite — mục "Đăng ký làm việc online"</strong> ít nhất <strong>01 ngày</strong> trước khi thực hiện.</li>
        <li><strong>Tuyệt đối không</strong> tự ý làm việc online khi chưa được phê duyệt.</li>
        <li>Trường hợp khẩn cấp: liên hệ trực tiếp Trưởng bộ phận và thực hiện đăng ký ngay khi có thể.</li>
      </ul>

      <h2>3. Thẩm quyền Phê duyệt</h2>
      <ul>
        <li><strong>Làm 01 ngày:</strong> Trưởng bộ phận + Phòng Hành chính Nhân sự (HCNS).</li>
        <li><strong>Từ 02 ngày trở lên:</strong> Cần thêm phê duyệt của Tổng Giám đốc / Chủ tịch nhóm.</li>
      </ul>

      <h2>4. Báo cáo Công việc</h2>
      <ul>
        <li>Báo cáo kết quả công việc mỗi ngày trên <strong>LarkSuite — mục "Báo cáo công việc Online"</strong> trước <strong>21:00</strong>.</li>
        <li>Báo cáo phải phản ánh đầy đủ công việc đã thực hiện trong ngày.</li>
      </ul>

      <h2>5. Chế độ Lương & Kỷ luật</h2>
      <ul>
        <li>✅ Hoàn thành công việc ≥ 90% và báo cáo đúng hạn: tính <strong>100% lương</strong>.</li>
        <li>⚠️ Không báo cáo hoặc hoàn thành dưới 90%: có thể bị <strong>trừ công hoặc chuyển sang nghỉ phép</strong>.</li>
        <li>❌ Làm online khi chưa được duyệt: xử lý kỷ luật theo nội quy công ty.</li>
      </ul>

      <div class="note"><p><strong>Lưu ý:</strong> Mọi câu hỏi về đăng ký làm online, liên hệ Phòng HCNS qua <strong>hcns@netspace.vn</strong>.</p></div>
    `
        },
        {
            title: "Quy định Đăng ký Làm ngoài Giờ & Ngày nghỉ",
            slug: "overtime-policy",
            category: "hr",
            excerpt: "Quy định làm thêm giờ sau 20h, ngày thứ Bảy, Chủ nhật và các ngày lễ, tết. Quy trình đăng ký trên LarkSuite.",
            icon: "schedule",
            content: `
      <h2>1. Các Trường hợp Cần Đăng ký OT</h2>
      <ul>
        <li>Làm việc sau <strong>20:00</strong> các ngày trong tuần.</li>
        <li>Làm việc vào <strong>Thứ Bảy, Chủ nhật</strong>.</li>
        <li>Làm việc vào các <strong>ngày lễ, Tết</strong>.</li>
      </ul>

      <h2>2. Quy định Chung</h2>
      <ul>
        <li>Thời gian làm việc tối đa: <strong>đến 23:00</strong>.</li>
        <li><strong>Nghiêm cấm tuyệt đối</strong> ở lại văn phòng qua đêm.</li>
        <li>Nhân viên phải đảm bảo an toàn PCCC và tắt toàn bộ thiết bị điện trước khi ra về.</li>
      </ul>

      <h2>3. Quy trình Đăng ký</h2>
      <ul>
        <li>Thực hiện đăng ký qua <strong>LarkSuite</strong>.</li>
        <li><strong>Ngày thường (OT sau 20h):</strong> Đăng ký trước <strong>18:00</strong> cùng ngày.</li>
        <li><strong>Ngày nghỉ / Ngày lễ:</strong> Đăng ký trước <strong>08:00</strong> cùng ngày.</li>
      </ul>

      <h2>4. Trách nhiệm Khi Làm OT</h2>
      <ul>
        <li>Kiểm tra và tắt toàn bộ thiết bị điện (máy tính, đèn, điều hòa) khi ra về.</li>
        <li>Đảm bảo khóa cửa, kích hoạt hệ thống an ninh trước khi rời văn phòng.</li>
        <li>Người về cuối cùng chịu trách nhiệm toàn bộ khu vực làm việc.</li>
      </ul>

      <div class="note"><p><strong>Quan trọng:</strong> Không đăng ký OT là vi phạm nội quy và sẽ không được tính lương tăng ca. Mọi thắc mắc liên hệ HCNS.</p></div>
    `
        },
        {
            title: "Quy định Mặc Đồng phục Công ty",
            slug: "uniform-policy",
            category: "workplace",
            excerpt: "Quy định mặc đồng phục vào Thứ Hai và Thứ Sáu hàng tuần. Mức phạt khi vi phạm và quy trình mua bổ sung.",
            icon: "checkroom",
            content: `
      <h2>1. Thời gian Mặc Đồng phục</h2>
      <ul>
        <li>Bắt buộc mặc đồng phục vào <strong>Thứ Hai và Thứ Sáu hàng tuần</strong> kể từ ngày 27/10/2025.</li>
        <li>Khi có thông báo đặc biệt yêu cầu mặc đồng phục (sự kiện, họp lớn, v.v.).</li>
        <li><strong>Ngoại lệ:</strong> Thời tiết lạnh dưới <strong>20°C</strong> — không bắt buộc mặc đồng phục.</li>
      </ul>

      <h2>2. Cấp phát Đồng phục</h2>
      <ul>
        <li><strong>Nhân sự chính thức:</strong> 02 áo/người.</li>
        <li><strong>Nhân sự thử việc:</strong> 01 áo/người. Khi ký HĐ chính thức sẽ được cấp thêm 01 áo.</li>
      </ul>

      <h2>3. Mua thêm Đồng phục</h2>
      <p>Trường hợp cần mua thêm ngoài số được cấp phát:</p>
      <ul>
        <li>Giá: <strong>150.000 VNĐ/áo</strong>.</li>
        <li>Chuyển khoản về: <strong>Nhữ Hồng Nhung — MB Bank — STK: 55506061999</strong>.</li>
        <li>Nội dung: <em>NetSpace – [Họ tên] – Mua [số lượng] áo đồng phục</em>.</li>
        <li>Sau khi kế toán xác nhận, liên hệ Phòng HCNS để nhận áo.</li>
      </ul>

      <h2>4. Quy định Khi Mặc</h2>
      <ul>
        <li>Áo sạch sẽ, phẳng phiu — không nhàu, bạc màu hoặc bẩn.</li>
        <li>Không tự ý cắt, sửa kiểu dáng hoặc thay đổi màu sắc (có thể cắt ngắn nếu áo quá dài).</li>
        <li>Phối cùng quần/váy màu nhã nhặn, váy chấm gối hoặc qua gối.</li>
        <li>Không mặc áo rách, có mùi hoặc logo/hình in bị bong tróc.</li>
      </ul>

      <h2>5. Mức Phạt Vi phạm</h2>
      <ul>
        <li>Quên mặc đồng phục: <strong>100.000 VNĐ/lần</strong>.</li>
      </ul>

      <div class="note"><p><strong>Lưu ý:</strong> Trưởng bộ phận có trách nhiệm nhắc nhở và giám sát nhân viên trong phạm vi quản lý. Phòng HCNS theo dõi và báo cáo vi phạm.</p></div>
    `
        },
        {
            title: "Quy định Kiểm tra Thiết bị & Dọn dẹp Văn phòng",
            slug: "office-rules",
            category: "workplace",
            excerpt: "Trách nhiệm tắt thiết bị, sắp xếp gọn gàng và kiểm tra toàn bộ văn phòng trước khi ra về. Mức phạt khi vi phạm.",
            icon: "apartment",
            content: `
      <h2>1. Trách nhiệm Trước Khi Ra Về</h2>
      <p>Toàn thể CBNV phải thực hiện trước khi rời văn phòng:</p>
      <ul>
        <li>Tắt máy tính, màn hình và tất cả thiết bị điện cá nhân.</li>
        <li>Sắp xếp tài liệu, đồ dùng gọn gàng trên bàn làm việc.</li>
        <li>Đẩy ghế vào gầm bàn.</li>
      </ul>

      <h2>2. Trách nhiệm Người Về Cuối</h2>
      <p>Người ra về <strong>cuối cùng trong ngày</strong> tại khu vực làm việc có trách nhiệm:</p>
      <ul>
        <li>Kiểm tra toàn bộ văn phòng, tắt các thiết bị còn sót lại (đèn, điều hòa, máy in, v.v.).</li>
        <li>Khóa cửa văn phòng.</li>
        <li>Nếu phát hiện vi phạm (thiết bị bật, bàn bừa bộn), chụp ảnh và gửi về <strong>hcns@netspace.vn</strong>.</li>
      </ul>

      <h2>3. Mức Phạt Vi phạm</h2>
      <ul>
        <li><strong>Lần 1:</strong> Nhắc nhở bằng văn bản.</li>
        <li><strong>Lần 2:</strong> Phạt <strong>50.000 VNĐ/thiết bị</strong> bị để bật.</li>
        <li><strong>Lần 3 trở lên:</strong> Phạt <strong>100.000 VNĐ/thiết bị</strong> bị để bật.</li>
      </ul>

      <div class="note"><p><strong>Lưu ý:</strong> Việc để thiết bị không tắt gây lãng phí điện năng và tiềm ẩn nguy cơ cháy nổ. Mọi người hãy ý thức bảo vệ tài sản chung.</p></div>
    `
        },
        {
            title: "Quy định Quản lý Tài khoản Truyền thông Số",
            slug: "social-media-policy",
            category: "it",
            excerpt: "Tài khoản mạng xã hội (Facebook, TikTok, Website...) là tài sản Công ty. Quy định bảo mật, nội dung và bàn giao khi nghỉ việc.",
            icon: "public",
            content: `
      <h2>1. Quyền Sở hữu Tài khoản</h2>
      <p>Toàn bộ tài khoản mạng xã hội, kênh truyền thông và website vận hành nhân danh NetSpace (Facebook, TikTok, Instagram, YouTube, Website...) đều là <strong>tài sản của Công ty</strong>, không thuộc sở hữu cá nhân.</p>

      <h2>2. Bảo mật Tài khoản</h2>
      <ul>
        <li>Bắt buộc kích hoạt <strong>xác thực 2 lớp (2FA)</strong> cho tất cả tài khoản.</li>
        <li>Thay đổi mật khẩu định kỳ ít nhất <strong>6 tháng/lần</strong>.</li>
        <li>Không chia sẻ thông tin đăng nhập với bên ngoài Công ty.</li>
        <li>Mật khẩu phải đủ mạnh: tối thiểu 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</li>
      </ul>

      <h2>3. Quy định Nội dung</h2>
      <ul>
        <li>Mọi bài đăng phải qua phê duyệt của cấp có thẩm quyền trước khi đăng tải.</li>
        <li>Không đăng thông tin <strong>sai lệch, chính trị</strong> hoặc vi phạm thuần phong mỹ tục.</li>
        <li>Không tự ý chia sẻ thông tin nội bộ, doanh số, chiến lược kinh doanh lên mạng xã hội.</li>
      </ul>

      <h2>4. Bàn giao Khi Nghỉ việc / Chuyển vị trí</h2>
      <p>Nhân viên quản lý tài khoản phải bàn giao <strong>đầy đủ và ngay lập tức</strong> khi nghỉ việc hoặc thay đổi vị trí công tác:</p>
      <ul>
        <li>Email đăng nhập.</li>
        <li>Mật khẩu hiện tại.</li>
        <li>Thông tin 2FA (mã xác thực, thiết bị liên kết).</li>
      </ul>

      <div class="note"><p><strong>Lưu ý:</strong> Nhân viên phải ký <strong>Bản cam kết</strong> khi tiếp nhận quyền quản lý tài khoản. Vi phạm gây thiệt hại cho Công ty sẽ chịu toàn bộ trách nhiệm pháp lý.</p></div>
    `
        },
        {
            title: "Cơ chế Giới thiệu Nhân sự",
            slug: "referral-policy",
            category: "hr",
            excerpt: "Thưởng từ 1.000.000đ đến 10.000.000đ khi giới thiệu người phù hợp gia nhập NetSpace và vượt qua thử việc.",
            icon: "person_add",
            content: `
      <h2>1. Mức Thưởng Giới thiệu</h2>
      <p>Nhân viên sẽ nhận thưởng sau khi người được giới thiệu ký Hợp đồng lao động chính thức:</p>
      <ul>
        <li><strong>Nhân viên / Chuyên viên:</strong> 1.000.000 – 2.000.000 VNĐ.</li>
        <li><strong>Trưởng nhóm / Phó phòng:</strong> 3.000.000 – 5.000.000 VNĐ.</li>
        <li><strong>Trưởng phòng / Quản lý cấp cao:</strong> 6.000.000 – 10.000.000 VNĐ.</li>
      </ul>

      <h2>2. Điều kiện Nhận Thưởng</h2>
      <ul>
        <li>Ứng viên do bạn giới thiệu phải <strong>vượt qua thời gian thử việc</strong>.</li>
        <li>Ứng viên phải <strong>ký Hợp đồng lao động chính thức</strong> với Công ty.</li>
        <li>Ứng viên giới thiệu phải chưa nằm trong hồ sơ ứng tuyển hiện tại của HR.</li>
      </ul>

      <h2>3. Quy trình Giới thiệu</h2>
      <ul>
        <li>Gửi CV ứng viên về email: <strong>hcns@netspace.vn</strong>.</li>
        <li>Ghi rõ thông tin người giới thiệu trong email.</li>
        <li>HR sẽ phản hồi về tình trạng hồ sơ trong vòng 3–5 ngày làm việc.</li>
      </ul>

      <h2>4. Thời gian Nhận Thưởng</h2>
      <p>Tiền thưởng được chi trả cùng <strong>kỳ lương gần nhất</strong> sau khi ứng viên ký Hợp đồng lao động chính thức.</p>

      <div class="note"><p><strong>Lưu ý:</strong> Chương trình này là cơ hội để bạn vừa giúp mở rộng đội ngũ NetSpace, vừa nhận thưởng xứng đáng. Hãy giới thiệu những ứng viên phù hợp với văn hóa và giá trị của Công ty.</p></div>
    `
        },
        {
            title: "Chính sách Nghỉ phép Năm",
            slug: "annual-leave",
            category: "leave",
            excerpt: "Quy định tích lũy ngày phép, chuyển tiếp sang năm sau và quy trình phê duyệt đơn nghỉ phép.",
            icon: "calendar_month",
            content: `
      <h2>1. Mức Phép Năm</h2>
      <ul>
        <li>Dưới 1 năm: <strong>12 ngày/năm</strong></li>
        <li>Từ 1–3 năm: <strong>14 ngày/năm</strong></li>
        <li>Từ 3–5 năm: <strong>16 ngày/năm</strong></li>
        <li>Trên 5 năm: <strong>18 ngày/năm</strong></li>
      </ul>
      <h2>2. Quy định Chuyển tiếp Phép</h2>
      <p>Ngày phép chưa dùng có thể chuyển tiếp sang năm kế tiếp tối đa <strong>5 ngày</strong>. Phần còn lại sẽ bị hủy vào ngày 31/12 hàng năm.</p>
      <div class="note"><p><strong>Khuyến nghị:</strong> Hãy lên kế hoạch nghỉ phép sớm. HR sẽ gửi nhắc nhở vào tháng 11 mỗi năm.</p></div>
      <h2>3. Quy trình Xin Phép</h2>
      <ul>
        <li>Nghỉ 1–2 ngày: nộp đơn trước ít nhất <strong>3 ngày làm việc</strong>.</li>
        <li>Nghỉ 3–5 ngày: thông báo trước ít nhất <strong>1 tuần</strong>.</li>
        <li>Nghỉ trên 5 ngày: thông báo trước ít nhất <strong>2 tuần</strong> và có kế hoạch bàn giao.</li>
      </ul>
    `
        },
        {
            title: "Hướng dẫn Bảo mật IT",
            slug: "it-security",
            category: "it",
            excerpt: "Quản lý mật khẩu, sử dụng VPN và cách báo cáo nghi vấn an ninh mạng.",
            icon: "security",
            content: `
      <h2>1. Quản lý Mật khẩu</h2>
      <ul>
        <li>Độ dài tối thiểu <strong>12 ký tự</strong>, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</li>
        <li>Không sử dụng lại mật khẩu giữa các hệ thống.</li>
        <li>Đổi mật khẩu định kỳ mỗi <strong>90 ngày</strong> (tài khoản nội bộ) hoặc <strong>6 tháng</strong> (tài khoản mạng xã hội Công ty).</li>
      </ul>
      <h2>2. Xác thực Hai yếu tố (2FA)</h2>
      <p>Bắt buộc kích hoạt 2FA trên tất cả tài khoản: Google Workspace, LarkSuite, mạng xã hội Công ty. Sử dụng Google Auth hoặc Authy — không dùng SMS.</p>
      <h2>3. Báo cáo Sự cố Bảo mật</h2>
      <ul>
        <li>Email: <strong>hcns@netspace.vn</strong></li>
        <li>Liên hệ trực tiếp Phòng IT để được hỗ trợ khẩn cấp.</li>
      </ul>
    `
        },
        {
            title: "Chính sách Thai sản",
            slug: "maternity",
            category: "leave",
            excerpt: "Quyền lợi thai sản, phụ cấp và thời gian nghỉ linh hoạt cho phụ huynh mới.",
            icon: "favorite",
            content: `
      <h2>1. Thời gian Nghỉ Thai sản</h2>
      <p>Nhân viên nữ được nghỉ thai sản <strong>6 tháng</strong> theo quy định pháp luật. NetSpace hỗ trợ thêm 1 tháng lương 100% trong thời gian này.</p>
      <h2>2. Phụ cấp Thai sản</h2>
      <ul>
        <li>Phụ cấp một lần: <strong>3.000.000 VNĐ</strong> khi sinh con.</li>
        <li>Tặng phẩm chào mừng thành viên mới từ Công ty.</li>
      </ul>
      <h2>3. Làm việc Linh hoạt sau Thai sản</h2>
      <p>Trong 6 tháng đầu sau khi quay lại, nhân viên có thể làm từ xa 100% hoặc đi muộn/về sớm tối đa 2 tiếng/ngày theo thỏa thuận với quản lý.</p>
    `
        },
        {
            title: "Hoàn trả Chi phí Công tác",
            slug: "expense",
            category: "finance",
            excerpt: "Quy trình hoàn tiền cho công tác, tiếp khách và mua sắm thiết bị văn phòng.",
            icon: "payments",
            content: `
      <h2>1. Các Chi phí Được Hoàn trả</h2>
      <ul>
        <li>Vé máy bay, tàu hỏa, xe khách phục vụ công tác được phê duyệt.</li>
        <li>Phòng khách sạn: tối đa <strong>1.500.000 VNĐ/đêm</strong> trong nước, <strong>100 USD/đêm</strong> nước ngoài.</li>
        <li>Chi phí ăn uống khi công tác: tối đa <strong>300.000 VNĐ/bữa</strong>.</li>
      </ul>
      <h2>2. Quy trình Hoàn Chi phí</h2>
      <ul>
        <li>Nộp Expense Report trong vòng <strong>15 ngày</strong> sau khi phát sinh.</li>
        <li>Đính kèm toàn bộ hóa đơn, biên lai gốc.</li>
        <li>Finance xử lý trong <strong>5–7 ngày làm việc</strong>.</li>
      </ul>
      <div class="note"><p><strong>Lưu ý:</strong> Hóa đơn phải xuất theo tên Công ty NetSpace mới được hoàn trả.</p></div>
    `
        },
        {
            title: "Chính sách Lương & Thưởng",
            slug: "payroll",
            category: "hr",
            excerpt: "Chu kỳ trả lương, kết cấu lương, thưởng hiệu suất và chính sách tăng lương.",
            icon: "account_balance_wallet",
            content: `
      <h2>1. Chu kỳ Trả Lương</h2>
      <p>Lương được thanh toán vào ngày <strong>25 hàng tháng</strong> qua chuyển khoản ngân hàng. Nếu ngày 25 trùng cuối tuần hoặc lễ, lương sẽ được trả vào ngày làm việc trước đó.</p>
      <h2>2. Kết cấu Lương</h2>
      <ul>
        <li>Lương cơ bản: 80% tổng thu nhập.</li>
        <li>Phụ cấp (xăng xe, ăn trưa, điện thoại): 20% tổng thu nhập.</li>
        <li>Thưởng hiệu suất (KPI): hàng quý và cuối năm.</li>
      </ul>
      <h2>3. Review Lương</h2>
      <p>Review lương định kỳ mỗi năm một lần vào tháng 4.</p>
    `
        },
        {
            title: "Chính sách Công tác & Du lịch",
            slug: "travel",
            category: "finance",
            excerpt: "Hướng dẫn mới về đặt vé máy bay, chỗ ở và chi tiêu khi công tác trong và ngoài nước.",
            icon: "flight",
            content: `
      <h2>1. Quy trình Đặt vé & Chỗ ở</h2>
      <p>Mọi chuyến công tác phải được phê duyệt bởi Trưởng bộ phận ít nhất <strong>07 ngày</strong> trước khi khởi hành.</p>
      <ul>
        <li>Vé máy bay: Ưu tiên hạng phổ thông (Economy). Với các chuyến bay trên 6 tiếng, có thể xem xét nâng hạng theo phê duyệt của Ban Giám đốc.</li>
        <li>Khách sạn: Tiêu chuẩn 3-4 sao hoặc tương đương. Hạn mức <strong>1.500.000 VNĐ/đêm</strong>.</li>
      </ul>
      <h2>2. Công tác phí (Per Diem)</h2>
      <p>Hạn mức chi tiêu ăn uống và đi lại địa phương:</p>
      <ul>
        <li>Trong nước: <strong>500.000 VNĐ/ngày</strong>.</li>
        <li>Nước ngoài: Tùy theo khu vực (Trung bình 50 - 80 USD/ngày).</li>
      </ul>
      <div class="note"><p><strong>Lưu ý:</strong> Mọi chi phí phát sinh ngoàiPer Diem cần có hóa đơn tài chính hợp lệ và giải trình cụ thể.</p></div>
    `
        },
        {
            title: "Quy trình Onboarding Nhân viên Mới",
            slug: "onboarding",
            category: "hr",
            excerpt: "Các bước hội nhập, đào tạo định hướng và cấp phát công cụ làm việc cho thành viên mới.",
            icon: "person_add",
            content: `
      <h2>1. Ngày đầu tiên (Day 1)</h2>
      <p>Chào mừng bạn gia nhập NetSpace! Lịch trình ngày đầu tiên của bạn bao gồm:</p>
      <ul>
        <li>08:30: Đón tiếp tại sảnh bởi bộ phận HR.</li>
        <li>09:00: Cấp phát trang thiết bị (Laptop, thẻ nhân viên, văn phòng phẩm).</li>
        <li>10:00: Đào tạo định hướng (Văn hóa công ty, nội quy, giới thiệu các phòng ban).</li>
        <li>12:00: Ăn trưa cùng Team.</li>
      </ul>
      <h2>2. Tuần đầu tiên (Week 1)</h2>
      <ul>
        <li>Hoàn thành các khóa đào tạo chuyên môn cơ bản.</li>
        <li>Thiết lập tài khoản hệ thống (LarkSuite, Email, VPN).</li>
        <li>Gặp gỡ "Buddy" — người đồng hành hỗ trợ bạn trong tháng đầu tiên.</li>
      </ul>
      <div class="note"><p><strong>HR Tips:</strong> Đừng ngần ngại đặt câu hỏi với Buddy hoặc bất kỳ ai trong phòng HR nếu bạn gặp khó khăn.</p></div>
    `
        },
        {
            title: "Sử dụng Thiết bị Công ty",
            slug: "device-policy",
            category: "it",
            excerpt: "Quy định bảo quản, sử dụng và trách nhiệm đối với thiết bị công nghệ được cấp phát.",
            icon: "devices",
            content: `
      <h2>1. Trách nhiệm Bảo quản</h2>
      <p>Mỗi nhân viên chịu trách nhiệm bảo quản và giữ gìn thiết bị được cấp phát (Laptop, iPad, điện thoại công vụ).</p>
      <ul>
        <li>Không dán sticker, vẽ hoặc làm trầy xước vỏ thiết bị.</li>
        <li>Không để thức ăn, đồ uống gần thiết bị.</li>
        <li>Sử dụng túi chống sốc khi di chuyển.</li>
      </ul>
      <h2>2. Sử dụng Phần mềm</h2>
      <ul>
        <li>Tuyệt đối không cài đặt phần mềm không có bản quyền hoặc phần mềm độc hại.</li>
        <li>Chỉ sử dụng thiết bị cho mục đích công việc của Công ty.</li>
      </ul>
      <h2>3. Mất mát & Hư hỏng</h2>
      <p>Trường hợp mất hoặc hư hỏng do lỗi cá nhân, nhân viên có trách nhiệm bồi thường theo giá trị còn lại của thiết bị tại thời điểm đó.</p>
    `
        },
        {
            title: "Quy trình Vận hành Hằng ngày",
            slug: "ops-workflow",
            category: "ops",
            excerpt: "Quy trình báo cáo, họp hằng tuần và phương thức quản lý tài nguyên nội bộ.",
            icon: "settings",
            content: `
      <h2>1. Họp Định kỳ</h2>
      <ul>
        <li><strong>Meeting hằng ngày (Daily Stand-up):</strong> 15 phút đầu giờ để cập nhật tiến độ công việc.</li>
        <li><strong>Họp tuần (Weekly Sync):</strong> Sáng thứ Hai từ 09:00 - 10:30.</li>
      </ul>
      <h2>2. Quản lý Tài liệu</h2>
      <p>Toàn bộ tài liệu làm việc phải được lưu trữ tập trung trên <strong>LarkDrive</strong>. Phân quyền truy cập theo quy mô dự án và phòng ban.</p>
      <h2>3. Kênh Liên lạc chính</h2>
      <ul>
        <li><strong>Thông báo gấp:</strong> Lark Messenger / Slack.</li>
        <li><strong>Trao đổi công việc chi tiết:</strong> Comment trực tiếp trên Task hoặc qua Email.</li>
      </ul>
    `
        }
    ];

    for (const p of policies) {
        // Upsert by slug
        await client.query(`
            INSERT INTO public.policies (title, slug, category, excerpt, icon, content, published)
            VALUES ($1, $2, $3, $4, $5, $6, true)
            ON CONFLICT (slug) DO UPDATE
            SET title = EXCLUDED.title,
                category = EXCLUDED.category,
                excerpt = EXCLUDED.excerpt,
                icon = EXCLUDED.icon,
                content = EXCLUDED.content,
                updated_at = NOW();
        `, [p.title, p.slug, p.category, p.excerpt, p.icon, p.content]);
    }

    console.log(`Synced ${policies.length} policies to Supabase.`);
    await client.end();
}

sync().catch(console.error);
