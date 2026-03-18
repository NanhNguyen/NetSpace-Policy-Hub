import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 py-20 relative overflow-hidden" aria-label="Footer">
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mr-48 -mt-48" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <Logo className="w-10 h-10" hideText={true} />
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tight text-slate-900 leading-none">NetSpace</span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Policy Hub</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs font-medium">
                            Nguồn thông tin chính thức về mọi chính sách nội bộ tại NetSpace. Luôn cập nhật, luôn minh bạch và chính xác.
                        </p>
                    </div>

                    <div className="sm:pl-8">
                        <h3 className="font-black text-[10px] mb-6 uppercase tracking-[0.2em] text-slate-400">Liên hệ hỗ trợ</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link className="text-slate-600 hover:text-primary transition-all flex items-center gap-2 group" href="/faq">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>
                                Trung tâm Hỗ trợ
                            </Link></li>
                            <li><Link className="text-slate-600 hover:text-primary transition-all flex items-center gap-2 group" href="/faq">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>
                                Gửi Yêu cầu mới
                            </Link></li>
                            <li className="pt-1"><a className="text-primary font-black hover:opacity-80 transition-opacity bg-primary/5 px-3 py-2 rounded-lg inline-block" href="mailto:hr@netspace.com.vn">abc@netspace.com</a></li>
                        </ul>
                    </div>

                    <div className="lg:pl-8">
                        <h3 className="font-black text-[10px] mb-6 uppercase tracking-[0.2em] text-slate-400">Tài liệu nội bộ</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link className="text-slate-600 hover:text-primary transition-all flex items-center gap-2 group" href="#">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>
                                Sổ tay Nhân viên
                            </Link></li>
                            <li><Link className="text-slate-600 hover:text-primary transition-all flex items-center gap-2 group" href="#">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>
                                Brand Guidelines
                            </Link></li>
                            <li><Link className="text-slate-600 hover:text-primary transition-all flex items-center gap-2 group" href="#">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>
                                Quy trình Vận hành
                            </Link></li>
                        </ul>
                    </div>

                    <div className="lg:pl-8">
                        <h3 className="font-black text-[10px] mb-6 uppercase tracking-[0.2em] text-slate-400">Khám phá</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link className="text-slate-600 hover:text-primary transition-all flex items-center gap-2 group" href="/policies">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>
                                Tất cả Quy định
                            </Link></li>
                            <li><Link className="text-slate-600 hover:text-primary transition-all flex items-center gap-2 group" href="/categories">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>
                                Chính Sách
                            </Link></li>
                            <li><Link className="text-slate-600 hover:text-primary transition-all flex items-center gap-2 group" href="/updates">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>
                                Cập nhật Mới nhất
                            </Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">© 2026 NetSpace Inc.</p>
                        <span className="w-1 h-1 bg-slate-200 rounded-full hidden md:block"></span>
                        <p className="text-[11px] text-slate-400 font-medium italic">Internal use only — All rights reserved.</p>
                    </div>
                    <div className="flex gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                        <Link className="hover:text-primary transition-colors" href="#">Bảo mật</Link>
                        <Link className="hover:text-primary transition-colors" href="#">Điều khoản</Link>
                        <Link className="hover:text-primary transition-colors" href="#">Dữ liệu</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
