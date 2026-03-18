const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

const policies = [
    {
        id: "remote-work",
        title: "Quy định Làm việc Online (Work From Home)",
        slug: "remote-work",
        category: "hr",
        icon: "home_work",
        excerpt: "Quy trình đăng ký, phê duyệt và báo cáo khi làm việc từ xa qua hệ thống LarkSuite.",
        content: `<h2>1. Mục đích & Phạm vi</h2><p>Quy định này áp dụng cho toàn thể cán bộ nhân viên (CBNV) NetSpace khi có nhu cầu làm việc tại nhà hoặc ngoài văn phòng...</p>`,
        published: true
    },
    {
        id: "overtime-policy",
        title: "Quy định Đăng ký Làm ngoài Giờ & Ngày nghỉ",
        slug: "overtime-policy",
        category: "hr",
        icon: "schedule",
        excerpt: "Quy định làm thêm giờ sau 20h, ngày thứ Bảy, Chủ nhật và các ngày lễ, tết.",
        content: `<h2>1. Các Trường hợp Cần Đăng ký OT</h2><ul><li>Làm việc sau 20:00 các ngày trong tuần.</li></ul>`,
        published: true
    },
    {
        id: "uniform-policy",
        title: "Quy định Mặc Đồng phục Công ty",
        slug: "uniform-policy",
        category: "conduct",
        icon: "checkroom",
        excerpt: "Quy định mặc đồng phục vào Thứ Hai và Thứ Sáu hàng tuần. Mức phạt khi vi phạm.",
        content: `<h2>1. Thời gian Mặc Đồng phục</h2><ul><li>Bắt buộc mặc đồng phục vào Thứ Hai và Thứ Sáu hàng tuần...</li></ul>`,
        published: true
    },
    {
        id: "office-rules",
        title: "Quy định Kiểm tra Thiết bị & Dọn dẹp Văn phòng",
        slug: "office-rules",
        category: "conduct",
        icon: "apartment",
        excerpt: "Trách nhiệm tắt thiết bị, sắp xếp gọn gàng và kiểm tra văn phòng trước khi ra về.",
        content: `<h2>1. Trách nhiệm Trước Khi Ra Về</h2><ul><li>Tắt máy tính, màn hình và tất cả thiết bị điện cá nhân.</li></ul>`,
        published: true
    },
    {
        id: "social-media-policy",
        title: "Quy định Quản lý Tài khoản Truyền thông Số",
        slug: "social-media-policy",
        category: "it",
        icon: "public",
        excerpt: "Tài khoản mạng xã hội là tài sản Công ty. Quy định bảo mật và bàn giao.",
        content: `<h2>1. Quyền Sở hữu Tài khoản</h2><p>Toàn bộ tài khoản mạng xã hội vận hành nhân danh NetSpace đều là tài sản của Công ty...</p>`,
        published: true
    },
    {
        id: "referral-policy",
        title: "Cơ chế Giới thiệu Nhân sự",
        slug: "referral-policy",
        category: "hr",
        icon: "person_add",
        excerpt: "Thưởng từ 1.000.000đ đến 10.000.000đ khi giới thiệu người phù hợp.",
        content: `<h2>1. Mức Thưởng Giới thiệu</h2><ul><li>Nhân viên / Chuyên viên: 1.000.000 – 2.000.000 VNĐ.</li></ul>`,
        published: true
    }
];

async function seed() {
    const client = new Client({
        connectionString: connectionString,
        ssl: false // User mentioned before that SSL might be an issue with pooler
    });

    try {
        await client.connect();
        console.log('Connected to database for seeding policies...');

        for (const p of policies) {
            const query = `
        INSERT INTO policies (title, slug, category, icon, excerpt, content, published, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          icon = EXCLUDED.icon,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          published = EXCLUDED.published,
          updated_at = NOW();
      `;
            const values = [p.title, p.slug, p.category, p.icon, p.excerpt, p.content, p.published];
            await client.query(query, values);
            console.log(`Seeded/Updated policy: ${p.title}`);
        }

        console.log('Seeding completed successfully!');
    } catch (err) {
        console.error('Error seeding policies:', err);
    } finally {
        await client.end();
    }
}

seed();
