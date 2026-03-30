const { createClient } = require('@supabase/supabase-js');
const { generateMindMapHtml } = require('./mindmap_generator');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');
const dummyPdfUrl = 'https://xwpkfnzireadfgzcdcbg.supabase.co/storage/v1/object/public/policies/1774842051811-form-commitment-social-media.docx';

async function run() {
  const { data: policies, error: fetchErr } = await supabase.from('policies').select('*');
  if (fetchErr) {
    console.error(fetchErr);
    return;
  }

  for (const p of policies) {
    let leftNodes = [
      {title: 'Điều kiện bắt buộc', desc: 'Có sự đồng ý của quản lý trực tiếp.'},
      {title: 'Đối tượng áp dụng', desc: 'Toàn thể nhân sự đã qua thử việc.'},
      {title: 'Xử lý vi phạm', desc: 'Cảnh cáo lần 1, phạt quỹ lần 2.'}
    ];
    let rightNodes = [
      {title: 'Quy định cốt lõi', desc: 'Tuân thủ giờ giấc và tác phong chuyên nghiệp.'},
      {title: 'Quyền lợi chung', desc: 'Đảm bảo môi trường mở, hỗ trợ y tế cơ bản.'},
      {title: 'Hướng dẫn cụ thể', desc: 'Điền form LarkSuite trước 24H.'}
    ];
    
    if (p.slug.includes('thai-san')) {
      leftNodes = [
        {title: 'Nghỉ 6 tháng đủ lương', desc: 'Hưởng 100% lương theo chế độ bảo hiểm.'},
        {title: 'Phụ cấp 3.000.000 VNĐ', desc: 'Trợ cấp 1 lần vào tháng sinh con.'},
        {title: 'Quà tặng chào mừng', desc: 'Bộ đồ sơ sinh từ công đoàn.'}
      ];
      rightNodes = [
        {title: 'Làm việc linh hoạt bù', desc: 'Sau 6 tháng, có thể WFH 100% linh động.'},
        {title: 'Đi làm trễ tối đa 2H', desc: 'Cho phép đi muộn 2H/ngày để vắt sữa.'},
        {title: 'Không cần tăng ca', desc: 'Miễn trừ OT/Deadline gấp mùa cam gắt.'}
      ];
    } else if (p.slug.includes('tai-khoan-truyen-thong')) {
      leftNodes = [
        {title: 'Tài sản NetSpace', desc: 'Tài khoản MXH dùng cho CV thuộc về cty.'},
        {title: 'Danh sách 10 KHÔNG', desc: 'Không công kích cá nhân, tiết lộ mật...'},
        {title: 'Bắt buộc Email CC', desc: 'Mọi đăng ký phải báo cáo về quản lý.'}
      ];
      rightNodes = [
        {title: 'Bảo mật 2FA', desc: 'Bật xác thực đa lớp bảo vệ thương hiệu.'},
        {title: 'Đổi Pass 3 tháng/lần', desc: 'Mật khẩu phải phức tạp (Kèm chữ/số/ký tự).'},
        {title: 'Bàn giao khi Offboard', desc: 'Bàn giao toàn bộ quyền trước 3 ngày.'}
      ];
    } else if (p.slug.includes('giai-tu-khoe')) {
      leftNodes = [
        {title: 'Mức Khởi Khởi (500K)', desc: 'Vượt KPI ≥ 120%, hỗ trợ đồng đội.'},
        {title: 'Mức Đột Phá (1 Triệu)', desc: 'KPI 140%, tạo ra quy trình làm tự động.'},
        {title: 'Mức Xuất Sắc (2 Triệu+)', desc: 'Cứu vãn khủng hoảng cực lón.'}
      ];
      rightNodes = [
        {title: 'Làm gương truyền lửa', desc: 'Chia sẻ kiến thức vào Box Chat chung.'},
        {title: 'Đề xuất sáng kiến', desc: 'Minh chứng rõ ràng qua Email cho HR.'},
        {title: 'Bảo vệ Fanpage', desc: 'Xử lý các đánh giá xấu khéo léo.'}
      ];
    } else if (p.slug.includes('chuoi-xanh')) {
      leftNodes = [
        {title: 'Đối tượng: Trễ Deadline', desc: 'Làm kéo lùi quy trình của dự án.'},
        {title: 'Đối tượng: Lười nhắc', desc: 'Gặp lỗi cũ không kiểm tra kỹ.'},
        {title: 'Cấm: Mỉa mai mổ xẻ', desc: 'Chỉ nhắc nhở vui, cấm dìm hàng.'}
      ];
      rightNodes = [
        {title: 'Trao Chuối Xanh', desc: 'Để trên bàn để nhắc nhở ngầm.'},
        {title: 'Chuối Chín', desc: 'Khi chuối chín phải mua chè mời ae.'},
        {title: 'Nhận thức tích cực', desc: 'Sai thì sửa, hứa không phạm lại.'}
      ];
    } else if (p.slug.includes('lam-viec-online')) {
      leftNodes = [
        {title: 'Hoàn thành tiến độ', desc: 'Phải đảm bảo ≥ 90% khối lượng ngày.'},
        {title: 'Luôn mở điện thoại', desc: 'Bắt máy, trả lời tin nhắn Lark trước 15p.'},
        {title: 'WFH Bắt buộc', desc: 'Lý do thiên tai, dịch bệnh thì 100% lương.'}
      ];
      rightNodes = [
        {title: 'Đăng ký LarkSuite', desc: 'Bắt buộc trước 1 ngày xin approval.'},
        {title: 'Báo cáo lúc 21h', desc: 'Không báo cáo coi như không làm.'},
        {title: 'Trễ KPI lặp lại', desc: 'Sẽ bị thu hồi đặc quyền WFH.'}
      ];
    }

    const titleUpper = p.title.toUpperCase();
    let contentHtml = generateMindMapHtml(titleUpper, leftNodes, rightNodes);

    if (p.content && p.content.includes('policy-slides')) {
        const divider = `<div class="my-10 pt-8 border-t border-slate-100 flex items-center justify-center relative">
          <div class="px-6 py-2 bg-slate-100 rounded-full text-xs font-black tracking-widest text-slate-400 uppercase shadow-inner z-10 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-slate-300"></span>
            Chi tiết các quy định bên dưới
            <span class="w-2 h-2 rounded-full bg-slate-300"></span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-50"></div>
        </div>`;
        
        let oldContent = '';
        const indexGrid = p.content.indexOf('<div class="grid policy-slides');
        const indexSpace = p.content.indexOf('<div class="space-y-6 policy-slides');
        const startIndex = Math.max(indexGrid, indexSpace);
        
        if (startIndex !== -1) {
            oldContent = p.content.substring(startIndex);
            contentHtml = contentHtml + divider + oldContent;
        } else {
            // fallback if string exact match not found
            contentHtml = contentHtml + divider + p.content;
        }
    }
    
    const { error } = await supabase.from('policies')
      .update({
        content: contentHtml,
        pdf_url: p.pdf_url || dummyPdfUrl
      })
      .eq('id', p.id);
      
    if (error) console.error('Error updating', p.title, error);
    else console.log('Updated with REAL MINDMAP details', p.title);
  }
}

run().catch(console.error);
