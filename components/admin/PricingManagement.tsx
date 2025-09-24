
import React, { useState } from 'react';
import { PRICING_PLANS } from '../../constants';
import { PricingPlan } from '../../types';

const PricingManagement: React.FC = () => {
    const [plans, setPlans] = useState<PricingPlan[]>(PRICING_PLANS);

    const handleInputChange = (planId: string, field: keyof PricingPlan, value: string | number | boolean) => {
        setPlans(plans.map(plan =>
            plan.id === planId ? { ...plan, [field]: value } : plan
        ));
    };

    const handleFeatureChange = (planId: string, featureIndex: number, value: string) => {
         setPlans(plans.map(plan => {
            if (plan.id === planId) {
                const newFeatures = [...plan.features];
                newFeatures[featureIndex] = value;
                return { ...plan, features: newFeatures };
            }
            return plan;
        }));
    };
    
    const handleSaveChanges = () => {
        // In a real application, this would send the 'plans' state to the backend API.
        console.log('Saving changes:', plans);
        alert('Thay đổi đã được lưu (mô phỏng)!');
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Chỉnh sửa bảng giá</h2>
            <div className="space-y-8">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-gray-900/50 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-indigo-400">{plan.name}</h3>
                            <div className="flex items-center">
                                <label htmlFor={`popular-${plan.id}`} className="mr-2 text-sm font-medium text-gray-300">Phổ biến</label>
                                <input
                                    type="checkbox"
                                    id={`popular-${plan.id}`}
                                    checked={!!plan.popular}
                                    onChange={e => handleInputChange(plan.id, 'popular', e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Tên gói</label>
                                <input 
                                    type="text" 
                                    value={plan.name} 
                                    onChange={e => handleInputChange(plan.id, 'name', e.target.value)}
                                    className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Giá (VNĐ)</label>
                                <input 
                                    type="number" 
                                    value={plan.price}
                                    onChange={e => handleInputChange(plan.id, 'price', Number(e.target.value))}
                                    className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Số credits</label>
                                <input 
                                    type="number" 
                                    value={plan.credits}
                                    onChange={e => handleInputChange(plan.id, 'credits', Number(e.target.value))}
                                    className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                             <label className="block text-sm font-medium text-gray-300">Tính năng (mỗi dòng một tính năng)</label>
                             <div className="space-y-2 mt-1">
                                {plan.features.map((feature, index) => (
                                     <input 
                                        key={index}
                                        type="text" 
                                        value={feature}
                                        onChange={e => handleFeatureChange(plan.id, index, e.target.value)}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                                    />
                                ))}
                             </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-end">
                <button 
                    onClick={handleSaveChanges}
                    className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default PricingManagement;
