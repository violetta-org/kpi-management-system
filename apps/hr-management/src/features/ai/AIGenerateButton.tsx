import React, { useState } from 'react';

interface AIGenerateButtonProps {
  onClick: () => Promise<string>;
  onSuccess: (generatedText: string) => void;
  label?: string;
  style?: React.CSSProperties;
}

export const AIGenerateButton: React.FC<AIGenerateButtonProps> = ({ onClick, onSuccess, label = "✨ Nhờ AI Viết", style }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const text = await onClick();
      onSuccess(text);
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("AI đang bận, vui lòng thử lại sau!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleGenerate}
      disabled={isGenerating}
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        backgroundColor: '#f3e8ff', // Nền tím nhạt rất đẹp và sang
        color: '#7e22ce', // Chữ màu tím đậm
        border: '1px solid #d8b4fe',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: isGenerating ? 'wait' : 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(126, 34, 206, 0.1)',
        ...style
      }}
    >
      {isGenerating ? (
        <>
          <span style={{ 
            display: 'inline-block', 
            animation: 'spin 1s linear infinite' 
          }}>
            ⚙️
          </span> AI đang phân tích...
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </>
      ) : (
        label
      )}
    </button>
  );
};
