import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-neutral-soft py-14" aria-label="Footer">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-primary p-2 rounded-lg">
                                <span className="material-symbols-outlined text-text-main text-[18px]">shield_person</span>
                            </div>
                            <div>
                                <div className="font-extrabold text-base text-text-main">NetSpace</div>
                                <div className="text-xs text-text-muted -mt-0.5">Policy Hub</div>
                            </div>
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Nguồn thông tin chính thức về mọi chính sách nội bộ tại NetSpace. Luôn cập nhật, luôn chính xác.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xs mb-5 uppercase tracking-widest text-text-muted">Liên hệ HR</h3>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="#">Trung tâm Hỗ trợ</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Gửi Yêu cầu</Link></li>
                            <li><a className="text-primary font-bold hover:underline" href="mailto:hr@netspace.com.vn">hr@netspace.com.vn</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-xs mb-5 uppercase tracking-widest text-text-muted">Tài liệu</h3>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="#">Sổ tay Nhân viên</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Bộ nhận diện Thương hiệu</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Sơ đồ Tổ chức</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-xs mb-5 uppercase tracking-widest text-text-muted">Điều hướng</h3>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/policies">Tất cả Chính sách</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/categories">Danh mục</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/updates">Cập nhật Mới</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/faq">FAQ</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-neutral-soft flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-text-muted">© 2026 NetSpace Inc. Chỉ dành cho nội bộ — Mọi quyền được bảo lưu.</p>
                    <div className="flex gap-5 text-xs font-semibold text-text-muted">
                        <Link className="hover:text-primary transition-colors" href="#">Chính sách Bảo mật</Link>
                        <Link className="hover:text-primary transition-colors" href="#">Điều khoản Sử dụng</Link>
                        <Link className="hover:text-primary transition-colors" href="#">Bảo mật Dữ liệu</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
