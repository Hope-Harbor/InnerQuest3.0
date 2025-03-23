/* 
Route: app/api/summary/[emotion]/route.ts
Purpose: Generates supportive summaries for emotions
Usage: Results page summary generation
*/

import { NextResponse } from 'next/server';
import { getGPTResponse } from '@/utils/openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ emotion: string }> }
) {
  try {
    // Await the params according to the new Next.js 15 requirement
    const params = await context.params;
    
    const userRole = request.headers.get('x-user-role') || 'user';
    console.log('Generating summary for role:', userRole);

    const { emotion } = params;

    if (!emotion || emotion.length > 100) {
      return NextResponse.json({ error: "Invalid emotion" }, { status: 400 });
    }

    const getRoleSpecificPrompt = (role: string, emotion: string) => {
      switch(role.toLowerCase()) {
        case 'adolescence':
          return `Based on the emotion '${emotion.trim()}', provide a supportive and relatable message for a teenager. Focus on school, friendships, and personal growth. Keep it casual and encouraging, under 50 words.`;
        case 'undergraduate':
          return `Based on the emotion '${emotion.trim()}', provide a supportive message for a college student. Address academic pressure, social life, and future goals. Keep it optimistic and practical, under 50 words.`;
        case 'working':
          return `Based on the emotion '${emotion.trim()}', offer guidance for a working professional. Consider work-life balance, career growth, and stress management. Keep it professional yet approachable, under 50 words.`;
        default:
          return `Based on the emotion '${emotion.trim()}', provide a supportive and concise summary. Use easy-to-understand language. Keep it encouraging and casual, under 50 words.`;
      }
    };

    const prompt = getRoleSpecificPrompt(userRole, emotion);
    const summary = await getGPTResponse(prompt);

    return NextResponse.json({ 
      emotion, 
      summary: summary.replace(/^["'](.+)["']$/, '$1').trim() 
    });

  } catch (error) {
    console.error('Summary API Error:', error);
    return NextResponse.json({ 
      emotion: 'unknown', 
      summary: "Fallback summary: try to acknowledge your feelings and consider self-care strategies." 
    });
  }
}