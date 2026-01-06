import type { PaystackConfig, PaymentChannel } from '@paystack/inline-js';

export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key_here';
export const PAYSTACK_LIVE_KEY = import.meta.env.VITE_PAYSTACK_LIVE_KEY || '';

export const getPaystackKey = (): string => {
    return import.meta.env.DEV ? PAYSTACK_PUBLIC_KEY : PAYSTACK_LIVE_KEY;
};

export const PAYSTACK_CONFIG: PaystackConfig = {
    key: getPaystackKey(),
    currency: 'KES',
    channels: ['card', 'mobile_money', 'bank_transfer'] as PaymentChannel[],
};

export const validateDonationForm = (data: {
    amount: number;
    name: string;
    email: string;
}): { isValid: boolean; error?: string } => {
    if (!data.amount || data.amount <= 0) {
        return { isValid: false, error: 'Please enter a valid donation amount' };
    }

    if (!data.name || data.name.trim().length < 2) {
        return { isValid: false, error: 'Please enter your full name' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
};

export const generatePaymentReference = (): string => {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
