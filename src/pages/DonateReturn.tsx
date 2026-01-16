import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type VerifyStatus = 'checking' | 'paid' | 'pending' | 'declined' | 'expired' | 'unknown' | 'error';

const DonateReturn = () => {
    const [status, setStatus] = useState<VerifyStatus>('checking');
    const [message, setMessage] = useState('');
    const [reference, setReference] = useState('');

    const { transactionToken, companyRef } = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return {
            transactionToken:
                params.get('TransactionToken') ||
                params.get('TransToken') ||
                params.get('ID') ||
                '',
            companyRef: params.get('CompanyRef') || '',
        };
    }, []);

    useEffect(() => {
        const verify = async () => {
            if (!transactionToken && !companyRef) {
                setStatus('error');
                setMessage('Missing transaction reference. Please contact support.');
                return;
            }

            try {
                const response = await fetch('/api/dpo/verify-token.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        transactionToken: transactionToken || undefined,
                        companyRef: companyRef || undefined,
                    }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data?.error || 'Unable to verify payment.');
                }

                const normalizedStatus = (data?.status || 'UNKNOWN').toString().toUpperCase();
                switch (normalizedStatus) {
                    case 'PAID':
                        setStatus('paid');
                        break;
                    case 'PENDING':
                        setStatus('pending');
                        break;
                    case 'DECLINED':
                        setStatus('declined');
                        break;
                    case 'EXPIRED':
                        setStatus('expired');
                        break;
                    default:
                        setStatus('unknown');
                }

                setMessage(data?.message || '');
                setReference(data?.companyRef || companyRef || '');
            } catch (error) {
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'Unable to verify payment.');
            }
        };

        verify();
    }, [transactionToken, companyRef]);

    return (
        <div className="w-full bg-gray-50 py-16 px-4 md:px-0">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10 text-center">
                {status === 'checking' && (
                    <>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Verifying Payment</h2>
                        <p className="text-gray-600">Please wait while we confirm your donation.</p>
                    </>
                )}

                {status === 'paid' && (
                    <>
                        <h2 className="text-3xl font-bold text-green-700 mb-4">Payment Successful</h2>
                        <p className="text-gray-700 mb-2">Thank you for supporting our mission.</p>
                        {reference && <p className="text-sm text-gray-500">Reference: {reference}</p>}
                    </>
                )}

                {status === 'pending' && (
                    <>
                        <h2 className="text-3xl font-bold text-yellow-600 mb-4">Payment Pending</h2>
                        <p className="text-gray-700 mb-2">
                            Your payment is still pending. Please refresh this page in a few minutes.
                        </p>
                        {reference && <p className="text-sm text-gray-500">Reference: {reference}</p>}
                    </>
                )}

                {status === 'declined' && (
                    <>
                        <h2 className="text-3xl font-bold text-red-600 mb-4">Payment Declined</h2>
                        <p className="text-gray-700 mb-2">Your payment was declined. Please try again.</p>
                        {reference && <p className="text-sm text-gray-500">Reference: {reference}</p>}
                    </>
                )}

                {status === 'expired' && (
                    <>
                        <h2 className="text-3xl font-bold text-red-600 mb-4">Payment Expired</h2>
                        <p className="text-gray-700 mb-2">The payment session expired. Please try again.</p>
                        {reference && <p className="text-sm text-gray-500">Reference: {reference}</p>}
                    </>
                )}

                {status === 'unknown' && (
                    <>
                        <h2 className="text-3xl font-bold text-gray-700 mb-4">Payment Status Unknown</h2>
                        <p className="text-gray-700 mb-2">
                            We could not confirm the payment status. Please contact support.
                        </p>
                        {message && <p className="text-sm text-gray-500">{message}</p>}
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h2 className="text-3xl font-bold text-red-600 mb-4">Verification Error</h2>
                        <p className="text-gray-700 mb-2">{message}</p>
                    </>
                )}

                {status !== 'checking' && (
                    <div className="mt-8">
                        <Link
                            to="/donate/money"
                            className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 rounded-xl text-base font-semibold transition-all duration-300"
                        >
                            Back to Donate
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonateReturn;
