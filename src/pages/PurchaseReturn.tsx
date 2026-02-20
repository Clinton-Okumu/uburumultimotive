import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type VerifyStatus =
  | "checking"
  | "paid"
  | "pending"
  | "declined"
  | "expired"
  | "unknown"
  | "error";

type PurchasedItem = {
  itemName: string;
  quantity: number;
};

const PurchaseReturn = () => {
  const [status, setStatus] = useState<VerifyStatus>("checking");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [context, setContext] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number | null>(null);
  const [itemCount, setItemCount] = useState<number | null>(null);
  const [items, setItems] = useState<PurchasedItem[]>([]);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");

  const { transactionToken, companyRef } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      transactionToken:
        params.get("TransactionToken") ||
        params.get("TransToken") ||
        params.get("ID") ||
        "",
      companyRef: params.get("CompanyRef") || "",
    };
  }, []);

  useEffect(() => {
    const verify = async () => {
      if (!transactionToken && !companyRef) {
        setStatus("error");
        setMessage("Missing transaction reference. Please contact support.");
        return;
      }

      try {
        const response = await fetch("/api/dpo/verify-token.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionToken: transactionToken || undefined,
            companyRef: companyRef || undefined,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to verify payment.");
        }

        const normalizedStatus = (data?.status || "UNKNOWN")
          .toString()
          .toUpperCase();
        switch (normalizedStatus) {
          case "PAID":
            setStatus("paid");
            break;
          case "PENDING":
            setStatus("pending");
            break;
          case "DECLINED":
            setStatus("declined");
            break;
          case "EXPIRED":
            setStatus("expired");
            break;
          default:
            setStatus("unknown");
        }

        setMessage(data?.message || "");
        setReference(data?.companyRef || companyRef || "");
        setContext(data?.context || "");
        setItemName(data?.itemName || "");
        setQuantity(typeof data?.quantity === "number" ? data.quantity : null);
        setItemCount(typeof data?.itemCount === "number" ? data.itemCount : null);
        setItems(
          Array.isArray(data?.items)
            ? data.items
                .map((item: { itemName?: unknown; quantity?: unknown }) => ({
                  itemName: (item?.itemName || "").toString(),
                  quantity:
                    typeof item?.quantity === "number" && item.quantity > 0
                      ? item.quantity
                      : 1,
                }))
                .filter((item: PurchasedItem) => item.itemName.trim() !== "")
            : [],
        );
        setAmount(data?.amount || "");
        setCurrency(data?.currency || "");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to verify payment.");
      }
    };

    verify();
  }, [transactionToken, companyRef]);

  const contextLabel = context === "uburu_home" ? "Uburu Home" : "Uburu Village";
  const returnPath = context === "uburu_home" ? "/get/home" : "/get/village";
  const amountLabel = amount ? `${currency} ${amount}`.trim() : "";

  return (
    <div className="w-full bg-slate-50 py-16 px-4 md:px-0">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10 text-center">
        {status === "checking" && (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Verifying your payment
            </h2>
            <p className="text-gray-600">Please wait while we confirm your purchase.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <h2 className="text-3xl font-bold text-green-700 mb-4">
              Payment confirmed
            </h2>
            <p className="text-gray-700 mb-2">
              Thank you for supporting {contextLabel}.
            </p>
            {itemCount && itemCount > 1 && (
              <p className="text-sm text-gray-600">Items: {itemCount}</p>
            )}
            {!items.length && itemName && (
              <p className="text-sm text-gray-600">Item: {itemName}</p>
            )}
            {!items.length && quantity && (
              <p className="text-sm text-gray-600">Qty: {quantity}</p>
            )}
            {items.length > 0 && (
              <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Purchase details
                </p>
                <div className="mt-2 space-y-1">
                  {items.map((item, index) => (
                    <p key={`${item.itemName}-${index}`} className="text-sm text-gray-700">
                      {item.itemName} x{item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {amountLabel && (
              <p className="text-sm text-gray-600">Total: {amountLabel}</p>
            )}
            {reference && (
              <p className="text-sm text-gray-500 mt-3">Reference: {reference}</p>
            )}
          </>
        )}

        {status === "pending" && (
          <>
            <h2 className="text-3xl font-bold text-yellow-600 mb-4">
              Payment pending
            </h2>
            <p className="text-gray-700 mb-2">
              Your payment is still pending. Please refresh this page in a few minutes.
            </p>
            {reference && (
              <p className="text-sm text-gray-500">Reference: {reference}</p>
            )}
          </>
        )}

        {status === "declined" && (
          <>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Payment declined
            </h2>
            <p className="text-gray-700 mb-2">
              Your payment was declined. Please try again.
            </p>
            {reference && (
              <p className="text-sm text-gray-500">Reference: {reference}</p>
            )}
          </>
        )}

        {status === "expired" && (
          <>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Payment expired
            </h2>
            <p className="text-gray-700 mb-2">
              The payment session expired. Please try again.
            </p>
            {reference && (
              <p className="text-sm text-gray-500">Reference: {reference}</p>
            )}
          </>
        )}

        {status === "unknown" && (
          <>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Payment status unknown
            </h2>
            <p className="text-gray-700 mb-2">
              We could not confirm the payment status. Please contact support.
            </p>
            {message && <p className="text-sm text-gray-500">{message}</p>}
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Verification error
            </h2>
            <p className="text-gray-700 mb-2">{message}</p>
          </>
        )}

        {status !== "checking" && (
          <div className="mt-8">
            <Link
              to={returnPath}
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 rounded-xl text-base font-semibold transition-all duration-300"
            >
              Back to {contextLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseReturn;
