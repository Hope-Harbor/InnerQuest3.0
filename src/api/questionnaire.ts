// src/api/questionnaire.ts
export async function fetchClientUuid() {
  try {
    // If there's a cached UUID, delete it first
    if (typeof window !== 'undefined') {
      localStorage.removeItem("questionnaire_uuid");
    }
    
    // Get a fresh UUID from the server
    const response = await fetch('/api/questionnaire/home', { 
      method: 'GET',
      cache: 'no-store' // Prevent caching to always get a fresh UUID
    });
    
    if (!response.ok) throw new Error("Failed to fetch client UUID");
    return response.json();
  } catch (error) {
    console.error("Error fetching client UUID:", error);
    
    // Fallback: generate a local UUID if server fails
    if (typeof window !== 'undefined') {
      // Simple random ID generator as fallback
      const fallbackId = Math.random().toString(36).substring(2, 15);
      return { client_uuid: `fallback_${fallbackId}` };
    }
    throw error;
  }
}

export async function fetchQuestion(clientUuid: string, prompt: string, previousResponse: string) {
  // Define userLang outside try block
  let userLang = 'en';
  
  try {
    if (typeof window !== 'undefined') {
      userLang = localStorage.getItem('userLanguage') || 'en';
    }
    
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Fetching question in ${userLang}`);
    }
    
    // Use a timestamp to prevent browser caching
    const timestamp = Date.now();
    
    const response = await fetch(`/api/questionnaire/home/${clientUuid}/${encodeURIComponent(previousResponse || '')}?t=${timestamp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-language': userLang,
        'x-user-role': typeof window !== 'undefined' ? localStorage.getItem('userRole') || 'user' : 'user'
      },
      body: JSON.stringify({ prompt }),
      cache: 'no-store'
    });

    if (!response.ok) throw new Error('Failed to fetch question');
    return response.json();
  } catch (error) {
    console.error('Error fetching question:', error);
    
    return {
      question: userLang === 'zh-TW' ? "您今天感覺如何？" : "How are you feeling today?",
      client_uuid: clientUuid,
      previous_response: previousResponse
    };
  }
}

export async function completeQuestionnaire(clientUuid: string, responses: Array<{ question: string; answer: string }>) {
  try {
    console.log('Sending completion request:', { clientUuid, responses });
    
    const response = await fetch(`/api/questionnaire/complete/${clientUuid}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ responses: responses.map(r => r.answer) }), // Only send answers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Questionnaire completion failed:', errorData);
      throw new Error("Failed to complete questionnaire");
    }
    
    const data = await response.json();
    console.log("Complete questionnaire response:", data);
    
    // Verify emotion is present
    if (!data.emotion) {
      console.warn('No emotion in response:', data);
      data.emotion = 'Content'; // Fallback emotion
    }
    
    return data;
  } catch (error) {
    console.error('Error completing questionnaire:', error);
    throw error;
  }
}

export async function handleQuestionnaireProgress(
  clientUuid: string, 
  responses: Array<{ question: string; answer: string }>,
  userRole: string
) {
  if (responses.length >= 5) {
    return completeQuestionnaire(clientUuid, responses);
  } else {
    const nextPrompt = `Based on the user being a ${userRole}...`;
    return fetchQuestion(clientUuid, nextPrompt, responses[responses.length - 1]?.answer || '');
  }
}
