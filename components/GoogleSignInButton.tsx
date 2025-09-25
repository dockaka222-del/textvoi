
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

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

    // ========================================================================
    // HƯỚNG DẪN CẤU HÌNH (QUAN TRỌNG)
    // ========================================================================
    // BẠN PHẢI THAY THẾ GIÁ TRỊ DƯỚI ĐÂY BẰNG GOOGLE CLIENT ID THẬT CỦA BẠN.
    // Lấy Client ID từ Google Cloud Console trong phần "Credentials".
    //
    // VÍ DỤ: const GOOGLE_CLIENT_ID = '1234567890-abcdefg.apps.googleusercontent.com';
    // ========================================================================
    const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com';

    useEffect(() => {
        // Nếu ID chưa được cấu hình hoặc thư viện Google chưa tải, không làm gì cả.
        if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com' || !window.google || !buttonDiv.current) {
            return;
        }

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    if (response.credential) {
                        // The credential IS the idToken
                        await login(response.credential);
                    } else {
                        console.error("Google credential not found in response.");
                    }
                },
            });

            window.google.accounts.id.renderButton(
                buttonDiv.current,
                { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with' }
            );
        } catch (error) {
            console.error("Lỗi khi khởi tạo Google Sign-In:", error);
        }

    }, [login]);

    // Nếu Client ID chưa được cấu hình, hiển thị một nút thông báo lỗi rõ ràng và hữu ích.
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com') {
        return (
            <div className="bg-yellow-500 text-black text-xs font-semibold px-3 py-2 rounded-md text-center">
                <p>Cần cấu hình Google Login</p>
                <p className="font-mono mt-1 opacity-80">Sửa file: GoogleSignInButton.tsx</p>
            </div>
        );
    }

    // Nếu đã cấu hình, render div để thư viện Google gắn nút đăng nhập vào.
    return <div ref={buttonDiv}></div>;
};

export default GoogleSignInButton;
