// app/api/translate-batch/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getGPTResponse } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();
    
    // Return original text if target is English
    if (targetLang === 'en') {
      return NextResponse.json({ translation: text });
    }

    const prompt = `Translate the following English text to Traditional Chinese (繁體中文), and the correct wording usage. 
    Maintain the same meaning and formality:
    "${text}"
    Provide only the translation, no explanations, no additional text, and no quotation marks.`;

    const translation = await getGPTResponse(prompt);
    return NextResponse.json({ translation: translation.trim() });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}