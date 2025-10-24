import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Home, Send, Wallet, ShoppingBag, LogOut, Copy, QrCode, User, Repeat2, TrendingUp, TrendingDown 
} from 'lucide-react';

// --- Global Context/Setup (Mandatory for Immersive DApps) ---
// Global variables provided by the Canvas environment
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

// Firebase Imports
import { getApp, getApps, initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken,
    onAuthStateChanged,
} from 'firebase/auth';
import { 
    getFirestore, 
    query,
    collection, 
    doc,
    increment,
    limit,
    onSnapshot,
    orderBy,
    Timestamp,
    addDoc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';

// Initialize Firebase Config
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config ? JSON.parse(__firebase_config) : null;

type EnvRecord = Record<string, string | undefined>;
const env = ((import.meta as unknown) as { env?: EnvRecord }).env ?? {};
const useMockApi = env.VITE_USE_MOCK === 'true';
const mockApiBase = env.VITE_API_BASE ?? 'http://localhost:3001/api';
const mockUserId = env.VITE_MOCK_UID ?? 'user123';
const mockPrimaryToken = env.VITE_MOCK_TOKEN ?? 'MEE';

// Mock Wallet/User Data
const MOCK_WALLET_ADDRESS = '0x499bE535e6D0212115b8e9dE60656710B116b3B4';
const MOCK_BALANCE = 1245.75;

type TransactionRecord = {
    id: string;
    type: string;
    amount: number;
    createdAt: Date;
    description?: string;
    counterparty?: string;
    direction?: 'in' | 'out' | 'trade';
};

const DEFAULT_TRANSACTIONS: TransactionRecord[] = [
    { id: 'mock-1', type: 'Sent', amount: -50.0, createdAt: new Date('2024-10-05') },
    { id: 'mock-2', type: 'Received', amount: 150.5, createdAt: new Date('2024-10-04') },
    { id: 'mock-3', type: 'Trade', amount: -25.0, createdAt: new Date('2024-10-03') },
    { id: 'mock-4', type: 'Sent', amount: -10.0, createdAt: new Date('2024-10-02') },
];

const DEFAULT_PROFILE = {
    walletAddress: MOCK_WALLET_ADDRESS,
    balance: MOCK_BALANCE,
};

const parseDate = (input: unknown): Date => {
    if (input instanceof Date) {
        return input;
    }
    if (typeof input === 'number' || typeof input === 'string') {
        const parsed = new Date(input);
        if (!Number.isNaN(parsed.valueOf())) {
            return parsed;
        }
    }
    return new Date();
};

const extractBalance = (rawBalance: unknown, primaryToken: string): number => {
    if (typeof rawBalance === 'number') {
        return rawBalance;
    }
    if (rawBalance && typeof rawBalance === 'object') {
        const balanceRecord = rawBalance as Record<string, unknown>;
        const primaryValue = balanceRecord[primaryToken];
        if (typeof primaryValue === 'number') {
            return primaryValue;
        }
        const firstNumeric = Object.values(balanceRecord).find((value): value is number => typeof value === 'number');
        if (typeof firstNumeric === 'number') {
            return firstNumeric;
        }
    }
    return DEFAULT_PROFILE.balance;
};

const mapMockTransaction = (raw: Record<string, unknown>): TransactionRecord => {
    const typeRaw = typeof raw.type === 'string' ? raw.type : 'Transaction';
    const normalizedType = typeRaw.toLowerCase();
    const direction: TransactionRecord['direction'] = normalizedType.includes('send') || raw.direction === 'out'
        ? 'out'
        : normalizedType.includes('receive') || raw.direction === 'in'
            ? 'in'
            : 'trade';
    const baseAmount = typeof raw.amount === 'number' ? raw.amount : parseFloat(String(raw.amount ?? 0));
    const signedAmount = direction === 'out' ? -Math.abs(baseAmount) : Math.abs(baseAmount);
    const counterpartyCandidate = direction === 'out'
        ? (typeof raw.to === 'string' ? raw.to : undefined)
        : (typeof raw.from === 'string' ? raw.from : undefined);

    return {
        id: typeof raw.id === 'string' ? raw.id : `mock-${Date.now()}`,
        type: typeRaw,
        amount: Number.isFinite(signedAmount) ? signedAmount : 0,
        createdAt: parseDate(raw.timestamp ?? raw.createdAt),
        description: typeof raw.description === 'string' ? raw.description : undefined,
        counterparty: counterpartyCandidate,
        direction,
    } satisfies TransactionRecord;
};

// Mock function for displaying toast notifications
const useToast = () => {
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const toastElement = document.getElementById('toast-message');
        if (toastElement) {
            toastElement.textContent = message;
            toastElement.className = `fixed top-4 right-4 p-3 rounded-lg shadow-xl text-white transition-opacity duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} opacity-100 z-50`;
            setTimeout(() => {
                toastElement.className = toastElement.className.replace('opacity-100', 'opacity-0');
            }, 3000);
        }
    };
    return { success: (m: string) => showToast(m, 'success'), error: (m: string) => showToast(m, 'error') };
};

