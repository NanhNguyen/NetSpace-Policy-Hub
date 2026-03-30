const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');

const dataPath = path.resolve('../Chính sách và Quy chế');

const policies = [
  {
    title: 'Quy định quản lý Tài khoản Truyền thông số',
    slug: 'quy-dinh-quan-ly-tai-khoan-truyen-thong-so',
    category: 'hr',
    icon: 'gavel',
    excerpt: 'Quy tắc sử dụng và bảo mật tài khoản truyền thông số của Công ty.',
    file: 'Quy định số 0425 - Quy định về quản lý tài khoản truyền thông số của Công ty.pdf',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 policy-slides">
        <div class="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-blue-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">description</span> 1. Quy định chung</h3>
          <ul class="space-y-2 text-sm text-slate-700 list-disc list-inside">
              <li><strong class="text-blue-900">Mã văn bản:</strong> Quy định số 04/QĐ-NETSPACE/2025.</li>
              <li><strong class="text-blue-900">Quyền sở hữu:</strong> Tất cả tài khoản truyền thông số là tài sản của Công ty. Khi quản lý phải ký bản cam kết.</li>
          </ul>
        </div>
        <div class="bg-orange-50/50 border border-orange-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-orange-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">rule</span> 2. Quy tắc sử dụng</h3>
          <ul class="space-y-2 text-sm text-slate-700 list-disc list-inside">
              <li>Nghiêm cấm cho mục đích cá nhân, chính trị, tôn giáo.</li>
              <li>Tuân thủ danh sách "10 Không" (Không vi phạm đạo đức báo chí, nói xấu, tiết lộ bí mật...).</li>
              <li>Nội dung nhạy cảm hoặc hợp tác cần phê duyệt bằng văn bản.</li>
          </ul>
        </div>
        <div class="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-emerald-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">lock</span> 3. Bảo mật</h3>
          <ul class="space-y-2 text-sm text-slate-700 list-disc list-inside">
              <li>Bắt buộc dùng email công ty để tạo tài khoản.</li>
              <li>Đổi mật khẩu ít nhất 3 tháng/lần, bắt buộc bật xác thực hai yếu tố (2FA).</li>
          </ul>
        </div>
        <div class="bg-purple-50/50 border border-purple-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-purple-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">assignment_return</span> 4. Bàn giao</h3>
          <ul class="space-y-2 text-sm text-slate-700 list-disc list-inside">
              <li>Khi nghỉ việc phải bàn giao trước 3 ngày làm việc (kèm biên bản 3 bên).</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    title: 'Cơ chế Cộng tác viên (CTV) Kinh doanh',
    slug: 'co-che-cong-tac-vien-kinh-doanh',
    category: 'finances',
    icon: 'groups',
    excerpt: 'Mức thưởng và hoa hồng dành cho CTV mở rộng mạng lưới kinh doanh.',
    file: 'CƠ CHẾ CTV NETSPACE.pdf',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 policy-slides">
        <div class="bg-indigo-50/50 border border-indigo-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-indigo-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">flag</span> 1. Mục đích</h3>
          <p class="text-sm text-slate-700">Mở rộng mạng lưới kinh doanh đối với cá nhân/tổ chức ngoài phòng kinh doanh.</p>
        </div>
        <div class="bg-rose-50/50 border border-rose-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-rose-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">handshake</span> 2. Hình thức hợp tác</h3>
          <ul class="space-y-2 text-sm text-slate-700 list-disc list-inside">
              <li><strong>Chỉ giới thiệu:</strong> Hưởng 6% tổng lợi nhuận thu về.</li>
              <li><strong>Tự đàm phán, triển khai:</strong> Hoa hồng tăng dần từ 10% đến 30% tùy loại và giá trị hợp đồng.</li>
          </ul>
        </div>
        <div class="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl shadow-sm md:col-span-2 hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-amber-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">payments</span> 3. Thanh toán</h3>
          <p class="text-sm text-slate-700">Chi trả theo kỳ sau khi khách hàng hoàn tất công nợ.</p>
        </div>
      </div>
    `
  },
  {
    title: 'Cơ chế Giới thiệu nhân sự',
    slug: 'co-che-gioi-thieu-nhan-su',
    category: 'benefits',
    icon: 'person_add',
    excerpt: 'Khuyến khích và thưởng cho nhân sự nội bộ giới thiệu ứng viên gia nhập công ty.',
    file: 'Cơ chế giới thiệu nhân sự.pdf',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 policy-slides">
        <div class="bg-teal-50/50 border border-teal-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow md:col-span-2">
          <h3 class="text-lg font-black text-teal-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">lightbulb</span> Mục đích & Điều kiện</h3>
          <p class="text-sm text-slate-700 mb-2">Khuyến khích nhân sự nội bộ giới thiệu ứng viên (Không áp dụng cho phòng HCNS và Quản lý trực tiếp).</p>
          <p class="text-sm text-slate-700"><strong>Điều kiện nhận thưởng:</strong> Ứng viên vượt qua thử việc và ký HĐLĐ chính thức. Trả vào kỳ lương gần nhất.</p>
        </div>
        <div class="bg-sky-50/50 border border-sky-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow md:col-span-2 flex flex-col items-center justify-center">
          <h3 class="text-lg font-black text-sky-800 mb-4 flex items-center gap-2"><span class="material-symbols-outlined">redeem</span> Mức thưởng theo cấp bậc ứng viên</h3>
          <div class="flex gap-4 flex-wrap justify-center w-full">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 min-w-[200px] text-center">
               <div class="text-[10px] font-black uppercase text-slate-400 mb-1">Quản lý / Trưởng phòng</div>
               <div class="text-lg font-black text-sky-600">6tr - 10tr VNĐ</div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 min-w-[200px] text-center">
               <div class="text-[10px] font-black uppercase text-slate-400 mb-1">Phó phòng / Trưởng nhóm</div>
               <div class="text-lg font-black text-sky-600">3tr - 5tr VNĐ</div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 min-w-[200px] text-center">
               <div class="text-[10px] font-black uppercase text-slate-400 mb-1">Chuyên viên / Nhân viên</div>
               <div class="text-lg font-black text-sky-600">1tr - 2tr VNĐ</div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    title: 'Quy định Giải Chuối Xanh',
    slug: 'quy-dinh-giai-chuoi-xanh',
    category: 'conduct',
    icon: 'sentiment_dissatisfied',
    excerpt: 'Nhắc nhở hài hước, văn minh với các lỗi vi phạm nội quy, tiến độ.',
    file: 'Giải chuối xanh.pdf',
    content: `
      <div class="grid grid-cols-1 gap-6 policy-slides">
        <div class="bg-green-50/50 border border-green-200 p-6 md:p-10 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center gap-8">
           <div class="w-full md:w-1/3 flex flex-col justify-center items-center text-center">
              <span class="text-6xl mb-4">🍌</span>
              <h3 class="text-2xl font-black text-green-800">GIẢI CHUỐI XANH</h3>
              <p class="text-xs text-green-600 font-bold uppercase tracking-widest mt-2">Nhắc nhở văn minh</p>
           </div>
           <div class="w-full md:w-2/3 space-y-4">
              <div class="bg-white rounded-2xl p-5 shadow-sm">
                <h4 class="text-sm font-black text-slate-800 mb-2 flex items-center gap-2"><span class="material-symbols-outlined text-[18px] text-red-500">warning</span> Đối tượng nhận giải</h4>
                <ul class="text-sm text-slate-600 list-disc list-inside space-y-1">
                   <li>Trễ deadline, không đạt KPI, sai sót lặp lại.</li>
                   <li>Đi muộn, ngủ gật, không đeo thẻ/đồng phục, bừa bộn.</li>
                </ul>
              </div>
              <div class="bg-white rounded-2xl p-5 shadow-sm">
                <h4 class="text-sm font-black text-slate-800 mb-2 flex items-center gap-2"><span class="material-symbols-outlined text-[18px] text-green-500">check_circle</span> Cách thức trao giải</h4>
                <p class="text-sm text-slate-600">Cắm "Chuối Xanh" tại văn phòng. Khi chuối chín thì mua đồ liên hoan. <strong class="text-red-500">Tuyệt đối không dùng để mỉa mai, công kích cá nhân.</strong></p>
              </div>
           </div>
        </div>
      </div>
    `
  },
  {
    title: 'Quy định Giải Tự Khoe',
    slug: 'quy-dinh-giai-tu-khoe',
    category: 'benefits',
    icon: 'emoji_events',
    excerpt: 'Ghi nhận thành tích, sáng kiến, lan tỏa năng lượng tích cực với các mức thưởng hấp dẫn.',
    file: 'Giải tự khoe.pdf',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 policy-slides">
        <div class="col-span-1 md:col-span-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 p-6 rounded-3xl text-center">
           <span class="material-symbols-outlined text-4xl text-amber-500 mb-2">military_tech</span>
           <h3 class="text-xl font-black text-amber-900 mb-2">GIẢI TỰ KHOE</h3>
           <p class="text-sm text-amber-700 font-medium">Ghi nhận sáng kiến, thành tích xuất sắc và lan tỏa năng lượng tích cực. Cần có minh chứng xác thực gửi về HCNS.</p>
        </div>
        
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden group hover:border-amber-200 transition-colors">
           <div class="absolute top-0 inset-x-0 h-1 bg-slate-200 group-hover:bg-amber-300 transition-colors"></div>
           <h4 class="text-2xl font-black text-slate-800 mb-1">500K</h4>
           <div class="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4">Mức Khởi Khởi</div>
           <p class="text-xs text-slate-600 leading-relaxed">Vượt KPI >= 120%, hỗ trợ đồng nghiệp hoặc khách hàng đặc biệt tốt.</p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden group hover:border-amber-400 transition-colors">
           <div class="absolute top-0 inset-x-0 h-1 bg-slate-300 group-hover:bg-amber-400 transition-colors"></div>
           <h4 class="text-2xl font-black text-slate-800 mb-1">1 TRIỆU</h4>
           <div class="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4">Mức Đột Phá</div>
           <p class="text-xs text-slate-600 leading-relaxed">Vượt KPI >= 140%, tối ưu quy trình làm việc hiệu quả, giải quyết sự cố quan trọng.</p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden group hover:border-amber-500 transition-colors">
           <div class="absolute top-0 inset-x-0 h-1 bg-amber-400 group-hover:bg-amber-500 transition-colors"></div>
           <h4 class="text-2xl font-black text-amber-600 mb-1">2 TRIỆU+</h4>
           <div class="text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-4">Mức Xuất Sắc</div>
           <p class="text-xs text-slate-600 leading-relaxed">Sáng kiến hiệu quả vượt trội, mang lại doanh thu lớn hoặc xử lý sự cố cực kỳ nghiêm trọng.</p>
        </div>
      </div>
    `
  },
  {
    title: 'Quy định Đồng phục',
    slug: 'quy-dinh-dong-phuc',
    category: 'conduct',
    icon: 'checkroom',
    excerpt: 'Quy định về việc cung cấp và sử dụng áo đồng phục công ty.',
    file: 'QĐ 0425 Quy định về mặc áo đồng phục.docx',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 policy-slides">
        <div class="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <span class="material-symbols-outlined absolute right-[-20px] bottom-[-20px] text-[100px] text-slate-100 opacity-50 pointer-events-none">laundry</span>
          <h3 class="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">Cấp phát đồng phục</h3>
          <ul class="space-y-3 text-sm text-slate-600 list-disc list-inside relative z-10">
              <li><strong>Nhân sự chính thức:</strong> Cấp 02 áo.</li>
              <li><strong>Nhân sự thử việc:</strong> Cấp 01 áo.</li>
              <li>Đăng ký mua thêm với giá: <strong>150.000đ/áo</strong>.</li>
          </ul>
        </div>
        <div class="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <span class="material-symbols-outlined absolute right-[-20px] bottom-[-20px] text-[100px] text-slate-100 opacity-50 pointer-events-none">warning</span>
          <h3 class="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">Sử dụng & Xử lý vi phạm</h3>
          <ul class="space-y-3 text-sm text-slate-600 list-disc list-inside relative z-10">
              <li><strong class="text-slate-900">Bắt buộc mặc:</strong> Vào Thứ Hai và Thứ Sáu hàng tuần.</li>
              <li><strong class="text-slate-900">Ngoại lệ:</strong> Không bắt buộc khi thời tiết dưới 20 độ C.</li>
              <li><strong class="text-red-500">Mức phạt:</strong> Quên mặc phạt 100.000đ/lần.</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    title: 'Quy định Kiểm tra Thiết bị và Dọn dẹp cuối ngày',
    slug: 'quy-dinh-kiem-tra-thiet-bi-don-dep',
    category: 'conduct',
    icon: 'power_settings_new',
    excerpt: 'Đảm bảo an toàn, tiết kiệm năng lượng và giữ gìn vệ sinh chung văn phòng.',
    file: 'Quy Định số 0625QyĐ-NS -Kiểm tra, tắt thiết bị và dọn dẹp khu vực làm việc trước khi rời khỏi văn phòng.pdf',
    content: `
      <div class="space-y-6 policy-slides">
        <div class="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4 shadow-sm">
           <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
              <span class="material-symbols-outlined text-[24px]">cleaning_services</span>
           </div>
           <div>
              <h3 class="text-sm font-black text-blue-900 mb-2 uppercase tracking-wide">Yêu cầu chung</h3>
              <p class="text-sm text-slate-600">Luôn dọn dẹp chỗ ngồi gọn gàng, tắt mọi thiết bị điện/máy móc không sử dụng. Thiết bị buộc chạy 24/24 phải có bảng đăng ký và treo biển báo rõ ràng.</p>
           </div>
        </div>

        <div class="bg-orange-50/50 border border-orange-100 p-6 rounded-3xl flex items-start gap-4 shadow-sm">
           <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
              <span class="material-symbols-outlined text-[24px]">verified_user</span>
           </div>
           <div>
              <h3 class="text-sm font-black text-orange-900 mb-2 uppercase tracking-wide">Trách nhiệm người về cuối</h3>
              <ul class="text-sm text-slate-600 list-disc list-inside space-y-1">
                 <li><strong>Người về cuối nhóm:</strong> Kiểm tra, tắt toàn bộ quạt/điện/máy lạnh khu vực mình.</li>
                 <li><strong>Người về cuối văn phòng:</strong> Rà soát tổng thể toàn VP, chụp ảnh khu vực vi phạm gửi cho HCNS, tắt hệ thống chung và khóa cửa an toàn.</li>
              </ul>
           </div>
        </div>

        <div class="bg-red-50/50 border border-red-100 p-6 rounded-3xl flex items-start gap-4 shadow-sm">
           <div class="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
              <span class="material-symbols-outlined text-[24px]">gavel</span>
           </div>
           <div>
              <h3 class="text-sm font-black text-red-900 mb-2 uppercase tracking-wide">Khung hình phạt lũy tiến</h3>
              <div class="flex flex-wrap gap-2 text-xs font-bold text-red-700 mt-2">
                 <span class="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-red-100">Lần 1: 200k</span>
                 <span class="material-symbols-outlined text-red-300">arrow_forward</span>
                 <span class="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-red-100">Lần 2: 500k</span>
                 <span class="material-symbols-outlined text-red-300">arrow_forward</span>
                 <span class="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-red-100">Lần 3: 1 Triệu</span>
                 <span class="material-symbols-outlined text-red-300">arrow_forward</span>
                 <span class="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-red-100 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">warning</span> Chấm dứt HĐLĐ</span>
              </div>
              <p class="text-xs text-red-600 mt-3 italic">* Nếu gây thiệt hại cháy nổ, thiết bị... phải bồi thường 100%.</p>
           </div>
        </div>
      </div>
    `
  },
  {
    title: 'Quy định làm việc Online (WFH)',
    slug: 'quy-dinh-lam-viec-online',
    category: 'hr',
    icon: 'home_work',
    excerpt: 'Điều kiện và quy trình báo cáo khi làm việc từ xa (Work From Home).',
    file: 'Quy định Số 0825QyĐ NS Đăng ký làm online.pdf',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 policy-slides">
        <div class="bg-cyan-50/50 border border-cyan-100 p-6 rounded-3xl shadow-sm md:col-span-2 hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-cyan-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">rule_folder</span> Phân loại hình thức WFH</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
               <strong class="text-slate-800 text-sm block mb-1">WFH Bắt buộc (Công ty yêu cầu)</strong>
               <p class="text-xs text-slate-600">Do thiên tai, sự cố văn phòng. Hưởng 100% lương tiêu chuẩn.</p>
             </div>
             <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
               <strong class="text-slate-800 text-sm block mb-1">WFH Cá nhân</strong>
               <p class="text-xs text-slate-600">Cần lý do chính đáng, duyệt trước. Không áp dụng cho lễ tân, bảo vệ, tiếp khách.</p>
             </div>
          </div>
        </div>
        
        <div class="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-slate-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">fact_check</span> Quy trình đăng ký</h3>
          <ul class="space-y-3 text-sm text-slate-600">
              <li class="flex gap-2"><span class="material-symbols-outlined text-[18px] text-primary">edit_calendar</span> Đăng ký trên LarkSuite trước ≥ 1 ngày.</li>
              <li class="flex gap-2"><span class="material-symbols-outlined text-[18px] text-primary">verified_user</span> WFH 1 ngày cần Trưởng khu vực + HCNS duyệt. Dài hơn cần GĐ duyệt.</li>
              <li class="flex gap-2"><span class="material-symbols-outlined text-[18px] text-primary">assignment_turned_in</span> Phải báo cáo công việc trên hệ thống trước 21h00 cùng ngày.</li>
          </ul>
        </div>
        
        <div class="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-lg font-black text-slate-800 mb-3 flex items-center gap-2"><span class="material-symbols-outlined">checklist</span> Tiêu chí Đánh giá</h3>
          <ul class="space-y-3 text-sm text-slate-600 list-disc list-inside">
              <li>Hoàn thành <strong>&ge; 90%</strong> tiến độ: Hưởng đủ 1 công.</li>
              <li>Hoàn thành <strong>&lt; 90%</strong>: Chỉ tính 0.5 công hoặc trừ phép.</li>
              <li><strong class="text-red-500">Vi phạm quy trình:</strong> Không báo cáo thì ghi nhận 0 công ngày đó.</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    title: 'Quy định Đăng ký làm Ngoài giờ/Lễ Tết',
    slug: 'quy-dinh-lam-ngoai-gio',
    category: 'hr',
    icon: 'more_time',
    excerpt: 'Quy trình ở lại văn phòng ngoài giờ hành chính hoặc làm việc dịp Lễ, Tết.',
    file: 'Qyd0126Net Đăng ký làm việc ngoài giờ và các ngày nghỉ lễ, tết.pdf',
    content: `
      <div class="space-y-6 policy-slides">
        <div class="bg-indigo-900 border border-indigo-800 p-6 rounded-3xl text-white shadow-xl flex items-center justify-between gap-4">
           <div>
              <h3 class="text-lg font-black mb-1 flex items-center gap-2"><span class="material-symbols-outlined">alarm</span> Khung thời gian yêu cầu</h3>
              <p class="text-sm text-indigo-200">Bắt buộc phải tạo quy trình đăng ký nếu làm việc sau <strong>20h00</strong> ngày thường hoặc làm việc bất kỳ giờ nào vào thứ 7, Chủ nhật, Lễ, Tết.</p>
           </div>
           <span class="material-symbols-outlined text-6xl text-indigo-700 opacity-50">nightlight</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <h4 class="text-sm font-black text-slate-800 mb-3 uppercase tracking-wide">Hạn chót đăng ký (Trên Lark)</h4>
              <ul class="space-y-2 text-sm text-slate-600">
                 <li class="flex items-center gap-2 justify-between border-b border-slate-50 pb-2">
                    <span>Ngày thường (sau 20h):</span>
                    <strong class="text-primary font-mono bg-primary/10 px-2 py-1 rounded">Trước 18h00</strong>
                 </li>
                 <li class="flex items-center gap-2 justify-between pt-1">
                    <span>Thứ 7, CN, Lễ, Tết:</span>
                    <strong class="text-primary font-mono bg-primary/10 px-2 py-1 rounded">Trước 08h00 sáng</strong>
                 </li>
              </ul>
           </div>
           
           <div class="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <h4 class="text-sm font-black text-slate-800 mb-3 uppercase tracking-wide">Giới hạn thời gian</h4>
              <p class="text-sm text-slate-600 leading-relaxed mb-2">Chỉ được duyệt làm ngoài giờ tối đa đến <strong>23h00</strong> mỗi ngày.</p>
              <div class="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl flex items-start gap-2 border border-red-100">
                 <span class="material-symbols-outlined text-[16px]">gavel</span>
                 Nghiêm cấm ngủ lại qua đêm dưới mọi hình thức, trừ khi được TGĐ phê duyệt đặc biệt.
              </div>
           </div>
        </div>
      </div>
    `
  }
];

