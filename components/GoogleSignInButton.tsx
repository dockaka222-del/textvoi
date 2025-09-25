import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon } from './icons/GoogleIcon';

// ========================================================================
// HƯỚNG DẪN CẤU HÌNH BIẾN MÔI TRƯỜNG CHO FRONTEND
// ========================================================================
// Để sử dụng Google Sign-In, bạn cần tạo một file `.env.local` ở thư mục gốc
// của dự án và thêm Google Client ID của bạn vào đó.
//
// File: .env.local
// REACT_APP_GOOGLE_CLIENT_ID='YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
//
// Biến môi trường này là AN TOÀN để sử dụng ở frontend. Nó chỉ định danh
// ứng dụng của bạn với Google và không phải là một key bí mật.
// Trong một dự án build bằng Vite hoặc Create React App, các biến có tiền tố
// REACT_APP_ hoặc VITE_ sẽ được nhúng vào code tại thời điểm build.
// ========================================================================

// FIX: Add type declaration for the Google Identity Services library on the window object
// to resolve TypeScript errors about 'google' not existing on 'Window'.
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential?: string }) => void;
                    }) => void;
                    renderButton: (
                        parent: HTMLElement,
                        options: {
                            theme?: 'outline' | 'filled_blue' | 'filled_black';
                            size?: 'large' | 'medium' | 'small';
                            type?: 'standard' | 'icon';
                            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
                        }
                    ) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

const GoogleSignInButton: React.FC = () => {
    const { login } = useAuth();
    const buttonDiv = useRef<HTMLDivElement>(null);

    // Đây là nơi bạn sẽ lấy Client ID từ biến môi trường.
    // Trong một dự án thực tế, bạn sẽ dùng:
    // const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    // QUAN TRỌNG: Đây là một giá trị MẪU. Bạn PHẢI thay thế nó bằng
    // Google Client ID thật của bạn từ Google Cloud Console để đăng nhập hoạt động.
    // FIX: Explicitly type GOOGLE_CLIENT_ID as string to avoid TypeScript inferring a too-specific literal type,
    // which caused an "unintentional comparison" error below.
    const GOOGLE_CLIENT_ID: string = '1234567890-fake-client-id.apps.googleusercontent.com';

    const isConfigured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

    useEffect(() => {
        if (!isConfigured || !window.google || !buttonDiv.current) {
            // Hiển thị cảnh báo nếu Client ID chưa được thay đổi
            if (!isConfigured) {
                console.warn("QUAN TRỌNG: Google Client ID chưa được cấu hình trong `components/GoogleSignInButton.tsx`. Đăng nhập Google sẽ không hoạt động cho đến khi bạn thay thế giá trị mẫu.");
            }
            return;
        }

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response) => {
                // response.credential là JWT token do Google cung cấp
                // FIX: Check if response.credential exists before calling login to prevent runtime errors.
                if (response.credential) {
                    await login(response.credential);
                }
            },
        });

        window.google.accounts.id.renderButton(
            buttonDiv.current,
            { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with' }
        );
        
        // window.google.accounts.id.prompt(); // Optional: Hiển thị One Tap prompt

    }, [isConfigured, login]);

    // Luôn hiển thị nút, nhưng nó sẽ không hoạt động nếu Client ID là giả
    return <div ref={buttonDiv}></div>;
};

export default GoogleSignInButton;