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

    // Hidden functionality per user request
    return null;
}