// --- Page Components ---

// 1. Dashboard Page (New - Data Driven)
type DashboardPageProps = {
    balance: number;
    walletAddress: string;
    userId?: string | null;
    transactions: TransactionRecord[];
    isLoading: boolean;
};

const DashboardPage = ({ balance, walletAddress, userId, transactions, isLoading }: DashboardPageProps) => {
    const displayTransactions = transactions.length ? transactions : DEFAULT_TRANSACTIONS;
    const normalizedBalance = Number.isFinite(balance) ? balance : DEFAULT_PROFILE.balance;
    const normalizedWallet = walletAddress || DEFAULT_PROFILE.walletAddress;

    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        sent: TrendingDown,
        received: TrendingUp,
        trade: Repeat2,
    };

    const formatDate = (date: Date) => {
        try {
            return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
        } catch {
            return date.toISOString().split('T')[0];
        }
    };

    return (
        <div className="p-4 sm:p-8 w-full">
            <h2 className="text-3xl font-bold mb-8 text-white">Dashboard</h2>

            {/* Balance Card */}
            <div className="bg-purple-700 p-6 sm:p-8 rounded-2xl shadow-xl mb-8">
                <p className="text-purple-200 text-sm">Total Balance</p>
                <h3 className="text-5xl font-extrabold mt-1">
                    {normalizedBalance.toFixed(2)} <span className="text-2xl font-semibold ml-2">MEE</span>
                </h3>
                <p className="text-xs text-purple-200 mt-3">
                    {isLoading ? 'Fetching real-time balance from Firestore...' : 'Balance synced with Firestore'}
                </p>
            </div>

            {/* Wallet Address Display */}
            <div className="bg-gray-800 p-4 rounded-xl mb-8">
                <p className="text-sm text-gray-400">Your Wallet Address</p>
                <p className="text-lg font-mono truncate">{normalizedWallet}</p>
            </div>

            {/* Transaction History */}
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Recent Transactions</h3>
            <div className="bg-gray-800 rounded-xl shadow-lg divide-y divide-gray-700">
                {isLoading && (
                    <div className="p-4 text-sm text-gray-500">Loading transactions...</div>
                )}
                {!isLoading && displayTransactions.map((tx) => {
                    const normalizedType = tx.type?.toLowerCase?.() ?? 'transaction';
                    const iconKey = normalizedType.includes('send') ? 'sent' : normalizedType.includes('receive') ? 'received' : normalizedType.includes('trade') ? 'trade' : tx.direction === 'out' ? 'sent' : 'received';
                    const Icon = iconMap[iconKey] || Repeat2;
                    const amountClass = tx.amount >= 0 ? 'text-green-400' : 'text-red-400';
                    const amountLabel = `${tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)} MEE`;
                    const createdAtLabel = formatDate(tx.createdAt);
                    return (
                        <div key={tx.id} className="flex justify-between items-center p-4 hover:bg-gray-700 transition duration-150">
                            <div className="flex items-center">
                                <Icon className="w-4 h-4 text-purple-300" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white">{tx.type || 'Transaction'}</p>
                                    <p className="text-xs text-gray-400">{createdAtLabel}</p>
                                    {tx.counterparty && (
                                        <p className="text-[11px] text-gray-500">{tx.counterparty}</p>
                                    )}
                                </div>
                            </div>
                            <p className={`font-mono text-sm font-semibold ${amountClass}`}>
                                {amountLabel}
                            </p>
                        </div>
                    );
                })}
                {!isLoading && !displayTransactions.length && (
                    <div className="p-4 text-sm text-gray-500 text-center">
                        ไม่มีรายการธุรกรรม ให้ลองส่ง/รับโทเคนเพื่อเริ่มต้น
                    </div>
                )}
            </div>

            <footer className="text-center text-xs text-gray-500 mt-8">
                User ID: {userId || 'Authenticating...'}
            </footer>
        </div>
    );
};

