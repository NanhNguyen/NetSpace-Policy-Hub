const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const PushNotificationService = {
    async subscribeUser() {
        if (!('serviceWorker' in navigator)) return;

        const registration = await navigator.serviceWorker.ready;

        // Get VAPID public key from backend or hardcode for now as we have it
        const PUBLIC_VAPID_KEY = 'BHiJuPRbXKTiJMTQcpKIm598qMQK60THAcDfANztIEKsL3sPIBWRJDfINR9Id3rbacUpO4mjX9nqlmbKPUwrYyI';

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: PUBLIC_VAPID_KEY
        });

        await fetch(`${API_URL}/notifications/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscription,
                role: 'hr'
            }),
        });

        console.log('[PUSH] User subscribed successfully');
    },

    async getSubscriptionStatus() {
        if (!('serviceWorker' in navigator)) return false;
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return !!subscription;
    }
};
