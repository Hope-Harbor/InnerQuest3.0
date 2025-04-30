/*
Route: app/api/questionnaire/final/[cuuid]/route.ts
Purpose: Processes final responses and determines dominant emotion
Usage: Analyzes user responses to determine
*/

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const validEmotions = [
  "Bored", "Busy", "Stressed", "Tired", "Startled", "Confused", "Amazed", "Excited",
  "Playful", "Content", "Interested", "Proud", "Accepted", "Powerful", "Peaceful",
  "Trusting", "Optimistic", "Lonely", "Vulnerable", "Despair", "Guilty", "Depressed",
  "Hurt", "Disapproving", "Disappointed", "Awful", "Repelled", "Let down", "Humiliated",
  "Bitter", "Mad", "Aggressive", "Frustrated", "Distant", "Critical", "Scared", "Anxious",
  "Insecure", "Weak", "Rejected", "Threatened"
];

type Props = {
  params: {
    cuuid: string;
  };
};

// Update getGPTResponse to use correct model name and add error handling
async function getGPTResponse(prompt: string) {
  try {
    console.log('Sending prompt to OpenAI:', prompt);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a balanced and neutral psychologist." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const response = completion.choices[0].message?.content?.trim() || "";
    console.log('OpenAI response:', response);
    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

async function refineEmotion(emotion: string) {
  const refinePrompt = `The emotion '${emotion}' needs to be mapped to one of the 41 emotions in our predefined list. Based on similarity in meaning, choose the CLOSEST MATCHING emotion from this list: ${validEmotions.join(", ")}. Respond with only the emotion name, no explanation or additional text.`;
  let refined = await getGPTResponse(refinePrompt);
  refined = refined.trim();
  if (refined.endsWith(".")) {
    refined = refined.slice(0, -1);
  }
  const lowerValid = validEmotions.map((e) => e.toLowerCase());
  if (lowerValid.includes(refined.toLowerCase())) {
    const idx = lowerValid.indexOf(refined.toLowerCase());
    refined = validEmotions[idx];
    return refined;
  }
  return refined;
}

async function processFinalEmotion(responses: string[]) {
  const prompt = `Based on these user responses: ${responses.join(", ")}, determine the user's dominant emotion. Choose EXACTLY ONE emotion from this list of 41 emotions: ${validEmotions.join(", ")}. Respond with only the emotion name, no explanation or additional text.`;
  let emotionResult = await getGPTResponse(prompt);
  emotionResult = emotionResult.trim();
  if (emotionResult.endsWith(".")) {
    emotionResult = emotionResult.slice(0, -1);
  }
  const lowerValid = validEmotions.map((e) => e.toLowerCase());
  if (lowerValid.includes(emotionResult.toLowerCase())) {
    const idx = lowerValid.indexOf(emotionResult.toLowerCase());
    emotionResult = validEmotions[idx];
  } else {
    emotionResult = await refineEmotion(emotionResult);
  }
  if (!emotionResult || emotionResult.trim() === "") {
    emotionResult = "Content";
  }
  return { message: "Emotion detected!", emotion: emotionResult };
}

// Update POST handler with correct Next.js 14 typing
export async function POST(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const cuuid = pathname.split("/").pop();

    if (!cuuid) {
      console.warn("Missing cuuid in URL");
      return NextResponse.json({ error: "Missing cuuid parameter" }, { status: 400 });
    }

    console.log('Starting request processing for:', cuuid);
    
    const body = await request.json();
    console.log('Request body:', body);

    if (!body?.responses || !Array.isArray(body.responses)) {
      console.warn('Invalid responses format:', body);
      return Response.json(
        { error: "Responses must be an array" },
        { status: 400 }
      );
    }

    const result = await processFinalEmotion(body.responses);
    console.log('Processed emotion result:', result);

    return Response.json(result);

  } catch (error) {
    console.error('Route handler error:', error);
    return Response.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
