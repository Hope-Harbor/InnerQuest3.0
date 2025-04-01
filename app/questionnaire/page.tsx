"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchClientUuid, fetchQuestion, completeQuestionnaire } from "@/api/questionnaire";
import { translateText, Language } from '@/utils/translate';
import RainbowText from "@/components/RainbowText";
import Link from "next/link";
import Script from 'next/script';

export default function QuestionnairePage() {
  const router = useRouter();
  const [question, setQuestion] = useState<string>("Loading...");
  const [progress, setProgress] = useState<number>(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [clientUuid, setClientUuid] = useState<string>('');
  const [responses, setResponses] = useState<Array<{ question: string; answer: string }>>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Get saved language and initialize
  useEffect(() => {
    const savedLang = localStorage.getItem('userLanguage') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  // Initialize questionnaire
  useEffect(() => {
    let isInitializing = false;
    
    async function initialize() {
      if (isInitializing) return; // Prevent multiple initializations
      isInitializing = true;
      
      const storedRole = localStorage.getItem("userRole");
      if (!storedRole) {
        router.push("/");
        return;
      }
      setUserRole(storedRole);
      
      // Ensure we always have the current language
      const currentLang = localStorage.getItem('userLanguage') as Language || 'en';
      setLanguage(currentLang);

      try {
        // Clear any existing UUID from previous sessions
        localStorage.removeItem("questionnaire_uuid");
        
        // Get a fresh client UUID for this session
        const uuidData = await fetchClientUuid();
        if (!uuidData || !uuidData.client_uuid) {
          console.error('Failed to get client UUID');
          setQuestion(currentLang === 'zh-TW' ? '載入問題時發生錯誤' : 'Error loading question');
          return;
        }
        
        // Store in state and also in localStorage for persistence
        setClientUuid(uuidData.client_uuid);
        localStorage.setItem("questionnaire_uuid", uuidData.client_uuid);

        // Language-specific prompt - send language instruction directly in the prompt
        const initialPrompt = currentLang === 'en'
          ? `As a balanced and neutral psychologist, create a thoughtful question for a ${storedRole} about their mental well-being at this moment/today that can be answered with Yes, No, or Maybe.`
          : `身為一位心理諮商師，請用繁體中文為一位${
              storedRole === 'teenager' ? '青少年' : 
              storedRole === 'undergraduate' ? '大學生' : 
              storedRole === 'workingProfessional' ? '在職人士' : '在職人士'
            }提出一個關於當下/今日心理健康的問題，該問題可以用是、否或也許來回答。限制在30字以內，不要使用引號。`;

        // Fetch the first question - pass language in request
        const questionData = await fetchQuestion(uuidData.client_uuid, initialPrompt, "start");
        
        if (!questionData || !questionData.question) {
          setQuestion(currentLang === 'zh-TW' ? '載入問題時發生錯誤' : 'Error loading question');
          return;
        }
        
        const cleanQuestion = questionData.question.replace(/^["']|["']$/g, '').trim();
        setQuestion(cleanQuestion);
      } catch (error) {
        setQuestion(language === 'zh-TW' ? '載入問題時發生錯誤' : 'Error loading question');
      } finally {
        isInitializing = false;
      }
    }

    initialize().catch(() => {
      setQuestion(language === 'zh-TW' ? '載入問題時發生錯誤' : 'Error loading question');
    });
  }, [router, language]);

  const handleAnswer = async (answer: string) => {
    try {
      // Disable buttons during processing to prevent multiple clicks
      setIsProcessing(true);
      
      const newResponses = [...responses, { 
        question, 
        answer // Keep answer in English for consistency
      }];
      setResponses(newResponses);
      
      if (newResponses.length >= 5) {
        const result = await completeQuestionnaire(clientUuid, newResponses);
        if (result.emotion) {
          // Store both emotion and language when redirecting
          localStorage.setItem("emotion", result.emotion);
          // Ensure language is preserved (userLanguage should already exist)
          router.push('/results');
          return;
        }
      }

      // Generate next question with language-specific prompts to avoid translation API calls
      const nextPrompt = language === 'en'
        ? `Based on the user being a ${userRole}, create a question that can be answered by yes, no, or maybe. The question should be different and be as creative as possible, targeting on diverse aspects.`
        : `請根據用戶是一位${
        userRole === 'teenager' ? '青少年' : 
        userRole === 'undergraduate' ? '大學生' : 
        userRole === 'workingProfessional' ? '上班族' : '上班族'
          }，用繁體中文創建一個可以用是、否或也許來回答的問題。問題應該有創意且與前一個問題不同，探索不同方面的心理健康。限制在30字以內，不要使用引號。`;

      const nextQuestionData = await fetchQuestion(clientUuid, nextPrompt, answer);
      
      if (!nextQuestionData || !nextQuestionData.question) {
        setQuestion(language === 'zh-TW' ? '載入問題時發生錯誤' : 'Error loading question');
        return;
      }
      
      // Clean and set the question directly - translation already handled in API
      const cleanQuestion = nextQuestionData.question.replace(/^["']|["']$/g, '').trim();
      setQuestion(cleanQuestion);
      setProgress(prev => prev + 20);
    } catch (error) {
      console.error('Error handling answer:', error);
      setQuestion(language === 'zh-TW' ? '載入問題時發生錯誤' : 'Error loading question');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
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

      <main>
        <RainbowText text="InnerQuest" />
        {userRole && (
          <h2 className="welcome-heading">
            {language === 'zh-TW' ? 
              `歡迎，${userRole === 'teenager' ? '青少年' : 
                       userRole === 'undergraduate' ? '大學生' : '在職人士'}!` :
              `Welcome, ${userRole}!`
            }
          </h2>
        )}
        
        <div className="question-box">
          <p className="question-text">{question}</p>
        </div>

        <div className="choice-button-group">
          <button onClick={() => handleAnswer("Yes")} disabled={isProcessing}>
            {language === 'zh-TW' ? '是' : 'Yes'}
          </button>
          <button onClick={() => handleAnswer("No")} disabled={isProcessing}>
            {language === 'zh-TW' ? '否' : 'No'}
          </button>
          <button onClick={() => handleAnswer("Maybe")} disabled={isProcessing}>
            {language === 'zh-TW' ? '或許' : 'Maybe'}
          </button>
        </div>

        <div className="progress-wrapper">
          <p>{language === 'zh-TW' ? `進度: ${progress / 20}/5` : `Progress: ${progress / 20}/5`}</p>
          <div className="progress-bar">
            <div 
              className="progress-bar-inner" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}
