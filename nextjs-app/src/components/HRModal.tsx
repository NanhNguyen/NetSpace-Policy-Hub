import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/db/client";
import { X, Send, CheckCircle, Upload } from 'lucide-react';

interface HRModalProps {
    open: boolean;
    onClose: () => void;
    defaultTopic?: string;
}

export default function HRModal({ open, onClose, defaultTopic = "" }: HRModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState(defaultTopic);
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState<any>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setSubmitted(false);
            setError("");

            // Get user info to autofill
            supabase.auth.getUser().then(({ data }) => {
                if (data.user) {
                    setUser(data.user);
                    setEmail(data.user.email || "");
                    // Try to get name from metadata if exists
                    setName(data.user.user_metadata?.full_name || "");
                }
            });

            setTimeout(() => nameRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            setError("⚠ Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const resp = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    topic,
                    message,
                    user_id: user?.id || null
                }),
            });

            if (!resp.ok) throw new Error('Failed to send');

            setLoading(false);
            setSubmitted(true);
        } catch (err) {
            setLoading(false);
            setError("❌ Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
        }
    }

    function handleClose() {
        onClose();
        setTimeout(() => {
            setName(""); setEmail(""); setTopic(defaultTopic); setMessage(""); setSubmitted(false); setError("");
        }, 300);
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div
                className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Brand Header */}
                <div className="bg-slate-900 px-8 py-8 text-white relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[60px] opacity-20 -mr-16 -mt-16" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                <span className="material-symbols-outlined text-white text-[28px]">support_agent</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight leading-tight">Hỗ trợ Nhân sự</h2>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/50 mt-0.5">NetSpace Policy Hub</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all text-white/70 hover:text-white group border border-transparent hover:border-white/10"
                        >
                            <span className="material-symbols-outlined text-[20px] group-active:scale-90">close</span>
                        </button>
                    </div>
                </div>

                <div className="px-8 py-8">
                    {!submitted ? (
                        <>
                            <div className="mb-8">
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    Chào <span className="text-slate-900 font-black">{name || 'bạn'}</span>, đội ngũ HR của NetSpace luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về chính sách công ty.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider ml-1" htmlFor="hr-name">
                                            Họ và tên
                                        </label>
                                        <input
                                            id="hr-name"
                                            ref={nameRef}
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Nguyễn Văn A"
                                            className="w-full text-sm rounded-xl border border-slate-200 px-4 py-3.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm font-semibold placeholder:text-slate-300"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider ml-1" htmlFor="hr-email">
                                            Email liên hệ
                                        </label>
                                        <input
                                            id="hr-email"
                                            type="email"
                                            required
                                            readOnly={!!user}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ten.ho@netspace.com.vn"
                                            className={`w-full text-sm rounded-xl border border-slate-200 px-4 py-3.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm font-semibold placeholder:text-slate-300 ${user ? 'bg-slate-50 text-slate-400' : ''}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider ml-1" htmlFor="hr-topic">
                                        Chủ đề bạn quan tâm
                                    </label>
                                    <select
                                        id="hr-topic"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full text-sm rounded-xl border border-slate-200 px-4 py-3.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm font-semibold bg-white"
                                    >
                                        <option value="">-- Chọn chủ đề --</option>
                                        <option>Chính sách Nghỉ phép</option>
                                        <option>Lương & Phúc lợi</option>
                                        <option>Làm việc từ xa</option>
                                        <option>Bảo mật & IT</option>
                                        <option>Nội quy Công sở</option>
                                        <option>Hoàn chi phí</option>
                                        <option>Khác</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider ml-1" htmlFor="hr-message">
                                        Nội dung thắc mắc
                                    </label>
                                    <textarea
                                        id="hr-message"
                                        rows={4}
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Mô tả chi tiết câu hỏi hoặc vấn đề của bạn..."
                                        className="w-full text-sm rounded-xl border border-slate-200 px-4 py-3.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm font-semibold resize-none placeholder:text-slate-300 min-h-[120px]"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-600 font-bold">
                                        <span className="material-symbols-outlined text-[16px]">error</span>
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-primary/20 active:scale-95"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                                                Cửa đang mở...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[20px]">send</span>
                                                Gửi yêu cầu hỗ trợ
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-green-500/10">
                                <span className="material-symbols-outlined text-green-500 text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    check_circle
                                </span>
                            </div>
                            <h3 className="font-black text-2xl mb-3 text-slate-900 leading-tight">Gửi Thành công!</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium px-4">
                                Cảm ơn <span className="text-slate-900 font-bold">{name}</span>. Đội ngũ HR sẽ phản hồi trực tiếp qua email của bạn trong vòng <strong>24 giờ làm việc</strong>.
                            </p>
                            <button
                                onClick={handleClose}
                                className="w-full max-w-[200px] flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black transition-all mx-auto mt-10 shadow-xl active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[18px]">done_all</span>
                                Đã hiểu
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