async function run() {
  console.log('Using Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Yes' : 'No');
  
  for (const p of policies) {
    const filePath = path.join(dataPath, p.file);
    if (!fs.existsSync(filePath)) {
      console.warn('File not found:', filePath);
      continue;
    }

    const fileContent = fs.readFileSync(filePath);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${encodeURIComponent(p.file)}`;

    console.log(`Uploading ${p.file}...`);
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('policies')
      .upload(fileName, fileContent, {
        contentType: p.file.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      continue;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('policies')
      .getPublicUrl(fileName);

    const pdfUrl = publicUrlData.publicUrl;

    console.log(`Upserting policy ${p.title}...`);
    
    // First, check if a policy with this slug exists
    const { data: existing } = await supabase.from('policies').select('*').eq('slug', p.slug).single();

    if (existing) {
       await supabase.from('policies').update({
         title: p.title,
         category: p.category,
         icon: p.icon,
         excerpt: p.excerpt,
         content: p.content,
         pdf_url: pdfUrl,
         updated_at: new Date().toISOString()
       }).eq('id', existing.id);
    } else {
       await supabase.from('policies').insert({
         title: p.title,
         slug: p.slug,
         category: p.category,
         icon: p.icon,
         excerpt: p.excerpt,
         content: p.content,
         pdf_url: pdfUrl,
         published: true
       });
    }

    console.log(`Done ${p.title}`);
  }
}

run().catch(console.error);
