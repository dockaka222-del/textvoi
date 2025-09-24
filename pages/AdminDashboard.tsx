
import React, { useState } from 'react';
import UserManagement from '../components/admin/UserManagement';
import DiscountCodes from '../components/admin/DiscountCodes';
import PricingManagement from '../components/admin/PricingManagement';
import RevenueAnalytics from '../components/admin/RevenueAnalytics';

type AdminTab = 'revenue' | 'users' | 'discounts' | 'pricing';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('revenue');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'revenue':
                return <RevenueAnalytics />;
            case 'users':
                return <UserManagement />;
            case 'discounts':
                return <DiscountCodes />;
            case 'pricing':
                return <PricingManagement />;
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{tab: AdminTab, children: React.ReactNode}> = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === tab 
                    ? 'bg-gray-800 text-white border-b-2 border-indigo-500' 
                    : 'text-gray-400 hover:bg-gray-700/50'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Bảng điều khiển Quản trị viên</h1>
            
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton tab="revenue">Thống kê Doanh thu</TabButton>
                    <TabButton tab="users">Quản lý Người dùng</TabButton>
                    <TabButton tab="discounts">Quản lý Mã giảm giá</TabButton>
                    <TabButton tab="pricing">Quản lý Bảng giá</TabButton>
                </nav>
            </div>

            <div className="mt-6 bg-gray-800 rounded-b-lg p-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;