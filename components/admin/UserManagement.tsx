
import React, { useState, useMemo } from 'react';
import { MOCK_USERS } from '../../constants';
import { User } from '../../types';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, users]);
    
    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        }
    };
    
    const handleEditUser = (userId: string) => {
        alert(`(Mô phỏng) Chuyển đến trang chỉnh sửa cho người dùng ID: ${userId}`);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm p-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900/50 rounded-lg">
                    <thead>
                        <tr className="bg-gray-700/50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Credits</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ngày tham gia</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-800/60">
                                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                    <img className="h-8 w-8 rounded-full mr-3" src={user.avatar} alt={user.name} />
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.credits.toLocaleString('vi-VN')}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.joinDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleEditUser(user.id)} className="text-indigo-400 hover:text-indigo-300 mr-4">Sửa</button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
