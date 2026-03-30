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
    if (p.content && p.content.includes('<div class="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-6')) {
      // already beautifully bento'd by seed_policies.ts
      continue;
    }
    
    let items = [];
    let icon = 'article';
    
    if (p.slug === 'maternity') {
       icon = 'pregnant_woman';
       items = [
         { t: 'Nghỉ sinh 6 tháng', d: 'Hưởng 100% lương từ quỹ bảo hiểm theo luật định.', i: 'local_hospital', c: 'teal' },
         { t: 'Trợ cấp Công ty', d: 'Tặng 3.000.000 VNĐ cùng hộp quà mừng chào đón em bé.', i: 'redeem', c: 'emerald' },
         { t: 'Quyền làm việc tại nhà', d: 'Cho phép nhân sự nữ WFH linh hoạt trong 6 tháng đi làm lại.', i: 'home', c: 'cyan' },
         { t: 'Đi lại linh hoạt', d: 'Cho phép đi làm trễ tối đa 2 giờ để vắt sữa / chăm bé.', i: 'schedule', c: 'orange' },
       ];
    } else if (p.slug === 'expense') {
       icon = 'account_balance_wallet';
       items = [
         { t: 'Thái độ khi đi lại', d: 'Hóa đơn di chuyển (máy bay, tàu hỏa) được công ty trả theo khung quy định.', i: 'flight', c: 'blue' },
         { t: 'Hạn mức khách sạn', d: 'Cấp bậc quản lý: 800K/đêm. Nhân viên: 500k/đêm (phải có hóa đơn đó).', i: 'bed', c: 'amber' },
         { t: 'Phụ cấp lưu trú', d: 'Được công ty cấp thêm 200,000đ - 300,000đ tiền đi lại ăn uống/ngày ngoài lương cố định.', i: 'payments', c: 'emerald' },
         { t: 'Nộp hóa đơn trong 7 ngày', d: 'Hoàn trả chứng từ vào form kế toán tối đa mùng 10 tháng sau.', i: 'receipt_long', c: 'rose' },
       ];
    } else if (p.slug === 'payroll') {
       icon = 'monetization_on';
       items = [
         { t: 'Lương cố định mùng 5', d: 'Công ty chốt công cuối tháng, ứng lương và trả lương minh bạch vào mùng 05 mỗi tháng.', i: 'event_available', c: 'emerald' },
         { t: 'Thưởng quý năng lực', d: 'Mức thưởng lên đến 1-3 tháng lương đối với phòng ban Business xuất sắc.', i: 'trending_up', c: 'amber' },
         { t: 'Bảo hiểm Xã Hội 100%', d: 'Bắt buộc toàn bộ nhân sự chính thức đều được NetSpace đóng BHXH, BHYT.', i: 'health_and_safety', c: 'blue' },
         { t: 'Đánh giá tăng lương', d: 'Thực hiện Performance Review định kì 6 tháng/1 lần (Tập trung năng suất)', i: 'speed', c: 'purple' },
       ];
    } else if (p.slug === 'it-security') {
       icon = 'security';
       items = [
         { t: 'Thông tin nội bộ', d: 'Mọi tài liệu nội bộ (Zalo, Trello, Google Drive) không được gửi ra máy trạm công cộng.', i: 'folder_off', c: 'rose' },
         { t: 'Sử dụng Email', d: 'Email NetSpace (@netspace.com.vn) chỉ được dùng cho các hợp đồng, công việc nội bộ.', i: 'mail', c: 'cyan' },
         { t: 'Kết nối mạng', d: 'Thận trọng kết nối WiFi công ty từ điện thoại, không chơi app lậu/VPN lạ.', i: 'wifi', c: 'orange' },
         { t: 'Password', d: 'Đổi mật khẩu mọi thiết bị/email sau 90 ngày. Khuyến khích 10 ký tự.', i: 'lock_person', c: 'teal' },
       ];
    } else if (p.slug === 'ops-workflow') {
       icon = 'manage_history';
       items = [
         { t: 'Check in khuôn mặt', d: 'Chấm công tự động trên LarkSuite lúc 8H30. Không quét trễ hạn.', i: 'face', c: 'blue' },
         { t: 'Văn hóa Email', d: 'Trả lời mọi Email khẩn cấp trong 4 Giờ. Nếu OT thì sáng mai xử lý.', i: 'reply_all', c: 'orange' },
         { t: 'Tổ chức Họp', d: 'Mỗi cuộc họp tối đa 45 phút, cần Agenda gửi trước.', i: 'groups', c: 'cyan' },
         { t: 'Bàn sạch tươm tất', d: 'Làm mâm nào gọn mâm nấy. Cuối ngày dời sách, rửa cốc cá nhân.', i: 'cleaning_services', c: 'teal' },
       ];
    } else if (p.slug === 'onboarding') {
       icon = 'emoji_people';
       items = [
         { t: 'Phổ biến quy tắc', d: 'Tuần đầu tiên là học nội quy và đọc tài liệu Onboarding của cty.', i: 'library_books', c: 'teal' },
         { t: 'Cấp phát laptop', d: 'IT sẽ cấp laptop và cài đủ Account công ty trước thứ 3 hằng tuần.', i: 'laptop_mac', c: 'blue' },
         { t: 'Buddy thân thiện', d: 'Được chỉ định một Buddy hướng dẫn tận tâm làm quen với 3 dự án nhỏ.', i: 'waving_hand', c: 'amber' },
         { t: 'Báo cáo thử việc', d: 'Thử việc 2 tháng. Ngày 55 phải nộp bài báo cáo thành phẩm trên slide.', i: 'summarize', c: 'orange' },
       ];
    } else if (p.slug === 'device-policy') {
       icon = 'devices';
       items = [
         { t: 'Cấp phát Máy', d: 'Laptop, PC cho nv lập trình/content được niêm phong cấu hình cứng.', i: 'memory', c: 'emerald' },
         { t: 'Khấu hao Tài sản', d: 'Làm hỏng đổ cafe: Đền bù 30%-100% tuỳ tuổi thọ khai báo.', i: 'water_drop', c: 'rose' },
         { t: 'Điều hòa & Điện', d: 'Sử dụng xong là phải tắt quạt và hệ thống tắt đèn.', i: 'bolt', c: 'amber' },
         { t: 'Quyền cài phần mềm', d: 'Cấm cài Game crack trên máy cấp. Yêu cầu IT nếu muốn có app lạ.', i: 'gpp_bad', c: 'purple' },
       ];
    } else if (p.slug === 'annual-leave') {
       icon = 'flight_takeoff';
       items = [
         { t: 'Tiêu chuẩn 12 ngày', d: 'Nhân viên chính thức có 12 ngày Annual Leave (AL). Tính sau thử việc.', i: 'event', c: 'cyan' },
         { t: 'Việc Tình Cảm', d: 'Đám cưới, đám tang nhân thân được nghỉ 3 - 5 ngày có lương hoàn toàn.', i: 'favorite', c: 'rose' },
         { t: 'Hạn cuối Phép năm', d: 'Được cộng dồn phép tồn sang quý 1 năm đén hết 30/03.', i: 'hourglass_bottom', c: 'amber' },
         { t: 'Báo hiệu nghỉ', d: 'Phải điền lịch Lark Approval nghỉ 1 ngày phải trước 2 ngày.', i: 'edit_notifications', c: 'blue' },
       ];
    } else if (p.slug === 'travel') {
       icon = 'explore';
       items = [
         { t: 'Team Building định kỳ', d: 'Quỹ Du Lịch tài trợ đi Retreat 1 lần/ năm cho người thâm niên > 6m.', i: 'beach_access', c: 'teal' },
         { t: 'Ngân sách Công tác', d: 'Trợ cấp khách sạn + Thêm 250k Phụ phí. Được công tác nước ngoài (Nếu Tech Lead).', i: 'globe_asia', c: 'blue' },
         { t: 'Trang phục quy chuẩn', d: 'Mặc Polo NetSpace vào các ngày đi Team Builiding ngày 1.', i: 'checkroom', c: 'orange' }
       ];
    } else {
       // generalized fallback if there are any others
       items = [
         { t: 'Đọc kỹ thông tin', d: 'Vui lòng đọc kĩ các yêu cầu bắt buộc bên dưới.', i: 'info', c: 'slate' },
         { t: 'Tuân thủ nội quy', d: 'Thực hiện văn hóa công sở đúng mực.', i: 'fact_check', c: 'slate' }
       ];
    }

    const html = wrap(p.title.toUpperCase(), icon, items);
    
    await supabase.from('policies')
      .update({
        content: html,
        pdf_url: p.pdf_url || dummyPdfUrl
      })
      .eq('id', p.id);
      
    console.log('Updated to BENTO', p.title);
  }
}

run().catch(console.error);
