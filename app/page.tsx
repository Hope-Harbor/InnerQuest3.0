"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import RainbowText from "@/components/RainbowText";
import RoleButtons from "@/components/RoleButtons";
import { translateText, Language } from '@/utils/translate';
import Script from 'next/script';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectValue, setSelectValue] = useState<string>('select'); // Initially show "Select"
  const [translations, setTranslations] = useState({
    subtitle: "Let's get to know you!",
    select: "Select",
  });

  useEffect(() => {
    // Check for saved language but don't auto-set the dropdown
    const savedLang = localStorage.getItem('userLanguage') as Language;
    if (savedLang) {
      // Even if language is saved, only update translations
      // but keep the dropdown on "Select"
      if (savedLang === 'zh-TW') {
        updateTranslations(savedLang);
      }
    }
  }, []);

  const updateTranslations = async (lang: Language) => {
    if (lang === 'zh-TW') {
      const [subtitle, select] = await Promise.all([
        translateText(translations.subtitle, lang),
        translateText(translations.select, lang),
      ]);

      setTranslations({
        subtitle,
        select,
      });
    } else {
      // Reset to English
      setTranslations({
        subtitle: "Let's get to know you!",
        select: "Select",
      });
    }
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectValue(newValue);
    
    // Only update actual language if a real language is selected
    if (newValue !== 'select') {
      const newLang = newValue as Language;
      setLanguage(newLang);
      localStorage.setItem('userLanguage', newLang);
      await updateTranslations(newLang);
    }
  };

  const handleRoleSelect = (role: string) => {
    // Handle role selection
    console.log('Selected role:', role);
  };

  return (
    <div>
      <header>
        <Link href="/" className="logo">InnerQuest</Link>
      </header>

      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-32ZXDHP4RC"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-32ZXDHP4RC');
          `,
        }}
      />

      <main>
        {/* Keep original */}
        <RainbowText text="Start your InnerQuest!" />
        
        {/* Translate */}
        <h2>{translations.subtitle}</h2>
        <RoleButtons 
          language={language} 
          onSelectRole={handleRoleSelect}
        />
      </main>

      <div className="language-select">
        <select value={selectValue} onChange={handleLanguageChange}>
          <option value="select">{translations.select}</option>
          <option value="en">English</option>
          <option value="zh-TW">Chinese</option>
        </select>
      </div>
    </div>
  );
}