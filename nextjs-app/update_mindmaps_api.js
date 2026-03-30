const { generateMindMapHtml } = require('./mindmap_generator');

const dummyPdfUrl = 'https://xwpkfnzireadfgzcdcbg.supabase.co/storage/v1/object/public/policies/1774842051811-form-commitment-social-media.docx';
const API_URL = 'http://localhost:4000/policies';

async function run() {
  const resp = await fetch(API_URL);
  const policies = await resp.json();

  for (const p of policies) {
    let leftNodes = ['Điều kiện bắt buộc', 'Đối tượng áp dụng', 'Hình thức phạt'];
    let rightNodes = ['Quy định chính', 'Lợi ích / Thưởng', 'Thủ tục đăng ký'];
    
    if (p.slug.includes('thai-san')) {
      leftNodes = ['Nghỉ 6 tháng 100% lương', 'Phụ cấp 3 TRIỆU VNĐ', 'Kèm quà tặng'];
      rightNodes = ['Làm việc linh hoạt bù', 'Cho phép WFH sau sinh', 'Trễ giờ tối đa 2H'];
    } else if (p.slug.includes('tai-khoan-truyen-thong')) {
      leftNodes = ['Tài sản công ty 100%', 'Tuân thủ "10 KHÔNG"', 'Dùng Email CC'];
      rightNodes = ['Bảo mật 2FA bắt buộc', 'Đổi Password định kì', 'Bàn giao khi nghỉ'];
    } else if (p.slug.includes('giai-tu-khoe')) {
      leftNodes = ['Thưởng nóng 500K - 2M', 'Vượt KPI ≥ 120%', 'Đóng góp sáng kiến'];
      rightNodes = ['Làm gương tích cực', 'Tối ưu nhanh quy trình', 'Bảo vệ hình ảnh'];
    } else if (p.slug.includes('chuoi-xanh')) {
      leftNodes = ['Trễ Deadline KPI', 'Đi Làm Muộn/Ngủ Gật', 'Vi phạm Nội quy'];
      rightNodes = ['Mua vui tự nguyện', 'Liên hoan nhóm', 'Không dùng mỉa mai'];
    }

    const htmlContent = generateMindMapHtml(p.title.toUpperCase(), leftNodes, rightNodes);
    
    // Update DB via NestJS API
    const updateResp = await fetch(`\${API_URL}/\${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: htmlContent,
        pdf_url: p.pdf_url || dummyPdfUrl
      })
    });
      
    if (!updateResp.ok) {
      console.error('Error updating', p.title, await updateResp.text());
    } else {
      console.log('Updated', p.title, 'with MINDMAP visual and PDF link.');
    }
  }
}

run().catch(console.error);
