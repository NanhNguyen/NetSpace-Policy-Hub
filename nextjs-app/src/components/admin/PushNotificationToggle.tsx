"use client";

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { PushNotificationService } from '@/lib/services/push-notification.service';

export default function PushNotificationToggle() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkStatus() {
            const status = await PushNotificationService.getSubscriptionStatus();
            setIsSubscribed(status);
            setLoading(false);
        }
        checkStatus();
    }, []);

    const handleToggle = async () => {
        setLoading(true);
        try {
            if (isSubscribed) {
                // In a real app we might want to unsubscribe, but for now let's just show status
                alert("Bạn đã đăng ký nhận thông báo. Để hủy, vui lòng chỉnh trong cài đặt trình duyệt.");
            } else {
                await PushNotificationService.subscribeUser();
                setIsSubscribed(true);
                alert("Đăng ký nhận thông báo thành công! Bạn sẽ nhận được tin nhắn khi có thắc mắc mới.");
            }
        } catch (error) {
            console.error(error);
            alert("Không thể đăng ký thông báo. Hãy đảm bảo bạn đã cấp quyền cho trình duyệt.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold group ${isSubscribed
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
        >
            {isSubscribed ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            {isSubscribed ? 'Thông báo: Bật' : 'Bật thông báo'}
        </button>
    );
}
