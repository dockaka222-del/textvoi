
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

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  amount: number; // in VND
  date: string; // YYYY-MM-DD
}

export interface GeneratedFile {
  id: string;
  userId: string;
  textSnippet: string;
  voice: string;
  charCount: number;
  url: string;
  createdAt: string; // ISO 8601 format
}


export type Page = 'home' | 'pricing' | 'top-up' | 'admin' | 'transaction-history' | 'file-history';