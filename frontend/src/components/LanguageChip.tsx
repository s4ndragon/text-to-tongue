// components/LanguageChip.tsx
import React from "react";

interface LanguageChipProps {
  languageCode: string;
}

const LanguageChip: React.FC<LanguageChipProps> = ({ languageCode }) => {
  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      "en-US": "English (US)",
      "es-ES": "Spanish",
      "th-TH": "Thai",
      "zh-TW": "Mandarin",
    };

    const shortCode = code.split("-")[0];
    return languages[code] || shortCode.toUpperCase();
  };

  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      en: "🇺🇸",
      es: "🇪🇸",
      th: "🇹🇭",
      zh: "🇹🇼",
    };

    const shortCode = code.split("-")[0];
    return flags[shortCode] || "";
  };

  const shortCode = languageCode.split("-")[0];

  return (
    <div className="language-chip">
      <span className="language-flag">{getLanguageFlag(shortCode)}</span>
      <span className="language-name">{getLanguageName(languageCode)}</span>
    </div>
  );
};

export default LanguageChip;
