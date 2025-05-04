// components/ExactTranslation.tsx
import React from "react";

interface ExactTranslationProps {
  originalText: string;
  originalLanguage: string;
  translationText: string;
  translationLanguage: string;
}

const ExactTranslation: React.FC<ExactTranslationProps> = ({
  originalText,
  originalLanguage,
  translationText,
  translationLanguage
}) => {
  // Split text into paragraphs
  const originalParagraphs = originalText.split('\n').filter(para => para.trim().length > 0);
  
  return (
    <div className="translation-section">
      <h3>Translation</h3>
      
      <div className="exact-translation-grid">
        <div className="translation-panel">
          <div className="translation-header">
            <h4>Original Text</h4>
            <div className="language-circle">{originalLanguage}</div>
          </div>
          
          <div className="translation-body">
            {originalParagraphs.map((paragraph, index) => (
              <p key={`original-${index}`} className="translation-paragraph">{paragraph}</p>
            ))}
          </div>
        </div>
        
        <div className="translation-panel">
          <div className="translation-header">
            <h4>Translation</h4>
            <div className="language-circle">{translationLanguage}</div>
          </div>
          
          <div className="translation-body">
            {/* We use the original paragraphs to determine the structure,
                but we'll display the translation text as a whole since it might
                not have the same paragraph breaks */}
            <div className="translation-text">
              {translationText || "No translation available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExactTranslation;