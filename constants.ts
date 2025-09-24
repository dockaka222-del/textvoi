
import { PricingPlan, User, DiscountCode } from './types';

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
