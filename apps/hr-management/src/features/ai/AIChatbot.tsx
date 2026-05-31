import React, { useState, useRef, useEffect } from 'react';
import { AIService, type SystemSnapshot } from './AIService';

interface AIChatbotProps {
  snapshot: SystemSnapshot;
}

const SUGGESTION_CHIPS = [
  "Dự án nào đang có nguy cơ trễ hạn?",
  "Ai là nhân viên hiệu suất cao nhất?",
  "Tóm tắt tình hình hệ thống cho tôi",
  "Viết email nhắc nhở nhân viên chưa log timesheet",
];

export const AIChatbot: React.FC<AIChatbotProps> = ({ snapshot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (msg: string) => {
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: msg.trim() }]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await AIService.askAdvisor(msg.trim(), snapshot);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (err: any) {
      const errMsg = err?.message || '';
      setMessages(prev => [
        ...prev, 
        { 
          role: 'ai', 
          text: `Lỗi kết nối AI: ${errMsg || "Kiểm tra mạng hoặc API Key."}\n\n💡 Bạn có thể cấu hình lại Gemini API Key bằng cách click vào biểu tượng bánh răng (⚙️) ở góc trên bên phải để cập nhật.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'var(--font-body, sans-serif)' }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          title="AI Cố vấn Dự án"
          style={{
            width: '56px', height: '56px', borderRadius: '28px',
            background: 'linear-gradient(135deg, #7e22ce, #a855f7)',
            color: 'white', border: 'none',
            boxShadow: '0 4px 16px rgba(126, 34, 206, 0.35)',
            cursor: 'pointer', fontSize: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(126, 34, 206, 0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(126, 34, 206, 0.35)'; }}
        >
          🤖
        </button>
      ) : (
        <div style={{
          width: '380px', height: '520px', backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          {/* ── Header ── */}
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg, #7e22ce, #a855f7)',
            color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>🤖 AI Cố vấn Dự án</div>
              <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>
                Phân tích real-time từ {snapshot.totalTasks} tasks & {snapshot.totalUsers} nhân sự
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => {
                  setTempKey(AIService.getSavedApiKey());
                  setIsSettingsOpen(!isSettingsOpen);
                }} 
                title="Cấu hình API Key" 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', padding: '4px', display: 'flex', alignItems: 'center' }}
              >
                ⚙️
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', padding: '4px', display: 'flex', alignItems: 'center' }}>✕</button>
            </div>
          </div>
          
          {/* ── Settings or Chat Area ── */}
          {isSettingsOpen ? (
            <div style={{
              flex: 1, padding: '20px', display: 'flex', flexDirection: 'column',
              backgroundColor: '#fafafa', gap: '14px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>⚙️ Cấu hình Google Gemini AI</div>
              <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.5' }}>
                Nhập Gemini API Key của bạn để sử dụng các tính năng trợ lý AI (Sinh mô tả, chuẩn hóa Timesheet, đánh giá hiệu suất, Chatbot).
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>Gemini API Key</label>
                <input 
                  type="password"
                  value={tempKey}
                  onChange={e => setTempKey(e.target.value)}
                  placeholder="Nhập AIzaSy..."
                  style={{
                    padding: '8px 12px', fontSize: '13px',
                    border: '1px solid #d1d5db', borderRadius: '8px',
                    outline: 'none', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#a855f7'}
                  onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                Lấy API Key miễn phí tại:{' '}
                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#7e22ce', textDecoration: 'underline' }}>
                  Google AI Studio
                </a>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => {
                    AIService.saveApiKey(tempKey);
                    setIsSettingsOpen(false);
                  }}
                  style={{
                    flex: 1, padding: '8px 12px', fontSize: '13px', fontWeight: 600,
                    backgroundColor: '#7e22ce', color: 'white', border: 'none', borderRadius: '8px',
                    cursor: 'pointer', transition: 'background 0.2s'
                  }}
                >
                  Lưu cấu hình
                </button>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  style={{
                    padding: '8px 14px', fontSize: '13px', fontWeight: 600,
                    backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              flex: 1, padding: '14px', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '10px',
              backgroundColor: '#fafafa'
            }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '14px' }}>
                    Tôi có thể phân tích tiến độ dự án, đánh giá rủi ro, hoặc soạn thảo văn bản cho bạn.
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                    {SUGGESTION_CHIPS.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(chip)}
                        style={{
                          padding: '6px 10px', fontSize: '11.5px',
                          backgroundColor: '#f3e8ff', color: '#7e22ce',
                          border: '1px solid #e9d5ff', borderRadius: '16px',
                          cursor: 'pointer', transition: 'background 0.15s'
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                  <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '3px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.role === 'user' ? 'Bạn' : '🤖 AI Advisor'}
                  </div>
                  <div style={{
                    padding: '10px 14px', borderRadius: '14px',
                    fontSize: '13px', lineHeight: '1.5',
                    backgroundColor: msg.role === 'user' ? '#7e22ce' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#1f2937',
                    border: msg.role === 'ai' ? '1px solid #e5e7eb' : 'none',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '14px',
                    borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '14px',
                    whiteSpace: 'pre-wrap',
                    boxShadow: msg.role === 'ai' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
                  <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '3px' }}>🤖 AI Advisor</div>
                  <div style={{
                    padding: '10px 14px', borderRadius: '14px', borderBottomLeftRadius: '4px',
                    backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
                    fontSize: '13px', color: '#7e22ce'
                  }}>
                    <span style={{ display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }}>
                      Đang phân tích dữ liệu hệ thống...
                    </span>
                    <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
          
          {/* ── Input Area ── */}
          {!isSettingsOpen && (
            <form onSubmit={handleSubmit} style={{
              display: 'flex', padding: '10px 12px',
              borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff', gap: '8px'
            }}>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Hỏi về tiến độ, rủi ro, nhân sự..."
                style={{
                  flex: 1, padding: '10px 14px',
                  border: '1px solid #d1d5db', borderRadius: '20px',
                  outline: 'none', fontSize: '13px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#a855f7'}
                onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '0 16px',
                  background: input.trim() && !isLoading ? 'linear-gradient(135deg, #7e22ce, #a855f7)' : '#e5e7eb',
                  color: input.trim() && !isLoading ? 'white' : '#9ca3af',
                  border: 'none', borderRadius: '20px',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  fontSize: '13px', fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                Gửi
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
