// app/questionnaire/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchClientUuid, fetchQuestion, completeQuestionnaire } from "@/api/questionnaire";
import RainbowText from "@/components/RainbowText";

export default function QuestionnairePage() {
  const [question, setQuestion] = useState<string>("Loading...");
  const [progress, setProgress] = useState<number>(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [clientUuid, setClientUuid] = useState<string>('');
  const [responses, setResponses] = useState<Array<{ question: string; answer: string }>>([]);
  const router = useRouter();

  useEffect(() => {
    async function initialize() {
      const storedRole = localStorage.getItem("userRole");
      if (!storedRole) {
        router.push("/");
        return;
      }
      setUserRole(storedRole);

      // Get a new client UUID
      const uuidData = await fetchClientUuid();
      setClientUuid(uuidData.client_uuid);

      // Generate the initial question based on the role
      const initialPrompt = `As a balanced and neutral psychologist, create a thoughtful question for a ${storedRole} about their mental well-being at this moment/today that can be answered with Yes, No, or Maybe. The resopnse should be a question without quotation marks but with punctuations.`;
      const questionData = await fetchQuestion(uuidData.client_uuid, initialPrompt, "start");
      setQuestion(questionData.question);
    }

    initialize().catch((error) => {
      console.error('Error initializing questionnaire:', error);
      setQuestion("Error loading question. Please try again.");
    });
  }, [router]);

  const handleAnswer = async (answer: string) => {
    try {
      const newResponses = [...responses, { question, answer }];
      setResponses(newResponses);
      setProgress(Math.min(newResponses.length * 20, 100));

      if (newResponses.length >= 5) {
        const result = await completeQuestionnaire(clientUuid, newResponses);
        // Save emotion to localStorage before redirecting
        if (result.emotion) {
          localStorage.setItem("emotion", result.emotion);
        }
        router.push('/results');
        return;
      }

      const nextPrompt = `Based on the user being a ${userRole} and their previous ${newResponses.length} responses: ${JSON.stringify(newResponses)}, generate a new thoughtful question about their mental well-being that can be answered with Yes, No, or Maybe. Make it different from previous questions. The response should be a question without quotation marks but with punctuations.`;

      const nextQuestionData = await fetchQuestion(clientUuid, nextPrompt, answer);

      setQuestion(nextQuestionData.question);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  return (
    <main>
      <RainbowText text="InnerQuest" />
      {userRole && <h2 className="welcome-heading">Welcome, {userRole}!</h2>}
      <div className="question-box">
        <p className="question-text">{question}</p>
      </div>
      <div className="choice-button-group">
        <button onClick={() => handleAnswer("Yes")}>Yes</button>
        <button onClick={() => handleAnswer("No")}>No</button>
        <button onClick={() => handleAnswer("Maybe")}>Maybe</button>
      </div>
      <div className="progress-wrapper">
        <p>{progress / 20}/5</p>
        <div className="progress-bar">
          <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </main>
  );
}
