import React, { useState, useEffect } from 'react';
import { Page, PricingPlan } from '../types';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { PRICING_PLANS } from '../constants';

interface TopUpPageProps {
    navigate: (page: Page) => void;
}

// ========================================================================
// NOTE FOR DEVELOPER on .env configuration for PayOS on the BACKEND:
// ========================================================================
// Luồng thanh toán này mô phỏng một tích hợp an toàn với Backend.
// Server backend (ví dụ: Node.js) của bạn PHẢI có một file `.env`
// chứa các key bí mật do PayOS cung cấp:
//
// File .env trên SERVER:
// PAYOS_CLIENT_ID='your-client-id'
// PAYOS_API_KEY='your-api-key'
// PAYOS_CHECKSUM_KEY='your-checksum-key'
//
// Backend sẽ tải các biến này và sử dụng chúng để giao tiếp an toàn với
// API của PayOS. Frontend KHÔNG BAO GIỜ được phép xử lý các key này.
// Frontend chỉ gọi đến backend của bạn để lấy link thanh toán/mã QR.
// ========================================================================

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

    const handleGenerateQR = async () => {
        // =================================================================
        // SECURE PAYOS INTEGRATION WORKFLOW
        // =================================================================
        setIsProcessing(true);
        setQrCodeUrl(null);

        // STEP 1: (FRONTEND -> YOUR BACKEND)
        // Yêu cầu backend tạo một link thanh toán.
        // Backend sẽ gọi API của PayOS một cách an toàn bằng cách sử dụng
        // PAYOS_API_KEY và PAYOS_CHECKSUM_KEY từ file .env của nó.
        try {
            console.log(`[FRONTEND] Calling backend to create payment link for plan: "${selectedPlan.name}"...`);
            // --- This part simulates the API call ---
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
            
            // In a real app:
            // const response = await fetch('/api/payos/create-payment', { method: 'POST', ... });
            // const data = await response.json();
            
            // --- Simulated backend response ---
            const fakeOrderId = `order_${Date.now()}`;
            const fakeQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payos-order-${fakeOrderId}`;
            console.log(`[BACKEND->FRONTEND] Response received with orderId: ${fakeOrderId}`);

            // STEP 2: (FRONTEND)
            // Hiển thị mã QR nhận được từ backend.
            setOrderId(fakeOrderId);
            setQrCodeUrl(fakeQrCode);

        } catch (error) {
            console.error("Failed to generate payment QR code:", error);
            alert("Đã có lỗi xảy ra khi tạo mã thanh toán. Vui lòng thử lại.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    // This effect simulates polling the backend to check for payment confirmation.
    // In a real app, this is more robustly handled with WebSockets for real-time updates.
    useEffect(() => {
        if (!orderId || paymentSuccess) return;

        console.log(`[FRONTEND] Started polling for payment status of order: ${orderId}`);
        
        // This timeout simulates the user taking time to pay and the backend receiving the webhook.
        const confirmationTimeout = setTimeout(() => {
             // STEP 3: (PAYOS -> YOUR BACKEND - Webhook)
            // Đây là bước quan trọng nhất phía server. PayOS gửi một webhook đến server của bạn.
            // Backend xác thực nó bằng CHECKSUM_KEY và cập nhật database (cộng credit cho user).
            console.log(`[BACKEND->FRONTEND] Payment for order ${orderId} is successful!`);
            setPaymentSuccess(true);
        }, 5000); // Simulate a 5-second delay for payment.

        // Cleanup function to stop polling when the component unmounts
        return () => clearTimeout(confirmationTimeout);
    }, [orderId, paymentSuccess]);


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
             <div className="mt-4 text-xs text-center text-gray-400">
                <p>Bảo mật bởi PayOS. Backend sử dụng `PAYOS_API_KEY` và `PAYOS_CHECKSUM_KEY` từ file .env trên server để xử lý giao dịch an toàn.</p>
            </div>

            {!qrCodeUrl ? (
                <button
                    onClick={handleGenerateQR}
                    disabled={isProcessing}
                    className="w-full mt-4 flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-blue-400 transition-all"
                >
                    {isProcessing ? <SpinnerIcon className="w-5 h-5" /> : 'Thanh toán bằng PayOS QR'}
                </button>
            ) : (
                <div className="mt-8 text-center">
                    <h3 className="font-semibold">Quét mã QR để thanh toán</h3>
                    <p className="text-sm text-gray-400">Sử dụng ứng dụng ngân hàng hoặc ví điện tử của bạn.</p>
                    <div className="my-2 p-2 bg-yellow-900/50 text-yellow-300 text-xs rounded-lg">
                        <strong>Lưu ý:</strong> Đây là giao dịch mô phỏng. Quá trình thanh toán sẽ tự động hoàn tất sau vài giây.
                    </div>
                    <div className="bg-white p-4 rounded-lg inline-block mt-2">
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