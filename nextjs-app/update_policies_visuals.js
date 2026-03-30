const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');

const policies = [
  {
    slug: 'quy-dinh-quan-ly-tai-khoan-truyen-thong-so',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-[2rem] border border-blue-200 shadow-sm hover:shadow-md transition-all">
          <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
             <span class="material-symbols-outlined">shield_person</span>
          </div>
          <h3 class="text-lg font-black text-blue-900 mb-2">Quyền Sở Hữu</h3>
          <ul class="space-y-2 text-sm text-slate-700">
              <li class="flex gap-2"><span class="text-blue-500">✓</span> 100% tài sản thuộc Công ty.</li>
              <li class="flex gap-2"><span class="text-blue-500">✓</span> Bắt buộc làm <strong>Bản Cam Kết</strong>.</li>
          </ul>
        </div>

        <div class="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-[2rem] border border-emerald-200 shadow-sm hover:shadow-md transition-all">
          <div class="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-200">
             <span class="material-symbols-outlined">lock</span>
          </div>
          <h3 class="text-lg font-black text-emerald-900 mb-2">An Toàn Bảo Mật</h3>
          <ul class="space-y-2 text-sm text-slate-700">
              <li class="flex gap-2"><span class="text-emerald-500">🛡️</span> Đổi mật khẩu <strong>3 tháng/lần</strong>.</li>
              <li class="flex gap-2"><span class="text-emerald-500">🛡️</span> Bắt buộc bật <strong>2FA</strong> (Xác thực 2 lớp).</li>
              <li class="flex gap-2"><span class="text-emerald-500">🛡️</span> Dùng email công ty đăng ký.</li>
          </ul>
        </div>

        <div class="bg-gradient-to-br from-red-50 to-red-100/50 p-6 rounded-[2rem] border border-red-200 shadow-sm hover:shadow-md transition-all md:col-span-2 flex flex-col items-center text-center">
          <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-red-200">
             <span class="material-symbols-outlined">block</span>
          </div>
          <h3 class="text-lg font-black text-red-900 mb-2">Hành Vi Nghiêm Cấm</h3>
          <div class="flex flex-wrap justify-center gap-2 text-xs font-bold text-red-700 mt-2">
             <span class="bg-white px-3 py-1.5 rounded-full border border-red-100 shadow-sm">Mục đích cá nhân/chính trị</span>
             <span class="bg-white px-3 py-1.5 rounded-full border border-red-100 shadow-sm">Nói xấu/Chửi bậy</span>
             <span class="bg-white px-3 py-1.5 rounded-full border border-red-100 shadow-sm">Lộ bí mật công ty</span>
             <span class="bg-white px-3 py-1.5 rounded-full border border-red-100 shadow-sm">Đăng bài không duyệt</span>
          </div>
        </div>
      </div>
    `
  },
  {
    slug: 'co-che-cong-tac-vien-kinh-doanh',
    content: `
      <div class="space-y-6">
        <div class="flex items-center gap-4 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
          <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
             <span class="material-symbols-outlined">group_add</span>
          </div>
          <div>
            <h3 class="font-black text-indigo-900">Mục đích</h3>
            <p class="text-sm text-slate-600">Mở rộng mạng lưới kinh doanh qua cá nhân/tổ chức bên ngoài.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div class="bg-white p-6 rounded-[2rem] border-2 border-slate-100 text-center hover:border-indigo-300 transition-colors">
              <span class="material-symbols-outlined text-4xl text-slate-400 mb-2">record_voice_over</span>
              <h4 class="font-black text-slate-800 mb-1">Dạng 1: Giới thiệu</h4>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Chỉ cần kết nối</p>
              <div class="text-4xl font-black text-indigo-600">6%</div>
              <p class="text-xs text-slate-500 mt-2">Tổng lợi nhuận thu về</p>
           </div>
           
           <div class="bg-white p-6 rounded-[2rem] border-2 border-slate-100 text-center hover:border-rose-300 transition-colors">
              <span class="material-symbols-outlined text-4xl text-rose-400 mb-2">handshake</span>
              <h4 class="font-black text-slate-800 mb-1">Dạng 2: Tự đàm phán</h4>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Triển khai từ A-Z</p>
              <div class="text-4xl font-black text-rose-600">10% - 30%</div>
              <p class="text-xs text-slate-500 mt-2">Tuỳ giá trị và loại hợp đồng</p>
           </div>
        </div>
        
        <div class="text-center text-sm font-medium text-slate-500 italic mt-4">
           * Hoa hồng chi trả sau khi khách hàng hoàn tất công nợ.
        </div>
      </div>
    `
  },
  {
    slug: 'co-che-gioi-thieu-nhan-su',
    content: `
      <div class="flex flex-col gap-6 items-center">
         <div class="text-center max-w-lg">
            <span class="material-symbols-outlined text-5xl text-teal-500 mb-2">redeem</span>
            <h3 class="text-xl font-black text-slate-800 mb-2">Chương Trình Giới Thiệu Cấp Tốc</h3>
            <p class="text-sm text-slate-600">Không áp dụng cho phòng HCNS và Quản lý trực tiếp. Nhận thưởng khi ứng viên ký HĐLĐ chính thức.</p>
         </div>

         <div class="w-full flex flex-col gap-3">
            <div class="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-amber-500 text-3xl">star</span>
                  <div>
                    <h4 class="font-black text-slate-800">Quản lý / Trưởng phòng</h4>
                    <span class="text-xs text-slate-500">Nhân sự cấp cao</span>
                  </div>
               </div>
               <div class="font-black text-lg text-teal-600 bg-teal-50 px-4 py-2 rounded-xl">6M - 10M</div>
            </div>

            <div class="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-sky-500 text-3xl">badge</span>
                  <div>
                    <h4 class="font-black text-slate-800">Phó phòng / Trưởng nhóm</h4>
                    <span class="text-xs text-slate-500">Nhân sự Cấp trung</span>
                  </div>
               </div>
               <div class="font-black text-lg text-sky-600 bg-sky-50 px-4 py-2 rounded-xl">3M - 5M</div>
            </div>

            <div class="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-slate-400 text-3xl">person</span>
                  <div>
                    <h4 class="font-black text-slate-800">Chính thức / Chuyên viên</h4>
                    <span class="text-xs text-slate-500">Nhân sự Tiêu chuẩn</span>
                  </div>
               </div>
               <div class="font-black text-lg text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">1M - 2M</div>
            </div>
         </div>
      </div>
    `
  },
  {
    slug: 'quy-dinh-giai-chuoi-xanh',
    content: `
      <div class="flex flex-col items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-green-50 p-8 rounded-[3rem] border border-green-200 text-center relative overflow-hidden">
         <span class="text-8xl absolute top-4 left-4 opacity-10 rotate-[-15deg]">🍌</span>
         <span class="text-8xl absolute bottom-4 right-4 opacity-10 rotate-[15deg]">🍌</span>
         
         <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-xl mb-6 relative z-10">🍌</div>
         <h2 class="text-3xl font-black text-green-900 mb-2 relative z-10">GIẢI CHUỐI XANH</h2>
         <p class="text-sm text-green-700 font-bold mb-8 max-w-sm relative z-10">Giải thưởng cống hiến cho những "Sự Cố" không đáng có!</p>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full relative z-10 text-left">
            <div class="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-green-100">
               <h4 class="font-black text-slate-800 text-sm mb-3 uppercase tracking-widest text-red-500 flex items-center gap-2">
                 <span class="material-symbols-outlined text-[18px]">warning</span> Lý do nhận giải
               </h4>
               <ul class="text-sm text-slate-700 space-y-2">
                 <li>• Trễ deadline, rớt KPI.</li>
                 <li>• Đi làm muộn, ngủ gật.</li>
                 <li>• Quên đeo thẻ, làm mất trật tự.</li>
               </ul>
            </div>
            <div class="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-green-100">
               <h4 class="font-black text-slate-800 text-sm mb-3 uppercase tracking-widest text-green-600 flex items-center gap-2">
                 <span class="material-symbols-outlined text-[18px]">card_giftcard</span> Nhận giải làm gì?
               </h4>
               <p class="text-sm text-slate-700">"Chuối Xanh" sẽ được cắm tại bàn. <strong>Khi chuối chín</strong>, người nhận giải phải mua đồ ăn liên hoan mời team.</p>
               <p class="text-[10px] text-red-500 font-bold mt-2 uppercase">* Không mang tính mỉa mai, chỉ mua vui, đóng góp quỹ vui vẻ!</p>
            </div>
         </div>
      </div>
    `
  },
  {
    slug: 'quy-dinh-giai-tu-khoe',
    content: `
      <div class="space-y-6">
        <div class="text-center">
           <span class="material-symbols-outlined text-6xl text-amber-500 mb-2">local_fire_department</span>
           <h3 class="text-2xl font-black text-slate-900">GIẢI TỰ KHOE</h3>
           <p class="text-sm text-slate-500 mt-1">Đừng ngại khoe chiến tích. NetSpace thưởng liền tay!</p>
        </div>
        
        <div class="flex flex-col gap-4">
           <!-- Level 1 -->
           <div class="bg-gradient-to-r from-yellow-50 to-white flex items-center p-4 rounded-3xl border border-yellow-200">
              <div class="w-20 font-black text-2xl text-amber-600 text-center flex-shrink-0">500K</div>
              <div class="h-10 w-[1px] bg-yellow-200 mx-4"></div>
              <div>
                <h4 class="font-black text-sm text-slate-800">Mức Khởi Khởi</h4>
                <p class="text-xs text-slate-600 mt-1">Vượt KPI &ge; 120%, hoặc hỗ trợ đồng nghiệp quá xuất sắc.</p>
              </div>
           </div>

           <!-- Level 2 -->
           <div class="bg-gradient-to-r from-amber-100/50 to-white flex items-center p-4 rounded-3xl border border-amber-200">
              <div class="w-20 font-black text-2xl text-amber-700 text-center flex-shrink-0">1M</div>
              <div class="h-10 w-[1px] bg-amber-200 mx-4"></div>
              <div>
                <h4 class="font-black text-sm text-slate-800">Mức Đột Phá</h4>
                <p class="text-xs text-slate-600 mt-1">Vượt KPI &ge; 140%, tối ưu cực mượt quy trình làm việc.</p>
              </div>
           </div>

           <!-- Level 3 -->
           <div class="bg-gradient-to-r from-orange-100 to-white flex items-center p-4 rounded-3xl border border-orange-200 shadow-sm relative overflow-hidden">
              <div class="absolute right-[-10px] top-[-10px] bg-red-500 text-white text-[9px] font-black uppercase px-4 py-1 rotate-[45deg]">Max</div>
              <div class="w-20 font-black text-2xl text-orange-600 text-center flex-shrink-0">2M+</div>
              <div class="h-10 w-[1px] bg-orange-200 mx-4"></div>
              <div>
                <h4 class="font-black text-sm text-slate-800">Mức Vượt Trội</h4>
                <p class="text-xs text-slate-600 mt-1">Cứu nguy công ty, mang về doanh thu lớn, sáng kiến cấp độ giám đốc.</p>
              </div>
           </div>
        </div>
      </div>
    `
  },
  {
    slug: 'quy-dinh-dong-phuc',
    content: `
      <div class="grid grid-cols-2 gap-4 text-center">
         <div class="col-span-2 bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
            <span class="material-symbols-outlined text-8xl absolute right-[-10px] bottom-[-20px] opacity-10">laundry</span>
            <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Thứ bắt buộc mặc vào</div>
            <div class="text-3xl font-black mb-1">THỨ 2 & THỨ 6</div>
            <p class="text-sm text-slate-300">Ngoại trừ nhiệt độ ngoài trời <strong>&lt; 20°C</strong></p>
         </div>

         <div class="bg-white p-5 rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center">
            <div class="text-2xl mb-2">👕</div>
            <h4 class="font-black text-sm text-slate-800">Được Cấp Lần Đầu</h4>
            <p class="text-xs text-slate-500 mt-1 border-t border-slate-50 pt-2 w-full">Thử việc: <strong>1 áo</strong><br/>Chính thức: <strong>2 áo</strong></p>
         </div>

         <div class="bg-red-50 p-5 rounded-3xl border-2 border-red-100 flex flex-col items-center justify-center">
            <div class="text-2xl mb-2 text-red-500"><span class="material-symbols-outlined">money_off</span></div>
            <h4 class="font-black text-sm text-red-800">Quy Định Phạt</h4>
            <p class="text-xs text-red-600 mt-1 border-t border-red-100 pt-2 w-full">Quên mặc/Mặc sai:<br/><strong>- 100K / lần</strong></p>
         </div>
      </div>
    `
  },
  {
    slug: 'quy-dinh-kiem-tra-thiet-bi-don-dep',
    content: `
      <div class="space-y-4">
        <h3 class="text-center font-black text-xl text-slate-800 mb-6 flex items-center justify-center gap-2">
           <span class="material-symbols-outlined text-primary">power_settings_new</span> Tắt Điện, Tắt Máy, Tắt Nguy Cơ
        </h3>
        
        <div class="flex gap-4">
           <div class="w-1/2 bg-blue-50 border border-blue-100 p-5 rounded-3xl flex flex-col">
              <span class="material-symbols-outlined text-blue-500 text-3xl mb-3">person</span>
              <h4 class="font-black text-sm text-blue-900 mb-2">Trách nhiệm cá nhân</h4>
              <p class="text-xs text-slate-600 flex-1">Dọn bàn sạch sẽ, đẩy ghế vào gầm. Tắt laptop và thiết bị khu vực mình.</p>
           </div>
           
           <div class="w-1/2 bg-indigo-50 border border-indigo-100 p-5 rounded-3xl flex flex-col">
              <span class="material-symbols-outlined text-indigo-500 text-3xl mb-3">group</span>
              <h4 class="font-black text-sm text-indigo-900 mb-2">Người về cuối cùng</h4>
              <p class="text-xs text-slate-600 flex-1">Đi dạo 1 vòng quanh văn phòng. Tắt máy lạnh, đèn, khóa cửa cẩn thận.</p>
           </div>
        </div>

        <div class="mt-4 bg-white border border-red-200 rounded-3xl p-5 relative overflow-hidden">
           <div class="absolute w-1 h-full bg-red-500 left-0 top-0"></div>
           <h4 class="font-black text-sm text-slate-800 mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-red-500 text-[18px]">receipt_long</span> Bảng Phạt Vi Phạm Không Tắt Thiết Bị
           </h4>
           <div class="flex justify-between items-center text-xs font-bold text-slate-600 text-center">
              <div class="bg-red-50 text-red-700 p-2 rounded-xl flex-1">Lần 1<br/>200K</div>
              <div class="px-2 text-slate-300">»</div>
              <div class="bg-red-50 text-red-700 p-2 rounded-xl flex-1">Lần 2<br/>500K</div>
              <div class="px-2 text-slate-300">»</div>
              <div class="bg-red-50 text-red-700 p-2 rounded-xl flex-1">Lần 3<br/>1 TRIỆU</div>
           </div>
        </div>
      </div>
    `
  },
  {
    slug: 'quy-dinh-lam-viec-online',
    content: `
      <div class="flex flex-col gap-6">
        <div class="bg-cyan-900 text-white p-6 rounded-[2rem] text-center shadow-xl">
           <h3 class="font-black text-xl mb-1">WORK FROM HOME (WFH)</h3>
           <p class="text-xs text-cyan-200 uppercase tracking-widest">Đăng ký đúng - Báo cáo đủ</p>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center text-xs font-bold max-w-sm mx-auto w-full">
           <div class="bg-slate-50 py-3 rounded-2xl">Đăng ký trước<br/><span class="text-lg text-primary">1 ngày</span></div>
           <div class="bg-slate-50 py-3 rounded-2xl">Báo cáo trước<br/><span class="text-lg text-primary">21h00</span></div>
           <div class="bg-slate-50 py-3 rounded-2xl">Kết quả KPI<br/><span class="text-lg text-primary">&ge; 90%</span></div>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-slate-200">
           <h4 class="font-black text-sm text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
             <span class="material-symbols-outlined text-green-500">checklist</span> Chế độ lương & phê duyệt
           </h4>
           <ul class="text-sm text-slate-600 space-y-3">
              <li class="flex items-start gap-2">
                 <span class="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">how_to_reg</span>
                 <span><strong>Duyệt 1 ngày:</strong> Trưởng BP + HCNS. <strong>&ge; 2 ngày:</strong> Có thêm GĐ duyệt.</span>
              </li>
              <li class="flex items-start gap-2">
                 <span class="material-symbols-outlined text-red-400 text-[18px] mt-0.5">warning</span>
                 <span>Kết quả &lt; 90% hoặc vi phạm: <strong>Cắt nửa công</strong> hoặc duyệt thành ngày Nghỉ Không Lương.</span>
              </li>
           </ul>
        </div>
      </div>
    `
  },
  {
    slug: 'quy-dinh-lam-ngoai-gio',
    content: `
      <div class="space-y-4">
         <div class="bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] bg-slate-900 border border-slate-800 p-6 rounded-[2rem] text-white flex items-center gap-4">
            <div class="bg-white/10 p-4 rounded-full flex-shrink-0">
               <span class="material-symbols-outlined text-3xl">nights_stay</span>
            </div>
            <div>
               <h3 class="text-xl font-black text-white leading-tight">LÀM VIỆC NGOÀI GIỜ (OT)</h3>
               <p class="text-xs text-slate-400 mt-1">Nghiêm cấm tuyệt đối ngủ lại văn phòng.</p>
            </div>
         </div>

         <div class="grid grid-cols-2 gap-4">
            <div class="bg-blue-50/50 border border-blue-100 p-4 rounded-3xl">
               <h4 class="font-black text-xs text-blue-900 mb-1 uppercase">Ngày thường (Sau 20h)</h4>
               <p class="text-xs text-slate-600">Đăng ký trên LarkSuite trước <strong>18H00</strong> cùng ngày.</p>
            </div>
            <div class="bg-orange-50/50 border border-orange-100 p-4 rounded-3xl">
               <h4 class="font-black text-xs text-orange-900 mb-1 uppercase">Thứ 7, CN, Lễ, Tết</h4>
               <p class="text-xs text-slate-600">Đăng ký trên LarkSuite trước <strong>08H00 SÁNG</strong> của ngày làm việc.</p>
            </div>
         </div>

         <div class="bg-red-50 text-red-700 text-sm font-bold p-4 rounded-2xl flex items-center justify-center gap-2 border border-red-200">
            <span class="material-symbols-outlined text-xl">timer_off</span> Tối đa chỉ làm đến 23:00 mỗi ngày!
         </div>
      </div>
    `
  }
];

async function run() {
  for (const p of policies) {
    console.log('Updating DB for:', p.slug);
    const { data, error } = await supabase.from('policies')
      .update({ content: p.content })
      .eq('slug', p.slug);
    
    if (error) {
      console.error('Error:', error);
    }
  }
  console.log('Done visual update.');
}

run().catch(console.error);
