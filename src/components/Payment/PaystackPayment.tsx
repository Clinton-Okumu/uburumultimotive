import Paystack from '@paystack/inline-js';
import type { Transaction } from '@paystack/inline-js';
import { generatePaymentReference, PAYSTACK_CONFIG } from '../../config/paystack';

interface PaymentProps {
    amount: number;
    email: string;
    fullName: string;
    onSuccess: (transaction: Transaction) => void;
    onCancel: () => void;
    onError: (error: Error) => void;
    disabled?: boolean;
}

const PaystackPayment = ({
    amount,
    email,
    fullName,
    onSuccess,
    onCancel,
    onError,
    disabled = false,
}: PaymentProps) => {
    const handlePayment = () => {
        const [firstName, ...lastNameParts] = fullName.split(' ');
        const lastName = lastNameParts.join(' ');

        const popup = new Paystack();

        popup.newTransaction({
            key: PAYSTACK_CONFIG.key,
            email,
            amount: amount * 100,
            currency: PAYSTACK_CONFIG.currency,
            firstName,
            lastName: lastName || '',
            reference: generatePaymentReference(),
            channels: PAYSTACK_CONFIG.channels,
            onSuccess: (transaction: Transaction) => {
                console.log('Payment successful:', transaction);
                onSuccess(transaction);
            },
            onLoad: (response) => {
                console.log('Payment popup loaded:', response);
            },
            onCancel: () => {
                console.log('Payment cancelled');
                onCancel();
            },
            onError: (error: Error) => {
                console.error('Payment error:', error);
                onError(error);
            },
        });
    };

    return (
        <button
            onClick={handlePayment}
            disabled={disabled}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {disabled ? 'Processing...' : 'Donate Now'}
        </button>
    );
};

export default PaystackPayment;
