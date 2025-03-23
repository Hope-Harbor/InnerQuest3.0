"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";

export default function ResultPage() {
  const [emotion, setEmotion] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summary, setSummary] = useState<string>("Take a moment to reflect on your feelings.");
  const resultBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Function to get URL parameters
  const getUrlParameter = (name: string): string | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  // Function to generate a UUID
  const generateUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  useEffect(() => {
    async function fetchData() {
      const storedEmotion = localStorage.getItem("emotion");
      console.log("Raw stored emotion:", storedEmotion);

      if (storedEmotion) {
        // Clean the emotion string properly
        const cleanEmotion = storedEmotion
          .replace(/[?.!]+$/, '') // Remove punctuation at the end
          .replace(/[^a-zA-Z\s]/g, '') // Remove any non-letter characters
          .trim()
          .toLowerCase() // Convert to lowercase
          .split(' ') // Split into words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
          .join(' ');

        console.log("Cleaned emotion:", cleanEmotion);
        setEmotion(cleanEmotion);
        
        try {
          const response = await fetch(`/api/summary/${encodeURIComponent(cleanEmotion)}`);
          if (!response.ok) throw new Error('Failed to fetch summary');
          const data = await response.json();
          
          // Clean and format the summary
          let cleanSummary = data.summary
            .trim()
            .replace(/^["']|["']$/g, ''); // Remove quotes
          
          // Add period if missing end punctuation
          if (!/[.!?]$/.test(cleanSummary)) {
            cleanSummary += '.';
          }
          
          setSummary(cleanSummary);
          
        } catch (error) {
          console.error('Error fetching summary:', error);
          setSummary("Unable to load summary. Please try again.");
        }
      } else {
        console.warn("No emotion found in localStorage");
        setEmotion("Content");
      }

      // Handle UUID
      let storedUUID = localStorage.getItem("uuid");
      if (!storedUUID) {
        storedUUID = generateUUID();
        localStorage.setItem("uuid", storedUUID);
      }
      setUuid(storedUUID);
    }

    fetchData();

    // Add click handler after component mounts
    const shareButton = document.getElementById("share-btn");
    if (shareButton) {
      shareButton.addEventListener("click", handleShare);
    }

    // Cleanup listener on unmount
    return () => {
      const shareButton = document.getElementById("share-btn");
      if (shareButton) {
        shareButton.removeEventListener("click", handleShare);
      }
    };
  }, [router]);

  const handleMusicClick = () => {
    alert("🎵 Music feature is under development. Stay tuned!");
    setIsPlaying(!isPlaying);
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

  const fetchSummary = async () => {
    try {
      const userRole = localStorage.getItem('userRole');
      console.log('Fetching summary for role:', userRole); // Add logging
  
      const response = await fetch(`/api/summary/${emotion}`, {
        headers: {
          'x-user-role': userRole || 'user'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch summary');
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary('Unable to load personalized message.');
    }
  };

  return (
    <main className="container">
      <h2 className="title">Result</h2>

      <div id="result-section" className="result-box" ref={resultBoxRef}>
        <div className="image-container">
          <img
            src={`/images/${emotion?.toLowerCase() || "content"}.png`}
            alt="Emotion Result"
            className="result-image"
            crossOrigin="anonymous" // Add this for CORS
          />
        </div>

        <p className="emotion-name">{emotion || "Unknown Emotion"}</p>

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
              onClick={() => alert("🎵 Volume control is under development. Stay tuned!")}
            />
          </div>
        </div>
        
        {/* Summary Box */}
        <div className="text-box">
          <p className="summary-text">{summary}</p>
        </div>
      </div>

      {/* Share Button */}
      <button id="share-btn" className="share-btn">Share</button>
    </main>
  );
}