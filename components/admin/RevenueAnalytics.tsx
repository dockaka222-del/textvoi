
import React, { useMemo, useState } from 'react';
import { MOCK_TRANSACTIONS } from '../../constants';

const PIE_CHART_COLORS = ['#4f46e5', '#7c3aed', '#db2777', '#f59e0b'];

interface RevenueData {
    totalRevenue: number;
    totalTransactions: number;
    averageTransactionValue: number;
    revenueByPlan: { name: string; value: number }[];
}

interface TooltipData {
    name: string;
    value: number;
    percent: number;
    x: number;
    y: number;
}

const RevenueAnalytics: React.FC = () => {
    const analyticsData = useMemo<RevenueData>(() => {
        const totalRevenue = MOCK_TRANSACTIONS.reduce((sum, txn) => sum + txn.amount, 0);
        const totalTransactions = MOCK_TRANSACTIONS.length;
        const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        const revenueByPlanMap = MOCK_TRANSACTIONS.reduce((acc, txn) => {
            acc[txn.planName] = (acc[txn.planName] || 0) + txn.amount;
            return acc;
        }, {} as Record<string, number>);
        
        const revenueByPlan = Object.entries(revenueByPlanMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        return {
            totalRevenue,
            totalTransactions,
            averageTransactionValue,
            revenueByPlan,
        };
    }, []);

    const recentTransactions = MOCK_TRANSACTIONS.slice(0, 5);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    
    const PieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
        const [tooltip, setTooltip] = useState<TooltipData | null>(null);

        const total = data.reduce((sum, item) => sum + item.value, 0);
        if (total === 0) {
            return <div className="flex items-center justify-center h-64 bg-gray-900/50 rounded-full text-gray-500">Không có dữ liệu</div>;
        }

        const getCoordinatesForPercent = (percent: number) => {
            const x = Math.cos(2 * Math.PI * percent - Math.PI / 2);
            const y = Math.sin(2 * Math.PI * percent - Math.PI / 2);
            return [x, y];
        };
        
        let cumulativePercent = 0;
        const slices = data.map((item, index) => {
            const percent = item.value / total;
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent + percent);
            const largeArcFlag = percent > 0.5 ? 1 : 0;

            const pathData = [
                `M 50 50`, // Move to center
                `L ${startX * 45 + 50} ${startY * 45 + 50}`, // Line to start of arc
                `A 45 45 0 ${largeArcFlag} 1 ${endX * 45 + 50} ${endY * 45 + 50}`, // Arc
                `Z` // Close path
            ].join(' ');
            
            cumulativePercent += percent;
            return {
                ...item,
                pathData,
                color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
                percent: percent * 100,
            };
        });

        const handleMouseMove = (e: React.MouseEvent, sliceData: (typeof slices)[0]) => {
            setTooltip({
                name: sliceData.name,
                value: sliceData.value,
                percent: sliceData.percent,
                x: e.clientX,
                y: e.clientY,
            });
        };

        return (
            <div className="relative flex flex-col items-center">
                <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-lg">
                    {slices.map((slice) => (
                        <path
                            key={slice.name}
                            d={slice.pathData}
                            fill={slice.color}
                            onMouseMove={(e) => handleMouseMove(e, slice)}
                            onMouseLeave={() => setTooltip(null)}
                            style={{
                                transition: 'transform 0.15s ease-out',
                                transformOrigin: '50% 50%',
                                transform: tooltip?.name === slice.name ? 'scale(1.05)' : 'scale(1)',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </svg>

                {tooltip && (
                    <div
                        className="fixed bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl text-sm pointer-events-none z-50"
                        style={{
                            top: tooltip.y,
                            left: tooltip.x,
                            transform: 'translate(15px, -100%)',
                        }}
                    >
                        <div className="font-bold">{tooltip.name}</div>
                        <div>{formatCurrency(tooltip.value)}</div>
                        <div className="text-gray-300">{tooltip.percent.toFixed(1)}%</div>
                    </div>
                )}

                <div className="mt-4 w-full space-y-2 text-sm">
                    {slices.map((item, index) => (
                        <div key={item.name} className="flex items-center">
                            <span 
                                className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="text-gray-300 truncate mr-2">{item.name}:</span>
                            <span className="ml-auto font-semibold">{formatCurrency(item.value)}</span>
                            <span className="ml-2 w-16 text-right text-gray-400 font-medium">({item.percent.toFixed(1)}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Tổng quan Doanh thu</h2>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900/50 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400">Tổng Doanh thu</h3>
                    <p className="mt-2 text-3xl font-bold text-indigo-400">{formatCurrency(analyticsData.totalRevenue)}</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400">Tổng số Giao dịch</h3>
                    <p className="mt-2 text-3xl font-bold">{analyticsData.totalTransactions}</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400">Doanh thu Trung bình / Giao dịch</h3>
                    <p className="mt-2 text-3xl font-bold">{formatCurrency(analyticsData.averageTransactionValue)}</p>
                </div>
            </div>

            {/* Chart and Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-gray-900/50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-center">Doanh thu theo Gói</h3>
                     <PieChart data={analyticsData.revenueByPlan} />
                </div>
                <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Giao dịch Gần đây</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="py-2 text-left text-xs font-medium text-gray-400 uppercase">Người dùng</th>
                                    <th className="py-2 text-left text-xs font-medium text-gray-400 uppercase">Gói</th>
                                    <th className="py-2 text-left text-xs font-medium text-gray-400 uppercase">Số tiền</th>
                                    <th className="py-2 text-left text-xs font-medium text-gray-400 uppercase">Ngày</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {recentTransactions.map(txn => (
                                    <tr key={txn.id}>
                                        <td className="py-3 whitespace-nowrap">{txn.userName}</td>
                                        <td className="py-3 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-900 text-indigo-300">
                                                {txn.planName}
                                            </span>
                                        </td>
                                        <td className="py-3 whitespace-nowrap font-medium">{formatCurrency(txn.amount)}</td>
                                        <td className="py-3 whitespace-nowrap text-gray-400">{txn.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueAnalytics;
