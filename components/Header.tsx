import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Page } from '../types';
import GoogleSignInButton from './GoogleSignInButton';

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


const UserMenu: React.FC<{ user: any; logout: () => void; navigate: (page: Page) => void }> = ({ user, logout, navigate }) => {
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

    const handleNavigate = (page: Page) => {
        navigate(page);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="text-white font-medium hidden sm:block">{user.name}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-gray-500 truncate">{user.sub}</p>
                            {/* Credits display needs to be re-integrated with backend logic */}
                            {/* <p className="text-indigo-600 font-bold mt-1">{user.credits.toLocaleString('vi-VN')} credits</p> */}
                        </div>
                         <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('top-up'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Nạp Credit</a>
                         <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('file-history'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Lịch sử Tệp Âm thanh</a>
                         <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('transaction-history'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Lịch sử Giao dịch</a>
                        {user.isAdmin && (
                           <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('admin'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t" role="menuitem">Bảng điều khiển Admin</a>
                        )}
                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t" role="menuitem">Đăng xuất</a>
                    </div>
                </div>
            )}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ navigate, currentPage }) => {
    const { user, logout } = useAuth();

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
                            <GoogleSignInButton />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;