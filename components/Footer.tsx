
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800/30">
            <div className="container mx-auto px-4 py-6 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} AI Voice Studio. All rights reserved.</p>
                <p className="text-sm mt-1">Được tạo ra với ❤️ cho cộng đồng.</p>
            </div>
        </footer>
    );
};

export default Footer;
