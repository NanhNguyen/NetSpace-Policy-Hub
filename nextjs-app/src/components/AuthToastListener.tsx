"use client";

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/db/client';
import toast from 'react-hot-toast';

export default function AuthToastListener() {
    const lastSessionId = useRef<string | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // Only show toast if it's a NEW session in this browser tab's lifecycle
                // OR if it's the first time we see a session after a redirect
                if (lastSessionId.current !== session.user.id) {
                    toast.success(`Chào mừng trở lại, ${session.user.user_metadata?.full_name || session.user.email}!`, {
                        id: 'auth-success', // Prevent duplicate toasts
                    });
                    lastSessionId.current = session.user.id;
                    
                    // Clean up URL if it contains access_token from Magic Link
                    if (window.location.hash.includes('access_token')) {
                        window.history.replaceState(null, '', window.location.pathname + window.location.search);
                    }
                }
            } else if (event === 'SIGNED_OUT') {
                if (lastSessionId.current) {
                    toast.success("Đã đăng xuất thành công");
                }
                lastSessionId.current = null;
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return null;
}
