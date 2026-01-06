declare module '@paystack/inline-js' {
    export type PaymentChannel = 'card' | 'bank' | 'ussd' | 'qr' | 'eft' | 'mobile_money' | 'bank_transfer' | 'apple_pay';
    
    export interface Transaction {
        reference: string;
        trans: string;
        status: string;
        message: string;
        transaction: string;
        trxref: string;
    }
    
    export interface TransactionLoadResponse {
        id: string;
        accessCode: string;
        customer: Record<string, unknown>;
    }
    
    export interface PaymentOptions {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        customerCode?: string;
        channels?: PaymentChannel[];
        metadata?: Record<string, unknown>;
        reference?: string;
        onSuccess: (transaction: Transaction) => void;
        onLoad?: (response: TransactionLoadResponse) => void;
        onCancel?: () => void;
        onError?: (error: Error) => void;
    }
    
    export type PaymentChannels = PaymentChannel[];
    export type PaystackConfig = Pick<PaymentOptions, 'key' | 'currency' | 'channels'>;
    
    class Paystack {
        newTransaction(options: PaymentOptions): void;
        checkout(options: PaymentOptions): Promise<void>;
        resumeTransaction(accessCode: string): void;
        cancelTransaction(id: string): void;
        preloadTransaction(options: PaymentOptions): () => void;
    }
    
    export default Paystack;
}
