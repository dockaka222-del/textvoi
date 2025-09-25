import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_GENERATED_FILES } from '../constants';
import { GeneratedFile } from '../types';

const FILE_EXPIRATION_HOURS = 72;

const FileHistoryPage: React.FC = () => {
    const { user } = useAuth();

    // FIX: Use `user.sub` which holds the email as the unique identifier from the JWT, instead of the non-existent `user.id`.
    const userFiles = MOCK_GENERATED_FILES.filter(file => file.userId === user?.sub);

    const getFileStatus = (file: GeneratedFile): { isExpired: boolean, timeLeft: string } => {
        const createdAt = new Date(file.createdAt);
        const expiresAt = new Date(createdAt.getTime() + FILE_EXPIRATION_HOURS * 60 * 60 * 1000);
        const now = new Date();
        
        if (now > expiresAt) {
            return { isExpired: true, timeLeft: 'Đã hết hạn' };
        }

        const hoursLeft = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
        return { isExpired: false, timeLeft: `Còn lại ~${hoursLeft} giờ` };
    };
    
    const handleDownload = (fileUrl: string) => {
        // In a real app, this might need authentication headers.
        window.open(fileUrl, '_blank');
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Lịch sử Tệp Âm thanh</h1>
            <p className="text-gray-400 mb-6">Các tệp sẽ được lưu trữ trong vòng 72 giờ kể từ lúc tạo.</p>
            
            <div className="bg-gray-800/50 rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-700/50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Văn bản (trích đoạn)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Giọng đọc</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-700">
                             {userFiles.length > 0 ? (
                                userFiles.map(file => {
                                    const { isExpired, timeLeft } = getFileStatus(file);
                                    return (
                                        <tr key={file.id} className="hover:bg-gray-800/60">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300 italic">"{file.textSnippet}"</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{file.voice}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{new Date(file.createdAt).toLocaleString('vi-VN')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isExpired ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                                                    {timeLeft}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDownload(file.url)}
                                                    disabled={isExpired}
                                                    className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                    Tải xuống
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-400">
                                        Bạn chưa tạo tệp âm thanh nào.
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

export default FileHistoryPage;