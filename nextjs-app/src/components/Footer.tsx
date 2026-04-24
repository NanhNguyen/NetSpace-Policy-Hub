import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8 relative overflow-hidden" aria-label="Footer">
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mr-48 -mt-48" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="col-span-1">
                        <div className="flex flex-col gap-6">
                            <Logo className="w-56 h-14" hideText={true} useImage={true} />
                            <div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[12px] font-black text-primary uppercase tracking-[0.3em] mt-1.5">Policy Hub</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-xs font-medium mt-4">
                                    Reshaping The Future
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="md:pl-8 flex flex-col justify-start pt-2">
                        <h3 className="font-black text-[10px] mb-6 uppercase tracking-[0.2em] text-slate-400">Thông tin liên hệ</h3>
                        <ul className="space-y-4 text-sm font-bold text-slate-600">
                            <li className="flex gap-3">
                                <span className="text-slate-400 min-w-[70px]">Địa chỉ:</span>
                                <span className="text-slate-800 font-medium">Tầng 3, Tòa nhà Mipec, 229 Tây Sơn, Phường Kim Liên, Hà Nội</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-slate-400 min-w-[70px]">Hotline:</span>
                                <span className="text-slate-800 font-medium">0888138888</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-slate-400 min-w-[70px]">Email:</span>
                                <a href="mailto:hr@netspace.vn" className="text-primary hover:underline font-bold">hr@netspace.vn</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bản quyền thuộc về ©2026 NetSpace</p>
                    <div className="flex gap-8">
                        <Link href="/faq" className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">Hỏi đáp</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}


