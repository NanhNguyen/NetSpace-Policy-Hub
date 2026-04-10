import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 py-20 relative overflow-hidden" aria-label="Footer">
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full -mr-48 -mt-48" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="col-span-1">
                        <div className="flex items-center gap-6 mb-6">
                            <Logo className="w-24 h-24" hideText={true} />
                            <div className="flex flex-col justify-center">
                                <span className="font-black text-3xl tracking-tighter text-slate-900 leading-none">NetSpace</span>
                                <span className="text-[14px] font-black text-primary uppercase tracking-[0.3em] mt-2">Policy Hub</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs font-medium">
                            Reshaping The Future
                        </p>
                    </div>

                    <div className="md:pl-8">
                        <h3 className="font-black text-[10px] mb-6 uppercase tracking-[0.2em] text-slate-400">Thông tin liên hệ</h3>
                        <ul className="space-y-4 text-sm font-bold text-slate-600">
                            <li className="flex gap-2">
                                <span className="text-slate-400">Địa chỉ:</span>
                                <span>Tầng 3, Tòa nhà Mipec, 229 Tây Sơn, Phường Kim Liên, Hà Nội</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-slate-400">Hotline:</span>
                                <span>0888138888</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-slate-400">Email:</span>
                                <a href="mailto:hr@netspace.vn" className="text-primary hover:underline">hr@netspace.vn</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Bản quyền thuộc về ©2026 NetSpace</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
