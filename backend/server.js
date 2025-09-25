// File: backend/server.js
// ========================================================================
// AI VOICE STUDIO - BACKEND SERVER
// ========================================================================

require('dotenv').config(); // Tải các biến môi trường từ file .env

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Phân tích body của request dưới dạng JSON

// --- Database & Data (Mô phỏng) ---
// Trong ứng dụng thực tế, bạn sẽ kết nối đến một database như PostgreSQL hoặc MongoDB.
const { MOCK_USERS, MOCK_NORMAL_USER, MOCK_ADMIN_USER } = require('../frontend/constants'); // Dùng tạm dữ liệu mock
let users = [...MOCK_USERS]; // Tạo bản sao để có thể chỉnh sửa

// --- Google Auth Client ---
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// --- Middleware xác thực Token (JWT) ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // Không có token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token không hợp lệ
        req.user = user; // Lưu thông tin user vào request
        next();
    });
};

// --- Middleware kiểm tra quyền Admin ---
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Yêu cầu quyền admin' });
    }
    next();
};

// ========================================================================
// API ROUTES
// ========================================================================

// --- Authentication Route ---
app.post('/api/auth/google', async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { name, email, picture } = payload;
        
        // Logic tìm hoặc tạo người dùng mới trong DB
        let user = users.find(u => u.email === email);
        if (!user) {
            // Đây là ví dụ, trong thực tế bạn sẽ tạo user mới trong DB
            console.log('User mới, dùng tạm MOCK_NORMAL_USER');
            user = { ...MOCK_NORMAL_USER, name, email, avatar: picture };
        }
        
        // Tạo JWT Token
        const tokenPayload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ user, token });

    } catch (error) {
        console.error("Lỗi xác thực Google:", error);
        res.status(401).json({ message: "Xác thực Google thất bại" });
    }
});


// --- User Management Route (Admin only) ---
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
    // Trả về danh sách người dùng (loại bỏ thông tin nhạy cảm nếu cần)
    res.json(users);
});


// --- Text-to-Speech Async Job Routes ---
const jobStore = new Map(); // Mô phỏng job store trên backend

// BƯỚC 1: Bắt đầu một công việc chuyển đổi
app.post('/api/tts/start', authenticateToken, (req, res) => {
    const { text, voice } = req.body;
    if (!text || !voice) {
        return res.status(400).json({ message: 'Thiếu text hoặc voice' });
    }

    const jobId = `job_${Date.now()}`;
    jobStore.set(jobId, { 
        status: 'PENDING', 
        startTime: Date.now(), 
        userId: req.user.id 
    });

    // Mô phỏng quá trình xử lý nền
    processJob(jobId, text, voice);
    
    console.log(`[Backend] Job queued with ID: ${jobId}`);
    res.status(202).json({ jobId }); // 202 Accepted: Yêu cầu đã được chấp nhận để xử lý
});


// BƯỚC 2: Kiểm tra trạng thái công việc
app.get('/api/tts/status/:jobId', authenticateToken, (req, res) => {
    const { jobId } = req.params;
    const job = jobStore.get(jobId);

    if (!job) {
        return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    
    // Đảm bảo user chỉ có thể kiểm tra job của chính mình
    if (job.userId !== req.user.id) {
        const currentUser = users.find(u => u.id === req.user.id);
        if (currentUser?.role !== 'admin') {
           return res.status(403).json({ message: "Không có quyền truy cập" });
        }
    }

    res.json({ 
        status: job.status,
        audioUrl: job.audioUrl,
        error: job.error
    });
});


// Hàm mô phỏng xử lý công việc và gọi Gemini API
async function processJob(jobId, text, voice) {
    const job = jobStore.get(jobId);
    
    // Trạng thái "Đang xử lý"
    await new Promise(resolve => setTimeout(resolve, 2000));
    jobStore.set(jobId, { ...job, status: 'PROCESSING' });

    try {
        // *** GỌI GEMINI API THỰC TẾ TẠI ĐÂY ***
        // const geminiApiKey = process.env.GEMINI_API_KEY;
        // const audioContent = await callGeminiTextToSpeechAPI(text, voice, geminiApiKey);
        // const audioUrl = await saveAudioAndGetUrl(audioContent); // Lưu file và lấy URL
        
        // Mô phỏng thành công
        await new Promise(resolve => setTimeout(resolve, 6000));
        const sampleUrl = 'https://cloud.google.com/text-to-speech/docs/audio/vi-VN-Standard-A.wav';
        jobStore.set(jobId, { ...job, status: 'COMPLETED', audioUrl: sampleUrl });
        
        console.log(`[Backend] Job ${jobId} completed successfully.`);

    } catch (error) {
        console.error(`[Backend] Job ${jobId} failed:`, error);
        jobStore.set(jobId, { ...job, status: 'FAILED', error: 'Lỗi khi gọi API chuyển đổi giọng nói.' });
    }
}


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
