import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Page } from '../types';

// This is an unsafe, client-side-only JWT decoder for demo purposes.
// In a real application, you should send the token to your backend for secure verification.
function decodeJwt(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error("Error decoding JWT:", e);
        return null;
    }
}

interface HeaderProps {
    navigate: (page: Page) => void;
    currentPage: Page;
}

const NavLink: React.FC<{
    page: Page;
    currentPage: Page;
    navigate: (page: Page) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, navigate, children }) => (
    <button
        onClick={() => navigate(page)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
            currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {children}
    </button>
);


const UserMenu: React.FC<{ user: User; logout: () => void; navigate: (page: Page) => void }> = ({ user, logout, navigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="text-white font-medium hidden sm:block">{user.name}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-gray-500 truncate">{user.email}</p>
                            <p className="text-indigo-600 font-bold mt-1">{user.credits.toLocaleString('vi-VN')} credits</p>
                        </div>
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate('top-up'); setIsOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Nạp Credit</a>
                        {user.role === 'admin' && (
                           <a href="#" onClick={(e) => { e.preventDefault(); navigate('admin'); setIsOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Bảng điều khiển Admin</a>
                        )}
                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); setIsOpen(false); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">Đăng xuất</a>
                    </div>
                </div>
            )}
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ navigate, currentPage }) => {
    const { user, login, logout } = useAuth();
    
    // ========================================================================
    // IMPORTANT: GOOGLE CLIENT ID CONFIGURATION
    // ========================================================================
    // In a real production application, the Google Client ID MUST be stored in an
    // environment variable (e.g., in a .env file) and accessed via `process.env`.
    // Example for Create React App: REACT_APP_GOOGLE_CLIENT_ID='your-id.apps.googleusercontent.com'
    //
    // For this demonstration environment where environment variables are not available,
    // we are using a placeholder value below.
    //
    // **ACTION REQUIRED:** Replace the placeholder string with your actual Google Client ID from Google Cloud Console.
    const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';


    const handleGoogleLoginCallback = (response: any) => {
        if (!response.credential) {
            return console.error("Google login failed: No credential returned.");
        }

        console.log("Received Google credential");
        const userData = decodeJwt(response.credential);
        
        if (userData) {
            login({
                name: userData.name,
                email: userData.email,
                avatar: userData.picture,
            });
        }
    };

    useEffect(() => {
        if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
            console.warn("Google Client ID is using a placeholder value. Please replace it with your actual Client ID in components/Header.tsx for Google Login to work.");
        }

        if (window.google && !user) {
            try {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleLoginCallback,
                });
    
                const loginButtonDiv = document.getElementById('google-login-button-container');
                if (loginButtonDiv && loginButtonDiv.childElementCount === 0) {
                     window.google.accounts.id.renderButton(loginButtonDiv, {
                        theme: 'filled_black',
                        size: 'large',
                        type: 'standard',
                        shape: 'rectangular',
                        text: 'continue_with',
                        logo_alignment: 'left',
                    });
                }
            } catch (error) {
                console.error("Error initializing Google Sign-In:", error);
            }
        }
    }, [user, GOOGLE_CLIENT_ID]);

    return (
        <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="text-2xl font-bold text-white">
                           AI<span className="text-indigo-400">Voice</span>
                        </a>
                         <nav className="hidden md:flex items-center space-x-2">
                             <NavLink page="home" currentPage={currentPage} navigate={navigate}>Trang chủ</NavLink>
                             <NavLink page="pricing" currentPage={currentPage} navigate={navigate}>Bảng giá</NavLink>
                         </nav>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <UserMenu user={user} logout={logout} navigate={navigate} />
                        ) : (
                            <div id="google-login-button-container" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;