
import { PricingPlan, User, DiscountCode, Transaction, GeneratedFile } from './types';

export const MOCK_ADMIN_USER: User = {
    id: 'admin01',
    name: 'Admin',
    email: 'admin@aivoice.studio',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    credits: 999999,
    role: 'admin',
    joinDate: '2023-01-15'
};

export const MOCK_NORMAL_USER: User = {
    id: 'user01',
    name: 'Người Dùng',
    email: 'user@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user',
    credits: 50000,
    role: 'user',
    joinDate: '2024-05-20'
};

export const PRICING_PLANS: PricingPlan[] = [
    {
        id: 'plan_starter',
        name: 'Khởi đầu',
        price: 99000,
        credits: 100000,
        features: ['100,000 ký tự', 'Giọng nói cơ bản', 'Hỗ trợ email'],
    },
    {
        id: 'plan_pro',
        name: 'Chuyên nghiệp',
        price: 249000,
        credits: 500000,
        features: ['500,000 ký tự', 'Giọng nói cao cấp', 'API Access', 'Hỗ trợ ưu tiên'],
        popular: true,
    },
    {
        id: 'plan_business',
        name: 'Doanh nghiệp',
        price: 799000,
        credits: 2000000,
        features: ['2,000,000 ký tự', 'Tất cả giọng nói', 'Tùy chỉnh giọng', 'Quản lý nhóm'],
    },
];

export const MOCK_USERS: User[] = [
    { id: 'user_1', name: 'Nguyễn Văn A', email: 'vana@example.com', avatar: 'https://i.pravatar.cc/150?u=user1', credits: 12000, role: 'user', joinDate: '2024-03-10' },
    { id: 'user_2', name: 'Trần Thị B', email: 'thib@example.com', avatar: 'https://i.pravatar.cc/150?u=user2', credits: 75000, role: 'user', joinDate: '2024-01-22' },
    { id: 'user_3', name: 'Lê Hoàng C', email: 'hoangc@example.com', avatar: 'https://i.pravatar.cc/150?u=user3', credits: 0, role: 'user', joinDate: '2024-06-01' },
    { id: 'user_4', name: 'Phạm Minh D', email: 'minhd@example.com', avatar: 'https://i.pravatar.cc/150?u=user4', credits: 500000, role: 'user', joinDate: '2023-11-05' },
    MOCK_NORMAL_USER,
    MOCK_ADMIN_USER
];


export const MOCK_DISCOUNT_CODES: DiscountCode[] = [
    { id: 'code_1', code: 'WELCOME25', discountPercent: 25, status: 'active', expiryDate: '2025-12-31' },
    { id: 'code_2', code: 'SUMMER2024', discountPercent: 15, status: 'active', expiryDate: '2024-08-31' },
    { id: 'code_3', code: 'OLDCODE', discountPercent: 10, status: 'expired', expiryDate: '2023-12-31' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'txn_1', userId: 'user_1', userName: 'Nguyễn Văn A', planId: 'plan_pro', planName: 'Chuyên nghiệp', amount: 249000, date: '2024-07-20' },
    { id: 'txn_2', userId: 'user_2', userName: 'Trần Thị B', planId: 'plan_starter', planName: 'Khởi đầu', amount: 99000, date: '2024-07-19' },
    { id: 'txn_3', userId: 'user_4', userName: 'Phạm Minh D', planId: 'plan_business', planName: 'Doanh nghiệp', amount: 799000, date: '2024-07-18' },
    { id: 'txn_4', userId: 'user_1', userName: 'Nguyễn Văn A', planId: 'plan_starter', planName: 'Khởi đầu', amount: 99000, date: '2024-07-15' },
    { id: 'txn_5', userId: 'user01', userName: 'Người Dùng', planId: 'plan_pro', planName: 'Chuyên nghiệp', amount: 249000, date: '2024-07-12' },
    { id: 'txn_6', userId: 'user_2', userName: 'Trần Thị B', planId: 'plan_pro', planName: 'Chuyên nghiệp', amount: 249000, date: '2024-07-10' },
    { id: 'txn_7', userId: 'user01', userName: 'Người Dùng', planId: 'plan_starter', planName: 'Khởi đầu', amount: 99000, date: '2024-07-09' },
    { id: 'txn_8', userId: 'user_4', userName: 'Phạm Minh D', planId: 'plan_pro', planName: 'Chuyên nghiệp', amount: 249000, date: '2024-07-05' },
    { id: 'txn_9', userId: 'user_1', userName: 'Nguyễn Văn A', planId: 'plan_pro', planName: 'Chuyên nghiệp', amount: 249000, date: '2024-07-02' },
    { id: 'txn_10', userId: 'user_2', userName: 'Trần Thị B', planId: 'plan_business', planName: 'Doanh nghiệp', amount: 799000, date: '2024-06-28' },
];


const now = new Date();
export const MOCK_GENERATED_FILES: GeneratedFile[] = [
    { 
        id: 'file_1', 
        userId: 'user01', 
        textSnippet: 'Chào mừng bạn đến với AI Voice Studio...',
        voice: 'Giọng Nữ Miền Bắc (Mai)',
        charCount: 45,
        url: 'https://cloud.google.com/text-to-speech/docs/audio/vi-VN-Standard-A.wav',
        createdAt: now.toISOString(),
    },
    { 
        id: 'file_2', 
        userId: 'user01', 
        textSnippet: 'Đây là một thử nghiệm cho giọng đọc tin tức...',
        voice: 'Giọng đọc tin tức',
        charCount: 150,
        url: 'https://cloud.google.com/text-to-speech/docs/audio/vi-VN-Wavenet-A.wav',
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    { 
        id: 'file_3', 
        userId: 'user01', 
        textSnippet: 'Một tệp âm thanh đã được tạo ra từ khá lâu...',
        voice: 'Giọng Nam Miền Nam (Gia Hưng)',
        charCount: 88,
        url: 'https://cloud.google.com/text-to-speech/docs/audio/vi-VN-Standard-D.wav',
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago (expired)
    },
     { 
        id: 'file_4', 
        userId: 'user_2', // Belongs to another user
        textSnippet: 'File này không thuộc về người dùng đang đăng nhập...',
        voice: 'Giọng Nữ Miền Nam (Ban Mai)',
        charCount: 120,
        url: 'https://cloud.google.com/text-to-speech/docs/audio/vi-VN-Standard-C.wav',
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
];