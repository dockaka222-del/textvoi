
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  credits: number;
  role: 'user' | 'admin';
  joinDate: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

export interface DiscountCode {
    id: string;
    code: string;
    discountPercent: number;
    status: 'active' | 'expired';
    expiryDate: string;
}

export type Page = 'home' | 'pricing' | 'top-up' | 'admin';
