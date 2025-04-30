import { Language } from './translate';

// The list of all valid emotions
export const validEmotions = [
  "Bored", "Busy", "Stressed", "Tired", "Startled", "Confused", "Amazed", "Excited",
  "Playful", "Content", "Interested", "Proud", "Accepted", "Powerful", "Peaceful",
  "Trusting", "Optimistic", "Lonely", "Vulnerable", "Despair", "Guilty", "Depressed",
  "Hurt", "Disapproving", "Disappointed", "Awful", "Repelled", "Let down", "Humiliated",
  "Bitter", "Mad", "Aggressive", "Frustrated", "Distant", "Critical", "Scared", "Anxious",
  "Insecure", "Weak", "Rejected", "Threatened"
];

// Map of emotions to their translations
export const emotionTranslations: Record<string, Record<Language, string>> = {
  // Positive/Content emotions
  "Content": { "en": "Content", "zh-TW": "滿足" },
  "Peaceful": { "en": "Peaceful", "zh-TW": "平靜" },
  "Optimistic": { "en": "Optimistic", "zh-TW": "樂觀" },
  "Excited": { "en": "Excited", "zh-TW": "興奮" },
  "Playful": { "en": "Playful", "zh-TW": "俏皮" },
  "Interested": { "en": "Interested", "zh-TW": "有興趣的" },
  "Proud": { "en": "Proud", "zh-TW": "自豪" },
  "Accepted": { "en": "Accepted", "zh-TW": "被接納" },
  "Powerful": { "en": "Powerful", "zh-TW": "強大" },
  "Trusting": { "en": "Trusting", "zh-TW": "信任" },
  "Amazed": { "en": "Amazed", "zh-TW": "驚嘆" },
  
  // Busy/Stressed emotions
  "Busy": { "en": "Busy", "zh-TW": "忙碌" },
  "Stressed": { "en": "Stressed", "zh-TW": "壓力大" },
  "Tired": { "en": "Tired", "zh-TW": "疲倦" },
  "Bored": { "en": "Bored", "zh-TW": "無聊" },
  
  // Confused/Uncertain emotions
  "Confused": { "en": "Confused", "zh-TW": "困惑" },
  "Startled": { "en": "Startled", "zh-TW": "驚訝" },
  
  // Negative emotions
  "Lonely": { "en": "Lonely", "zh-TW": "孤單" },
  "Vulnerable": { "en": "Vulnerable", "zh-TW": "脆弱" },
  "Despair": { "en": "Despair", "zh-TW": "絕望" },
  "Guilty": { "en": "Guilty", "zh-TW": "內疚" },
  "Depressed": { "en": "Depressed", "zh-TW": "沮喪" },
  "Hurt": { "en": "Hurt", "zh-TW": "受傷" },
  "Disappointed": { "en": "Disappointed", "zh-TW": "失望" },
  "Disapproving": { "en": "Disapproving", "zh-TW": "不被認同" },
  "Awful": { "en": "Awful", "zh-TW": "糟糕" },
  "Repelled": { "en": "Repelled", "zh-TW": "排斥" },
  "Let down": { "en": "Let down", "zh-TW": "被辜負" },
  "Humiliated": { "en": "Humiliated", "zh-TW": "羞愧" },
  "Bitter": { "en": "Bitter", "zh-TW": "痛苦" },
  "Mad": { "en": "Mad", "zh-TW": "生氣" },
  "Aggressive": { "en": "Aggressive", "zh-TW": "積極" },
  "Frustrated": { "en": "Frustrated", "zh-TW": "挫折" },
  "Distant": { "en": "Distant", "zh-TW": "疏離" },
  "Critical": { "en": "Critical", "zh-TW": "批判" },
  "Scared": { "en": "Scared", "zh-TW": "害怕" },
  "Anxious": { "en": "Anxious", "zh-TW": "焦慮" },
  "Insecure": { "en": "Insecure", "zh-TW": "不安" },
  "Weak": { "en": "Weak", "zh-TW": "軟弱" },
  "Rejected": { "en": "Rejected", "zh-TW": "被拒絕" },
  "Threatened": { "en": "Threatened", "zh-TW": "受威脅" }
};

// Helper function to get the translated emotion based on language
export function getTranslatedEmotion(emotion: string, lang: Language): string {
  // If the emotion exists in our mapping, return the translation
  if (emotionTranslations[emotion] && emotionTranslations[emotion][lang]) {
    return emotionTranslations[emotion][lang];
  }
  
  // Fallback to the original emotion if not found
  return emotion;
}