// 2. Send Token Page (New - Connected)
type SendTokenPageProps = {
    balance: number;
    onSend: (payload: { recipient: string; amount: number }) => Promise<void>;
    canSend: boolean;
};

const SendTokenPage = ({ balance, onSend, canSend }: SendTokenPageProps) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleSend = async () => {
        const parsedAmount = parseFloat(amount);
        if (!recipient || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error('กรุณากรอกข้อมูลผู้รับและจำนวนที่ถูกต้อง');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSend({ recipient, amount: parsedAmount });
            toast.success(`ส่ง ${parsedAmount.toFixed(2)} MEE ให้ ${recipient} เรียบร้อยแล้ว`);
            setRecipient('');
            setAmount('');
        } catch (error) {
            console.error('Send transaction failed', error);
            toast.error('ไม่สามารถส่งโทเคนได้ โปรดลองอีกครั้ง');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 w-full">
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center">
                <Send className="w-6 h-6 mr-3 text-purple-400" />
                ส่ง MEE Token
            </h2>

            <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-lg mx-auto">
                <div className="mb-6">
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-2">
                        ที่อยู่ผู้รับ (Recipient Address)
                    </label>
                    <input
                        type="text"
                        id="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition duration-150"
                    />
                </div>

                <div className="mb-8">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                        จำนวน MEE (Amount)
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition duration-150"
                    />
                    <p className="text-right text-xs text-gray-400 mt-1">
                        Available: {balance.toFixed(2)} MEE
                    </p>
                </div>

                <button
                    onClick={handleSend}
                    disabled={!canSend || isSubmitting}
                    className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition duration-200 active:scale-95 ${
                        !canSend || isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isSubmitting ? 'กำลังส่ง...' : 'ยืนยันการส่ง'}
                </button>
                {!canSend && (
                    <p className="mt-4 text-xs text-center text-red-300">
                        กรุณาเชื่อมต่อ Firebase และเข้าสู่ระบบก่อนทำรายการโทเคน
                    </p>
                )}
            </div>
        </div>
    );
};


