import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

interface CustomVoice {
    id: string;
    name: string;
}

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const [text, setText] = useState('Chào mừng bạn đến với AI Voice Studio. Hãy nhập văn bản bạn muốn chuyển đổi tại đây.');
    const [voice, setVoice] = useState('vi-VN-Standard-A');
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [charCount, setCharCount] = useState(0);

    // New state for voice cloning feature
    const [customVoiceFile, setCustomVoiceFile] = useState<File | null>(null);
    const [isCloning, setIsCloning] = useState(false);
    const [customVoices, setCustomVoices] = useState<CustomVoice[]>([]);
    const [cloneSuccessMessage, setCloneSuccessMessage] = useState<string>('');
    
    // New state for text file upload
    const [uploadedTextFileName, setUploadedTextFileName] = useState<string | null>(null);


    useEffect(() => {
        setCharCount(text.length);
    }, [text]);

    const credits = user ? user.credits : 0;
    const usagePercentage = credits > 0 ? (charCount / credits) * 100 : 0;

    const getCharCountColor = () => {
        if (!user || credits === 0) return 'text-gray-400';
        if (usagePercentage > 100) {
            return 'text-red-500 font-semibold';
        }
        if (usagePercentage > 80) {
            return 'text-yellow-400 font-medium';
        }
        return 'text-gray-300';
    };
    
    // This is a placeholder for a real API call.
    // It uses the browser's built-in speech synthesis for demonstration.
    const handleConvert = () => {
        if (!text || isLoading) return;
        
        if (!user) {
            alert('Vui lòng đăng nhập để sử dụng chức năng này.');
            return;
        }

        if (charCount > user.credits) {
            alert('Bạn không đủ credit để thực hiện chuyển đổi này.');
            return;
        }

        setIsLoading(true);
        setAudioUrl(null);

        // Simulate API call delay
        setTimeout(() => {
            try {
                 // If a custom voice is selected, we would ideally use a different API endpoint
                // For this simulation, we'll just log it and use the standard synthesis
                if (voice.startsWith('custom-')) {
                    console.log(`Converting text using custom voice profile: ${voice}`);
                }

                const utterance = new SpeechSynthesisUtterance(text);
                
                // Find a Vietnamese voice if available
                const voices = window.speechSynthesis.getVoices();
                const vietnameseVoice = voices.find(v => v.lang === 'vi-VN');
                if (vietnameseVoice) {
                    utterance.voice = vietnameseVoice;
                }
                utterance.lang = 'vi-VN';
                utterance.rate = 1;
                utterance.pitch = 1;

                // Creating a blob URL to simulate a downloadable file
                utterance.onend = () => {
                    setIsLoading(false);
                };
                
                window.speechSynthesis.speak(utterance);
                 // Note: Creating a downloadable audio file from SpeechSynthesis is complex and not directly supported.
                 // This part is a simulation of what would happen with a real API response.
                 // We'll just set a fake URL to show the audio player.
                 setAudioUrl("#");


            } catch (error) {
                console.error("Lỗi chuyển đổi giọng nói:", error);
                alert("Đã xảy ra lỗi trong quá trình chuyển đổi.");
                setIsLoading(false);
            }
        }, 1500);
    };

    // New handlers for voice cloning
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setCustomVoiceFile(event.target.files[0]);
            setCloneSuccessMessage('');
        }
    };

    const handleCloneVoice = () => {
        if (!customVoiceFile) return;

        setIsCloning(true);
        setCloneSuccessMessage('');

        // Simulate backend processing for voice cloning
        setTimeout(() => {
            const newVoiceId = `custom-${Date.now()}`;
            const newVoiceName = `Tùy chỉnh - ${customVoiceFile.name.split('.').slice(0, -1).join('.')}`;

            const newVoice: CustomVoice = { id: newVoiceId, name: newVoiceName };
            
            setCustomVoices(prev => [...prev, newVoice]);
            setVoice(newVoiceId); // Auto-select the new voice
            setCustomVoiceFile(null);
            setIsCloning(false);
            setCloneSuccessMessage(`Tạo giọng đọc "${newVoiceName}" thành công!`);
        }, 2500);
    };

    const handleTextFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadedTextFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target?.result as string;
            setText(fileContent);
        };
        reader.onerror = (e) => {
            console.error("Lỗi đọc file:", e);
            alert("Không thể đọc file. Vui lòng thử lại với file .txt.");
            setUploadedTextFileName(null);
        }
        
        // For simplicity, we'll only read .txt files. A real app would need a library for .doc/.docx
        if(file.name.endsWith('.txt')) {
             reader.readAsText(file);
        } else {
             setText(`Đã tải lên file: ${file.name}. (Xem trước nội dung không khả dụng cho file .doc/.docx trong bản demo này.)`);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6">
                <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                    Chuyển Văn Bản Thành Giọng Nói AI
                </h1>
                <p className="text-center text-gray-300">
                    Tạo ra âm thanh tự nhiên và chân thực từ văn bản với công nghệ AI tiên tiến.
                </p>

                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Nhập văn bản của bạn ở đây..."
                        className="w-full h-48 p-4 pr-32 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none text-lg placeholder-gray-500 shadow-inner focus:shadow-lg focus:shadow-indigo-900/50"
                        aria-label="Văn bản cần chuyển đổi"
                    />
                    <div className={`absolute bottom-4 right-4 text-sm px-3 py-1 rounded-full bg-gray-900/80 backdrop-blur-sm transition-colors duration-300 ${getCharCountColor()}`}>
                       {charCount.toLocaleString('vi-VN')} / {user ? user.credits.toLocaleString('vi-VN') : '...'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="voice-select" className="block text-sm font-medium text-gray-300 mb-2">Chọn giọng đọc</label>
                        <select
                            id="voice-select"
                            value={voice}
                            onChange={(e) => setVoice(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <optgroup label="Giọng đọc chuyên biệt">
                                <option value="vi-VN-Wavenet-A">Giọng đọc truyện tình cảm (Nữ)</option>
                                <option value="vi-VN-News-A">Giọng đọc tin tức</option>
                            </optgroup>
                            <optgroup label="Giọng đọc tiêu chuẩn">
                                <option value="vi-VN-Standard-A">Giọng Nữ Miền Bắc (Mai)</option>
                                <option value="vi-VN-Standard-B">Giọng Nam Miền Bắc (Lê Minh)</option>
                                <option value="vi-VN-Standard-C">Giọng Nữ Miền Nam (Ban Mai)</option>
                                <option value="vi-VN-Standard-D">Giọng Nam Miền Nam (Gia Hưng)</option>
                            </optgroup>
                            {customVoices.length > 0 && (
                                <optgroup label="Giọng đọc của bạn">
                                    {customVoices.map(customVoice => (
                                        <option key={customVoice.id} value={customVoice.id}>
                                            {customVoice.name}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>

                     <div>
                        <label htmlFor="text-upload" className="block text-sm font-medium text-gray-300 mb-2">Tải lên file văn bản</label>
                         <label htmlFor="text-upload" className="w-full flex items-center justify-center p-3 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 truncate">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            <span className="text-gray-400 text-sm">
                                {uploadedTextFileName ? uploadedTextFileName : 'Chọn file...'}
                            </span>
                             <input id="text-upload" type="file" accept=".txt,.doc,.docx" className="hidden" onChange={handleTextFileChange} />
                         </label>
                    </div>

                    {/* Voice Cloning Section */}
                    <div className="space-y-2">
                         <label htmlFor="voice-upload" className="block text-sm font-medium text-gray-300 mb-2">Tạo giọng đọc tùy chỉnh</label>
                        <div className="flex items-center space-x-2">
                             <label htmlFor="voice-upload" className="flex-1 cursor-pointer bg-gray-700 border border-gray-600 rounded-lg p-3 text-center text-gray-400 hover:bg-gray-600 truncate">
                                <input id="voice-upload" type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
                                {customVoiceFile ? customVoiceFile.name : 'Chọn file âm thanh...'}
                             </label>
                            <button 
                                onClick={handleCloneVoice} 
                                disabled={!customVoiceFile || isCloning}
                                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
                                aria-busy={isCloning}
                            >
                                {isCloning ? <SpinnerIcon className="w-5 h-5" /> : 'Tạo'}
                            </button>
                        </div>
                         {cloneSuccessMessage && <p className="text-sm text-green-400 mt-2">{cloneSuccessMessage}</p>}
                    </div>
                </div>

                <button
                    onClick={handleConvert}
                    disabled={isLoading || (user && charCount > user.credits)}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:from-indigo-500 disabled:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <>
                            <SpinnerIcon className="w-5 h-5 mr-2" />
                            Đang xử lý...
                        </>
                    ) : (
                        'Chuyển đổi'
                    )}
                </button>

                {audioUrl && (
                     <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 text-center">Kết quả</h3>
                        <p className="text-center text-sm text-gray-400 mb-4">Lưu ý: Đây là bản phát lại trực tiếp từ trình duyệt. API thực tế sẽ cung cấp file MP3 để tải về.</p>
                        <audio controls className="w-full">
                            {/* A real implementation would have a src={audioUrl} pointing to an MP3 file */}
                            <source src="" type="audio/mpeg" />
                            Trình duyệt của bạn không hỗ trợ phát âm thanh.
                        </audio>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
