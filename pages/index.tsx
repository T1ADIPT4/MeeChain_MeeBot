import React, { useState, useEffect, useCallback } from 'react';
import { 
    Home, Send, Wallet, ShoppingBag, LogOut, Copy, QrCode, User, Repeat2, TrendingUp, TrendingDown 
} from 'lucide-react';

// --- Global Context/Setup (Mandatory for Immersive DApps) ---
// Global variables provided by the Canvas environment
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken,
    onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';

// Initialize Firebase Config
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config ? JSON.parse(__firebase_config) : null;

// Mock Wallet/User Data
const MOCK_WALLET_ADDRESS = '0x499bE535e6D0212115b8e9dE60656710B116b3B4';
const MOCK_BALANCE = 1245.75;

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

// 1. Dashboard Page (New - Skeleton)
const DashboardPage = ({ balance, userId }) => {
    const mockHistory = [
        { type: 'Sent', amount: 50.00, date: '2024-10-05', icon: <TrendingDown className="w-4 h-4 text-red-400" /> },
        { type: 'Received', amount: 150.50, date: '2024-10-04', icon: <TrendingUp className="w-4 h-4 text-green-400" /> },
        { type: 'Trade', amount: -25.00, date: '2024-10-03', icon: <Repeat2 className="w-4 h-4 text-yellow-400" /> },
        { type: 'Sent', amount: 10.00, date: '2024-10-02', icon: <TrendingDown className="w-4 h-4 text-red-400" /> },
    ];
    return (
        <div className="p-4 sm:p-8 w-full">
            <h2 className="text-3xl font-bold mb-8 text-white">Dashboard</h2>

            {/* Balance Card */}
            <div className="bg-purple-700 p-6 sm:p-8 rounded-2xl shadow-xl mb-8">
                <p className="text-purple-200 text-sm">Total Balance</p>
                <h3 className="text-5xl font-extrabold mt-1">
                    {balance.toFixed(2)} <span className="text-2xl font-semibold ml-2">MEE</span>
                </h3>
            </div>

            {/* Wallet Address Display */}
            <div className="bg-gray-800 p-4 rounded-xl mb-8">
                <p className="text-sm text-gray-400">Your Wallet Address</p>
                <p className="text-lg font-mono truncate">{MOCK_WALLET_ADDRESS}</p>
            </div>

            {/* Transaction History */}
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Recent Transactions</h3>
            <div className="bg-gray-800 rounded-xl shadow-lg divide-y divide-gray-700">
                {mockHistory.map((tx, index) => (
                    <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-700 transition duration-150">
                        <div className="flex items-center">
                            {tx.icon}
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{tx.type}</p>
                                <p className="text-xs text-gray-400">{tx.date}</p>
                            </div>
                        </div>
                        <p className={`font-mono text-sm font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} MEE
                        </p>
                    </div>
                ))}
            </div>

            <footer className="text-center text-xs text-gray-500 mt-8">
                User ID: {userId || 'Authenticating...'}
            </footer>
        </div>
    );
};

// 2. Send Token Page (New - Skeleton)
const SendTokenPage = () => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const toast = useToast();

    const handleSend = () => {
        if (!recipient || parseFloat(amount) <= 0) {
            toast.error('กรุณากรอกข้อมูลผู้รับและจำนวนที่ถูกต้อง');
            return;
        }
        // Simulate transaction logic
        console.log(`Sending ${amount} MEE to ${recipient}`);
        toast.success(`ส่ง ${amount} MEE ให้ ${recipient} เรียบร้อยแล้ว`);
        setRecipient('');
        setAmount('');
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
                        Available: {MOCK_BALANCE.toFixed(2)} MEE
                    </p>
                </div>

                <button
                    onClick={handleSend}
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition duration-200 active:scale-95"
                >
                    ยืนยันการส่ง
                </button>
            </div>
        </div>
    );
};


// 3. Receive Token Page (Existing - Integrated)
const ReceiveTokenPage = ({ userId }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
    const toast = useToast();

    const handleCopy = useCallback(async () => {
        try {
            const input = document.createElement('textarea');
            input.value = MOCK_WALLET_ADDRESS;
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
    }, [toast]);


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
                            {MOCK_WALLET_ADDRESS}
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
const NavigationMenu = ({ currentPage, setCurrentPage }) => {
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
    // State for navigation and authentication
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    
    // Auth Initialization and Listeners
    useEffect(() => {
        if (!firebaseConfig) {
            setUserId('GUEST_NO_FIREBASE_CONFIG');
            setIsAuthReady(true);
            return;
        }

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        
        // 1. Sign In Logic
        const initializeAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Firebase sign-in failed:", error);
            }
        };

        // 2. Auth State Change Listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(crypto.randomUUID()); // Anonymous or default ID
            }
            setIsAuthReady(true);
        });

        initializeAuth();
        
        // 3. Optional: Example Firestore Listener (Not strictly needed for this simple dashboard, but good practice)
        // if (isAuthReady && auth.currentUser) {
        //     const q = query(collection(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'transactions'));
        //     const unsubscribeData = onSnapshot(q, (snapshot) => {
        //         // Handle data changes here
        //     });
        //     return () => unsubscribeData();
        // }

        return () => unsubscribe();

    }, []); // Only run once on mount

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
                return <DashboardPage balance={MOCK_BALANCE} userId={userId} />;
            case 'send':
                return <SendTokenPage />;
            case 'receive':
                return <ReceiveTokenPage userId={userId} />;
            case 'marketplace':
                return <MarketplacePage />;
            default:
                return <DashboardPage balance={MOCK_BALANCE} userId={userId} />;
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