// 3. Receive Token Page (Existing - Integrated)
type ReceiveTokenPageProps = { userId?: string | null; walletAddress: string };
const ReceiveTokenPage = ({ userId, walletAddress }: ReceiveTokenPageProps) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
    const toast = useToast();

    const handleCopy = useCallback(async () => {
        try {
            const input = document.createElement('textarea');
            input.value = walletAddress || DEFAULT_PROFILE.walletAddress;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            
            setCopyStatus('copied');
            toast.success('คัดลอกที่อยู่กระเป๋าเงินแล้ว! (Address copied!)');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            toast.error('ไม่สามารถคัดลอกได้ (Failed to copy)');
        }
    }, [toast, walletAddress]);


    return (
        <div className="p-4 sm:p-8 w-full">
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center">
                <Wallet className="w-6 h-6 mr-3 text-purple-400" />
                รับ MEE Token
            </h2>

            <div className="max-w-xl mx-auto">
                <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
                    
                    <div className="flex items-center mb-6">
                        <User className="w-5 h-5 text-purple-400 mr-2" />
                        <h3 className="text-lg font-semibold text-purple-300">
                            Your Wallet Address
                        </h3>
                    </div>

                    {/* QR Code Placeholder Area */}
                    <div className="bg-gray-900 p-4 rounded-xl flex items-center justify-center aspect-square max-w-xs mx-auto mb-6 border-4 border-dashed border-gray-700">
                        <QrCode className="w-32 h-32 text-gray-600" />
                    </div>

                    {/* Address and Copy Button */}
                    <div className="bg-gray-700/50 p-3 rounded-xl flex items-center justify-between mt-4">
                        <p className="text-xs sm:text-sm font-mono text-gray-300 overflow-hidden overflow-ellipsis whitespace-nowrap mr-4">
                            {walletAddress || DEFAULT_PROFILE.walletAddress}
                        </p>
                        <button 
                            onClick={handleCopy} 
                            className={`flex-shrink-0 p-2 ml-2 rounded-lg transition duration-150 active:scale-95 shadow-md ${copyStatus === 'copied' ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                            aria-label="Copy address"
                        >
                            <Copy className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-sm font-semibold text-pink-400">
                        <span className="font-extrabold text-lg mr-1">**</span>
                        คำเตือน:** Address นี้มีไว้สำหรับรับโทเคน <span className="text-yellow-300">**MEE**</span> **เท่านั้น**. 
                    </p>
                </div>
            </div>
            <footer className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-700">
                User ID: {userId || 'Authenticating...'}
            </footer>
        </div>
    );
};


// 4. Marketplace Page (Existing - Integrated)
const MarketplacePage = () => {
    return (
        <div className="p-4 sm:p-8 w-full">
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center">
                <ShoppingBag className="w-6 h-6 mr-3 text-purple-400" />
                Marketplace / Trade
            </h2>
            
            <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-2xl shadow-2xl mt-16 max-w-xl mx-auto border border-gray-700">
                <ShoppingBag className="w-16 h-16 mb-6 text-gray-500" />
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 text-center">
                    Marketplace is under development.
                </h3>
                
                <p className="text-base text-gray-400 text-center mb-6">
                    ตลาดซื้อขายกำลังอยู่ในระหว่างการพัฒนาฟีเจอร์ใหม่ ๆ โปรดติดตามการอัปเดตเร็ว ๆ นี้
                </p>
                <button 
                    onClick={() => console.log('Checking for updates...')}
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition duration-200 active:scale-95"
                >
                    ดู Road Map
                </button>
            </div>
        </div>
    );
};

// --- Core Navigation Component ---
type NavigationMenuProps = { currentPage: string; setCurrentPage: (p: string) => void };
const NavigationMenu = ({ currentPage, setCurrentPage }: NavigationMenuProps) => {
    const menuItems = [
        { name: 'Dashboard', page: 'dashboard', icon: Home },
        { name: 'Send Token', page: 'send', icon: Send },
        { name: 'Receive Token', page: 'receive', icon: Wallet },
        { name: 'Marketplace', page: 'marketplace', icon: ShoppingBag },
    ];

    return (
        <nav className="p-4 w-64 bg-gray-800 flex flex-col justify-between h-full shadow-lg flex-shrink-0">
            <div>
                <div className="text-2xl font-black text-purple-400 mb-10 border-b border-gray-700 pb-4">
                    MeeChain DApp
                </div>
                {menuItems.map((item) => {
                    const isActive = currentPage === item.page;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.page}
                            onClick={() => setCurrentPage(item.page)}
                            className={`flex items-center w-full p-3 mb-2 rounded-xl transition duration-150 ${
                                isActive ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="font-semibold">{item.name}</span>
                        </button>
                    );
                })}
            </div>
            <button
                onClick={() => { console.log('Simulating Logout'); alert('Logged out'); }}
                className="flex items-center w-full p-3 text-red-400 hover:bg-gray-700 rounded-xl transition duration-150 mt-4"
            >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-semibold">Logout</span>
            </button>
        </nav>
    );
};


