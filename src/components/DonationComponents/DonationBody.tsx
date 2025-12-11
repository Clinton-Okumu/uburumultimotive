import { CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";
import Button from "../shared/Button";

const DonationBody = () => {
    const [method, setMethod] = useState<"mpesa" | "visa" | null>(null);

    return (
        <div className="w-full bg-gray-50 py-16 px-4 md:px-0">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10">

                <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
                    Support Our Mission
                </h2>
                <p className="text-gray-600 text-center mb-10">
                    Your contribution directly impacts the communities we serve.
                </p>

                <div className="mb-8">
                    <label className="block mb-2 text-gray-700 font-medium">
                        Donation Amount (KES)
                    </label>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Full Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="you@email.com"
                        />
                    </div>
                </div>

                <div className="mb-10">
                    <p className="text-gray-700 font-medium mb-3">Select Payment Method</p>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${method === "mpesa"
                                ? "border-green-600 bg-green-50"
                                : "border-gray-300"
                                }`}
                            onClick={() => setMethod("mpesa")}
                        >
                            <Smartphone className="text-green-600" />
                            <span className="font-medium">M-Pesa</span>
                        </button>

                        <button
                            className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${method === "visa"
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-300"
                                }`}
                            onClick={() => setMethod("visa")}
                        >
                            <CreditCard className="text-blue-600" />
                            <span className="font-medium">Visa / Card</span>
                        </button>
                    </div>
                </div>

                {method === "mpesa" && (
                    <div className="mb-10 bg-green-50 border border-green-200 p-6 rounded-xl">
                        <label className="block mb-2 text-gray-700 font-medium">M-Pesa Phone Number</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="07xx xxx xxx"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                            You’ll receive an M-Pesa STK Push after submitting.
                        </p>
                    </div>
                )}

                {method === "visa" && (
                    <div className="mb-10 bg-blue-50 border border-blue-200 p-6 rounded-xl">
                        <label className="block mb-2 text-gray-700 font-medium">Card Number</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="xxxx xxxx xxxx xxxx"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="MM/YY"
                            />
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="CVV"
                            />
                        </div>
                    </div>
                )}

                <Button className="w-full py-4 rounded-xl text-lg font-semibold transition-all">
                    Donate Now
                </Button>
            </div>
        </div>
    );
};

export default DonationBody;
