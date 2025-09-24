
import React from 'react';
import { PRICING_PLANS } from '../constants';
import { Page, PricingPlan } from '../types';

interface PricingCardProps {
    plan: PricingPlan;
    onSelect: (planId: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect }) => {
    return (
        <div className={`relative flex flex-col p-8 rounded-2xl shadow-lg border-2 transition-all duration-300
            ${plan.popular ? 'bg-indigo-600/20 border-indigo-500' : 'bg-gray-800/50 border-gray-700 hover:border-indigo-500'}`}
        >
            {plan.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Phổ biến
                </div>
            )}
            <h3 className="text-2xl font-semibold">{plan.name}</h3>
            <p className="mt-4 text-4xl font-bold">
                {plan.price.toLocaleString('vi-VN')}
                <span className="text-lg font-medium text-gray-400"> VNĐ</span>
            </p>
            <p className="mt-2 text-indigo-300 font-medium">
                {plan.credits.toLocaleString('vi-VN')} ký tự
            </p>
            <ul className="mt-6 space-y-2 text-gray-300 flex-grow">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {feature}
                    </li>
                ))}
            </ul>
            <button
                onClick={() => onSelect(plan.id)}
                className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold transition-all duration-300
                ${plan.popular ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-indigo-500 hover:text-white'}`}
            >
                Mua ngay
            </button>
        </div>
    );
};

interface PricingPageProps {
    navigate: (page: Page) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ navigate }) => {
    const handleSelectPlan = (planId: string) => {
        // In a real app, you might pass the planId in the URL or state
        console.log(`Plan selected: ${planId}`);
        navigate('top-up');
    };

    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Bảng giá</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                Chọn gói phù hợp với nhu cầu của bạn và bắt đầu tạo ra những sản phẩm âm thanh tuyệt vời.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {PRICING_PLANS.map(plan => (
                    <PricingCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
                ))}
            </div>
        </div>
    );
};

export default PricingPage;
