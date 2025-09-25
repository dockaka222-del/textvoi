// services/api.ts
// ====================================================================================
// File này đã được cập nhật để gọi đến một BACKEND NODE.JS/EXPRESS THỰC SỰ.
// Backend sẽ xử lý logic, quản lý secrets và giao tiếp với các dịch vụ bên ngoài.
// ====================================================================================

import { User } from '../types';

// Backend của bạn sẽ được Nginx proxy qua đường dẫn /api
const API_BASE_URL = '/api';

/**
 * Lấy JWT token từ localStorage để gửi kèm trong header Authorization.
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};


// ========================================================================
// Chức năng Chuyển đổi Giọng nói (Text-to-Speech) - Luồng Bất đồng bộ
// ========================================================================

/**
 * BƯỚC 1: Gửi yêu cầu chuyển đổi đến backend.
 * Backend sẽ đưa yêu cầu vào hàng đợi và trả về ngay một jobId.
 */
export const startConversionJob = async (text: string, voice: string): Promise<{ jobId: string }> => {
    console.log('[API Service] Calling backend to start async conversion job...');
    const response = await fetch(`${API_BASE_URL}/tts/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text, voice })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định' }));
        throw new Error(`Failed to start job: ${errorData.message}`);
    }

    const data = await response.json();
    console.log(`[API Service] Job queued with ID: ${data.jobId}`);
    return data;
};

export interface JobStatusResponse {
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    audioUrl?: string;
    error?: string;
}

/**
 * BƯỚC 2: Kiểm tra (poll) trạng thái của công việc bằng jobId.
 * Frontend sẽ gọi hàm này lặp lại cho đến khi nhận được 'COMPLETED' hoặc 'FAILED'.
 */
export const getConversionStatus = async (jobId: string): Promise<JobStatusResponse> => {
    const response = await fetch(`${API_BASE_URL}/tts/status/${jobId}`, {
        headers: getAuthHeaders()
    });
    
     if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định' }));
        throw new Error(`Failed to get job status: ${errorData.message}`);
    }

    return response.json();
};


// ========================================================================
// Chức năng Quản lý Người dùng (Admin)
// ========================================================================

/**
 * Lấy danh sách tất cả người dùng từ backend. (Yêu cầu quyền Admin)
 */
export const getUsers = async (): Promise<User[]> => {
    console.log('[API Service] Fetching users from backend...');
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Không thể tải danh sách người dùng. Bạn có phải là admin không?');
    }
    return response.json();
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

     if (!response.ok) {
         throw new Error('Xác thực Google với backend thất bại');
     }
     
     return response.json();
}
