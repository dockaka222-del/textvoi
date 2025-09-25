// services/api.ts
// ====================================================================================
// File này đã được cập nhật để gọi đến các API endpoint do SCRIPT BASH tạo ra.
// ====================================================================================
import { User } from '../types';

const API_BASE_URL = '/api';

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
export const startConversionJob = async (text: string, voice: string): Promise<{ id: string }> => {
    console.log('[API Service] Calling backend to start async conversion job...');
    const response = await fetch(`${API_BASE_URL}/tts/jobs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: text, voiceId: voice })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định' }));
        throw new Error(`Failed to start job: ${errorData.message}`);
    }

    const data = await response.json();
    console.log(`[API Service] Job queued with ID: ${data.id}`);
    return data;
};

export interface JobStatusResponse {
    id: string;
    status: 'queued' | 'done' | 'error';
    url?: string; // Corresponds to audioUrl
    error?: string;
}

/**
 * BƯỚC 2: Kiểm tra (poll) trạng thái của công việc bằng jobId.
 */
export const getConversionStatus = async (jobId: string): Promise<JobStatusResponse> => {
    const response = await fetch(`${API_BASE_URL}/tts/jobs/${jobId}`, {
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
    // The new backend returns { items: [...] }, so we need to adapt
    const data = await response.json();
    return data.items || [];
};

// ========================================================================
// Chức năng Xác thực
// ========================================================================

/**
 * Gửi Google credential đến backend để xác thực và đăng nhập/đăng ký.
 * @param idToken - Credential token (idToken) nhận được từ Google Sign-In.
 * @returns {Promise<{token: string}>} - Chỉ trả về JWT token.
 */
export const loginWithGoogle = async (idToken: string): Promise<{token: string}> => {
     console.log(`[API Service] Sending Google idToken to backend for verification...`);
     const response = await fetch(`${API_BASE_URL}/auth/google`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ idToken }) // The new backend expects `idToken`
     });

     if (!response.ok) {
         throw new Error('Xác thực Google với backend thất bại');
     }
     
     return response.json();
}
