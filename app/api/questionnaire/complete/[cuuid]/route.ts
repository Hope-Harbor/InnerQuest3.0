/*
Route: app/api/questionnaire/complete/[cuuid]/route.ts
Purpose: Handles questionnaire completion
Usage: Stores final responses
*/

import { NextResponse } from 'next/server';
import { getGPTResponse, validEmotions, refineEmotion } from '@/utils/openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function processFinalEmotion(responses: string[]) {
  const prompt = `Based on these user responses: ${responses.join(", ")}, determine the user's dominant emotion. Choose EXACTLY ONE emotion from this list of 41 emotions: ${validEmotions.join(", ")}. Respond with only the emotion name, no explanation or additional text.`;
  
  let emotionResult = await getGPTResponse(prompt);
  emotionResult = emotionResult.trim();
  if (emotionResult.endsWith('.')) {
    emotionResult = emotionResult.slice(0, -1);
  }

  const lowerValid = validEmotions.map(e => e.toLowerCase());
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

export async function POST(request: Request) {
  try {
    // Extract cuuid from the URL
    const { pathname } = new URL(request.url);
    const cuuid = pathname.split("/").pop();

    if (!cuuid) {
      console.warn("Missing cuuid in URL");
      return NextResponse.json({ error: "Missing cuuid parameter" }, { status: 400 });
    }

    console.log('Processing questionnaire completion for:', cuuid);

    const body = await request.json();
    const { responses } = body;
    
    if (!Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: "No responses provided" }, { status: 400 });
    }

    const result = await processFinalEmotion(responses);
    console.log("Final emotion result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing final emotion:", error);
    return NextResponse.json(
      { error: "Failed to process final emotion" },
      { status: 500 }
    );
  }
}