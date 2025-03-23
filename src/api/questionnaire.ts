// src/api/questionnaire.ts
export async function fetchClientUuid() {
    const response = await fetch('/api/questionnaire/home', { method: 'GET' });
    if (!response.ok) throw new Error("Failed to fetch client UUID");
    return response.json();
  }
  
  export async function fetchQuestion(clientUuid: string, prompt: string, previousResponse: string) {
    try {
      const response = await fetch(`/api/questionnaire/home/${clientUuid}/${encodeURIComponent(previousResponse || '')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
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
