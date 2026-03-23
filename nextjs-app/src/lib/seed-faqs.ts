import { FAQService } from "@/lib/services/faq.service";

const initialFaqs = [
    {
        question: "Tôi muốn làm việc online, cần đăng ký như thế nào?",
        answer: "Đăng ký qua LarkSuite tại mục 'Đăng ký làm việc online' ít nhất 01 ngày trước. Sau đó chờ phê duyệt từ Trưởng bộ phận và Phòng HCNS. Tuyệt đối không tự ý làm online khi chưa được duyệt.",
        category: "Nhân sự",
        order_index: 1,
        published: true
    },
    {
        question: "Làm thêm tối nay sau 20h có cần đăng ký không?",
        answer: "Có. Bắt buộc đăng ký qua LarkSuite trước 18:00 cùng ngày. Nếu không đăng ký, thời gian OT sẽ không được tính và bạn vi phạm nội quy.",
        category: "Nhân sự",
        order_index: 2,
        published: true
    },
    {
        question: "Những ngày nào phải mặc đồng phục?",
        answer: "Thứ Hai và Thứ Sáu hàng tuần. Ngoài ra khi có thông báo sự kiện đặc biệt. Ngoại lệ: thời tiết dưới 20°C không bắt buộc.",
        category: "Nội quy Công sở",
        order_index: 3,
        published: true
    },
    {
        question: "Nếu tôi quên tắt máy tính trước khi về sẽ bị phạt bao nhiêu?",
        answer: "Lần 1: Nhắc nhở. Lần 2: Phạt 50.000 VNĐ/thiết bị bị để bật. Lần 3 trở lên: Phạt 100.000 VNĐ/thiết bị. Nếu phát hiện vi phạm, người phát hiện chụp ảnh gửi về hcns@netspace.vn.",
        category: "Nội quy Công sở",
        order_index: 4,
        published: true
    },
    {
        question: "Bao lâu phải đổi mật khẩu tài khoản mạng xã hội?",
        answer: "Ít nhất 6 tháng/lần. Tài khoản hệ thống nội bộ phải đổi mỗi 90 ngày. Bắt buộc kích hoạt xác thực 2 lớp (2FA) cho tất cả tài khoản Công ty.",
        category: "IT & Bảo mật",
        order_index: 5,
        published: true
    },
    {
        question: "Tôi được thưởng bao nhiêu nếu giới thiệu người vào NetSpace?",
        answer: "Mức thưởng: Nhân viên/Chuyên viên: 1–2 triệu. Trưởng nhóm/Phó phòng: 3–5 triệu. Trưởng phòng/Quản lý: 6–10 triệu VNĐ. Điều kiện: ứng viên vượt thử việc và ký HĐ chính thức.",
        category: "Nhân sự",
        order_index: 6,
        published: true
    },
    {
        question: "Tôi có bao nhiêu ngày phép năm?",
        answer: "Dưới 1 năm: 12 ngày. Từ 1–3 năm: 14 ngày. Từ 3–5 năm: 16 ngày. Trên 5 năm: 18 ngày. Phép cộng dồn theo tháng làm việc thực tế.",
        category: "Nghỉ phép & Phúc lợi",
        order_index: 7,
        published: true
    }
];

export async function seedFaqs() {
    console.log("Starting to seed FAQs...");
    for (const faq of initialFaqs) {
        try {
            await FAQService.create(faq);
            console.log(`Added FAQ: ${faq.question}`);
        } catch (e) {
            console.error(`Failed to add FAQ: ${faq.question}`, e);
        }
    }
    console.log("Seeding complete.");
}
