import React, { useState, useEffect } from 'react';
import { Page, PricingPlan } from '../types';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { PRICING_PLANS } from '../constants';

interface TopUpPageProps {
    navigate: (page: Page) => void;
}

const TopUpPage: React.FC<TopUpPageProps> = ({ navigate }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    // In a real app, this would be passed via state or URL params.
    // For this simulation, we'll default to the 'pro' plan.
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(
        PRICING_PLANS.find(p => p.popular) || PRICING_PLANS[0]
    );

    const handleGenerateQR = () => {
        // =================================================================
        // QUY TRÌNH BẢO MẬT KHI TÍCH HỢP PAYOS
        // =================================================================
        setIsProcessing(true);
        setQrCodeUrl(null);

        // BƯỚC 1: (FRONTEND -> BACKEND)
        // Gọi API lên backend của bạn để yêu cầu tạo một đơn hàng thanh toán.
        // Backend sẽ dùng API Key bí mật để gọi sang PayOS.
        // TUYỆT ĐỐI KHÔNG GỌI API PAYOS TRỰC TIẾP TỪ FRONTEND.
        console.log(`[FRONTEND] Gửi yêu cầu tạo đơn hàng cho gói "${selectedPlan.name}"...`);

        // Giả lập việc gọi API và nhận lại link QR từ backend
        setTimeout(() => {
            const fakeOrderId = `order_${Date.now()}`;
            const fakeQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payos-order-${fakeOrderId}`;
            
            console.log(`[BACKEND->FRONTEND] Nhận được mã QR cho đơn hàng: ${fakeOrderId}`);
            setOrderId(fakeOrderId);
            setQrCodeUrl(fakeQrCode);
            setIsProcessing(false);

            // BƯỚC 2: (FRONTEND)
            // Hiển thị mã QR và bắt đầu chờ xác nhận.
            // Trong thực tế, bạn sẽ dùng orderId để hỏi backend về trạng thái thanh toán (polling)
            // hoặc chờ tín hiệu từ WebSocket.

        }, 1500);
    };
    
    // Giả lập việc backend nhận được webhook và frontend kiểm tra trạng thái
    useEffect(() => {
        if (orderId) {
            console.log("[FRONTEND] Bắt đầu kiểm tra trạng thái đơn hàng...");
            const fakeWebhookTimeout = setTimeout(() => {
                // BƯỚC 3: (PAYOS -> BACKEND - Webhook)
                // Đây là bước quan trọng nhất, diễn ra ẩn ở phía server.
                // PayOS gọi đến webhook của bạn. Backend dùng Checksum Key để xác thực.
                // Nếu hợp lệ, backend MỚI cộng credit cho user trong database.
                console.log(`[BACKEND] Đã nhận và xác thực webhook cho đơn hàng ${orderId}. Cộng credit vào database.`);
                setPaymentSuccess(true);
            }, 5000); // Giả lập 5 giây sau người dùng thanh toán thành công
            
            return () => clearTimeout(fakeWebhookTimeout);
        }
    }, [orderId]);


    if (paymentSuccess) {
        return (
            <div className="max-w-md mx-auto bg-gray-800/50 p-8 rounded-2xl text-center">
                 <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-2xl font-bold mt-6">Thanh toán thành công!</h2>
                <p className="text-gray-300 mt-2">
                    {selectedPlan.credits.toLocaleString('vi-VN')} credits đã được thêm vào tài khoản của bạn.
                </p>
                <button 
                    onClick={() => navigate('home')}
                    className="mt-6 bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Về Trang chủ
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Xác nhận thanh toán</h1>
            <div className="bg-gray-700 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-400">Gói đã chọn:</span>
                    <span className="font-semibold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Số credits:</span>
                    <span className="font-semibold">{selectedPlan.credits.toLocaleString('vi-VN')}</span>
                </div>
                 <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-600">
                    <span>Tổng cộng:</span>
                    <span className="text-indigo-400">{selectedPlan.price.toLocaleString('vi-VN')} VNĐ</span>
                </div>
            </div>

            {!qrCodeUrl ? (
                <button
                    onClick={handleGenerateQR}
                    disabled={isProcessing}
                    className="w-full mt-8 flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-blue-400 transition-all"
                >
                    {isProcessing ? <SpinnerIcon className="w-5 h-5" /> : 'Thanh toán bằng PayOS QR'}
                </button>
            ) : (
                <div className="mt-8 text-center">
                    <h3 className="font-semibold">Quét mã QR để thanh toán</h3>
                    <p className="text-sm text-gray-400">Sử dụng ứng dụng ngân hàng hoặc ví điện tử của bạn.</p>
                    <div className="bg-white p-4 rounded-lg inline-block mt-4">
                        <img src={qrCodeUrl} alt="PayOS QR Code" />
                    </div>
                     <p className="mt-4 text-sm text-yellow-400 animate-pulse">
                        Đang chờ xác nhận thanh toán từ hệ thống...
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Mã đơn hàng: {orderId}</p>
                </div>
            )}
        </div>
    );
};

export default TopUpPage;
