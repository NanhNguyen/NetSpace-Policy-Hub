"use client";

import { useState, useRef, useEffect } from "react";

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
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setSubmitted(false);
            setError("");
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
                body: JSON.stringify({ name, email, topic, message }),
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="absolute inset-0 bg-text-main/40 backdrop-blur-sm" onClick={handleClose} />
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-text-main text-[24px]">support_agent</span>
                        <h2 id="modal-title" className="font-black text-lg text-text-main">Hỏi đội ngũ HR</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-lg hover:bg-primary-dark flex items-center justify-center transition-colors"
                        aria-label="Đóng"
                    >
                        <span className="material-symbols-outlined text-text-main text-[20px]">close</span>
                    </button>
                </div>

                <div className="px-6 py-6">
                    {!submitted ? (
                        <>
                            <p className="text-sm text-text-muted mb-5 leading-relaxed">
                                Điền thông tin bên dưới, HR sẽ phản hồi trong vòng{" "}
                                <strong className="text-text-main">24 giờ làm việc</strong>.
                            </p>
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" htmlFor="hr-name">
                                        Họ và tên <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="hr-name"
                                        ref={nameRef}
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full text-sm rounded-lg border border-neutral-soft px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" htmlFor="hr-email">
                                        Email công ty <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="hr-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ten.ho@netspace.com.vn"
                                        className="w-full text-sm rounded-lg border border-neutral-soft px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" htmlFor="hr-topic">
                                        Chủ đề
                                    </label>
                                    <select
                                        id="hr-topic"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full text-sm rounded-lg border border-neutral-soft px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white"
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
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" htmlFor="hr-message">
                                        Câu hỏi của bạn <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        id="hr-message"
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Mô tả chi tiết câu hỏi hoặc vấn đề của bạn..."
                                        className="w-full text-sm rounded-lg border border-neutral-soft px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none"
                                    />
                                </div>
                                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer group">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <span className="material-symbols-outlined text-[20px]">upload_file</span>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-text-main">
                                                Tải lên hình ảnh hoặc tài liệu
                                            </p>
                                            <p className="text-[10px] text-text-muted mt-0.5">
                                                Hỗ trợ JPG, PNG, PDF (Tối đa 5MB)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // Handle file selection logic
                                                    console.log("Selected file:", file.name);
                                                }
                                            }}
                                            accept="image/*,.pdf"
                                        />
                                    </label>
                                </div>
                                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 py-3 border border-neutral-soft text-text-main font-bold rounded-xl text-sm hover:bg-neutral-soft transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-primary hover:bg-primary-dark text-text-main font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[18px]">send</span>
                                                Gửi câu hỏi
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    check_circle
                                </span>
                            </div>
                            <h3 className="font-black text-lg mb-2 text-text-main">Đã gửi thành công!</h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Đội ngũ HR sẽ liên hệ lại với bạn qua email trong vòng 24 giờ làm việc.
                            </p>
                            <button
                                onClick={handleClose}
                                className="mt-5 px-6 py-2.5 bg-primary hover:bg-primary-dark text-text-main font-bold rounded-lg text-sm transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
