require('dotenv').config({ path: '../backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in ../backend/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const policiesMap = [
  { slug: 'quy-dinh-quan-ly-tai-khoan-truyen-thong-so', file: '/policies/Quy định số 0425 - Quy định về quản lý tài khoản truyền thông số của Công ty.pdf' },
  { slug: 'co-che-cong-tac-vien-kinh-doanh', file: '/policies/CƠ CHẾ CTV NETSPACE.pdf' },
  { slug: 'co-che-gioi-thieu-nhan-su', file: '/policies/Cơ chế giới thiệu nhân sự.pdf' },
  { slug: 'quy-dinh-giai-chuoi-xanh', file: '/policies/Giải chuối xanh.pdf' },
  { slug: 'quy-dinh-giai-tu-khoe', file: '/policies/Giải tự khoe.pdf' },
  { slug: 'quy-dinh-dong-phuc', file: '/policies/QĐ 0425 Quy định về mặc áo đồng phục.docx' },
  { slug: 'quy-dinh-kiem-tra-thiet-bi-don-dep', file: '/policies/Quy Định số 0625QyĐ-NS -Kiểm tra, tắt thiết bị và dọn dẹp khu vực làm việc trước khi rời khỏi văn phòng.pdf' },
  { slug: 'quy-dinh-lam-viec-online', file: '/policies/Quy định Số 0825QyĐ NS Đăng ký làm online.pdf' },
  { slug: 'quy-dinh-lam-ngoai-gio', file: '/policies/Qyd0126Net Đăng ký làm việc ngoài giờ và các ngày nghỉ lễ, tết.pdf' },
];

async function updatePdfUrls() {
  console.log("Updating PDF URLs in Supabase...");
  for (const p of policiesMap) {
    const { data, error } = await supabase
      .from('policies')
      .update({ pdf_url: p.file })
      .eq('slug', p.slug);

    if (error) {
      console.error(`Failed to update ${p.slug}:`, error.message);
    } else {
      console.log(`Updated ${p.slug} => ${p.file}`);
    }
  }
  console.log("Done.");
}

updatePdfUrls();
