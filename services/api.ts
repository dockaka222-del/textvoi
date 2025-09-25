// services/api.ts
// ====================================================================================
// TRUNG TÂM QUẢN LÝ API VÀ BẢO MẬT VỚI .ENV TRÊN BACKEND
// ====================================================================================
// File này là cầu nối duy nhất giữa Frontend và Backend của bạn.
//
// **Kiến trúc bảo mật với file .env trên Backend (VPS):**
//
// 1. **Tạo file `.env` duy nhất trên VPS của bạn:**
//    File này sẽ nằm ở thư mục gốc của dự án backend và KHÔNG BAO GIỜ được commit
//    lên Git.
//
//    Nội dung file `.env` trên server của bạn sẽ trông như sau:
//
//    ```
//    # PayOS Secret Keys
//    PAYOS_CLIENT_ID='your-payos-client-id'
//    PAYOS_API_KEY='your-payos-api-key'
//    PAYOS_CHECKSUM_KEY='your-payos-checksum-key'
//
//    # Google Secret for Backend Verification
//    GOOGLE_CLIENT_ID='your-google-client-id-for-web' // Backend cũng cần ID này để xác thực token
//
//    # Gemini API Key (hoặc dịch vụ TTS khác)
//    GEMINI_API_KEY='your-secret-gemini-api-key'
//
//    # Database Connection
//    DATABASE_URL='postgresql://user:password@host:port/database'
//
//    # JWT Secret for Sessions
//    JWT_SECRET='một-chuỗi-bí-mật-dài-và-ngẫu-nhiên'
//    ```
//
// 2. **Backend của bạn sẽ đọc các biến này:**
//    Sử dụng thư viện như `dotenv` (cho Node.js), backend sẽ tải tất cả các giá trị
//    từ file `.env` vào `process.env`.
//
// 3. **Frontend chỉ gọi đến Backend:**
//    Frontend không bao giờ biết đến các key bí mật này. Nó chỉ thực hiện các lời
//    gọi an toàn đến các endpoint mà bạn định nghĩa trên backend (ví dụ: `/api/tts/convert`).
//
// ====================================================================================

import { User } from '../types';

// Giả sử backend của bạn chạy trên domain này.
const API_BASE_URL = '/api'; // Sử dụng proxy hoặc thay bằng URL đầy đủ, ví dụ: 'http://your-vps-ip:3001/api'

// ========================================================================
// Chức năng Chuyển đổi Giọng nói (Text-to-Speech)
// ========================================================================
interface TTSResponse {
    audioUrl: string;
    creditsUsed: number;
}

/**
 * Gửi văn bản đến backend để chuyển đổi thành giọng nói.
 * Backend sẽ sử dụng GEMINI_API_KEY từ file .env của nó.
 */
export const convertTextToSpeech = async (text: string, voice: string): Promise<TTSResponse> => {
    console.log('[API Service] Calling backend to convert text...');
    const response = await fetch(`${API_BASE_URL}/tts/convert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi chuyển đổi giọng nói');
    }
    
    // --- SIMULATION ---
    await new Promise(resolve => setTimeout(resolve, 1500));
    const sampleUrl = 'https://cloud.google.com/text-to-speech/docs/audio/vi-VN-Standard-A.wav';
    return { audioUrl: sampleUrl, creditsUsed: text.length };
};


// ========================================================================
// Chức năng Quản lý Người dùng
// ========================================================================

/**
 * Lấy danh sách tất cả người dùng từ backend.
 */
export const getUsers = async (): Promise<User[]> => {
    console.log('[API Service] Fetching users from backend...');
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
    if (!response.ok) throw new Error('Không thể tải danh sách người dùng');
    
    // --- SIMULATION ---
    const { MOCK_USERS } = await import('../constants');
    return MOCK_USERS;
};

// ========================================================================
// Chức năng Xác thực
// ========================================================================

/**
 * Gửi Google credential đến backend để xác thực và đăng nhập/đăng ký.
 * Backend sẽ xác thực token này với Google.
 * @param credential - Credential token nhận được từ Google Sign-In.
 * @returns {Promise<{user: User, token: string}>} - Dữ liệu người dùng và JWT token.
 */
export const loginWithGoogle = async (credential: string): Promise<{user: User, token: string}> => {
     console.log(`[API Service] Sending Google credential to backend for verification...`);
     const response = await fetch(`${API_BASE_URL}/auth/google`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ credential })
     });

     if (!response.ok) throw new Error('Xác thực Google thất bại');

     // --- SIMULATION ---
     const { MOCK_NORMAL_USER } = await import('../constants');
     // Trong thực tế, backend sẽ trả về user tương ứng với credential
     return { user: MOCK_NORMAL_USER, token: 'fake-jwt-token-from-backend' };
}
