/* 
Route: app/api/questionnaire/home/[cuuid]/route.ts
Purpose: Handles question generation and follow-up prompts
*/

import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getGPTResponse } from '@/utils/openai';


// Initialize OpenAI with error handling
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

// This route should always be dynamic, never statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Change from edge to nodejs runtime

// Define the GET handler with correct typing
export async function GET(request: Request) {
  try {
    // Extract cuuid and resp from the URL path
    const { pathname } = new URL(request.url);
    const pathParts = pathname.split("/");
    const cuuid = pathParts[pathParts.length - 2]; // Second last part
    const resp = pathParts[pathParts.length - 1]; // Last part

    if (!cuuid || !resp) {
      console.warn("Missing cuuid or resp in URL");
      return NextResponse.json({ error: "Missing cuuid or resp parameter" }, { status: 400 });
    }

    console.log('Processing GET request:', { cuuid, resp });

    // Verify API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key missing');
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Your specified model
      messages: [
        { 
          role: "system", 
          content: "You are a balanced and neutral psychologist. Provide questions without quotation marks." 
        },
        { 
          role: "user", 
          content: resp === 'start' 
            ? "Create an initial question about mental well-being."
            : `Based on the previous response "${resp}", generate a follow-up question.`
        }
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    // Clean up the question string by removing quotes
    const question = completion.choices[0].message?.content?.trim()
      .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
      .trim() || "";
    
    console.log('Generated question:', question);

    return NextResponse.json({ 
      question, 
      client_uuid: cuuid 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Failed to generate question" }, 
      { status: 500 }
    );
  }
}

// Define the POST handler with correct typing
export async function POST(request: NextRequest) {
  try {
    // Extract cuuid and resp from the URL path
    const { pathname } = new URL(request.url);
    const pathParts = pathname.split("/");
    const cuuid = pathParts[pathParts.length - 2]; 
    const resp = pathParts[pathParts.length - 1];
    
    // Get language preference from headers
    const userLang = request.headers.get('x-language') || 'en';
    const userRole = request.headers.get('x-user-role') || 'user';

    if (!cuuid || !resp) {
      console.warn("Missing cuuid or resp in URL");
      return NextResponse.json({ error: "Missing cuuid or resp parameter" }, { status: 400 });
    }

    const { prompt } = await request.json();
    
    // Instead of using the prompt directly, modify it to generate in the correct language
    // This eliminates the need for a separate translation API call
    const enhancedPrompt = userLang === 'zh-TW' && !prompt.includes('繁體中文')
      ? `用繁體中文回答: ${prompt}`
      : prompt;
    
    // Single API call to generate content in the correct language
    const question = await getGPTResponse(enhancedPrompt);
    
    return NextResponse.json({ 
      question,
      client_uuid: cuuid,
      previous_response: resp 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Failed to generate question" }, 
      { status: 500 }
    );
  }
}