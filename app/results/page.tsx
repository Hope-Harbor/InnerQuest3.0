"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Language, translateText } from '@/utils/translate';
import Link from "next/link";
import html2canvas from "html2canvas";
import Script from 'next/script';

export default function ResultPage() {
  const [lang, setLang] = useState<Language>('en');
  const [summary, setSummary] = useState("Take a moment to reflect on your feelings.");
  const [emotion, setEmotion] = useState("Content");
  const [uuid, setUuid] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const resultBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [translations, setTranslations] = useState({
    result: "Result",
    emotion: "Unknown Emotion",
    loading: "Loading...",
    error: "Error loading summary",
    share: "Share",
    volumeAlert: "🎵 Volume control is under development. Stay tuned!",
    musicAlert: "🎵 Music feature is under development. Stay tuned!"
  });

  const [language, setLanguage] = useState<Language>('en');

  // Function to generate a UUID
  const generateUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Initial setup - only run once
  useEffect(() => {
    // Get stored emotion from localStorage
    const storedEmotion = localStorage.getItem("emotion");
    if (storedEmotion) {
      setEmotion(storedEmotion);
      // Don't fetch summary here
    }

    // Handle UUID
    let storedUUID = localStorage.getItem("uuid");
    if (!storedUUID) {
      storedUUID = generateUUID();
      localStorage.setItem("uuid", storedUUID);
    }
    setUuid(storedUUID);

    // Add click handler after component mounts
    const shareButton = document.getElementById("share-btn");
    if (shareButton) {
      shareButton.addEventListener("click", handleShare);
    }

    // Check for language preference but ONLY use it if it's explicitly set
    const savedLang = localStorage.getItem('userLanguage') as Language;
    if (savedLang) {
      setLanguage(savedLang);
      setLang(savedLang);
      
      // Only translate UI for Chinese
      if (savedLang === 'zh-TW') {
        updateUITranslations(savedLang);
      }
    }

    // Cleanup listener on unmount
    return () => {
      const shareButton = document.getElementById("share-btn");
      if (shareButton) {
        shareButton.removeEventListener("click", handleShare);
      }
    };
  }, []);

  // This effect is ONLY for fetching summary when emotion changes
  useEffect(() => {
    if (emotion && emotion !== "Content") {
      fetchSummary(emotion);
    }
  }, [emotion]);

  // Updated translation function that only translates UI elements
  const updateUITranslations = async (lang: Language) => {
    if (lang === 'zh-TW') {
      const [result, loading, error, share] = await Promise.all([
        translateText('Result', lang),
        translateText('Loading...', lang),
        translateText('Error loading summary', lang),
        translateText('Share', lang)
      ]);

      setTranslations({
        result,
        emotion: emotion, // Don't translate emotion - API will provide it correctly
        loading,
        error,
        share,
        volumeAlert: "🎵 音量控制正在開發中。敬請期待！",
        musicAlert: "🎵 音樂功能正在開發中。敬請期待！"
      });
      
      // Don't translate summary here - API will return it in the right language
    }
  };

  const handleMusicClick = () => {
    alert(language === 'zh-TW' ? translations.musicAlert : translations.volumeAlert);
    setIsPlaying(!isPlaying);
  };

  const fetchSummary = async (currentEmotion: string) => {
    try {
      // Get language and role from localStorage
      const userLang = localStorage.getItem('userLanguage') || 'en';
      const userRole = localStorage.getItem('userRole') || 'user';
      
      console.log('Fetching summary for:', {
        emotion: currentEmotion,
        language: userLang,
        role: userRole
      });
      
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      
      const response = await fetch(`/api/summary/${encodeURIComponent(currentEmotion)}?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-language': userLang,
          'x-user-role': userRole
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Error fetching summary: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Summary received:', data);
      
      // Set the summary directly - it's already in the correct language
      setSummary(data.summary.trim());
      
    } catch (error) {
      console.error('Error fetching summary:', error);
      // Display error in current language
      const errorMessage = language === 'zh-TW' 
        ? "無法載入摘要，請重試。"
        : "Unable to load summary. Please try again.";
      setSummary(errorMessage);
    }
  };

  // Function to handle share/download
  const handleShare = async () => {
    const resultSection = document.getElementById("result-section");
    if (resultSection) {
      try {
        const canvas = await html2canvas(resultSection);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "emotional-result.png";
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <header>
        <Link href="/" className="logo">InnerQuest</Link>
      </header>

      {/* Google Analytics */}
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

      <main className="container">
        <h2 className="title">{translations.result}</h2>

        <div id="result-section" className="result-box" ref={resultBoxRef}>
          <div className="image-container">
            <img
              src={`/images/${emotion?.toLowerCase() || "content"}.png`}
              alt={translations.emotion}
              className="result-image"
              crossOrigin="anonymous" // Add this for CORS
            />
          </div>

          <p className="emotion-name">{emotion || translations.emotion}</p>

          {/* Audio Player */}
          <div className="audio-player">
            <audio id="bgMusic" preload="metadata">
              <source src="/background-music.mp3" type="audio/mpeg" />
            </audio>
            <div className="audio-controls">
              <button 
                className="audio-btn" 
                onClick={handleMusicClick}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <input 
                type="range" 
                id="volumeSlider" 
                min="0" 
                max="100" 
                defaultValue="70" 
                className="volume-control"
                onClick={() => alert(language === 'zh-TW' ? translations.volumeAlert : translations.volumeAlert)}
              />
            </div>
          </div>
          
          {/* Summary Box */}
          <div className="text-box">
            <p className="summary-text">{summary}</p>
          </div>
        </div>

        {/* Share Button */}
        <button id="share-btn" className="share-btn">{translations.share}</button>
      </main>
    </div>
  );
}