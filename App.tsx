
import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import TopUpPage from './pages/TopUpPage';
import AdminDashboard from './pages/AdminDashboard';
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
                return user?.role === 'admin' ? <AdminDashboard /> : <HomePage />;
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
