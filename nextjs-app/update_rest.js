const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');
const dummyPdfUrl = 'https://xwpkfnzireadfgzcdcbg.supabase.co/storage/v1/object/public/policies/1774842051811-form-commitment-social-media.docx';

function wrap(title, icon, items) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 policy-slides">
      <div class="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-6 md:p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all">
        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/10 group-hover:scale-110 transition-transform pointer-events-none">${icon}</span>
        <div class="relative z-10 w-full md:w-4/5 text-left">
           <div class="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/20 mb-4 backdrop-blur-sm">Thông tin tóm tắt</div>
           <h3 class="text-2xl md:text-3xl font-black mb-3 leading-tight tracking-tight shadow-sm">${title}</h3>
        </div>
      </div>
      
      ${items.map(item => `
        <div class="bg-${item.c}-50 border border-${item.c}-100 p-6 rounded-[2rem] shadow-sm hover:-translate-y-1 transition-transform cursor-default">
           <div class="bg-${item.c}-100 w-12 h-12 rounded-2xl flex items-center justify-center text-${item.c}-600 mb-4 shadow-sm">
             <span class="material-symbols-outlined text-[24px]">${item.i}</span>
           </div>
           <h3 class="text-base font-black text-slate-800 mb-2">${item.t}</h3>
           <p class="text-xs text-slate-600 font-medium leading-relaxed">${item.d}</p>
        </div>
      `).join('')}
    </div>
  `;
}

async function run() {
  const { data: policies } = await supabase.from('policies').select('*');

  for (const p of policies) {
    let items = [];
    let icon = 'article';
    
    // DATA MAPPING BASED ON REAL POLICY DOCUMENTS
    if (p.slug === 'remote-work') {
       icon = 'home_work';
       items = [
         { t: 'Đăng ký LarkSuite', d: 'Phải đăng ký ít nhất 01 ngày trước khi thực hiện. Chờ TBP phê duyệt.', i: 'edit_calendar', c: 'blue' },
         { t: 'Báo cáo 21:00', d: 'Nộp báo cáo công việc mỗi ngày trước 21:00 qua LarkSuite.', i: 'assignment_turned_in', c: 'emerald' },
         { t: 'Thẩm quyền duyệt', d: 'Dưới 2 ngày: TBP + HCNS. Từ 2 ngày: Tổng Giám đốc phê duyệt.', i: 'rule', c: 'orange' },
         { t: '100% Lương', d: 'Tính đủ lương nếu hoàn thành ≥ 90% công việc và báo cáo đúng hạn.', i: 'attach_money', c: 'teal' },
       ];
    } else if (p.slug === 'overtime-policy') {
       icon = 'schedule';
       items = [
         { t: 'Thời hạn đăng ký', d: 'Ngày thường trước 18:00. Ngày nghỉ/Lễ trước 08:00 trên LarkSuite.', i: 'new_releases', c: 'rose' },
         { t: 'Hạn cuối 23:00', d: 'Thời gian làm OT tối đa đến 23:00. Nghiêm cấm ở lại qua đêm.', i: 'nights_stay', c: 'indigo' },
         { t: 'Tắt thiết bị điện', d: 'Phải kiểm tra và tắt toàn bộ điện/điều hòa trước khi rời văn phòng.', i: 'bolt', c: 'amber' },
         { t: 'Người về cuối', d: 'Chịu trách nhiệm khóa cửa và kích hoạt hệ thống an ninh khu vực.', i: 'key', c: 'slate' },
       ];
    } else if (p.slug === 'uniform-policy') {
       icon = 'checkroom';
       items = [
         { t: 'Thứ 2 & Thứ 6', d: 'Bắt buộc mặc đồng phục vào 2 ngày này. Ngoại lệ: Trời lạnh < 20°C.', i: 'calendar_today', c: 'blue' },
         { t: 'Phạt 100.000đ', d: 'Mức phạt áp dụng cho mỗi lần quên mặc đồng phục vào ngày quy định.', i: 'warning', c: 'rose' },
         { t: 'Cấp phát áo', d: 'Nhân viên chính thức: 02 áo. Thử việc: 01 áo (thêm 1 khi chính thức).', i: 'shopping_bag', c: 'emerald' },
         { t: 'Mua thêm 150k', d: 'Giá mua thêm 150.000đ/áo. Chuyển khoản MB Bank Nhữ Hồng Nhung.', i: 'payments', c: 'teal' },
       ];
    } else if (p.slug === 'office-rules') {
       icon = 'apartment';
       items = [
         { t: 'Dọn dẹp bàn', d: 'Sắp xếp tài liệu, đồ dùng gọn gàng và đẩy ghế vào gầm trước khi về.', i: 'cleaning_services', c: 'teal' },
         { t: 'Tắt máy tính', d: 'Phải tắt màn hình và mọi thiết bị điện cá nhân khi rời chỗ làm.', i: 'desktop_windows', c: 'rose' },
         { t: 'Báo cáo vi phạm', d: 'Chụp ảnh gửi hcns@netspace.vn nếu thấy thiết bị chưa tắt.', i: 'photo_camera', c: 'orange' },
         { t: 'Mức phạt lũy tiến', d: 'Lần 2: 50.000đ/thiết bị. Lần 3+: 100.000đ/thiết bị bị để bật.', i: 'gavel', c: 'slate' },
       ];
    } else if (p.slug === 'social-media-policy') {
       icon = 'public';
       items = [
         { t: 'Tài sản Công ty', d: 'Tất cả tài khoản (Facebook, TikTok...) là tài sản của NetSpace.', i: 'token', c: 'blue' },
         { t: 'Bảo mật 2FA', d: 'Bắt buộc xác thực 2 lớp. Đổi mật khẩu định kỳ ít nhất 6 tháng/lần.', i: 'verified_user', c: 'emerald' },
         { t: 'Phê duyệt nội dung', d: 'Mọi bài đăng phải qua phê duyệt. Không đăng tin sai lệch, chính trị.', i: 'fact_check', c: 'orange' },
         { t: 'Bàn giao ngay', d: 'Bàn giao Full account + mã 2FA ngay khi nghỉ việc hoặc đổi vị trí.', i: 'assignment_return', c: 'rose' },
       ];
    } else if (p.slug === 'referral-policy') {
       icon = 'person_add';
       items = [
         { t: 'Thưởng 1-10 triệu', d: 'Mức thưởng tùy theo cấp bậc vị trí được giới thiệu thành công.', i: 'card_giftcard', c: 'emerald' },
         { t: 'Điều kiện nhận', d: 'Ứng viên vượt thử việc và ký hợp đồng lao động chính thức.', i: 'task_alt', c: 'blue' },
         { t: 'Quy trình gửi CV', d: 'Gửi về hcns@netspace.vn. HR phản hồi trong 3-5 ngày làm việc.', i: 'mail', c: 'cyan' },
         { t: 'Kỳ trả thưởng', d: 'Chi trả cùng kỳ lương gần nhất sau khi ứng viên ký HĐ chính thức.', i: 'payments', c: 'teal' },
       ];
    } else if (p.slug === 'maternity') {
       icon = 'favorite';
       items = [
         { t: 'Nghỉ 6 tháng', d: 'Nghỉ thai sản theo luật định. NetSpace hỗ trợ thêm 1 tháng lương.', i: 'pregnant_woman', c: 'rose' },
         { t: 'Thưởng 3.000.000đ', d: 'Trợ cấp một lần kèm quà tặng chúc mừng thành viên mới.', i: 'redeem', c: 'emerald' },
         { t: 'WFH linh hoạt', d: 'Cho phép làm từ xa 100% linh hoạt trong 6 tháng sau khi quay lại.', i: 'home', c: 'cyan' },
         { t: 'Về sớm 2 tiếng', d: 'Được đi muộn/về sớm tối đa 2 tiếng/ngày để chăm sóc bé.', i: 'schedule', c: 'orange' },
       ];
    } else if (p.slug === 'expense') {
       icon = 'payments';
       items = [
         { t: 'Vé máy bay/Tàu', d: 'Hoàn trả 100% kinh phí đi lại phục vụ công việc được phê duyệt.', i: 'flight_takeoff', c: 'blue' },
         { t: 'Khách sạn 1.5M', d: 'Hạn mức 1.5M VND/đêm trong nước hoặc 100 USD/đêm nước ngoài.', i: 'hotel', c: 'amber' },
         { t: 'Ăn uống 300k', d: 'Hạn mức chi phí ăn uống tối đa 300.000 VNĐ/bữa khi đi công tác.', i: 'restaurant', c: 'emerald' },
         { t: 'Báo cáo 15 ngày', d: 'Nộp báo cáo chi phí kèm hóa đơn tài chính trong vòng 15 ngày.', i: 'receipt_long', c: 'rose' },
       ];
    } else if (p.slug === 'payroll') {
       icon = 'account_balance_wallet';
       items = [
         { t: 'Ngày 25 hằng tháng', d: 'Lương được trả vào ngày 25. Chuyển khoản ngân hàng 100%.', i: 'event', c: 'emerald' },
         { t: 'Kết cấu 80/20', d: '80% Lương cơ bản và 20% phụ cấp (xăng, ăn, điện thoại).', i: 'pie_chart', c: 'blue' },
         { t: 'Review hằng năm', d: 'Đánh giá tăng lương định kỳ mỗi năm một lần vào tháng 4.', i: 'trending_up', c: 'amber' },
         { t: 'Thưởng KPI', d: 'Thưởng hiệu suất theo quý dựa trên kết quả công việc thực tế.', i: 'workspace_premium', c: 'purple' },
       ];
    } else if (p.slug === 'annual-leave') {
       icon = 'calendar_month';
       items = [
         { t: '12 - 18 ngày', d: 'Từ 12 ngày phép/năm, tăng dần theo thâm niên mỗi 2-3 năm.', i: 'date_range', c: 'cyan' },
         { t: 'Chuyển phép 5 ngày', d: 'Cho phép chuyển tối đa 5 ngày phép thừa sang năm kế tiếp.', i: 'hourglass_top', c: 'amber' },
         { t: 'Báo trước 1 tuần', d: 'Nghỉ 3-5 ngày báo trước 1 tuần. Nghỉ lẻ báo trước 3 ngày.', i: 'notification_important', c: 'rose' },
         { t: 'Phép tình cảm', d: 'Hưởng thêm ngày nghỉ có lương cho việc hỷ, hiếu theo nội quy.', i: 'favorite', c: 'blue' },
       ];
    } else {
       items = [
         { t: 'Đọc kỹ thông tin', d: 'Vui lòng xem chi tiết file PDF nguyên văn bên dưới.', i: 'info', c: 'slate' },
         { t: 'NetSpace Rule', d: 'Tuân thủ các quy định để xây dựng môi trường chuyên nghiệp.', i: 'fact_check', c: 'slate' }
       ];
    }

    const html = wrap(p.title.toUpperCase(), icon, items);
    
    await supabase.from('policies')
      .update({
        content: html,
        pdf_url: p.pdf_url || dummyPdfUrl
      })
      .eq('id', p.id);
      
    console.log('Updated to ACCURATE BENTO', p.title);
  }
}

run().catch(console.error);
