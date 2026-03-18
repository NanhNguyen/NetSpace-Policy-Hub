import { FAQService } from "@/lib/services/faq.service";

const initialFaqs = [
    {
        question: "Công ty có hỗ trợ chi phí làm việc từ xa không?",
        answer: "Hiện tại NetSpace hỗ trợ 500.000 VNĐ/tháng cho các nhân sự làm việc remote toàn thời gian để trang trải chi phí Internet và điện năng.",
        category: "Chế độ & Phúc lợi",
        order_index: 1,
        published: true
    },
    {
        question: "Làm thế nào để đăng ký nghỉ phép năm?",
        answer: "Nhân viên cần đăng ký trên hệ thống quản lý nhân sự ít nhất 3 ngày trước ngày nghỉ. Đối với kỳ nghỉ dài trên 5 ngày, vui lòng thông báo trước 2 tuần.",
        category: "Nhân sự",
        order_index: 2,
        published: true
    },
    {
        question: "Quy định về trang phục (Dresscode) tại văn phòng như thế nào?",
        answer: "Công ty khuyến khích trang phục lịch sự, gọn gàng. Riêng thứ 2 hằng tuần toàn bộ nhân viên mặc đồng phục áo thun NetSpace.",
        category: "Nội quy",
        order_index: 3,
        published: true
    },
    {
        question: "Thời gian làm việc chính thức của công ty là lúc mấy giờ?",
        answer: "Thời gian làm việc từ 08:30 đến 17:30, từ thứ 2 đến thứ 6. Nghỉ trưa từ 12:00 đến 13:00.",
        category: "Nội quy",
        order_index: 4,
        published: true
    },
    {
        question: "Lương hằng tháng được quyết toán vào ngày nào?",
        answer: "Lương được chuyển khoản vào ngày 05 hằng tháng. Nếu ngày 05 rơi vào cuối tuần hoặc ngày lễ, lương sẽ được phát vào ngày làm việc trước đó.",
        category: "Tài chính",
        order_index: 5,
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
