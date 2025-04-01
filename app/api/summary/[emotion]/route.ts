import { NextResponse } from 'next/server';
import { getGPTResponse } from '@/utils/openai';
import { headers } from 'next/headers';

// Keep Node.js runtime for better compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ emotion: string }> }
) {
  let userLang = 'en';

  try {
    // Get header values - properly awaited in nodejs runtime
    const headersList = await headers();
    userLang = headersList.get('x-language') || 'en';
    const userRole = headersList.get('x-user-role') || 'user';
    
    // Get emotion from params using context parameter
    const { emotion } = await context.params;

    // Role mapping
    const roleMap = {
      teenager: ['a teenager', '青少年'],
      undergraduate: ['a college student', '大學生'],
      working: ['a working professional', '上班族'],
      user: ['someone', '人']
    };

    const [engRole, zhRole] = roleMap[userRole as keyof typeof roleMap] || ['someone', '人'];

    // Generate content based on language
    const isChinese = userLang === 'zh-TW';
    const prompt = isChinese
      ? `為一位感到${emotion}的${zhRole}提供一段清晰且支持性的訊息，包含實用且適用的建議，字數在70字以內。使用第二人稱，以輕鬆樂觀的語氣表達，像是對話一樣給予情緒價值協助。`
      : `Provide a clear and supportive message with useful and practical suggestions that are applicable for ${engRole} feeling ${emotion} within 50 words. Use second person perspective and a casual and optimistic tone.`;

    const summary = (await getGPTResponse(prompt)).replace(/^["'](.+)["']$/, '$1').trim();

    return NextResponse.json({ emotion, summary });

  } catch (error) {
    return NextResponse.json({
      emotion: 'unknown',
      summary: userLang === 'zh-TW'
        ? "請嘗試認識自己的情緒，並考慮適當的自我照顧方式。"
        : "Try to acknowledge your feelings and consider self-care strategies."
    });
  }
}