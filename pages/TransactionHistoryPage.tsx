import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_TRANSACTIONS } from '../constants';

const TransactionHistoryPage: React.FC = () => {
    const { user } = useAuth();

    // Filter transactions for the logged-in user
    // FIX: Use `user.sub` which holds the email as the unique identifier from the JWT, instead of the non-existent `user.id`.
    const userTransactions = MOCK_TRANSACTIONS.filter(txn => txn.userId === user?.sub);
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Lịch sử Giao dịch</h1>
            <div className="bg-gray-800/50 rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-700/50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ngày</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gói</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Số tiền</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {userTransactions.length > 0 ? (
                                userTransactions.map(txn => (
                                    <tr key={txn.id} className="hover:bg-gray-800/60">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{txn.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-900 text-indigo-300">
                                                {txn.planName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{formatCurrency(txn.amount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                                                Thành công
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-400">
                                        Bạn chưa có giao dịch nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistoryPage;