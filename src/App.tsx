import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, Sparkles, Loader2, Copy, CheckCircle2, GraduationCap } from 'lucide-react';
import { generateLessonPlan } from './lib/gemini';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [lessonPlan, setLessonPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Vui lòng nhập nội dung sách giáo khoa.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setLessonPlan('');
    
    try {
      const result = await generateLessonPlan(inputText);
      setLessonPlan(result);
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!lessonPlan) return;
    navigator.clipboard.writeText(lessonPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setInputText(`Bài 21: Quang hợp ở thực vật (Sinh học 11)

I. KHÁI NIỆM QUANG HỢP
Quang hợp là quá trình lá cây nhờ có chất diệp lục, sử dụng ánh sáng mặt trời, nước và khí carbon dioxide để tổng hợp ra chất hữu cơ và giải phóng khí oxygen.
Phương trình tổng quát:
Ánh sáng + 6CO2 + 6H2O -> C6H12O6 + 6O2 (có chất diệp lục)

II. VAI TRÒ CỦA QUANG HỢP
1. Cung cấp thức ăn: Tổng hợp chất hữu cơ làm thức ăn cho mọi sinh vật, nguyên liệu cho công nghiệp và thuốc chữa bệnh...
2. Cung cấp năng lượng: Tích lũy năng lượng, duy trì hoạt động sống của sinh giới.
3. Điều hòa không khí: Hấp thụ CO2 và giải phóng O2, giúp giảm hiệu ứng nhà kính.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 card-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 leading-tight">Kế Hoạch Bài Giảng Tích Cực 5E</h1>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Thiết kế bài giảng tích cực & truyền cảm hứng</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-200">Thời lượng: 45 Phút</span>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)] min-h-[600px]">
          
          {/* Left Column: Input */}
          <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Nội Dung Sách Giáo Khoa
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLoadSample}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200"
                >
                  Tải Nội Dung Mẫu
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 flex flex-col gap-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Dán hoặc nhập đoạn trích Sách Giáo Khoa (SGK) vào đây...&#10;&#10;Ví dụ: Bài 5 - Sự bay hơi và sự ngưng tụ (Vật lý 6)..."
                className="flex-1 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputText.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang thiết kế giáo án...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Tạo Bài Giảng 5E
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden relative">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Kết Quả Bài Giảng
              </h2>
              
              <button
                onClick={handleCopy}
                disabled={!lessonPlan}
                title="Sao chép kết quả"
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-50/30">
              {!lessonPlan && !isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
                    <Sparkles className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Chưa có bài giảng nào</h3>
                  <p className="text-sm max-w-sm">Nhập nội dung Sách Giáo Khoa ở bên trái và nhấn nút để AI thiết kế cho bạn một Kế hoạch bài giảng 5E sáng tạo.</p>
                </div>
              ) : (
                <div className="p-6 prose prose-slate prose-sm md:prose-base max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-h3:text-indigo-700 prose-h3:uppercase prose-h3:text-sm prose-h3:tracking-wide prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-table:border-collapse prose-th:bg-slate-50 prose-th:p-3 prose-th:border-b prose-th:border-slate-200 prose-th:text-xs prose-th:uppercase prose-th:text-slate-400 prose-td:border-b prose-td:border-slate-100 prose-td:p-4 prose-td:font-medium prose-td:text-slate-700 prose-strong:text-slate-800 prose-li:text-slate-600">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-4 opacity-50">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                      <p className="font-medium animate-pulse text-indigo-600">Đang phân tích và sáng tạo...</p>
                    </div>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {lessonPlan}
                    </ReactMarkdown>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
