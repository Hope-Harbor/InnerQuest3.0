"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Language, translateText } from '@/utils/translate';
import { getTranslatedEmotion } from '@/utils/emotions';
import Link from "next/link";
import html2canvas from "html2canvas";
import Script from 'next/script';

export default function ResultPage() {
  // State variables
  const [language, setLanguage] = useState<Language>('en');
  const [summary, setSummary] = useState("Take a moment to reflect on your feelings.");
  const [emotion, setEmotion] = useState("Content");
  const [translatedEmotion, setTranslatedEmotion] = useState("Content");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [musicGenerated, setMusicGenerated] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const resultBoxRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const [audioCache, setAudioCache] = useState<{[key: string]: string}>({});
  const [audioSrc, setAudioSrc] = useState<string>('');

  // Translations
  const [translations, setTranslations] = useState({
    result: "Result",
    share: "Share",
    volumeAlert: "Adjust the volume using the slider.",
    musicGenerating: "Generating personalized music...",
    musicReady: "Custom music ready. Click play to listen.",
    musicError: "Couldn't generate music. Try again later."
  });

  // Function to generate a UUID
  const generateUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Initial setup
  useEffect(() => {
    // Set up audio ref
    audioRef.current = document.getElementById('bgMusic') as HTMLAudioElement;
    
    // Get stored emotion from localStorage
    const storedEmotion = localStorage.getItem("emotion");
    if (storedEmotion) {
      setEmotion(storedEmotion);
      
      // Get saved language
      const savedLang = localStorage.getItem('userLanguage') as Language || 'en';
      setTranslatedEmotion(getTranslatedEmotion(storedEmotion, savedLang));
    }

    // Handle UUID
    let storedUUID = localStorage.getItem("uuid");
    if (!storedUUID) {
      storedUUID = generateUUID();
      localStorage.setItem("uuid", storedUUID);
    }

    // Add click handler for share button
    const shareButton = document.getElementById("share-btn");
    if (shareButton) {
      shareButton.addEventListener("click", handleShare);
    }

    // Check for language preference
    const savedLang = localStorage.getItem('userLanguage') as Language;
    if (savedLang) {
      setLanguage(savedLang);
      
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

  // Fetch summary when emotion changes
  useEffect(() => {
    if (emotion && emotion !== "Content") {
      fetchSummary(emotion);
      // Music generation removed - under development
    }
  }, [emotion]);

  // Update audio source when audioSrc changes
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.load(); // Important to call load() after changing src
    }
  }, [audioSrc]);

  // Translation function for UI elements
  const updateUITranslations = async (lang: Language) => {
    if (lang === 'zh-TW') {
      const [result, share, musicGenerating, musicReady, musicError] = await Promise.all([
        translateText('Result', lang),
        translateText('Share', lang),
        translateText('Generating personalized music...', lang),
        translateText('Custom music ready. Click play to listen.', lang),
        translateText("Couldn't generate music. Try again later.", lang)
      ]);

      setTranslations({
        result,
        share,
        volumeAlert: "調整音量使用滑桿。",
        musicGenerating,
        musicReady,
        musicError
      });
    }
  };

  // Handle music playback
  const handleMusicClick = () => {
    // Show alert when music button is clicked
    alert(language === 'zh-TW' ? 
      "音樂功能開發中，即將上線！" : 
      "🎵 Music feature under development. Coming soon!");
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = parseInt(e.target.value) / 100;
    }
  };

  // Fetch summary
  const fetchSummary = async (currentEmotion: string) => {
    try {
      // Get language and role from localStorage
      const userLang = localStorage.getItem('userLanguage') as Language || 'en';
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
      
      // Set both the summary and the translated emotion
      setSummary(data.summary.trim());
      
      // Update translated emotion
      setTranslatedEmotion(data.translatedEmotion || getTranslatedEmotion(currentEmotion, userLang));
      
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

  // Get music player status text
  const getMusicStatusText = () => {
    if (isGeneratingMusic) {
      return translations.musicGenerating;
    }
    if (audioError) {
      return audioError;
    }
    if (musicGenerated) {
      return isPlaying ? "" : translations.musicReady;
    }
    return "";
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
              alt={emotion}
              className="result-image"
              crossOrigin="anonymous"
            />
          </div>

          <p className="emotion-name">{language === 'zh-TW' ? translatedEmotion : emotion}</p>

          {/* Audio Player */}
          <div className="audio-player">
            <audio id="bgMusic" preload="metadata">
              {/* Source will be set dynamically */}
            </audio>
            <div className="audio-controls">
              <button 
                className={`audio-btn ${isGeneratingMusic ? 'generating' : ''}`}
                onClick={handleMusicClick}
                disabled={isGeneratingMusic}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                {isGeneratingMusic ? '⏳' : isPlaying ? '⏸' : audioError ? '🔄' : '▶'}
              </button>
              <input 
                type="range" 
                id="volumeSlider" 
                min="0" 
                max="100" 
                defaultValue="70" 
                className="volume-control"
                onChange={handleVolumeChange}
                disabled={isGeneratingMusic || audioError !== null}
              />
            </div>
            {getMusicStatusText() && (
              <span className="music-status">{getMusicStatusText()}</span>
            )}
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