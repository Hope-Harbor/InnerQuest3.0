"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Language } from '@/utils/translate';

interface RoleButtonsProps {
  language: Language;
  onSelectRole?: (role: string) => void;
}

const RoleButtons: React.FC<RoleButtonsProps> = ({ language, onSelectRole }) => {
  const router = useRouter();
  const [translations, setTranslations] = useState({
    teenager: "Teenager",
    undergraduate: "Undergraduate",
    working: "Working Professional"
  });

  useEffect(() => {
    if (language === 'zh-TW') {
      // Manual translations for Chinese
      setTranslations({
        teenager: "青少年",
        undergraduate: "大學生",
        working: "在職人士"
      });
    } else {
      // Reset to English
      setTranslations({
        teenager: "Teenager",
        undergraduate: "Undergraduate",
        working: "Working Professional"
      });
    }
  }, [language]);

  const startQuiz = (role: string) => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userLanguage", language);
    router.refresh();
    router.push("/questionnaire");
  };

  return (
    <div className="identity-button-group">
      <button onClick={() => startQuiz("teenager")}>
        {translations.teenager}
      </button>
      <button onClick={() => startQuiz("undergraduate")}>
        {translations.undergraduate}
      </button>
      <button onClick={() => startQuiz("working")}>
        {translations.working}
      </button>
    </div>
  );
};

export default RoleButtons;