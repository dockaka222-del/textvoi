
import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import TopUpPage from './pages/TopUpPage';
import AdminDashboard from './pages/AdminDashboard';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import FileHistoryPage from './pages/FileHistoryPage';
import { Page } from './types';

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const { user } = useAuth();

    const navigate = useCallback((page: Page) => {
        setCurrentPage(page);
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'pricing':
                return <PricingPage navigate={navigate} />;
            case 'top-up':
                return <TopUpPage navigate={navigate} />;
            case 'admin':
                // ========================================================================
                // CẢNH BÁO BẢO MẬT NGHIÊM TRỌNG (CRITICAL SECURITY WARNING)
                // ========================================================================
                // Việc kiểm tra `user?.isAdmin` ở phía CLIENT-SIDE chỉ dùng
                // để hiển thị/ẩn giao diện và CỰC KỲ KHÔNG AN TOÀN. Bất kỳ người dùng
                // nào cũng có thể giả mạo vai trò 'admin' trên trình duyệt của họ.
                //
                // **YÊU CẦU BẮT BUỘC:** Tất cả các API endpoint dành cho admin
                // (ví dụ: /api/users, /api/analytics,...) PHẢI được bảo vệ ở phía
                // BACKEND. Backend phải xác thực JWT token và kiểm tra vai trò 'admin'
                // trên MỌI request trước khi trả về dữ liệu.
                // ========================================================================
                return user?.isAdmin ? <AdminDashboard /> : <HomePage />;
            case 'transaction-history':
                return user ? <TransactionHistoryPage /> : <HomePage />;
            case 'file-history':
                return user ? <FileHistoryPage /> : <HomePage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 flex flex-col">
            <Header navigate={navigate} currentPage={currentPage} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;