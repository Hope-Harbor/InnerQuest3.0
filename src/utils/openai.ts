import OpenAI from 'openai';

export const validEmotions = [
  "Bored", "Busy", "Stressed", "Tired", "Startled", "Confused", "Amazed", "Excited",
  "Playful", "Content", "Interested", "Proud", "Accepted", "Powerful", "Peaceful",
  "Trusting", "Optimistic", "Lonely", "Vulnerable", "Despair", "Guilty", "Depressed",
  "Hurt", "Disapproving", "Disappointed", "Awful", "Repelled", "Let down", "Humiliated",
  "Bitter", "Mad", "Aggressive", "Frustrated", "Distant", "Critical", "Scared", "Anxious",
  "Insecure", "Weak", "Rejected", "Threatened"
];

// Initialize OpenAI with error handling and logging
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getGPTResponse(prompt: string) {
  try {
    // Remove console.log in production
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a balanced and neutral psychologist. Your ideas are always creative." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    return completion.choices[0].message?.content?.trim() || "";
  } catch (error) {
    // Simplified error handling
    throw error;
  }
}

export async function refineEmotion(emotion: string) {
  const prompt = `The emotion '${emotion}' needs to be mapped to one of the 41 emotions in our predefined list. Based on similarity in meaning, choose the CLOSEST MATCHING emotion from this list: ${validEmotions.join(", ")}. Respond with only the emotion name, no explanation or additional text.`;
  
  try {
    let refined = await getGPTResponse(prompt);
    refined = refined.trim();
    if (refined.endsWith('.')) {
      refined = refined.slice(0, -1);
    }

    const lowerValid = validEmotions.map(e => e.toLowerCase());
    if (lowerValid.includes(refined.toLowerCase())) {
      const idx = lowerValid.indexOf(refined.toLowerCase());
      refined = validEmotions[idx];
      return refined;
    }
    return refined;
  } catch (error) {
    console.error('Error refining emotion:', error);
    return "Content";
  }
}

export default openai;