
import React, { useState, useEffect } from 'react';
import { MOCK_DISCOUNT_CODES } from '../../constants';
import { DiscountCode } from '../../types';

const DiscountCodes: React.FC = () => {
    const [codes, setCodes] = useState<DiscountCode[]>(MOCK_DISCOUNT_CODES);
    const [showModal, setShowModal] = useState(false);
    const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

    const openCreateModal = () => {
        setEditingCode(null);
        setShowModal(true);
    };

    const openEditModal = (code: DiscountCode) => {
        setEditingCode(code);
        setShowModal(true);
    };

    const handleDeleteCode = (codeId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này không?')) {
            setCodes(prev => prev.filter(c => c.id !== codeId));
        }
    };
    
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        if (editingCode) {
            // Update existing code
            const updatedCode: DiscountCode = {
                ...editingCode,
                code: formData.get('code') as string,
                discountPercent: Number(formData.get('discount')),
                expiryDate: formData.get('expiry') as string,
                status: new Date(formData.get('expiry') as string) > new Date() ? 'active' : 'expired'
            };
            setCodes(prev => prev.map(c => c.id === editingCode.id ? updatedCode : c));
        } else {
            // Create new code
            const newCode: DiscountCode = {
                id: `code_${Date.now()}`,
                code: formData.get('code') as string,
                discountPercent: Number(formData.get('discount')),
                expiryDate: formData.get('expiry') as string,
                status: new Date(formData.get('expiry') as string) > new Date() ? 'active' : 'expired'
            };
            setCodes(prev => [newCode, ...prev]);
        }
        
        setShowModal(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách mã giảm giá</h2>
                <button 
                    onClick={openCreateModal}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Tạo mã mới
                </button>
            </div>
            
             <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900/50 rounded-lg">
                    <thead>
                        <tr className="bg-gray-700/50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mã</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Giảm giá (%)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ngày hết hạn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {codes.map(code => (
                            <tr key={code.id} className="hover:bg-gray-800/60">
                                <td className="px-6 py-4 whitespace-nowrap font-mono">{code.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{code.discountPercent}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">{code.expiryDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${code.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                        {code.status === 'active' ? 'Hoạt động' : 'Hết hạn'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => openEditModal(code)} className="text-indigo-400 hover:text-indigo-300 mr-4">Sửa</button>
                                    <button onClick={() => handleDeleteCode(code.id)} className="text-red-500 hover:text-red-400">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">{editingCode ? 'Sửa mã giảm giá' : 'Tạo mã giảm giá mới'}</h3>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Mã code</label>
                                <input name="code" type="text" defaultValue={editingCode?.code} required className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-lg" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Phần trăm giảm giá</label>
                                <input name="discount" type="number" defaultValue={editingCode?.discountPercent} required className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-lg" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Ngày hết hạn</label>
                                <input name="expiry" type="date" defaultValue={editingCode?.expiryDate} required className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-lg" />
                            </div>
                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-500">Hủy</button>
                                <button type="submit" className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700">
                                    {editingCode ? 'Lưu thay đổi' : 'Tạo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountCodes;
