# NetSpace Policy Hub 🛡️

**NetSpace Policy Hub** là một nền tảng tập trung giúp nhân viên NetSpace tra cứu mọi chính sách, nội quy và hướng dẫn công ty một cách nhanh chóng, chính xác và chuyên nghiệp.

Ứng dụng được xây dựng với mục tiêu "Tìm thấy chính sách trong 3 giây", giúp tối ưu hóa quy trình truyền thông nội bộ và hỗ trợ nhân sự (HR).

---

## ✨ Tính năng chính

- 🔍 **Tìm kiếm Thông minh:** Thanh tìm kiếm mạnh mẽ ngay tại Hero section, hỗ trợ tìm theo tên hoặc từ khóa chính sách.
- 📂 **Phân loại Danh mục:** Chính sách được nhóm theo 6 lĩnh vực chính (Nhân sự, Nghỉ phép, IT & Bảo mật, Tài chính, Nội quy, Phúc lợi).
- 📜 **Đọc Chính sách Chi tiết:** Nội dung trình bày sạch sẽ, có mục lục tự động (TOC), hỗ trợ in ấn và sao chép liên kết nhanh.
- 🕒 **Dòng thời gian Cập nhật:** Theo dõi các thay đổi, bổ sung mới nhất từ bộ phận HR.
- ❓ **FAQ (Câu hỏi thường gặp):** Hệ thống câu hỏi dạng Accordion giúp giải đáp nhanh các thắc mắc phổ biến.
- 💬 **Hỏi HR (HR Support):** Form gửi yêu cầu trực tiếp cho đội ngũ HR tích hợp trên mọi trang.
- 📱 **Responsive Design:** Trải nghiệm mượt mà trên mọi thiết bị (Mobile, Tablet, Desktop).

- 🔐 **Hệ thống Quản trị (Admin):** HR Dashboard để quản lý chính sách (CRUD), theo dõi câu hỏi từ nhân viên và phản hồi Ticket.
- 📊 **Phân tích Tìm kiếm:** Lưu nhật ký tìm kiếm để HR biết nhân viên đang quan tâm điều gì hoặc nội dung nào còn thiếu.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router)
- **Backend:** [NestJS](https://nestjs.com/)
- **Database:** [Supabase / PostgreSQL](https://supabase.com/)
- **Ngôn ngữ:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** Lucide React & Material Symbols

---

## 🚀 Hướng dẫn bắt đầu

### Yêu cầu hệ thống
- Node.js **>= 20.2.1**
- Tài khoản Supabase

### Cài đặt

#### 1. Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
*Lưu ý: Đảm bảo cấu hình `DATABASE_URL` trong `backend/.env`.*

#### 2. Frontend (Next.js)
```bash
cd nextjs-app
npm install
npm run dev
```
*Lưu ý: Frontend sẽ gọi API tại `http://localhost:4000`.*

3. **Thiết lập Database:**
Copy nội dung file `setup.sql` vào **SQL Editor** trong bảng điều khiển Supabase của bạn và chạy để khởi tạo các bảng (`policies`, `tickets`, `faqs`, `search_logs`).

4. Khởi động server phát triển:
```bash
npm run dev
```

### Truy cập
- **Nhân viên:** `http://localhost:3000`
- **HR Admin:** `http://localhost:3000/admin/dashboard`

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt của bạn để xem kết quả.

---

## 📁 Cấu trúc dự án

```text
src/
├── app/              # Next.js App Router (Pages & Layouts)
├── components/       # Các thành phần giao diện dùng chung (Header, Footer, Cards, Modals)
├── lib/              # Dữ liệu tĩnh (data.ts) và các định nghĩa Type
└── globals.css       # Design System và Tailwind config
```

---

## 🎨 Nguyên tắc Thiết kế

- **Màu sắc:** Tông trắng sáng kết hợp với màu Accent xanh ngọc (#84DCC6) mang lại cảm giác chuyên nghiệp và tin cậy.
- **Trải nghiệm:** Tập trung vào tốc độ phản hồi (Search ngay tại trang chủ) và tính đơn giản trong điều hướng.
- **Ngôn ngữ:** 100% nội dung và giao diện sử dụng tiếng Việt chuẩn công sở.

---

© 2026 NetSpace Inc. - Chỉ sử dụng nội bộ.