// --- Main App Component (Router) ---
export default function App() {
    const initialLoadComplete = !firebaseConfig && !useMockApi;

    // State for navigation, authentication, and live data
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [userId, setUserId] = useState<string | null>(null);
    const [hasActiveSession, setHasActiveSession] = useState(useMockApi || !firebaseConfig);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [balance, setBalance] = useState(DEFAULT_PROFILE.balance);
    const [walletAddress, setWalletAddress] = useState(DEFAULT_PROFILE.walletAddress);
    const [transactions, setTransactions] = useState<TransactionRecord[]>(DEFAULT_TRANSACTIONS);
    const [isProfileLoaded, setIsProfileLoaded] = useState(initialLoadComplete);
    const [isTransactionsLoaded, setIsTransactionsLoaded] = useState(initialLoadComplete);

    const firebaseServicesRef = useRef<{ auth: ReturnType<typeof getAuth> | null; db: ReturnType<typeof getFirestore> | null }>({ auth: null, db: null });

    // Auth Initialization and Firestore listeners
    useEffect(() => {
        if (useMockApi) {
            const abortController = new AbortController();
            const { signal } = abortController;

            setUserId(mockUserId);
            setHasActiveSession(true);
            setIsAuthReady(true);
            setIsProfileLoaded(false);
            setIsTransactionsLoaded(false);

            const loadMockData = async () => {
                try {
                    const profileResponse = await fetch(`${mockApiBase}/user/${mockUserId}`, { signal });
                    if (profileResponse.ok) {
                        const profile = (await profileResponse.json()) as Record<string, unknown>;
                        if (!signal.aborted) {
                            const nextWallet = typeof profile.walletAddress === 'string' && profile.walletAddress ? profile.walletAddress : DEFAULT_PROFILE.walletAddress;
                            const nextBalance = extractBalance(profile.balance, mockPrimaryToken);
                            setWalletAddress(nextWallet);
                            setBalance(Number.isFinite(nextBalance) ? nextBalance : DEFAULT_PROFILE.balance);
                        }
                    } else if (!signal.aborted) {
                        setWalletAddress(DEFAULT_PROFILE.walletAddress);
                        setBalance(DEFAULT_PROFILE.balance);
                    }
                } catch (error) {
                    if (!signal.aborted) {
                        console.error('Mock profile fetch failed:', error);
                        setWalletAddress(DEFAULT_PROFILE.walletAddress);
                        setBalance(DEFAULT_PROFILE.balance);
                    }
                } finally {
                    if (!signal.aborted) {
                        setIsProfileLoaded(true);
                    }
                }

                try {
                    const transactionsResponse = await fetch(`${mockApiBase}/user/${mockUserId}/transactions`, { signal });
                    if (transactionsResponse.ok) {
                        const transactionPayload = await transactionsResponse.json();
                        if (!signal.aborted) {
                            const records = Array.isArray(transactionPayload)
                                ? transactionPayload.map((entry) => mapMockTransaction(entry as Record<string, unknown>))
                                : [];
                            setTransactions(records.length ? records : [...DEFAULT_TRANSACTIONS]);
                        }
                    } else if (!signal.aborted) {
                        setTransactions(() => [...DEFAULT_TRANSACTIONS]);
                    }
                } catch (error) {
                    if (!signal.aborted) {
                        console.error('Mock transactions fetch failed:', error);
                        setTransactions(() => [...DEFAULT_TRANSACTIONS]);
                    }
                } finally {
                    if (!signal.aborted) {
                        setIsTransactionsLoaded(true);
                    }
                }
            };

            loadMockData();
            return () => abortController.abort();
        }

        if (!firebaseConfig) {
            setUserId('GUEST_NO_FIREBASE_CONFIG');
            setIsAuthReady(true);
            setHasActiveSession(true);
            setWalletAddress(DEFAULT_PROFILE.walletAddress);
            setBalance(DEFAULT_PROFILE.balance);
            setTransactions(() => [...DEFAULT_TRANSACTIONS]);
            setIsProfileLoaded(true);
            setIsTransactionsLoaded(true);
            return;
        }

        let appInstance;
        try {
            appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            setIsAuthReady(true);
            setIsProfileLoaded(true);
            setIsTransactionsLoaded(true);
            return;
        }

        const auth = getAuth(appInstance);
        const db = getFirestore(appInstance);
        firebaseServicesRef.current = { auth, db };

        const activeUnsubscribes: Array<() => void> = [];

        const resetDataToDefaults = () => {
            setWalletAddress(DEFAULT_PROFILE.walletAddress);
            setBalance(DEFAULT_PROFILE.balance);
            setTransactions(() => [...DEFAULT_TRANSACTIONS]);
        };

        const subscribeToUserData = (uid: string) => {
            setIsProfileLoaded(false);
            setIsTransactionsLoaded(false);

            const profileUnsubscribe = onSnapshot(
                doc(db, 'artifacts', appId, 'users', uid),
                (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.data() as Record<string, unknown>;
                        const nextWallet = typeof data.walletAddress === 'string' && data.walletAddress ? data.walletAddress : DEFAULT_PROFILE.walletAddress;
                        const nextBalanceRaw = data.balance;
                        const nextBalance = typeof nextBalanceRaw === 'number' ? nextBalanceRaw : parseFloat(String(nextBalanceRaw ?? DEFAULT_PROFILE.balance));
                        setWalletAddress(nextWallet);
                        setBalance(Number.isFinite(nextBalance) ? nextBalance : DEFAULT_PROFILE.balance);
                    } else {
                        resetDataToDefaults();
                    }
                    setIsProfileLoaded(true);
                },
                (error) => {
                    console.error('Profile listener error:', error);
                    setIsProfileLoaded(true);
                },
            );

            const transactionsRef = query(
                collection(db, 'artifacts', appId, 'users', uid, 'transactions'),
                orderBy('createdAt', 'desc'),
                limit(10),
            );

            const transactionsUnsubscribe = onSnapshot(
                transactionsRef,
                (snapshot) => {
                    if (!snapshot.empty) {
                        const records: TransactionRecord[] = snapshot.docs.map((docSnap) => {
                            const data = docSnap.data() as Record<string, unknown>;
                            const createdAtValue = data.createdAt;
                            let createdAt = new Date();
                            if (createdAtValue instanceof Timestamp) {
                                createdAt = createdAtValue.toDate();
                            } else if (typeof createdAtValue === 'number') {
                                createdAt = new Date(createdAtValue);
                            } else if (typeof createdAtValue === 'string') {
                                const parsed = new Date(createdAtValue);
                                if (!Number.isNaN(parsed.valueOf())) {
                                    createdAt = parsed;
                                }
                            }

                            const rawAmount = typeof data.amount === 'number' ? data.amount : parseFloat(String(data.amount ?? 0));
                            const directionRaw = (typeof data.direction === 'string' ? data.direction : undefined) ?? (typeof data.type === 'string' && data.type.toLowerCase().includes('send') ? 'out' : 'in');
                            const signedAmount = directionRaw === 'out' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

                            return {
                                id: docSnap.id,
                                type: typeof data.type === 'string' ? data.type : 'Transaction',
                                amount: Number.isFinite(signedAmount) ? signedAmount : 0,
                                createdAt,
                                description: typeof data.description === 'string' ? data.description : undefined,
                                counterparty: typeof data.recipient === 'string' && data.recipient ? data.recipient : typeof data.counterparty === 'string' ? data.counterparty : undefined,
                                direction: directionRaw === 'out' ? 'out' : directionRaw === 'trade' ? 'trade' : 'in',
                            } as TransactionRecord;
                        });
                        setTransactions(records);
                    } else {
                        setTransactions(() => [...DEFAULT_TRANSACTIONS]);
                    }
                    setIsTransactionsLoaded(true);
                },
                (error) => {
                    console.error('Transactions listener error:', error);
                    setTransactions(() => [...DEFAULT_TRANSACTIONS]);
                    setIsTransactionsLoaded(true);
                },
            );

            activeUnsubscribes.push(profileUnsubscribe, transactionsUnsubscribe);
        };

        const initializeAuth = async () => {
            try {
                if (!auth.currentUser) {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                }
            } catch (error) {
                console.error('Firebase sign-in failed:', error);
            }
        };

        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            activeUnsubscribes.forEach((fn) => fn());
            activeUnsubscribes.length = 0;

            if (user) {
                setUserId(user.uid);
                setHasActiveSession(true);
                subscribeToUserData(user.uid);
            } else {
                setUserId(crypto.randomUUID());
                setHasActiveSession(false);
                resetDataToDefaults();
                setIsProfileLoaded(true);
                setIsTransactionsLoaded(true);
            }

            setIsAuthReady(true);
        });

        initializeAuth();

        return () => {
            authUnsubscribe();
            activeUnsubscribes.forEach((fn) => fn());
        };

    }, [firebaseConfig, mockApiBase, mockPrimaryToken, mockUserId, useMockApi]);

    const handleSendTransaction = useCallback(
        async ({ recipient, amount }: { recipient: string; amount: number }) => {
            const sanitizedAmount = Math.abs(amount);
            if (!sanitizedAmount) {
                throw new Error('Invalid amount');
            }

            if (useMockApi) {
                const response = await fetch(`${mockApiBase}/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        from: walletAddress,
                        to: recipient,
                        token: mockPrimaryToken,
                        amount: sanitizedAmount,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Mock API send failed with status ${response.status}`);
                }

                const payload = (await response.json()) as { success?: boolean; tx?: Record<string, unknown> };
                if (payload && payload.success === false) {
                    throw new Error('Mock API rejected the send request');
                }

                const transactionRaw = (payload?.tx ?? {}) as Record<string, unknown>;
                const record = mapMockTransaction({
                    id: transactionRaw.id ?? `mock-${Date.now()}`,
                    type: typeof transactionRaw.type === 'string' ? transactionRaw.type : 'Sent',
                    amount: transactionRaw.amount ?? sanitizedAmount,
                    timestamp: transactionRaw.timestamp ?? new Date().toISOString(),
                    to: transactionRaw.to ?? recipient,
                    from: transactionRaw.from ?? walletAddress,
                    direction: 'out',
                    description: transactionRaw.description ?? `Sent ${mockPrimaryToken} to ${recipient}`,
                });

                setTransactions((prev) => [record, ...prev].slice(0, 10));
                setBalance((prev) => Math.max(0, prev - sanitizedAmount));
                return;
            }

            if (!firebaseConfig || !hasActiveSession) {
                const previewRecord: TransactionRecord = {
                    id: `preview-${Date.now()}`,
                    type: 'Sent (Preview)',
                    amount: -sanitizedAmount,
                    createdAt: new Date(),
                    counterparty: recipient,
                    direction: 'out',
                };
                setTransactions((prev) => [previewRecord, ...prev].slice(0, 10));
                setBalance((prev) => Math.max(0, prev - sanitizedAmount));
                return;
            }

            const { db, auth } = firebaseServicesRef.current;
            if (!db || !auth) {
                throw new Error('Firebase services unavailable');
            }

            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error('User is not authenticated');
            }

            const txCollectionRef = collection(db, 'artifacts', appId, 'users', currentUser.uid, 'transactions');
            await addDoc(txCollectionRef, {
                type: 'Sent',
                amount: sanitizedAmount,
                recipient,
                direction: 'out',
                createdAt: serverTimestamp(),
                description: `Sent MEE to ${recipient}`,
                status: 'pending',
            });

            const profileRef = doc(db, 'artifacts', appId, 'users', currentUser.uid);
            await setDoc(
                profileRef,
                {
                    walletAddress,
                    balance: increment(-sanitizedAmount),
                },
                { merge: true },
            );

            setBalance((prev) => Math.max(0, prev - sanitizedAmount));
        },
        [firebaseConfig, hasActiveSession, mockApiBase, mockPrimaryToken, useMockApi, walletAddress],
    );

    const isDataLoading = !isProfileLoaded || !isTransactionsLoaded;
    const canSend = useMockApi || !firebaseConfig || hasActiveSession;

    // Function to render the correct page component based on state
    const renderPage = () => {
        if (!isAuthReady) {
            return (
                <div className="flex-1 flex items-center justify-center text-xl text-gray-400">
                    Loading Authentication...
                </div>
            );
        }

        switch (currentPage) {
            case 'dashboard':
                return (
                    <DashboardPage
                        balance={balance}
                        walletAddress={walletAddress}
                        userId={userId}
                        transactions={transactions}
                        isLoading={isDataLoading}
                    />
                );
            case 'send':
                return <SendTokenPage balance={balance} onSend={handleSendTransaction} canSend={canSend} />;
            case 'receive':
                return <ReceiveTokenPage userId={userId} walletAddress={walletAddress} />;
            case 'marketplace':
                return <MarketplacePage />;
            default:
                return (
                    <DashboardPage
                        balance={balance}
                        walletAddress={walletAddress}
                        userId={userId}
                        transactions={transactions}
                        isLoading={isDataLoading}
                    />
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 font-inter">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
                .font-inter { font-family: 'Inter', sans-serif; }
            `}</style>
            
            {/* Toast Message Container */}
            <div id="toast-message" className="opacity-0 transition-opacity duration-300"></div>

            {/* 1. Navigation Menu (Sidebar) */}
            <NavigationMenu currentPage={currentPage} setCurrentPage={setCurrentPage} />

            {/* 2. Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
}
