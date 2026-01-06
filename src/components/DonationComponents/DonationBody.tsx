import { CheckCircle, XCircle, Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PaystackPayment from "../Payment/PaystackPayment";

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

const DonationBody = () => {
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionReference, setTransactionReference] = useState('');

    const handleSuccess = (transaction: { reference: string }) => {
        setPaymentStatus('success');
        setTransactionReference(transaction.reference);
        toast.success('Payment successful! Thank you for your donation.');
        
        setTimeout(() => {
            setPaymentStatus('idle');
            setAmount('');
            setName('');
            setEmail('');
            setTransactionReference('');
        }, 10000);
    };

    const handleCancel = () => {
        setPaymentStatus('idle');
        toast('Payment cancelled');
    };

    const handleError = (error: Error) => {
        setPaymentStatus('error');
        setErrorMessage(error.message || 'Payment failed. Please try again.');
        toast.error('Payment failed. Please try again.');
        
        setTimeout(() => {
            setPaymentStatus('idle');
            setErrorMessage('');
        }, 5000);
    };

    const isFormDisabled = paymentStatus === 'processing' || paymentStatus === 'success';

    return (
        <div className="w-full bg-gray-50 py-16 px-4 md:px-0">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10">

                <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
                    Support Our Mission
                </h2>
                <p className="text-gray-600 text-center mb-10">
                    Your contribution directly impacts communities we serve.
                </p>

                {paymentStatus === 'success' && (
                    <div className="mb-8 bg-green-50 border border-green-200 p-6 rounded-xl flex items-start gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-green-800 mb-1">Payment Successful!</h3>
                            <p className="text-green-700 mb-2">
                                Thank you for your donation of KES {parseFloat(amount).toLocaleString()}!
                            </p>
                            <p className="text-sm text-green-600">
                                Reference: {transactionReference}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                                A receipt has been sent to {email}
                            </p>
                        </div>
                    </div>
                )}

                {paymentStatus === 'error' && (
                    <div className="mb-8 bg-red-50 border border-red-200 p-6 rounded-xl flex items-start gap-3">
                        <XCircle className="text-red-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-red-800 mb-1">Payment Failed</h3>
                            <p className="text-red-700">{errorMessage}</p>
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <label className="block mb-2 text-gray-700 font-medium">
                        Donation Amount (KES)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        disabled={isFormDisabled}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Your name"
                            disabled={isFormDisabled}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="you@email.com"
                            disabled={isFormDisabled}
                        />
                    </div>
                </div>

                <div className="mb-10">
                    <p className="text-sm text-gray-600 mb-4">
                        You'll be able to select your preferred payment method (M-Pesa, Card, or Bank Transfer) in the secure payment popup.
                    </p>
                </div>

                {paymentStatus === 'idle' && (
                    <PaystackPayment
                        amount={parseFloat(amount) || 0}
                        email={email}
                        fullName={name}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                        onError={handleError}
                    />
                )}

                {paymentStatus === 'processing' && (
                    <div className="w-full bg-yellow-400 text-black py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3">
                        <Loader className="animate-spin" />
                        <span>Processing Payment...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationBody;
