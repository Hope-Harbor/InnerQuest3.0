export type Language = 'en' | 'zh-TW';

// Larger cache for commonly used translations
const translationCache: Record<string, Record<Language, string>> = {
  'Welcome': { 'en': 'Welcome', 'zh-TW': '歡迎' },
  'Loading...': { 'en': 'Loading...', 'zh-TW': '載入中...' },
  'Progress': { 'en': 'Progress', 'zh-TW': '進度' },
  'Error loading question': { 'en': 'Error loading question', 'zh-TW': '載入問題時發生錯誤' },
  'Yes': { 'en': 'Yes', 'zh-TW': '是/會' },
  'No': { 'en': 'No', 'zh-TW': '否/不會' },
  'Maybe': { 'en': 'Maybe', 'zh-TW': '或許' }
};

export async function translateText(text: string, targetLang: Language): Promise<string> {
  if (targetLang === 'en') return text;
  
  // Check cache first
  if (translationCache[text]?.[targetLang]) {
    return translationCache[text][targetLang];
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });

    if (!response.ok) throw new Error();
    const { translation } = await response.json();

    // Cache silently
    if (!translationCache[text]) {
      translationCache[text] = {} as Record<Language, string>;
    }
    translationCache[text][targetLang] = translation;

    return translation;
  } catch (error) {
    // Minimal error logging
    return text;
  }
}