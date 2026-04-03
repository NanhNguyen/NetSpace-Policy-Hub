import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const baseUrl = 'https://xwpkfnzireadfgzcdcbg.supabase.co/storage/v1/object/public/policies/';

const mapping = [
  { slug: 'quy-dinh-quan-ly-tai-khoan-truyen-thong-so', file: '1774840143318-quy-dinh-quan-ly-tai-khoan-truyen-thong-so.pdf' },
  { slug: 'co-che-cong-tac-vien-kinh-doanh', file: '1774840150008-co-che-cong-tac-vien-kinh-doanh.pdf' },
  { slug: 'co-che-gioi-thieu-nhan-su', file: '1774840151677-co-che-gioi-thieu-nhan-su.pdf' },
  { slug: 'quy-dinh-giai-chuoi-xanh', file: '1774840157648-quy-dinh-giai-chuoi-xanh.pdf' },
  { slug: 'quy-dinh-giai-tu-khoe', file: '1774840159174-quy-dinh-giai-tu-khoe.pdf' },
  { slug: 'quy-dinh-dong-phuc', file: '1774840160495-quy-dinh-dong-phuc.docx' },
  { slug: 'quy-dinh-kiem-tra-thiet-bi-don-dep', file: '1774840161273-quy-dinh-kiem-tra-thiet-bi-don-dep.pdf' },
  { slug: 'quy-dinh-lam-viec-online', file: '1774840164578-quy-dinh-lam-viec-online.pdf' },
  { slug: 'quy-dinh-lam-ngoai-gio', file: '1774840172705-quy-dinh-lam-ngoai-gio.pdf' },
];

async function update() {
  console.log("Syncing with Supabase Storage Bucket...");
  for (const item of mapping) {
    const fullUrl = baseUrl + item.file;
    const { error } = await supabase
      .from('policies')
      .update({ pdf_url: fullUrl })
      .eq('slug', item.slug);

    if (error) {
      console.error(`Failed ${item.slug}:`, error.message);
    } else {
      console.log(`Linked ${item.slug} -> Bucket`);
    }
  }
  console.log("Security sync complete.");
  process.exit(0);
}

update();
